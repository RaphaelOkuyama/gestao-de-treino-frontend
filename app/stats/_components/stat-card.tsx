import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 border border-border/40 p-5 shadow-sm">
      <div className="flex items-center justify-center rounded-xl bg-muted/50 p-3">
        <Icon className="size-5 text-foreground/70" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-heading text-2xl font-bold leading-none text-foreground">
          {value}
        </p>
        <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}