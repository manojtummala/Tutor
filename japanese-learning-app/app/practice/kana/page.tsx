import { redirect } from "next/navigation";

type KanaPracticeRoutePageProps = {
  searchParams?: Promise<{
    lessonIds?: string | string[];
  }>;
};

export default async function KanaPracticeRoutePage({ searchParams }: KanaPracticeRoutePageProps) {
  const params = await searchParams;
  const value = Array.isArray(params?.lessonIds) ? params.lessonIds.join(",") : params?.lessonIds;
  redirect(value ? `/practice?lessonIds=${encodeURIComponent(value)}` : "/practice");
}
