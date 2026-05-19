"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Settings = {
  wpm: number;
  fontSize: number;
  mirror: boolean;
  flip: boolean;
  darkMode: boolean;
};

type EditorViewProps = {
  onStart: () => void;
  script: string;
  setScript: React.Dispatch<React.SetStateAction<string>>;
};

type PrompterViewProps = {
  script: string;
  settings: Settings;
  onSettingsChange: (next: Partial<Settings>) => void;
  onExit: () => void;
};

const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const MIN_WPM = 10;
const MAX_WPM = 65;
const DEFAULT_WPM = 40;

function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function getWordCount(script: string): number {
  const trimmed = script.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function readTextFileWithFileReader(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Could not read text file."));
    reader.readAsText(file);
  });
}

function EditorView({ onStart, script, setScript }: EditorViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  useEffect(() => {
    const preventWindowFileDrop = (event: DragEvent) => {
      event.preventDefault();
    };

    window.addEventListener("dragover", preventWindowFileDrop);
    window.addEventListener("drop", preventWindowFileDrop);

    return () => {
      window.removeEventListener("dragover", preventWindowFileDrop);
      window.removeEventListener("drop", preventWindowFileDrop);
    };
  }, []);

  const wordCount = useMemo(() => getWordCount(script), [script]);
  const estimatedSeconds = useMemo(() => {
    if (wordCount === 0) return 0;
    return Math.round((wordCount / DEFAULT_WPM) * 60);
  }, [wordCount]);

  const importFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsImporting(true);

    try {
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".txt")) {
        const text = await readTextFileWithFileReader(file);
        setScript(text);
      } else if (lower.endsWith(".docx")) {
        const mammoth = (await import("mammoth")) as {
          extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
        };
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const extractedText = result.value?.trim() ?? "";
        if (!extractedText) {
          window.alert("Could not extract text from this .docx file.");
          return;
        }
        setScript(extractedText);
      } else {
        window.alert("Unsupported file type. Please choose .txt or .docx.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      window.alert(`Import failed: ${message}`);
    } finally {
      setIsImporting(false);
    }
  }, [setScript]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await importFile(file);
    event.target.value = "";
  }, [importFile]);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDraggingFile(true);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDraggingFile(false);
    }
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDraggingFile(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await importFile(file);
  }, [importFile]);

  return (
    <section style={{ display: "grid", gap: "24px" }}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `1px solid ${isDraggingFile ? "var(--accent)" : "var(--text-primary)"}`,
          padding: "16px",
          display: "grid",
          gap: "12px",
          background: isDraggingFile ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent",
          transition: "border-color 160ms ease, background-color 160ms ease",
        }}
      >
        <label htmlFor="script-input" style={{ fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "12px" }}>
          Script
        </label>
        <textarea
          id="script-input"
          value={script}
          onChange={(event) => setScript(event.target.value)}
          placeholder="Paste your script here..."
          style={{
            width: "100%",
            minHeight: "340px",
            resize: "vertical",
            border: "1px solid var(--text-primary)",
            background: "transparent",
            color: "var(--text-primary)",
            padding: "16px",
            fontFamily: "var(--font-inter)",
            fontSize: "17px",
            lineHeight: 1.5,
            outline: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isImporting}
            className="tm-button"
          >
            {isImporting ? "Importing..." : "Import (.txt / .docx)"}
          </button>
          <input ref={inputRef} type="file" accept=".txt,.docx" onChange={handleImport} style={{ display: "none" }} />
          <span style={{ fontFamily: MONO, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em" }}>
            {wordCount} words · est {formatTime(estimatedSeconds)}
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "10px", color: isDraggingFile ? "var(--accent)" : "inherit" }}>
          Drag and drop .txt or .docx anywhere in this box
        </p>
      </div>

      <button type="button" className="tm-cta" onClick={onStart} disabled={!script.trim()} style={{ justifySelf: "center", marginTop: "2px" }}>
        Start Prompter →
      </button>
    </section>
  );
}

