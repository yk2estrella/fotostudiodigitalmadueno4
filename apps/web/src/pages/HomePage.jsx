import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { VolumeX, ChevronDown, Church, BookOpen, Music } from 'lucide-react';
import Chapter from '@/components/Chapter';
import Particles from '@/components/Particles';
import { useNarration } from '@/hooks/useNarration';

const IMG = {
    dawn: 'https://images.hostinger.com/b582e932-fabe-4b73-bead-bf7aa9a75128.png',
    friar: 'https://images.hostinger.com/2cbfb270-b743-4aa4-98c3-9f4c448839c9.png',
    carving: 'https://images.hostinger.com/0b083533-f3fb-4e13-bb45-49b0c32f2e89.png',
    farewell: 'https://images.hostinger.com/ec3680cf-0bcb-4dcf-90b5-8ed64b8062b2.png',
    discovery: 'https://images.hostinger.com/7ac7b367-79ee-4155-969c-ec6a21d07399.png',
    pilgrims: 'https://images.hostinger.com/924509d3-031f-4759-8285-9456f61bc4d9.png',
    procession: 'https://images.hostinger.com/e12a6d90-33bf-4dce-bfb0-c303d65d7bfe.png',
    aerial: 'https://images.hostinger.com/73dbd6bf-6ee9-47d0-8c5d-6d7e248aa513.png',
};

const PROLOGUE_TEXT =
    'Bienvenido. Hoy iniciarás una peregrinación digital por uno de los símbolos de fe más importantes del norte del Perú. Cada paso que des descubrirá una parte de esta historia. Una historia que une tradición, cultura y esperanza.';

const CHAPTERS = [
    {
        id: 'c1', kicker: 'Capítulo I · 1860 – 1865', title: 'El ermitaño del cerro',
        image: IMG.friar, alt: 'Fray Juan Agustín de Abad caminando por el sendero con hábito franciscano',
        stations: [1], glow: false, mood: 'light',
        text: 'Entre los años 1860 y 1865, un religioso franciscano llamado Fray Juan Agustín de Abad llegó a los alrededores de Motupe. Eligió el Cerro Chalpón como lugar de oración, silencio y penitencia. Desde allí descendía para celebrar misas, administrar sacramentos y evangelizar a los pobladores de Motupe, Olmos y caseríos cercanos. Su vida sencilla y profundamente espiritual dejó una huella que sería recordada por generaciones.',
    },
    {
        id: 'c2', kicker: 'Capítulo II', title: 'Las tres cruces',
        image: IMG.carving, alt: 'Fray Juan tallando enormes cruces de madera de guayacán entre los árboles',
        stations: [2, 3], glow: true, mood: 'light',
        text: 'Durante su permanencia en el cerro, el fraile elaboró tres grandes cruces utilizando madera resistente, tradicionalmente identificada como guayacán. Las colocó en tres cerros: Chalpón, Rajado y Penachí. Para los pobladores, aquellas cruces representaban un símbolo de protección y fe para toda la región.',
    },
    {
        id: 'c3', kicker: 'Capítulo III', title: 'El adiós del fraile',
        image: IMG.farewell, alt: 'Fray Juan despidiéndose, caminando con bastón y volteando hacia el cerro',
        stations: [4, 5], glow: false, mood: 'light',
        text: 'Con el paso del tiempo, Fray Juan dejó Motupe. Poco después, los pobladores conocieron la noticia de su fallecimiento en 1866. La tradición cuenta que antes de partir había hablado sobre las cruces que había dejado en los cerros. Desde entonces comenzó el deseo de encontrarlas.',
    },
    {
        id: 'c4', kicker: 'Capítulo IV · 5 de agosto de 1868', title: 'El hallazgo',
        image: IMG.discovery, alt: 'Campesinos buscando con antorchas en la oscuridad del Cerro Chalpón',
        stations: [6, 7, 8], glow: true, mood: 'dark',
        text: 'Durante varios días, un grupo de pobladores recorrió el accidentado Cerro Chalpón. El 5 de agosto de 1868, el joven José Mercedes Anteparra Peralta encontró la cruz incrustada en una gruta natural. El hallazgo fue recibido con profunda emoción y marcó el inicio de una devoción que continúa hasta nuestros días.',
    },
    {
        id: 'c5', kicker: 'Capítulo V', title: 'Nace la peregrinación',
        image: IMG.pilgrims, alt: 'Miles de peregrinos caminando con velas por el sendero',
        stations: [9, 10], glow: true, mood: 'light', counter: true,
        text: 'Desde aquel momento, la Cruz comenzó a reunir a fieles provenientes de distintos lugares. Cada año, miles de peregrinos ascienden el Cerro Chalpón para agradecer favores, renovar su fe y mantener viva una tradición transmitida de generación en generación. La peregrinación se convirtió en una de las manifestaciones religiosas más importantes del norte del Perú.',
    },
    {
        id: 'c6', kicker: 'Capítulo VI', title: 'Un símbolo de Lambayeque',
        image: IMG.procession, alt: 'Procesión de la Santísima Cruz de Motupe con flores y mantos',
        stations: [11, 12], glow: true, mood: 'light',
        text: 'Con el paso de las décadas, la Santísima Cruz de Motupe trascendió las fronteras de Lambayeque. Hoy recibe peregrinos de diferentes regiones del Perú y también visitantes del extranjero. Para miles de personas representa identidad, esperanza, agradecimiento y unidad.',
    },
    {
        id: 'c7', kicker: 'Capítulo VII', title: 'El Cerro Chalpón en la actualidad',
        image: IMG.aerial, alt: 'Vista aérea del Cerro Chalpón y el pueblo de Motupe con el sendero de peregrinación',
        stations: [13], glow: true, mood: 'light', map: true,
        text: 'Con el paso de los años, el sendero también ha cambiado. Actualmente, la capilla se encuentra junto a la Estación XII. La Estación XIII continúa formando parte del recorrido. La antigua Estación XIV desapareció a causa de un huaico ocurrido años atrás, reflejando cómo la naturaleza también transforma este lugar de peregrinación. Aun así, el significado espiritual del recorrido permanece vivo para miles de devotos.',
    },
];

