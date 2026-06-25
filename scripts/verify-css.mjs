// Build guard (non-negotiable #3): the build must FAIL LOUDLY, never ship an
// empty / near-empty / broken styles.css. Run after `tailwindcss` compiles.
import { readFileSync, existsSync, statSync } from "node:fs";

const CSS_PATH = "./dist/styles.css";

// Minimum sane size for a compiled Tailwind build. A near-empty file (only a
// reset, or a build that matched zero content) falls under this.
const MIN_BYTES = 5000;

// Tokens that MUST appear in the output. In Tailwind v4 every @theme color is
// emitted as a CSS variable, so their presence proves the theme compiled and
// the brand source-of-truth made it into the bundle.
const REQUIRED = [
  "--color-brand-red",
  "--color-brand-green",
  "--color-ink",
  "--color-paper",
];

function fail(msg) {
  console.error(`\n  ✗ CSS BUILD VERIFICATION FAILED\n    ${msg}\n`);
  process.exit(1);
}

if (!existsSync(CSS_PATH)) {
  fail(`${CSS_PATH} does not exist — Tailwind produced no output.`);
}

const bytes = statSync(CSS_PATH).size;
if (bytes < MIN_BYTES) {
  fail(`${CSS_PATH} is only ${bytes} bytes (< ${MIN_BYTES}). Likely empty or matched no content.`);
}

const css = readFileSync(CSS_PATH, "utf8");
const missing = REQUIRED.filter((tok) => !css.includes(tok));
if (missing.length) {
  fail(`${CSS_PATH} is missing required theme tokens: ${missing.join(", ")}`);
}

console.log(`  ✓ CSS verified: ${CSS_PATH} (${(bytes / 1024).toFixed(1)} KB, all theme tokens present)`);
