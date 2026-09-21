"use client";

import { useCallback, useEffect, useState } from "react";
import { getLanguages, getSnippets, languageLabel, type Snippet } from "./lib/api";
import SnippetForm from "./components/SnippetForm";
import SnippetCard from "./components/SnippetCard";

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setSnippets(await getSnippets(search, languageFilter));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} ¿Está corriendo el backend?`
          : "Error inesperado."
      );
    } finally {
      setLoaded(true);
    }
  }, [search, languageFilter]);

  // Carga los lenguajes una sola vez
  useEffect(() => {
    getLanguages().then(setLanguages).catch(() => {});
  }, []);

  // Recarga la lista al cambiar la búsqueda o el filtro (con una pequeña espera)
  useEffect(() => {
    const timer = setTimeout(refresh, 250);
    return () => clearTimeout(timer);
  }, [refresh]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Snippet Manager</h1>
        <p className="mb-8 text-gray-600">Guarda, busca y reutiliza tus fragmentos de código.</p>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <SnippetForm languages={languages} onCreated={refresh} />
          </aside>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                           text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                placeholder="Buscar por título, etiqueta o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="">Todos los lenguajes</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {languageLabel(l)}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}

            {loaded && !error && snippets.length === 0 && (
              <p className="rounded-md bg-white p-6 text-center text-gray-500 shadow">
                No hay snippets que mostrar. Crea el primero con el formulario.
              </p>
            )}

            {snippets.map((s) => (
              <SnippetCard key={s.id} snippet={s} onDeleted={refresh} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}