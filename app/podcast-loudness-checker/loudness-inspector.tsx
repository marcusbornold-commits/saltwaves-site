"use client";

// app/podcast-loudness-checker/loudness-inspector.tsx
// Loudness Inspector — Saltwaves. All analysis runs locally in the browser.

import { useCallback, useRef, useState } from "react";
import {
  analyzeChannels,
  decodeFileTo48k,
  type AnalysisResult,
} from "@/lib/audio-analysis";
import { buildDiagnoses, PLATFORMS, verdictFor } from "./diagnosis";
import { trackInspectorEvent } from "./tracking";

type Phase = "idle" | "working" | "done" | "error";

const fmt = (v: number, unit = "", digits = 1) =>
  !isFinite(v) ? "–" : `${v.toFixed(digits)}${unit}`;

const MAX_MB = 400;

export default function LoudnessInspector() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [target, setTarget] = useState(PLATFORMS[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setPhase("working");
    setFileName(file.name);
    setResult(null);
    setError(null);

    if (file.size > MAX_MB * 1024 * 1024) {
      setPhase("error");
      setError(`File is larger than ${MAX_MB} MB. Try a compressed export.`);
      return;
    }

    const mb = (file.size / 1048576).toFixed(0);
    setStatus(`Decoding ${mb} MB — this can take a moment on long files…`);

    const startedAt = performance.now();
    try {
      const channels = await decodeFileTo48k(file);
      const mins = channels[0].length / 48000 / 60;
      trackInspectorEvent("analysis_started", {
        durationMin: Math.round(mins),
      });
      const res = await analyzeChannels(channels, (stage, frac) => {
        setStatus(`Measuring ${stage} · ${(frac * 100).toFixed(0)} %`);
      });
      setResult(res);
      setPhase("done");
      setStatus("");
      trackInspectorEvent("analysis_completed", {
        durationMin: Math.round(res.durationSec / 60),
        integratedLufs: Number(res.integratedLufs.toFixed(1)),
        truePeakDb: Number(res.truePeakDb.toFixed(1)),
        lra: Number(res.lra.toFixed(1)),
        elapsedSec: Math.round((performance.now() - startedAt) / 1000),
      });
    } catch (e) {
      setPhase("error");
      setStatus("");
      setError(
        e instanceof Error && e.name === "EncodingError"
          ? "Could not decode this file. Try WAV, MP3, M4A or FLAC."
          : "Analysis failed. Try a different file.",
      );
      trackInspectorEvent("analysis_failed", {});
    }
  }, []);

  const platform = PLATFORMS.find((p) => p.id === target) ?? PLATFORMS[0];
  const verdict = result ? verdictFor(result, platform) : null;
  const diagnoses = result ? buildDiagnoses(result, platform) : [];

  return (
    <div className="border border-[#ff6200]/25 bg-[#222018] p-8 sm:p-10">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        className={`flex cursor-pointer flex-col gap-2 rounded-xl border-[1.5px] border-dashed p-8 text-center transition-colors ${
          phase === "done"
            ? "border-solid border-[#ff6200] bg-[#ff6200]/[0.04]"
            : "border-[#f1ede8]/25 hover:border-[#ff6200]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.wav,.mp3,.m4a,.flac,.aac,.ogg"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff6200]">
          Analyze an episode
        </span>
        <span className="break-all text-base text-[#f1ede8]">
          {fileName ?? "Drop an audio file here, or click to browse"}
        </span>
        <span className="text-sm text-[#f1ede8]/55">
          {status ||
            (phase === "idle"
              ? "WAV, MP3, M4A or FLAC. Nothing is uploaded — the analysis runs on your machine."
              : "")}
        </span>
        {error && <span className="text-sm text-[#ff8a7a]">{error}</span>}
      </div>

      {result && verdict && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-[#f1ede8]/55">
              Target
            </span>
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setTarget(p.id);
                  trackInspectorEvent("target_changed", { target: p.id });
                }}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  p.id === target
                    ? "border-[#ff6200] bg-[#ff6200] text-[#1a1a1a]"
                    : "border-[#f1ede8]/20 text-[#f1ede8]/75 hover:border-[#f1ede8]/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div
            className={`mt-6 border-l-4 py-3 pl-5 ${
              verdict.pass ? "border-[#ff6200]" : "border-[#f1ede8]/35"
            }`}
          >
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {verdict.headline}
            </p>
            <p className="mt-2 max-w-2xl leading-relaxed text-[#f1ede8]/80">
              {verdict.detail}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Integrated",
                value: fmt(result.integratedLufs, " LUFS"),
                note: `${platform.label} target ${platform.lufs}`,
              },
              {
                label: "True peak",
                value: fmt(result.truePeakDb, " dBTP"),
                note: `ceiling ${platform.dbtp}`,
              },
              {
                label: "Loudness range",
                value: fmt(result.lra, " LU"),
                note: "spoken word 5–11",
              },
              {
                label: "Peak to loudness",
                value: fmt(result.plr, " dB"),
                note: "headroom above average",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-[#f1ede8]/12 bg-[#1a1a1a] p-4"
              >
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#f1ede8]/55">
                  {m.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {m.value}
                </p>
                <p className="mt-1 text-xs text-[#f1ede8]/50">{m.note}</p>
              </div>
            ))}
          </div>

          {diagnoses.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#f1ede8]/55">
                What a broadcast engineer would say
              </h3>
              <ul className="mt-4 space-y-4">
                {diagnoses.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-xl border border-[#f1ede8]/12 bg-[#1a1a1a] p-5"
                  >
                    <p className="font-semibold text-[#ff6200]">{d.title}</p>
                    <p className="mt-2 leading-relaxed text-[#f1ede8]/80">
                      {d.body}
                    </p>
                    <p className="mt-2 text-sm text-[#f1ede8]/55">{d.fix}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-8 text-xs leading-relaxed text-[#f1ede8]/45">
            {(result.durationSec / 60).toFixed(1)} min analyzed. Measurements
            follow ITU-R BS.1770-4, K-weighted and gated, with true peak
            evaluated at 4× oversampling. Verified against the ffmpeg ebur128
            reference to within 0.1 units.
          </p>
        </div>
      )}
    </div>
  );
}
