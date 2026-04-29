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
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
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
        className="h-12 rounded-none border border-white bg-white px-6 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-white"
      >
        {isSubmitting ? "Joining..." : "Join"}
      </button>
      {error ? (
        <p className="text-xs uppercase tracking-[0.12em] text-[#ff8e57] sm:col-span-2">
          {error}
        </p>
      ) : null}
      {submitted ? (
        <p className="text-xs uppercase tracking-[0.12em] text-white/60 sm:col-span-2">
          Thanks. You are on the list.
        </p>
      ) : null}
    </form>
  );
}
