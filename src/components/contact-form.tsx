"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

const topics = [
  "Allmän fråga",
  "Orderstatus",
  "Retur / reklamation",
  "Samarbete / press",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setFeedback(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Kunde inte skicka meddelandet.");
      }
      setStatus("ok");
      setFeedback("Tack! Vi återkommer inom 24h på vardagar.");
      setName("");
      setEmail("");
      setMessage("");
      setTopic(topics[0]);
    } catch (err) {
      setStatus("error");
      setFeedback(
        err instanceof Error ? err.message : "Något gick fel, försök igen.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-ice-50/70">
        Namn
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-ice-50 focus:border-ice focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-ice-50/70">
        E-post
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-ice-50 focus:border-ice focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-ice-50/70">
        Ämne
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-ice-50 focus:border-ice focus:outline-none"
        >
          {topics.map((t) => (
            <option key={t} value={t} className="bg-ink">
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-ice-50/70">
        Meddelande
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-ice-50 focus:border-ice focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary"
      >
        {status === "submitting" ? "Skickar…" : "Skicka meddelande"}
      </button>
      {feedback ? (
        <p
          role="status"
          className={
            status === "error"
              ? "text-sm text-ember"
              : "text-sm text-ice"
          }
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
