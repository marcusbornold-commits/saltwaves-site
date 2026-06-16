"use client";

import { FormEvent, useState } from "react";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitted(false);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: value }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not subscribe right now.");
        return;
      }

      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <p
        role="status"
        className="mt-8 border border-[#ff6200]/30 bg-[#ff6200]/10 px-5 py-4 font-[family-name:var(--font-space)] text-sm leading-relaxed text-[#f1ede8]"
      >
        You&apos;re on the list — we&apos;ll email you when it launches.
      </p>
    );
  }

  return (
    <div className="mt-8 w-full max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <label htmlFor="loudness-inspector-email" className="sr-only">
          Email
        </label>
        <input
          id="loudness-inspector-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@domain.com"
          className="h-12 min-w-0 flex-1 rounded-[2px] border border-[#f1ede8]/20 bg-[#f1ede8]/5 px-4 font-[family-name:var(--font-space)] text-[0.95rem] text-[#f1ede8] placeholder:text-[#f1ede8]/40 focus:border-[#ff6200]/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 rounded-[2px] bg-[#ff6200] px-6 font-[family-name:var(--font-archivo)] text-[0.8rem] uppercase tracking-[0.08em] text-[#1a1a1a] transition-colors hover:bg-[#cc4e00] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Notify me"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 font-[family-name:var(--font-space)] text-sm text-[#ff8e57]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
