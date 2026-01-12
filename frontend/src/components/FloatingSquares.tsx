import { useEffect, useState } from "react";

interface Square {
  id: number;
  size: number;
  top: number;
  left: number;
  color: string;
  delay: number;
}

const colors = ['#598EBC', '#392B7D', '#EF3443', '#92A8B4'];

export function FloatingSquares() {
  const [squares, setSquares] = useState<Square[]>([]);

  useEffect(() => {
    const generatedSquares: Square[] = Array.from({ length: 5 }, (_, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 60 + Math.random() * 100; // 60-160px
      const top = Math.random() * 80; // 0-80%
      const left = Math.random() * 90; // 0-90%
      const delay = Math.random() * 3; // 0-3s

      return {
        id: i,
        size,
        top,
        left,
        color,
        delay
      };
    });

    setSquares(generatedSquares);
  }, []);

  return (
    <>
      {squares.map((square) => (
        <div
          key={square.id}
          className="absolute border-2 opacity-60 animate-float"
          style={{
            top: `${square.top}%`,
            left: `${square.left}%`,
            width: `${square.size}px`,
            height: `${square.size}px`,
            borderColor: `${square.color}40`,
            animationDelay: `${square.delay}s`
          }}
        />
      ))}
    </>
  );
}
