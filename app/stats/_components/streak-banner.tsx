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
        "relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10 transition-all duration-700",
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

      <div className="relative z-20 flex flex-col items-center gap-3">
        <div className={cn(
          "rounded-full border border-background/12 p-3 backdrop-blur-xs transition-all duration-500",
          workoutStreak > 0 ? "bg-background/20" : "bg-background/10"
        )}>
          <Flame 
            className={cn(
              "size-8 transition-all duration-700",
              workoutStreak >= 7 ? "animate-bounce" : "",
              intensity > 0.5 ? "text-white fill-white" : "text-background"
            )}
            style={{ 
              filter: workoutStreak > 0 ? `drop-shadow(0 0 ${workoutStreak / 2}px rgba(255,255,255,0.6))` : 'none' 
            }}
          />
        </div>

        {/* Textos originais preservados */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-heading text-5xl font-semibold leading-[0.95] text-background">
            {workoutStreak} dias
          </p>
          <p className="font-heading text-base leading-[1.15] text-background/60">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  );
}