import Image from "next/image";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBannerProps {
  workoutStreak: number;
}

export function StreakBanner({ workoutStreak }: StreakBannerProps) {
  const isZero = workoutStreak === 0;
  const intensity = Math.min(workoutStreak / 30, 1);
  const overlayStyle = {
    backgroundColor: `rgba(249, 115, 22, ${intensity})`,
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl px-5 py-12 transition-all duration-700",
        isZero ? "bg-zinc-900" : "bg-primary/20"
      )}
    >
      {!isZero && (
        <div
          className="absolute inset-0 transition-all duration-700 z-10 mix-blend-overlay"
          style={overlayStyle}
        />
      )}

      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/stats-banner.png"
          alt=""
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isZero ? "grayscale opacity-40" : "opacity-60"
          )}
          priority
        />
      </div>

      <div className="relative z-20 flex flex-col items-center gap-4">
        <div
          className={cn(
            "rounded-full border border-background/12 p-4 backdrop-blur-sm transition-all duration-500",
            workoutStreak > 0 ? "bg-background/20" : "bg-background/10"
          )}
        >
          <Flame
            className={cn(
              "size-10 transition-all duration-700",
              workoutStreak >= 7 ? "animate-bounce" : "",
              intensity > 0.5 ? "text-white fill-white" : "text-background"
            )}
            style={{
              filter:
                workoutStreak > 0
                  ? `drop-shadow(0 0 ${workoutStreak / 2}px rgba(255,255,255,0.6))`
                  : "none",
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p
            className="text-6xl uppercase leading-none text-background"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            {workoutStreak} dias
          </p>
          <p className="font-heading text-sm tracking-widest uppercase text-background/50">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  );
}