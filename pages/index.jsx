import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Rewrite Assistant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your rough feedback here..."
          rows={6}
          className="w-full p-3 border rounded resize-none"
        />
        <button
          type="submit"
          disabled={loading || !input}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Rewriting..." : "Rewrite"}
        </button>
      </form>

      {results && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="font-semibold text-lg">Professional Rewrite</h2>
            <p className="border p-3 rounded bg-gray-50">{results.professional}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Empathetic Rewrite</h2>
            <p className="border p-3 rounded bg-gray-50">{results.empathetic}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Tone Risk Tags</h2>
            <ul className="list-disc ml-5">
              {results.risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Suggested CTA</h2>
            <p className="italic">{results.cta}</p>
          </div>
        </div>
      )}
    </main>
  );
}
