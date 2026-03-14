import { Calendar, Coffee, ArrowRight } from "lucide-react";

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
  showActions?: boolean;
}

export function RestDayCard({ weekDay, showActions = false }: RestDayCardProps) {
  return (
    <div className="group relative flex h-[130px] w-full flex-col items-start justify-between overflow-hidden rounded-xl bg-muted/40 p-5 border border-border/50 shadow-sm transition-all duration-300 hover:border-border/70 hover:bg-muted/50 hover:shadow-md">
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.08]">
        <Coffee size={100} className="rotate-12 text-foreground" />
      </div>

      <div className="relative flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1.5 backdrop-blur-md">
        <Calendar className="size-3.5 text-foreground/70" />
        <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          {WEEKDAY_LABELS[weekDay]}
        </span>
      </div>

      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <Coffee className="size-5 text-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-heading text-2xl font-semibold leading-none text-foreground tracking-tight">
              Descanso
            </span>
            {showActions && (
              <span className="text-[11px] text-muted-foreground/70 leading-none">
                Registre seu descanso
              </span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 rounded-full border border-border/30 bg-background/40 px-2.5 py-1.5 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-primary">
              Confirmar
            </span>
            <ArrowRight className="size-3 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5" />
          </div>
        )}
      </div>
    </div>
  );
}