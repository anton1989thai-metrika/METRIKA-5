import EditTaskClient from "./EditTaskClient";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <EditTaskClient taskId={id} />;
}
