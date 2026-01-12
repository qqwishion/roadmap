/**
 * Утилиты для безопасной работы с массивами
 * Защита от undefined/null значений при интеграции с API
 */

/**
 * Безопасно возвращает массив или пустой массив
 */
export function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Безопасно возвращает строку или пустую строку
 */
export function safeString(value: string | undefined | null): string {
  return value || '';
}

/**
 * Безопасно возвращает число или 0
 */
export function safeNumber(value: number | undefined | null): number {
  return value || 0;
}
