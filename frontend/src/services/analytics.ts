/**
 * Сервис аналитики для отслеживания действий пользователей
 * Собирает данные о кликах, просмотрах и созданных траекториях
 */

export interface AnalyticsEvent {
  eventType: 'click' | 'view' | 'trajectory_created' | 'trajectory_deleted';
  category: 'university' | 'college' | 'company' | 'trajectory';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = 'cosmic_roadmap_analytics';
  private readonly MAX_EVENTS = 1000; // Максимум событий в localStorage

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.loadEvents();
  }

  /**
   * Получить или создать ID сессии
   */
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('cosmic_roadmap_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('cosmic_roadmap_session', sessionId);
    }
    return sessionId;
  }

  /**
   * Загрузить события из localStorage
   */
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
      this.events = [];
    }
  }

  /**
   * Сохранить события в localStorage
   */
  private saveEvents(): void {
    try {
      // Ограничиваем количество сохраненных событий
      const eventsToSave = this.events.slice(-this.MAX_EVENTS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventsToSave));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  /**
   * Отследить событие
   */
  private track(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.events.push(fullEvent);
    this.saveEvents();

    // Отправить на сервер (если настроен Django backend)
    this.sendToBackend(fullEvent);

    // Логируем в консоль для разработки
    if (import.meta?.env?.DEV) {
      console.log('📊 Analytics:', fullEvent);
    }
  }

  /**
   * Отправить событие на backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      const apiUrl = import.meta?.env?.VITE_API_URL;
      if (!apiUrl) return;

      await fetch(`${apiUrl}/analytics/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Тихо игнорируем ошибки отправки аналитики
      console.debug('Analytics backend error:', error);
    }
  }

  /**
   * Клик по вузу
   */
  trackUniversityClick(universityId: string, universityName: string): void {
    this.track({
      eventType: 'click',
      category: 'university',
      action: 'view_details',
      label: universityName,
      metadata: { universityId },
    });
  }

  /**
   * Клик по ссузу
   */
  trackCollegeClick(collegeId: string, collegeName: string): void {
    this.track({
      eventType: 'click',
      category: 'college',
      action: 'view_details',
      label: collegeName,
      metadata: { collegeId },
    });
  }

  /**
   * Клик по предприятию
   */
  trackCompanyClick(companyId: string, companyName: string): void {
    this.track({
      eventType: 'click',
      category: 'company',
      action: 'view_details',
      label: companyName,
      metadata: { companyId },
    });
  }

  /**
   * Создание траектории
   */
  trackTrajectoryCreated(trajectory: {
    direction: string;
    educationLevel: string;
    institution: string;
    company?: string;
    career?: string;
  }): void {
    this.track({
      eventType: 'trajectory_created',
      category: 'trajectory',
      action: 'create',
      label: trajectory.direction,
      metadata: trajectory,
    });
  }

  /**
   * Удаление траектории
   */
  trackTrajectoryDeleted(trajectoryId: string): void {
    this.track({
      eventType: 'trajectory_deleted',
      category: 'trajectory',
      action: 'delete',
      metadata: { trajectoryId },
    });
  }

  /**
   * Просмотр страницы
   */
  trackPageView(pageName: string): void {
    this.track({
      eventType: 'view',
      category: 'trajectory',
      action: 'page_view',
      label: pageName,
    });
  }

  /**
   * Получить все события
   */
  getAllEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Получить события по категории
   */
  getEventsByCategory(category: AnalyticsEvent['category']): AnalyticsEvent[] {
    return this.events.filter(event => event.category === category);
  }

  /**
   * Получить статистику
   */
  getStats(): {
    totalEvents: number;
    universitiesClicked: number;
    collegesClicked: number;
    companiesClicked: number;
    trajectoriesCreated: number;
    trajectoriesDeleted: number;
  } {
    return {
      totalEvents: this.events.length,
      universitiesClicked: this.events.filter(
        e => e.category === 'university' && e.eventType === 'click'
      ).length,
      collegesClicked: this.events.filter(
        e => e.category === 'college' && e.eventType === 'click'
      ).length,
      companiesClicked: this.events.filter(
        e => e.category === 'company' && e.eventType === 'click'
      ).length,
      trajectoriesCreated: this.events.filter(
        e => e.eventType === 'trajectory_created'
      ).length,
      trajectoriesDeleted: this.events.filter(
        e => e.eventType === 'trajectory_deleted'
      ).length,
    };
  }

  /**
   * Очистить все события (только для тестирования)
   */
  clearAll(): void {
    this.events = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Экспортировать события для отправки в админку
   */
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

// Экспортируем единственный экземпляр сервиса
export const analytics = new AnalyticsService();

// Дополнительно экспортируем класс для тестирования
export default AnalyticsService;
