import { getKnowledgeHubData } from '@/lib/parser';
import Shell from '@/components/Shell';

export default async function Home() {
  // Use local file for development, can be replaced with a remote URL
  const source = process.env.MD_SOURCE || 'knowledge-hub.md';

  try {
    const data = await getKnowledgeHubData(source);
    return <Shell data={data} />;
  } catch (error) {
    console.error('Error loading data:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-6 font-medium">Failed to load the knowledge hub data.</p>
          <pre className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg overflow-x-auto text-left border border-slate-100 mb-6">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Retry
          </a>
        </div>
      </div>
    );
  }
}
