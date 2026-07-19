import React, { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Particles from './Particles';

// A single cinematic chapter scene. Image parallaxes and slowly zooms while
// the narration text reveals; narration audio fires when the scene enters view.
export default function Chapter({ chapter, index, onActivate, activeStations }) {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.55 });
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
    const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

    useEffect(() => {
        if (inView) onActivate(chapter);
    }, [inView, chapter, onActivate]);

    const dark = chapter.mood === 'dark';

    return (
        <section
            ref={ref}
            aria-label={chapter.title}
            className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden py-24"
        >
            <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 -z-10">
                <img
                    src={chapter.image}
                    alt={chapter.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: dark
                            ? 'linear-gradient(180deg, rgba(6,4,3,0.75) 0%, rgba(6,4,3,0.55) 40%, rgba(6,4,3,0.9) 100%)'
                            : 'linear-gradient(180deg, rgba(10,7,5,0.55) 0%, rgba(10,7,5,0.35) 45%, rgba(10,7,5,0.92) 100%)',
                    }}
                />
            </motion.div>

            {chapter.glow && <Particles count={20} />}

            <div className="relative z-10 w-full max-w-3xl px-6 md:px-10">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="mb-4 font-display text-xs md:text-sm tracking-[0.4em] text-amber-300/90 uppercase"
                >
                    {chapter.kicker}
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                    className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-glow text-amber-50"
                >
                    {chapter.title}
                </motion.h2>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                    className="my-6 h-px w-40 origin-left bg-gradient-to-r from-amber-400/90 to-transparent"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                    className="font-serif-body text-xl md:text-2xl lg:text-[1.7rem] leading-relaxed text-amber-50/90 max-w-2xl"
                >
                    {chapter.text}
                </motion.p>

                {chapter.stations?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-8 flex flex-wrap items-center gap-3"
                    >
                        {chapter.stations.map((s) => {
                            const lit = activeStations >= s;
                            return (
                                <span
                                    key={s}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-display tracking-wider transition-all duration-700 ${
                                        lit
                                            ? 'border-amber-400/80 bg-amber-400/10 text-amber-200 text-glow'
                                            : 'border-amber-100/15 text-amber-100/40'
                                    }`}
                                >
                                    <span aria-hidden="true">✝</span> Estación {toRoman(s)}
                                </span>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function toRoman(n) {
    const map = [
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];
    let res = '';
    let num = n;
    for (const [v, sym] of map) {
        while (num >= v) {
            res += sym;
            num -= v;
        }
    }
    return res;
}
