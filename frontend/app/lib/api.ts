export interface Snippet {
  id: number;
  title: string;
  code: string;
  tags: string;
  createdAt: string;
  language: string;
  fileExtension: string;
}

export interface NewSnippet {
  language: string;
  title: string;
  code: string;
  tags: string;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  sql: "SQL",
};

export function languageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language;
}

export async function getSnippets(search = "", language = ""): Promise<Snippet[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (language) params.set("language", language);

  const res = await fetch(`${API_URL}/api/snippets?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los snippets.");
  return res.json();
}

export async function getLanguages(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/snippets/languages`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los lenguajes.");
  return res.json();
}

export async function createSnippet(data: NewSnippet): Promise<Snippet> {
  const res = await fetch(`${API_URL}/api/snippets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "No se pudo crear el snippet.");
  }
  return res.json();
}

export async function deleteSnippet(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/snippets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el snippet.");
}