const CURIOSITIES = [
    '¿Sabías que la Cruz encontrada en el Cerro Chalpón fue elaborada, según la tradición, con madera de guayacán?',
    '¿Sabías que cada agosto llegan miles de peregrinos para participar en la festividad?',
    '¿Sabías que la Cruz permanece la mayor parte del año en el santuario del Cerro Chalpón y solo desciende al pueblo durante las celebraciones?',
    '¿Sabías que la peregrinación combina fe, identidad cultural y tradiciones familiares transmitidas por generaciones?',
];

const CURIOSITY_ANSWERS = [
    'El guayacán es una madera densa y resistente, capaz de perdurar por décadas a la intemperie del cerro.',
    'La festividad central se celebra el 5 de agosto, aniversario del hallazgo de 1868.',
    'Su descenso al pueblo es uno de los momentos más esperados y emotivos del año para los devotos.',
    'Muchas familias peregrinan juntas año tras año, heredando la promesa de padres a hijos.',
];

export default function HomePage() {
    const narration = useNarration();
    const [started, setStarted] = useState(false);
    const [maxStation, setMaxStation] = useState(0);
    const [openCard, setOpenCard] = useState(null);
    const experienceRef = useRef(null);

    const activateChapter = useCallback(
        (ch) => {
            const top = ch.stations?.length ? Math.max(...ch.stations) : 0;
            setMaxStation((m) => (top > m ? top : m));
            narration.speak(ch.text, ch.id);
        },
        [narration]
    );

    const begin = () => {
        narration.setMode('audiobook');
        setStarted(true);
        setTimeout(() => narration.speak(PROLOGUE_TEXT, 'prologue'), 350);
        setTimeout(() => experienceRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
    };

    return (
        <div className="relative w-full bg-[#0a0705] text-amber-50">
            <AudioSelector narration={narration} visible={started} />

            <AnimatePresence>{!started && <Prologue onBegin={begin} />}</AnimatePresence>

            <div ref={experienceRef}>
                {started && <IntroBand />}

                {CHAPTERS.map((ch, i) => (
                    <div key={ch.id} className="relative">
                        <Chapter chapter={ch} index={i} onActivate={activateChapter} activeStations={maxStation} />
                        {ch.counter && <PilgrimCounter />}
                    </div>
                ))}

                <TrailProgress maxStation={maxStation} />

                <Curiosities open={openCard} setOpen={setOpenCard} />

                <Finale narration={narration} />
            </div>
        </div>
    );
}

const AUDIO_OPTIONS = [
    { id: 'audiobook', label: 'Audiolibro', icon: BookOpen },
    { id: 'song', label: 'Canción', icon: Music },
    { id: 'none', label: 'Ninguno', icon: VolumeX },
];

function AudioSelector({ narration, visible }) {
    if (!visible) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-full border border-amber-400/40 bg-black/55 p-1 backdrop-blur-md"
            role="radiogroup"
            aria-label="Selector de audio"
        >
            {AUDIO_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = narration.mode === opt.id;
                return (
                    <button
                        key={opt.id}
                        onClick={() => narration.setMode(opt.id)}
                        role="radio"
                        aria-checked={active}
                        aria-label={opt.label}
                        className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-display tracking-wider transition active:scale-95 ${
                            active ? 'text-[#0a0705]' : 'text-amber-100/70 hover:text-amber-50'
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId="audioActivePill"
                                className="absolute inset-0 -z-10 rounded-full bg-amber-300"
                                style={{ boxShadow: '0 0 18px rgba(232,190,110,0.7)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            />
                        )}
                        <Icon size={15} />
                        <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                );
            })}
        </motion.div>
    );
}

