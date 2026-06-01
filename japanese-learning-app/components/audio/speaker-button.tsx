"use client";

import { Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { cn } from "@/lib/utils";

type SpeakerButtonProps = {
  audioSrc?: string | null;
  text: string;
  label?: string;
  className?: string;
};

export function SpeakerButton({ audioSrc, text, label = "Play pronunciation", className }: SpeakerButtonProps) {
  const { isPlaying, play } = useAudioPlayer();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void play({ audioSrc, text });
      }}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md border bg-white/90 text-muted-foreground shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-60",
        className,
      )}
      disabled={isPlaying}
    >
      <Volume2 className="size-4" />
    </button>
  );
}
