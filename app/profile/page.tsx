import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import { getUserTrainData, getHomeData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Weight, Ruler, BicepsFlexed, User, Crown } from "lucide-react";
import { LogoutButton } from "./_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [trainData, homeData] = await Promise.all([
    getUserTrainData(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  if (trainData.status !== 200) {
    throw new Error("Failed to fetch user train data");
  }

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    !trainData.data;
  if (needsOnboarding) redirect("/onboarding");

  const user = session.data.user;
  const data = trainData.data;

  const weightInKg = data ? data.weightInGrams / 1000 : null;
  const heightInCm = data?.heightInCentimeters ?? null;
  const bodyFatPercentage = data?.bodyFatPercentage ?? null;
  const age = data?.age ?? null;

  const firstName = user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[260px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[32px] px-6 pb-8 pt-6">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/profile-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            }}
          />
        </div>

        <p
          className="relative text-[24px] uppercase leading-none text-white"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>

        <div className="relative flex w-full items-end gap-4">
          <Avatar className="size-16 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-xl bg-muted text-foreground">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5 pb-1">
            <h1
              className="text-2xl uppercase leading-tight text-white"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {firstName}
            </h1>
            <div className="flex items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 backdrop-blur-sm border border-background/10 w-fit">
              <Crown className="size-3 text-white/50" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Plano Básico
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-5 pt-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Seus Dados
          </h2>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 border border-border/40 p-5 shadow-sm">
              <div className="flex items-center justify-center rounded-xl bg-muted/50 p-2.5">
                <Weight className="size-4 text-foreground/70" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading text-2xl font-bold leading-none text-foreground">
                  {weightInKg ?? "-"}
                </span>
                <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                  Kg
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 border border-border/40 p-5 shadow-sm">
              <div className="flex items-center justify-center rounded-xl bg-muted/50 p-2.5">
                <Ruler className="size-4 text-foreground/70" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading text-2xl font-bold leading-none text-foreground">
                  {heightInCm ?? "-"}
                </span>
                <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                  Cm
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 border border-border/40 p-5 shadow-sm">
              <div className="flex items-center justify-center rounded-xl bg-muted/50 p-2.5">
                <BicepsFlexed className="size-4 text-foreground/70" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading text-2xl font-bold leading-none text-foreground">
                  {bodyFatPercentage != null ? `${bodyFatPercentage}%` : "-"}
                </span>
                <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                  Gordura
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 border border-border/40 p-5 shadow-sm">
              <div className="flex items-center justify-center rounded-xl bg-muted/50 p-2.5">
                <User className="size-4 text-foreground/70" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading text-2xl font-bold leading-none text-foreground">
                  {age ?? "-"}
                </span>
                <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                  Anos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <div className="h-px w-full bg-border/40" />
          <LogoutButton />
        </div>
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}