function PrompterView({ script, settings, onSettingsChange, onExit }: PrompterViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const topScrollAnimationRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const hideHudTimeoutRef = useRef<number | null>(null);
  const elapsedMsRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWpm, setCurrentWpm] = useState(settings.wpm);
  const [currentFontSize, setCurrentFontSize] = useState(settings.fontSize);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [showHud, setShowHud] = useState(true);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  const startHudFadeTimer = useCallback(() => {
    if (hideHudTimeoutRef.current) {
      window.clearTimeout(hideHudTimeoutRef.current);
    }
    hideHudTimeoutRef.current = window.setTimeout(() => {
      setShowHud(false);
    }, 3000);
  }, []);

  const revealHud = useCallback(() => {
    setShowHud(true);
    startHudFadeTimer();
  }, [startHudFadeTimer]);

  const hideHudNow = useCallback(() => {
    if (hideHudTimeoutRef.current) {
      window.clearTimeout(hideHudTimeoutRef.current);
    }
    setShowHud(false);
  }, []);

  const toggleHudVisibility = useCallback(() => {
    setShowHud((current) => {
      const next = !current;
      if (next) {
        startHudFadeTimer();
      } else if (hideHudTimeoutRef.current) {
        window.clearTimeout(hideHudTimeoutRef.current);
      }
      return next;
    });
  }, [startHudFadeTimer]);

  const syncProgress = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const maxScroll = Math.max(1, node.scrollHeight - node.clientHeight);
    const ratio = Math.min(1, node.scrollTop / maxScroll);
    setProgress(ratio);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    lastFrameRef.current = null;
  }, []);

  const cancelTopScrollAnimation = useCallback(() => {
    if (topScrollAnimationRef.current) {
      window.cancelAnimationFrame(topScrollAnimationRef.current);
      topScrollAnimationRef.current = null;
    }
  }, []);

  const restart = useCallback(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = 0;
    }
    elapsedMsRef.current = 0;
    setElapsedTime("0:00");
    setProgress(0);
    setShowEndOverlay(false);
    setIsPlaying(true);
    lastFrameRef.current = null;
    revealHud();
  }, [revealHud]);

  const jumpToTop = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    cancelTopScrollAnimation();
    pause();

    const startScroll = node.scrollTop;
    if (startScroll <= 1) {
      setElapsedTime("0:00");
      elapsedMsRef.current = 0;
      setProgress(0);
      setShowEndOverlay(false);
      revealHud();
      return;
    }

    const durationMs = 1100;
    const brakeMs = 500;
    const cruiseMs = Math.max(0, durationMs - brakeMs);
    const cruiseProgress = 0.82;
    const startTime = performance.now();
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const step = (now: number) => {
      const elapsed = now - startTime;
      let eased: number;
      if (elapsed <= cruiseMs) {
        const cruiseT = cruiseMs === 0 ? 1 : elapsed / cruiseMs;
        eased = cruiseProgress * cruiseT;
      } else {
        const brakeT = Math.min(1, (elapsed - cruiseMs) / brakeMs);
        eased = cruiseProgress + (1 - cruiseProgress) * easeOutQuint(brakeT);
      }
      const t = Math.min(1, elapsed / durationMs);
      node.scrollTop = startScroll * (1 - eased);

      const maxScroll = Math.max(1, node.scrollHeight - node.clientHeight);
      const ratio = Math.min(1, node.scrollTop / maxScroll);
      setProgress(ratio);

      if (t < 1) {
        topScrollAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        topScrollAnimationRef.current = null;
        elapsedMsRef.current = 0;
        setElapsedTime("0:00");
        setProgress(0);
        setShowEndOverlay(false);
        lastFrameRef.current = null;
        revealHud();
      }
    };

    topScrollAnimationRef.current = window.requestAnimationFrame(step);
  }, [cancelTopScrollAnimation, pause, revealHud]);

  const handleExit = useCallback(() => {
    pause();
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    onExit();
  }, [onExit, pause]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((current) => {
      const next = !current;
      if (next) {
        hideHudNow();
      } else {
        revealHud();
      }
      return next;
    });
  }, [hideHudNow, revealHud]);

  const toggleFullscreen = useCallback(async () => {
    const root = document.documentElement;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await root.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen permission / browser errors.
    }
    revealHud();
  }, [revealHud]);

  const adjustWpm = useCallback((delta: number) => {
    setCurrentWpm((current) => {
      const next = Math.max(MIN_WPM, Math.min(MAX_WPM, current + delta));
      onSettingsChange({ wpm: next });
      return next;
    });
    revealHud();
  }, [onSettingsChange, revealHud]);

  const setWpmDirect = useCallback((nextValue: number) => {
    const next = Math.max(MIN_WPM, Math.min(MAX_WPM, nextValue));
    setCurrentWpm(next);
    onSettingsChange({ wpm: next });
    revealHud();
  }, [onSettingsChange, revealHud]);

  const setFontSizeDirect = useCallback((nextValue: number) => {
    const next = Math.max(32, Math.min(120, nextValue));
    setCurrentFontSize(next);
    onSettingsChange({ fontSize: next });
    revealHud();
  }, [onSettingsChange, revealHud]);

  useEffect(() => {
    startHudFadeTimer();
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "dark");

    return () => {
      if (previousTheme) {
        root.setAttribute("data-theme", previousTheme);
      } else {
        root.removeAttribute("data-theme");
      }
      if (hideHudTimeoutRef.current) {
        window.clearTimeout(hideHudTimeoutRef.current);
      }
      if (topScrollAnimationRef.current) {
        window.cancelAnimationFrame(topScrollAnimationRef.current);
      }
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startHudFadeTimer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const isPlayToggle = key === " " || key === "Enter" || key === "PageDown" || key === "ArrowRight";
      const isExit = key === "Escape" || key === "PageUp" || key === "ArrowLeft";

      if (isPlayToggle) {
        event.preventDefault();
        togglePlayPause();
        return;
      }

      if (isExit) {
        event.preventDefault();
        handleExit();
        return;
      }

      if (key.toLowerCase() === "t") {
        event.preventDefault();
        toggleHudVisibility();
        return;
      }

      if (key === "ArrowUp") {
        event.preventDefault();
        adjustWpm(5);
      } else if (key === "ArrowDown") {
        event.preventDefault();
        adjustWpm(-5);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [adjustWpm, handleExit, toggleHudVisibility, togglePlayPause]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (!isPlaying) {
        animationRef.current = null;
        return;
      }

      const node = scrollRef.current;
      if (!node) {
        animationRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const previousTime = lastFrameRef.current ?? timestamp;
      const deltaSeconds = (timestamp - previousTime) / 1000;
      lastFrameRef.current = timestamp;

      const pixelsPerSecond = (currentWpm / 60) * (currentFontSize * 3.2);
      node.scrollTop += pixelsPerSecond * deltaSeconds;

      elapsedMsRef.current += deltaSeconds * 1000;
      setElapsedTime(formatTime(elapsedMsRef.current / 1000));

      const maxScroll = Math.max(1, node.scrollHeight - node.clientHeight);
      const ratio = Math.min(1, node.scrollTop / maxScroll);
      setProgress(ratio);

      if (node.scrollTop >= maxScroll - 1) {
        setShowEndOverlay(true);
        pause();
        revealHud();
        return;
      }

      animationRef.current = window.requestAnimationFrame(tick);
    };

    if (isPlaying) {
      animationRef.current = window.requestAnimationFrame(tick);
    } else {
      lastFrameRef.current = null;
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [currentFontSize, currentWpm, isPlaying, pause, revealHud]);

  return (
    <section style={{ position: "fixed", inset: 0, background: "#000", color: "#fff" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: `${Math.max(0, Math.min(1, progress)) * 100}%`, height: "3px", background: "#ff6200", zIndex: 40 }} />

      <div
        ref={scrollRef}
        onScroll={syncProgress}
        onMouseMove={revealHud}
        onTouchStart={revealHud}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          padding: "8vh 8vw 18vh",
          fontFamily: "var(--font-archivo)",
          fontSize: `${currentFontSize}px`,
          lineHeight: 1.3,
          letterSpacing: "0.01em",
          transform: `${settings.mirror ? "scaleX(-1)" : ""} ${settings.flip ? "scaleY(-1)" : ""}`.trim() || "none",
          transformOrigin: "center center",
          whiteSpace: "pre-wrap",
        }}
      >
        {script}
      </div>

      <div
        style={{
          position: "fixed",
          left: "16px",
          right: "16px",
          bottom: "14px",
          border: "1px solid #fff",
          background: "rgba(0, 0, 0, 0.75)",
          padding: "10px 14px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: MONO,
          fontSize: "11px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: showHud ? 1 : 0,
          transition: "opacity 220ms ease",
          pointerEvents: showHud ? "auto" : "none",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <div>WPM {currentWpm}</div>
        <div style={{ color: "#ff6200" }}>{isPlaying ? "Playing" : "Paused"}</div>
        <div>Elapsed {elapsedTime}</div>
        <button
          type="button"
          className="tm-button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            togglePlayPause();
          }}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="tm-button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleExit();
          }}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          Exit
        </button>
        <button
          type="button"
          className="tm-button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void toggleFullscreen();
          }}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          Fullscreen
        </button>
        <button
          type="button"
          className="tm-button"
          onClick={jumpToTop}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          Top
        </button>
        <button
          type="button"
          className="tm-button"
          onClick={() => {
            onSettingsChange({ mirror: !settings.mirror });
            revealHud();
          }}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          Mirror {settings.mirror ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          className="tm-button"
          onClick={() => {
            onSettingsChange({ flip: !settings.flip });
            revealHud();
          }}
          style={{ borderColor: "#fff", color: "#fff", padding: "8px 10px" }}
        >
          Flip {settings.flip ? "ON" : "OFF"}
        </button>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div className="tm-inline-control">
            <span>Speed</span>
            <div className="tm-inline-slider">
              <input
                type="range"
                min={MIN_WPM}
                max={MAX_WPM}
                value={currentWpm}
                onChange={(event) => setWpmDirect(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="tm-inline-control">
            <span>Size</span>
            <span style={{ fontFamily: "var(--font-archivo)", textTransform: "none", fontSize: "12px" }}>a</span>
            <span style={{ fontFamily: "var(--font-archivo)", textTransform: "none", fontSize: "18px" }}>A</span>
            <div className="tm-inline-slider">
              <input
                type="range"
                min={32}
                max={120}
                value={currentFontSize}
                onChange={(event) => setFontSizeDirect(Number(event.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {!showHud && (
        <button
          type="button"
          className="tm-button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            revealHud();
          }}
          style={{
            position: "fixed",
            right: "16px",
            bottom: "16px",
            zIndex: 55,
            borderColor: "#fff",
            color: "#fff",
            background: "rgba(0, 0, 0, 0.75)",
            padding: "8px 12px",
          }}
        >
          Visa verktyg
        </button>
      )}

      {showEndOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "grid",
            placeItems: "center",
            background: "rgba(0, 0, 0, 0.82)",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-archivo)", textTransform: "uppercase", fontSize: "clamp(34px, 6vw, 80px)" }}>
              End of Script
            </h2>
            <button type="button" className="tm-button" onClick={restart} style={{ borderColor: "#fff", color: "#fff" }}>
              Restart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Page() {
  const [script, setScript] = useState("");
  const [isPrompterActive, setIsPrompterActive] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    wpm: DEFAULT_WPM,
    fontSize: 64,
    mirror: false,
    flip: false,
    darkMode: true,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isPrompterActive) return;
    root.setAttribute("data-theme", settings.darkMode ? "dark" : "light");
    return () => {
      if (!isPrompterActive) {
        root.removeAttribute("data-theme");
      }
    };
  }, [isPrompterActive, settings.darkMode]);

  return (
    <main
      data-theme={settings.darkMode ? "dark" : "light"}
      style={{
        minHeight: "100svh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <style>{`
        main[data-theme="light"] {
          --bg: #f1ede8;
          --text-primary: #1a1a1a;
          --accent: #ff6200;
        }

        main[data-theme="dark"] {
          --bg: #1a1a1a;
          --text-primary: #f1ede8;
          --accent: #ff6200;
        }

        .mono {
          margin: 0;
          font-family: ${MONO};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
        }

        .tm-shell {
          width: min(1100px, 100%);
          margin: 0 auto;
          padding: clamp(20px, 3vw, 38px);
          display: grid;
          gap: 22px;
        }

        .tm-title {
          margin: 0;
          font-family: var(--font-archivo);
          font-size: clamp(46px, 9vw, 130px);
          line-height: 0.87;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .tm-button,
        .tm-cta {
          border: 1px solid var(--text-primary);
          border-radius: 0;
          padding: 12px 14px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: ${MONO};
          font-size: 12px;
          background: transparent;
          color: inherit;
          transition: background-color 180ms ease, color 180ms ease;
        }

        .tm-button:hover,
        .tm-cta:hover {
          background: var(--text-primary);
          color: var(--bg);
        }

        .tm-button:disabled,
        .tm-cta:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tm-cta {
          justify-self: start;
          font-size: 14px;
          padding: 16px 20px;
          font-weight: 700;
          font-family: var(--font-archivo);
          letter-spacing: 0.04em;
        }

        .tm-seo {
          border: 1px solid var(--text-primary);
          padding: 16px;
          display: grid;
          gap: 10px;
          transition: opacity 180ms ease;
        }

        .tm-seo h1 {
          margin: 0;
          font-family: var(--font-archivo);
          text-transform: uppercase;
          line-height: 0.92;
          font-size: clamp(34px, 7vw, 72px);
        }

        .tm-seo p {
          margin: 0;
          max-width: 70ch;
          font-size: 16px;
        }

        .tm-seo[data-hidden="true"] {
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          padding-top: 0;
          padding-bottom: 0;
          border-width: 0;
          pointer-events: none;
        }

        .tm-inline-control {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .tm-inline-slider {
          width: 170px;
          opacity: 0;
          pointer-events: none;
          transform: scaleX(0.98);
          transform-origin: left center;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .tm-inline-control:hover .tm-inline-slider,
        .tm-inline-control:focus-within .tm-inline-slider {
          opacity: 1;
          pointer-events: auto;
          transform: scaleX(1);
        }

        .tm-inline-slider input[type="range"] {
          width: 170px;
        }
      `}</style>

      <div className="tm-shell">
        <p className="mono" style={{ color: "var(--accent)" }}>Prompter Master</p>
        <p className="tm-title">Teleprompter</p>
        <button
          type="button"
          className="tm-button"
          onClick={() => {
            setSettings((current) => ({ ...current, darkMode: !current.darkMode }));
          }}
          style={{ justifySelf: "start" }}
        >
          Dark mode {settings.darkMode ? "ON" : "OFF"}
        </button>

        <div className="tm-seo" data-hidden={isPrompterActive || script.trim().length > 0 ? "true" : "false"}>
          <h1>Free Online Teleprompter</h1>
          <p>Paste your script, set your pace, and start recording. No app, no install.</p>
        </div>

        {!isPrompterActive && (
          <EditorView
            onStart={() => setIsPrompterActive(true)}
            script={script}
            setScript={setScript}
          />
        )}
      </div>

      {isPrompterActive && (
        <PrompterView
          script={script}
          settings={settings}
          onSettingsChange={(next) => {
            setSettings((current) => ({ ...current, ...next }));
          }}
          onExit={() => {
            setIsPrompterActive(false);
          }}
        />
      )}
    </main>
  );
}
