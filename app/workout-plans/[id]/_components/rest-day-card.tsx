import { Calendar, Coffee } from "lucide-react";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface RestDayCardProps {
  weekDay: string;
}

export function RestDayCard({ weekDay }: RestDayCardProps) {
  return (
    <div className="relative flex h-[110px] w-full flex-col items-start justify-between overflow-hidden rounded-xl bg-muted/40 p-5 border border-border/50 shadow-sm">
      
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
        <Coffee size={100} className="rotate-12 text-foreground" />
      </div>

      <div className="relative flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1.5 backdrop-blur-md">
        <Calendar className="size-3.5 text-foreground/70" />
        <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          {WEEKDAY_LABELS[weekDay]}
        </span>
      </div>

      <div className="relative flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 backdrop-blur-sm">
          <Coffee className="size-5 text-foreground" />
        </div>
        <span className="font-heading text-2xl font-semibold leading-none text-foreground tracking-tight">
          Descanso
        </span>
      </div>
    </div>
  );
}