// Optional Inspector analytics are paused until an opt-in flow is implemented.
// Remove the legacy first-touch marker; do not send measurements or set new cookies.
function clearLegacyMarker(): void {
  if (typeof document === "undefined") return;
  document.cookie = "sw_li_first_touch=; path=/; max-age=0; SameSite=Lax; Secure";
  if (window.location.hostname.endsWith("saltwaves.studio")) {
    document.cookie = "sw_li_first_touch=; path=/; domain=.saltwaves.studio; max-age=0; SameSite=Lax; Secure";
  }
}
export function trackInspectorEvent(_event: string, _props: Record<string, string | number | boolean>): void {
  clearLegacyMarker();
}
export function inspectorAttribution(): { days: number } | null {
  clearLegacyMarker();
  return null;
}
