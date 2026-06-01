"use client";

import { useCallback, useRef, useState } from "react";

type PlayOptions = {
  audioSrc?: string | null;
  text: string;
};

const smallKana = new Set(["ゃ", "ゅ", "ょ", "ャ", "ュ", "ョ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ァ", "ィ", "ゥ", "ェ", "ォ"]);
const JapaneseTextPattern = /^[\u3040-\u30ffー、。！？\s/]+$/;

function optimizeJapaneseText(text: string) {
  return text
    .replace(/,/g, "、")
    .replace(/\./g, "。")
    .replace(/\?/g, "？")
    .trim();
}

function getBestJapaneseVoice() {
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((voice) => voice.lang === "ja-JP" && voice.localService) ||
    voices.find((voice) => voice.lang === "ja-JP") ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ja")) ||
    null
  );
}

function createJapaneseUtterance(text: string, onDone?: () => void) {
  const utterance = new SpeechSynthesisUtterance(text);
  const japaneseVoice = getBestJapaneseVoice();

  utterance.lang = "ja-JP";
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  // Some browser voices clamp this, so mora-by-mora playback below provides
  // an additional timing control for kana-heavy pronunciation.
  utterance.rate = 0.55;
  utterance.pitch = 0.95;
  utterance.volume = 1;

  if (onDone) {
    utterance.onend = onDone;
    utterance.onerror = onDone;
  }

  return utterance;
}

function splitIntoMoras(text: string) {
  const normalized = optimizeJapaneseText(text);
  const moras: string[] = [];

  for (const char of normalized) {
    if (!char.trim() || char === "、" || char === "。" || char === "！" || char === "？") {
      continue;
    }

    if (char === "/") {
      moras.push("、");
      continue;
    }

    if (smallKana.has(char) && moras.length > 0) {
      moras[moras.length - 1] += char;
      continue;
    }

    moras.push(char);
  }

  return moras;
}

function shouldUseMoraTiming(text: string) {
  const normalized = optimizeJapaneseText(text);

  return JapaneseTextPattern.test(normalized) && splitIntoMoras(normalized).length > 1;
}

function speakMoraTimed(text: string, onDone: () => void) {
  const moras = splitIntoMoras(text);
  let index = 0;

  const speakNext = () => {
    const mora = moras[index];

    if (!mora) {
      onDone();
      return;
    }

    index += 1;

    if (mora === "、") {
      window.setTimeout(speakNext, 280);
      return;
    }

    if (mora === "っ" || mora === "ッ" || mora === "ー") {
      window.setTimeout(speakNext, 260);
      return;
    }

    const utterance = createJapaneseUtterance(mora, () => {
      window.setTimeout(speakNext, 140);
    });

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}

function speakJapanese(text: string, onDone: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onDone();
    return;
  }

  window.speechSynthesis.cancel();

  const optimizedText = optimizeJapaneseText(text);

  window.setTimeout(() => {
    if (shouldUseMoraTiming(optimizedText)) {
      speakMoraTimed(optimizedText, onDone);
      return;
    }

    window.speechSynthesis.speak(createJapaneseUtterance(optimizedText, onDone));
  }, 80);
}

export function useAudioPlayer() {
  const lastStartedAtRef = useRef(0);
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async ({ text }: PlayOptions) => {
    const now = Date.now();
    if (isPlayingRef.current || now - lastStartedAtRef.current < 500) {
      return;
    }

    lastStartedAtRef.current = now;
    isPlayingRef.current = true;
    setIsPlaying(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    speakJapanese(text, () => {
      window.setTimeout(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      }, 150);
    });
  }, []);

  return { isPlaying, play };
}
