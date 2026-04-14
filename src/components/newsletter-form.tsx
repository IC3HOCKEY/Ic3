"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Registrering misslyckades");
      setStatus("ok");
      setMessage("Du är på listan. Varmare dagar väntar.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Något gick fel, försök igen.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3"
      aria-label="Prenumerera på IC3 nyhetsbrev"
    >
      <label
        htmlFor="footer-email"
        className="display-heading text-xs tracking-[0.3em] text-ice"
      >
        Få nästa drop först
      </label>
      <div className="flex w-full overflow-hidden rounded-full border border-white/10 bg-white/5 focus-within:border-ice">
        <input
          id="footer-email"
          type="email"
          required
          placeholder="din@mail.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className="flex-1 bg-transparent px-5 py-3 text-sm text-ice-50 placeholder:text-ice-50/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-ice px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-ink transition hover:bg-ice-200 disabled:opacity-50"
        >
          {status === "submitting" ? "Laddar…" : "Anmäl"}
        </button>
      </div>
      {message ? (
        <p
          role="status"
          className={
            status === "error" ? "text-xs text-ember" : "text-xs text-ice"
          }
        >
          {message}
        </p>
      ) : (
        <p className="text-xs text-ice-50/40">
          Inga spam-mail. Endast droppar, restocks och events.
        </p>
      )}
    </form>
  );
}
