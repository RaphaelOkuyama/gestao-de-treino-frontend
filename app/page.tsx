import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { getHomeData, getUserTrainData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowRight, TrendingUp } from "lucide-react";
import { BottomNav } from "./_components/bottom-nav";
import { ConsistencyTracker } from "./_components/consistency-tracker";
import { WorkoutDayCard } from "./_components/workout-day-card";
import { cn } from "@/lib/utils";

function getMotivationalSubtitle(streak: number, userName: string): string {
  if (streak >= 7) return `${streak} dias seguidos, ${userName}! Imparável 🔥`;
  if (streak >= 3) return `${streak} dias de sequência! Mantém o ritmo.`;
  if (streak === 0) return "Bora começar uma nova sequência!";
  return "Bora treinar hoje?";
}

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  const needsOnboarding =
    !homeData.data.activeWorkoutPlanId ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  const { todayWorkoutDay, workoutStreak, consistencyByDay, activeWorkoutPlanId } =
    homeData.data;
  const userName = session.data.user.name?.split(" ")[0] ?? "";

  const workoutDayLink = todayWorkoutDay
    ? `/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`
    : "#";

  const isHighStreak = workoutStreak >= 4;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[320px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[32px] px-6 pb-10 pt-6">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/home-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)",
            }}
          />
        </div>

        <div className="relative flex w-full items-center">
          <p
            className="text-[24px] uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Fit.ai
          </p>
        </div>

        <div className="relative flex w-full items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-3xl font-bold leading-tight text-white">
              Olá, {userName}
            </h1>
            <p className="font-heading text-sm text-white/60 leading-snug max-w-[200px]">
              {getMotivationalSubtitle(workoutStreak, userName)}
            </p>
          </div>

          <Link
            href={workoutDayLink}
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-full px-5 py-3 transition-all active:scale-95 shadow-lg",
              todayWorkoutDay
                ? "bg-white/15 border border-white/25 backdrop-blur-md hover:bg-white/25"
                : "bg-muted/20 cursor-not-allowed opacity-40 pointer-events-none"
            )}
          >
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Bora!
            </span>
            <ArrowRight className="size-4 text-white transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Consistência
          </h2>
          <Link
            href="/stats"
            className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
          >
            <TrendingUp className="size-3" />
            VER HISTÓRICO
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 border border-border/40 shadow-sm">
          <div className="flex-1">
            <ConsistencyTracker
              consistencyByDay={consistencyByDay}
              today={today}
            />
          </div>

          <div
            className={cn(
              "flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-xl py-3 px-2 transition-all duration-500",
              isHighStreak
                ? "bg-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.35)]"
                : "bg-muted/50 border border-border/40"
            )}
          >
            <Flame
              className={cn(
                "size-5",
                isHighStreak ? "text-white fill-white" : "text-orange-500"
              )}
            />
            <span
              className={cn(
                "font-heading font-bold leading-none tabular-nums",
                workoutStreak >= 1000
                  ? "text-sm"
                  : workoutStreak >= 100
                    ? "text-base"
                    : "text-xl",
                isHighStreak ? "text-white" : "text-foreground"
              )}
            >
              {workoutStreak}
            </span>
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-wide leading-none",
                isHighStreak ? "text-white/70" : "text-muted-foreground"
              )}
            >
              dias
            </span>
          </div>
        </div>
      </div>

      {todayWorkoutDay && (
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Treino de Hoje
            </h2>
            <Link
              href={`/workout-plans/${activeWorkoutPlanId}`}
              className="text-xs font-bold text-primary transition-colors hover:text-primary/80"
            >
              VER PLANO
            </Link>
          </div>

          <Link
            href={workoutDayLink}
            className="transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <WorkoutDayCard
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={todayWorkoutDay.estimatedDurationInSeconds}
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        </div>
      )}

      <BottomNav activePage="home" />
    </div>
  );
}