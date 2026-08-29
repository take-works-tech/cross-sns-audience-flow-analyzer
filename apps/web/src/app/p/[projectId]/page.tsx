import { AppFrame } from "@/components/app-frame";
import { TopBar } from "@/components/chrome/TopBar";
import { MOCK_PROJECTS } from "@/lib/mock/data";

export default async function ProjectPage({
  params,
}: PageProps<"/p/[projectId]">) {
  const { projectId } = await params;
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  return (
    <div className="flex h-full flex-col">
      <TopBar projectName={project?.name} />
      <AppFrame projectId={projectId} />
    </div>
  );
}
