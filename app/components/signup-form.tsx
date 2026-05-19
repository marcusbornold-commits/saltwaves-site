"use client";

import { FormEvent, useState } from "react";

export default function SignupForm() {
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

  return (
    <div className="mt-10 w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@domain.com"
          className="h-12 flex-1 rounded-none border border-white/25 bg-white/5 px-4 text-white placeholder:text-white/50 focus:border-white/55 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-none border border-white bg-white px-6 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Joining..." : "Join"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 border border-[#ff8e57]/40 bg-[#ff8e57]/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#ffb18c]">
          {error}
        </p>
      ) : null}
      {submitted ? (
        <p className="mt-3 border border-white/15 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/70">
          Thanks. You are on the list.
        </p>
      ) : null}
    </div>
  );
}
