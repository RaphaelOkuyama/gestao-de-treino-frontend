"use client";

import { useTransition } from "react";
import { startWorkoutAction } from "../_actions";

interface StartWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
}

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(async () => {
      await startWorkoutAction(workoutPlanId, workoutDayId);
    });
  };

  return (
    <button
      onClick={handleStart}
      disabled={isPending}
      className="rounded-full bg-white/15 border border-white/25 backdrop-blur-md px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/25 active:scale-95 disabled:opacity-50"
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </button>
  );
}