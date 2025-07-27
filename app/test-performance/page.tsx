export default function TestPerformance() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Performance Test Page</h1>
        <p className="text-lg text-gray-600">This is a minimal page to test performance improvements.</p>
        <p className="mt-4">No heavy components, no auth checks, no dynamic imports.</p>
      </div>
    </main>
  );
}