function Prologue({ onBegin }) {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 900);
        const t2 = setTimeout(() => setPhase(2), 2400);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <motion.section
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40 flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black"
        >
            <motion.img
                src={IMG.dawn}
                alt="Amanecer sobre el Cerro Chalpón con rayos de luz"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: phase >= 1 ? 0.65 : 0, scale: 1.08 }}
                transition={{ duration: 3.5, ease: 'easeOut' }}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85" />
            <Particles count={26} />

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="mb-8 flex justify-center"
                >
                    <span className="font-display text-6xl md:text-7xl text-amber-300 text-glow" aria-hidden="true">✝</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
                    transition={{ duration: 1.4, delay: 0.3 }}
                    className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-amber-50 text-glow"
                >
                    Historia de la Santísima Cruz de Motupe
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ duration: 1.4 }}
                    className="mt-5 font-serif-body text-lg md:text-2xl italic text-amber-100/80"
                >
                    Más de 150 años de fe, tradición y esperanza
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 16 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-12"
                >
                    <button
                        onClick={onBegin}
                        className="group inline-flex items-center gap-3 rounded-full border border-amber-400/60 bg-amber-400/10 px-8 py-4 font-display text-sm md:text-base tracking-[0.25em] uppercase text-amber-100 backdrop-blur-md transition hover:bg-amber-400/20 hover:border-amber-300 active:scale-95"
                    >
                        Iniciar peregrinación
                        <ChevronDown size={18} className="transition group-hover:translate-y-0.5" />
                    </button>
                    <p className="mt-4 text-xs text-amber-100/50">Con narración de audiolibro · usa audífonos</p>
                </motion.div>
            </div>
        </motion.section>
    );
}

function IntroBand() {
    return (
        <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-b border-amber-100/10 bg-[#0a0705] py-24">
            <Particles count={12} />
            <div className="relative z-10 max-w-2xl px-6 text-center">
                <p className="font-display text-xs tracking-[0.4em] text-amber-300/80 uppercase">Escena 0 · Prólogo</p>
                <p className="mt-6 font-serif-body text-2xl md:text-3xl leading-relaxed text-amber-50/90">
                    Comienza el descenso de la luz sobre el Cerro Chalpón. El viento, las aves y las campanas anuncian el inicio de un recorrido de fe.
                </p>
                <div className="mt-10 flex justify-center">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-amber-300/70"
                    >
                        <ChevronDown size={28} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function PilgrimCounter() {
    const ref = useRef(null);
    const [val, setVal] = useState(0);
    const steps = [100, 1000, 5000, 10000, 25000, 50000];
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    steps.forEach((s, i) => setTimeout(() => setVal(s), i * 550));
                    obs.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section ref={ref} className="relative overflow-hidden border-y border-amber-100/10 bg-[#0d0906] py-20">
            <Particles count={14} />
            <div className="relative z-10 text-center">
                <p className="font-display text-xs tracking-[0.4em] text-amber-300/80 uppercase">Peregrinos por año</p>
                <p className="mt-4 font-display text-6xl md:text-8xl font-bold text-amber-200 text-glow tabular-nums">
                    +{val.toLocaleString('es-PE')}
                </p>
                <div className="mx-auto mt-8 flex max-w-md items-center justify-between px-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
                            className="h-2 w-2 rounded-full bg-amber-300"
                        />
                    ))}
                </div>
                <p className="mt-6 font-serif-body text-lg italic text-amber-100/70">
                    Puntos de luz avanzando por el sendero hacia la cima
                </p>
            </div>
        </section>
    );
}

