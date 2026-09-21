"use client";

import { useState, type FormEvent } from "react";
import { createSnippet, languageLabel } from "../lib/api";

interface Props {
  languages: string[];
  onCreated: () => Promise<void> | void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function SnippetForm({ languages, onCreated }: Props) {
  const [language, setLanguage] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Mientras el usuario no elija, se usa el primer lenguaje que devuelve la API
  const selectedLanguage = language || languages[0] || "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createSnippet({ language: selectedLanguage, title, code, tags });
      setTitle("");
      setCode("");
      setTags("");
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow">
      <h2 className="text-lg font-semibold text-gray-900">Nuevo snippet</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Lenguaje</label>
        <select
          className={inputClass}
          value={selectedLanguage}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((l) => (
            <option key={l} value={l}>
              {languageLabel(l)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Leer un archivo"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Código</label>
        <textarea
          className={`${inputClass} h-40 font-mono`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Pega tu código aquí"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Etiquetas (separadas por coma)
        </label>
        <input
          className={inputClass}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="archivos, io"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving || !selectedLanguage}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar snippet"}
      </button>
    </form>
  );
}