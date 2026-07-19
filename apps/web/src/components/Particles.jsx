import React, { useMemo } from 'react';

// Lightweight golden dust particles rendered as pure CSS float animations.
export default function Particles({ count = 22, className = '', color = 'rgba(232,190,110,0.85)' }) {
    const dots = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                bottom: Math.random() * 30,
                size: 2 + Math.random() * 4,
                delay: Math.random() * 8,
                duration: 7 + Math.random() * 8,
            })),
        [count]
    );

    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
            {dots.map((d) => (
                <span
                    key={d.id}
                    style={{
                        position: 'absolute',
                        left: `${d.left}%`,
                        bottom: `${d.bottom}%`,
                        width: d.size,
                        height: d.size,
                        borderRadius: '9999px',
                        background: color,
                        boxShadow: `0 0 ${d.size * 3}px ${color}`,
                        animation: `floatUp ${d.duration}s ease-in-out ${d.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}