function TrailProgress({ maxStation }) {
    return (
        <section className="relative overflow-hidden bg-[#0a0705] py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <p className="font-display text-xs tracking-[0.4em] text-amber-300/80 uppercase">El sendero · 14 estaciones</p>
                <h3 className="mt-4 font-display text-2xl md:text-4xl text-amber-50 text-glow">
                    {maxStation >= 14 ? 'Todo el recorrido iluminado' : `Estaciones recorridas: ${maxStation} de 14`}
                </h3>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    {Array.from({ length: 14 }).map((_, i) => {
                        const n = i + 1;
                        const lit = maxStation >= n;
                        return (
                            <motion.span
                                key={n}
                                animate={lit ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 0.5 }}
                                className={`flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm transition-all duration-700 ${
                                    lit
                                        ? 'border-amber-400/80 bg-amber-400/15 text-amber-200 text-glow'
                                        : 'border-amber-100/15 text-amber-100/30'
                                }`}
                                aria-label={`Estación ${n}${lit ? ' iluminada' : ''}`}
                            >
                                ✝
                            </motion.span>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Curiosities({ open, setOpen }) {
    return (
        <section className="relative overflow-hidden border-t border-amber-100/10 bg-[#0d0906] py-24">
            <div className="mx-auto max-w-3xl px-6">
                <p className="text-center font-display text-xs tracking-[0.4em] text-amber-300/80 uppercase">¿Sabías que...?</p>
                <h3 className="mt-4 text-center font-display text-2xl md:text-4xl text-amber-50 text-glow">
                    Datos que guarda la tradición
                </h3>
                <div className="mt-10 space-y-3">
                    {CURIOSITIES.map((q, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={i} className="overflow-hidden rounded-xl border border-amber-100/15 bg-black/30">
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-amber-400/5"
                                >
                                    <span className="font-serif-body text-lg md:text-xl text-amber-50/90">{q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`shrink-0 text-amber-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: 'easeOut' }}
                                        >
                                            <p className="px-5 pb-5 font-serif-body text-base md:text-lg italic text-amber-100/70">
                                                {CURIOSITY_ANSWERS[i]}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Finale({ narration }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1, 0.75]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0, 1, 0.6]);
    const spokenRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !spokenRef.current) {
                    spokenRef.current = true;
                    narration.speak(
                        'La fe no solo se encuentra en la cima del cerro, sino también en cada paso que conduce hasta ella.',
                        'finale'
                    );
                }
            },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [narration]);

    return (
        <section ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black">
            <motion.img
                src={IMG.aerial}
                alt="Vista panorámica del Cerro Chalpón y Motupe con todas las estaciones iluminadas"
                style={{ scale, opacity }}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/90" />
            <Particles count={30} />

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="mb-8 block font-display text-6xl text-amber-300 text-glow"
                    aria-hidden="true"
                >
                    ✝
                </motion.span>
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3 }}
                    className="font-serif-body text-2xl md:text-4xl italic leading-relaxed text-amber-50 text-glow"
                >
                    "La fe no solo se encuentra en la cima del cerro, sino también en cada paso que conduce hasta ella."
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="mt-16 flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-2 text-amber-100/70">
                        <Church size={18} />
                        <span className="font-display text-xs tracking-[0.3em] uppercase">
                            Proyecto desarrollado por Foto Studio Digital MADUEÑO
                        </span>
                    </div>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-3 rounded-full border border-amber-400/60 bg-amber-400/10 px-8 py-4 font-display text-sm tracking-[0.2em] uppercase text-amber-100 backdrop-blur-md transition hover:bg-amber-400/20 hover:border-amber-300 active:scale-95"
                    >
                        Continuar hacia la experiencia interactiva
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
