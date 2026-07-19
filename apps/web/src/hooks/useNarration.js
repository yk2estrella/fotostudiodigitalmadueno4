import { useCallback, useEffect, useRef, useState } from "react";

export function useNarration() {
    const [mode, setMode] = useState("none");
    const [speakingId, setSpeakingId] = useState(null);

    const voiceRef = useRef(null);
    const modeRef = useRef("none");

    const musicRef = useRef(null);

    // Guarda el último texto narrado
    const lastTextRef = useRef("");
    const lastIdRef = useRef(null);

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    // Buscar una voz en español
    const pickVoice = useCallback(() => {
        if (!window.speechSynthesis) return;

        const voices = window.speechSynthesis.getVoices();

        const es = voices.filter((v) => /es(-|_)?/i.test(v.lang));

        voiceRef.current =
            es.find((v) =>
                /(natural|neural|google|helena|paulina|jorge|monica)/i.test(v.name)
            ) ||
            es.find((v) => /es-(PE|MX|US|ES)/i.test(v.lang)) ||
            es[0] ||
            voices[0] ||
            null;
    }, []);

    useEffect(() => {
        if (!window.speechSynthesis) return;

        pickVoice();

        window.speechSynthesis.onvoiceschanged = pickVoice;

        return () => {
            window.speechSynthesis.cancel();

            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current.currentTime = 0;
            }
        };
    }, [pickVoice]);

    // ===========================
    // MÚSICA
    // ===========================

    const startMusic = useCallback(() => {
        if (!musicRef.current) {
            musicRef.current = new Audio("/audio/audio02.mp3");
            musicRef.current.loop = true;
            musicRef.current.volume = 0.5;
        }

        musicRef.current.play().catch((err) => {
            console.error("Error reproduciendo audio:", err);
        });
    }, []);

    const stopMusic = useCallback(() => {
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.currentTime = 0;
        }
    }, []);

    // ===========================
    // NARRACIÓN
    // ===========================

    const speak = useCallback((text, id) => {
        if (!window.speechSynthesis || !text) return;

        lastTextRef.current = text;
        lastIdRef.current = id;

        if (modeRef.current !== "audiobook") return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        if (voiceRef.current) {
            utterance.voice = voiceRef.current;
        }

        utterance.lang = voiceRef.current?.lang || "es-PE";
        utterance.rate = 0.92;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setSpeakingId(id ?? null);
        };

        utterance.onend = () => {
            setSpeakingId(null);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    // ===========================
    // DETENER TODO
    // ===========================

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        stopMusic();
        setSpeakingId(null);
    }, [stopMusic]);

    // ===========================
    // CAMBIO DE MODO
    // ===========================

    const changeMode = useCallback(
        (next) => {
            if (next === modeRef.current) return;

            window.speechSynthesis.cancel();
            stopMusic();

            setSpeakingId(null);

            modeRef.current = next;
            setMode(next);

            if (next === "song") {
                startMusic();
            }

            if (
                next === "audiobook" &&
                lastTextRef.current
            ) {
                setTimeout(() => {
                    speak(lastTextRef.current, lastIdRef.current);
                }, 150);
            }
        },
        [speak, startMusic, stopMusic]
    );

    useEffect(() => {
        return () => {
            stopMusic();
        };
    }, [stopMusic]);

    return {
        mode,
        setMode: changeMode,
        speak,
        stop,
        speakingId,
    };
}