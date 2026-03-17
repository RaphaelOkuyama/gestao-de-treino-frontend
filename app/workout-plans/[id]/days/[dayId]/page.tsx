import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { getWorkoutDay, getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import { Calendar, Timer, Dumbbell } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { BackButton } from "./_components/back-button";
import { ExerciseCard } from "./_components/exercise-card";
import { StartWorkoutButton } from "./_components/start-workout-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

const WEEKDAY_TITLE_LABELS: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const WEEKDAY_VALIDATOR: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { id: workoutPlanId, dayId } = await params;
  const [workoutDayData, homeData, trainData] = await Promise.all([
    getWorkoutDay(workoutPlanId, dayId),
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (workoutDayData.status !== 200) redirect("/");

  const {
    name,
    weekDay,
    estimatedDurationInSeconds,
    exercises,
    sessions,
    coverImageUrl,
  } = workoutDayData.data;

  const todayNum = dayjs().day();
  const isCorrectDay = WEEKDAY_VALIDATOR[weekDay] === todayNum;

  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);

  const inProgressSession = sessions.find(
    (s) => s.startedAt && !s.completedAt && dayjs(s.startedAt).isSame(dayjs(), "day"),
  );
  const completedSession = sessions.find(
    (s) => s.completedAt && dayjs(s.completedAt).isSame(dayjs(), "day"),
  );
  const hasInProgressSession = !!inProgressSession;
  const hasCompletedSession = !!completedSession;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <h1 className="font-heading text-lg font-semibold text-foreground">
          {hasInProgressSession || hasCompletedSession
            ? "Treino de Hoje"
            : WEEKDAY_TITLE_LABELS[weekDay]}
        </h1>
        <div className="size-6" />
      </div>

      <div className="px-5">
        <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={name}
              fill
              className="pointer-events-none object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md border border-white/10">
              <Calendar className="size-3.5 text-white" />
              <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-white">
                {WEEKDAY_LABELS[weekDay]}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-end justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <h2
                className="text-2xl uppercase leading-tight text-white truncate"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                {name}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Timer className="size-3.5 text-white/70" />
                  <span className="font-heading text-xs text-white/70 font-medium">
                    {durationInMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-white/70" />
                  <span className="font-heading text-xs text-white/70 font-medium whitespace-nowrap">
                    {exercises.length} exs
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {!hasInProgressSession && !hasCompletedSession && isCorrectDay && (
                <StartWorkoutButton
                  workoutPlanId={workoutPlanId}
                  workoutDayId={dayId}
                />
              )}

              {!hasInProgressSession && !hasCompletedSession && !isCorrectDay && (
                <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10 whitespace-nowrap">
                  <span className="font-heading text-[10px] font-bold text-white/60 uppercase tracking-tight">
                    Bloqueado
                  </span>
                </div>
              )}

              {hasCompletedSession && (
                <div className="rounded-full bg-emerald-500/20 px-4 py-2 backdrop-blur-md border border-emerald-500/20 whitespace-nowrap">
                  <span className="font-heading text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
                    Concluído
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        {exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              sessionId={inProgressSession?.id}
            />
          ))}
      </div>

      {hasInProgressSession && inProgressSession && (
        <div className="px-5 pt-5">
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={dayId}
            sessionId={inProgressSession.id}
          />
        </div>
      )}

      <BottomNav activePage="calendar" />
    </div>
  );
}