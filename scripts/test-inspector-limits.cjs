const ts = require("typescript");
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync("app/(public-tools)/podcast-loudness-checker/diagnosis.ts", "utf8");
const moduleCopy = {exports:{}};
vm.runInNewContext(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {exports:moduleCopy.exports, require});
const {verdictFor, PLATFORMS, buildDiagnoses} = moduleCopy.exports;
for (const p of PLATFORMS) {
  const r = {integratedLufs:p.target, truePeakDb:p.ceiling, clippedSamples:0, loudnessRange:6, duration:120};
  assert.equal(verdictFor(r,p).pass,true);
  r.truePeakDb += 0.1;
  assert.equal(verdictFor(r,p).pass,false);
  assert.ok(buildDiagnoses(r,p).some(d=>d.id === "truepeak"));
}
console.log("PASS: exact peak ceiling accepted; +0.1 dB rejected and diagnosed for all four presets.");
