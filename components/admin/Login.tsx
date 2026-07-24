"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Formulaire de connexion à l'espace admin (mot de passe unique). */
export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-800 p-8"
      >
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink">
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="text-center font-heading text-2xl font-black uppercase text-bone">
          Espace admin
        </h1>
        <p className="mt-2 text-center text-sm text-bone-dim">
          Accès réservé au club.
        </p>
        <label className="mt-6 block">
          <span className="mb-1.5 block font-heading text-[0.7rem] font-bold uppercase tracking-wider text-bone-dim">
            Mot de passe
          </span>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-ink px-3.5 py-2.5 text-bone focus:border-gold focus:outline-none"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={busy || !password}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
