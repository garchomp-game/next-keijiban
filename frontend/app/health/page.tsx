export default async function HealthPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/healthz`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return <pre>{JSON.stringify(data)}</pre>;
}
