"use client";

import { useState } from "react";
import { CircleHelp, Zap, Check } from "lucide-react";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
  sessionId?: string;
}

export function ExerciseCard({ exercise, sessionId }: ExerciseCardProps) {
  const storageKey = `exercise_done_${sessionId ?? "no_session"}_${exercise.id}`;

  const [completed, setCompleted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const handleHelp = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Como executar o exercício ${exercise.name} corretamente?`,
    });
  };

  const handleToggle = () => {
    const next = !completed;
    setCompleted(next);
    localStorage.setItem(storageKey, String(next));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300",
        completed
          ? "border-primary/30 bg-primary/5"
          : "border-border/40 bg-muted/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={handleToggle}
            className={cn(
              "mt-0.5 flex shrink-0 size-5 items-center justify-center rounded-full border-2 transition-all duration-300",
              completed
                ? "border-primary bg-primary"
                : "border-border/60 bg-transparent"
            )}
          >
            {completed && (
              <Check className="size-3 text-primary-foreground" strokeWidth={3} />
            )}
          </button>

          <span
            className={cn(
              "font-heading text-base font-semibold leading-snug transition-all duration-300",
              completed ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {exercise.name}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleHelp}
          className="shrink-0 size-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <CircleHelp className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 pl-8">
        <div className="flex flex-col items-center gap-0.5 rounded-xl bg-muted/50 border border-border/30 px-3 py-2 min-w-[56px]">
          <span className="font-heading text-base font-bold leading-none text-foreground">
            {exercise.sets}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            séries
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5 rounded-xl bg-muted/50 border border-border/30 px-3 py-2 min-w-[56px]">
          <span className="font-heading text-base font-bold leading-none text-foreground">
            {exercise.reps}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            reps
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5 rounded-xl bg-muted/50 border border-border/30 px-3 py-2 min-w-[56px]">
          <div className="flex items-center gap-0.5">
            <Zap className="size-3 text-foreground" />
            <span className="font-heading text-base font-bold leading-none text-foreground">
              {exercise.restTimeInSeconds}s
            </span>
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            descanso
          </span>
        </div>
      </div>
    </div>
  );
}