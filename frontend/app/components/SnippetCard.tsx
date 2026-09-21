"use client";

import { useState } from "react";
import { deleteSnippet, languageLabel, type Snippet } from "../lib/api";

interface Props {
  snippet: Snippet;
  onDeleted: () => Promise<void> | void;
}

export default function SnippetCard({ snippet, onDeleted }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const tags = snippet.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  // La extensión (.js, .py, .sql) la definió la clase concreta creada por la Factory
  function handleDownload() {
    const blob = new Blob([snippet.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${snippet.title.replace(/[^\w-]+/g, "_")}${snippet.fileExtension}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar "${snippet.title}"?`)) return;
    try {
      await deleteSnippet(snippet.id);
      await onDeleted();
    } catch {
      setError("No se pudo eliminar el snippet.");
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{snippet.title}</h3>
          <p className="text-xs text-gray-500">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {languageLabel(snippet.language)} · {snippet.fileExtension}
        </span>
      </header>

      <pre className="overflow-x-auto rounded-md bg-gray-900 p-3 text-sm text-gray-100">
        <code>{snippet.code}</code>
      </pre>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              #{t}
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <footer className="mt-4 flex gap-2">
        <button
          onClick={handleCopy}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
        <button
          onClick={handleDownload}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Descargar
        </button>
        <button
          onClick={handleDelete}
          className="ml-auto rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>
      </footer>
    </article>
  );
}