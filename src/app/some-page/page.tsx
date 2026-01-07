export default async function SomePage({ 
  searchParams 
}: { 
  searchParams?: Record<string, string | string[]>;
}) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Some Page</h1>
      <p>This is a placeholder page.</p>
    </div>
  );
}

