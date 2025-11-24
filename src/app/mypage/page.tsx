// This page will show up at the route /mypage

// Using incremental static regeneration, will invalidate this page
// after 300s (no deploy webhooks needed)
export const revalidate = 300;

export default async function MyPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">My Page</h1>
      <p>This is a placeholder page.</p>
    </div>
  );
}

