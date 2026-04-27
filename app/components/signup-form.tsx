"use client";

import { FormEvent, useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    // Placeholder MailerLite integration.
    console.log("MailerLite signup placeholder", { email: value });
    setSubmitted(true);
    setEmail("");
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
        className="h-12 rounded-none border border-white bg-white px-6 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-white"
      >
        Join
      </button>
      {submitted ? (
        <p className="text-xs uppercase tracking-[0.12em] text-white/60 sm:col-span-2">
          Thanks. You are on the list.
        </p>
      ) : null}
    </form>
  );
}
