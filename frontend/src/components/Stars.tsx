import { useMemo } from "react";

export function Stars() {
  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => {
      const size = Math.random() * 3 + 1;
      const colors = ['#FFFFFF', '#E8F4FF', '#D4E8F7', '#92A8B4', '#598EBC'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size,
        color,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 4}px ${star.size * 1.5}px ${star.color}`,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration
          }}
        />
      ))}
    </div>
  );
}
