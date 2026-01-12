import { useEffect, useState } from "react";

interface Comet {
  id: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  size: number;
}

export function Comets() {
  const [comets, setComets] = useState<Comet[]>([]);
  // Естественные цвета комет - больше белых и голубоватых
  const colors = ['#FFFFFF', '#FFFFFF', '#E8F4FF', '#D4E8F7', '#92A8B4', '#598EBC'];

  useEffect(() => {
    // Генерация 8 комет с рандомными параметрами
    const generatedComets: Comet[] = Array.from({ length: 8 }, (_, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 3 + 2; // 2-5px
      
      // Разнообразные направления движения
      const direction = Math.random();
      let startX, startY, endX, endY;
      
      if (direction < 0.25) {
        // Сверху вниз-влево (классическое)
        startX = Math.random() * 120 - 10;
        startY = -10 - Math.random() * 20;
        endX = startX - (40 + Math.random() * 60);
        endY = startY + (40 + Math.random() * 80);
      } else if (direction < 0.5) {
        // Справа налево-вниз
        startX = 100 + Math.random() * 30;
        startY = Math.random() * 60;
        endX = startX - (50 + Math.random() * 70);
        endY = startY + (30 + Math.random() * 60);
      } else if (direction < 0.7) {
        // Слева направо-вниз (обратное)
        startX = -10 - Math.random() * 20;
        startY = Math.random() * 50;
        endX = startX + (40 + Math.random() * 60);
        endY = startY + (30 + Math.random() * 60);
      } else {
        // Сверху-справа диагонально вниз-влево
        startX = 70 + Math.random() * 50;
        startY = -10 - Math.random() * 20;
        endX = startX - (60 + Math.random() * 80);
        endY = startY + (50 + Math.random() * 90);
      }
      
      const duration = 4 + Math.random() * 6; // 4-10s - быстрее
      const delay = Math.random() * 15; // 0-15s задержка - чаще
      
      return {
        id: i,
        color,
        startX,
        startY,
        endX,
        endY,
        duration,
        delay,
        size
      };
    });
    
    setComets(generatedComets);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {comets.map((comet) => {
        const deltaX = comet.endX - comet.startX;
        const deltaY = comet.endY - comet.startY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        return (
          <div
            key={comet.id}
            className="comet"
            style={{
              position: 'absolute',
              width: `${comet.size}px`,
              height: `${comet.size}px`,
              borderRadius: '50%',
              backgroundColor: comet.color,
              boxShadow: `
                0 0 ${comet.size * 3}px ${comet.size * 0.8}px ${comet.color},
                -${comet.size * 15}px 0 ${comet.size * 8}px ${comet.size * 4}px ${comet.color}66,
                -${comet.size * 25}px 0 ${comet.size * 12}px ${comet.size * 6}px ${comet.color}33,
                -${comet.size * 35}px 0 ${comet.size * 16}px ${comet.size * 8}px ${comet.color}1a
              `,
              animation: `comet-path-${comet.id} ${comet.duration}s linear infinite`,
              animationDelay: `${comet.delay}s`,
              opacity: 0,
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}
      
      <style>{`
        ${comets.map((comet) => {
          const fadeInPercent = 3 + Math.random() * 4;
          const fadeOutPercent = 88 + Math.random() * 8;
          
          return `
          @keyframes comet-path-${comet.id} {
            0% {
              opacity: 0;
              left: ${comet.startX}%;
              top: ${comet.startY}%;
            }
            ${fadeInPercent}% {
              opacity: 0.9;
            }
            ${fadeOutPercent}% {
              opacity: 0.7;
            }
            100% {
              opacity: 0;
              left: ${comet.endX}%;
              top: ${comet.endY}%;
            }
          }
        `;
        }).join('\n')}
      `}</style>
    </div>
  );
}
