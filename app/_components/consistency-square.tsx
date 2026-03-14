interface ConsistencySquareProps {
  completed: boolean;
  started: boolean;
  isToday: boolean;
}

export function ConsistencySquare({
  completed,
  started,
  isToday,
}: ConsistencySquareProps) {
  if (completed) {
    return (
      <div className="size-8 rounded-lg bg-primary shadow-sm shadow-primary/30" />
    );
  }

  if (started) {
    return (
      <div className="size-8 rounded-lg bg-primary/25 border-2 border-primary/40" />
    );
  }

  if (isToday) {
    return (
      <div className="size-8 rounded-lg border-2 border-primary relative">
        <div className="absolute inset-0 rounded-[6px] bg-primary/10" />
      </div>
    );
  }

  return <div className="size-8 rounded-lg border-2 border-border/50 bg-muted/30" />;
}