// Build-time HTML partials (DRY: header/footer are authored once in
// site/partials/ and referenced from every page).
//
// A page pulls in a partial with a marker on its own line:
//     <!-- @include header -->
//
// Expansion runs at build time (see scripts/bundle.mjs), so the HTML shipped to
// dist/ is plain, fully-inlined markup — no runtime fetch, no flash of missing
// header, fully crawlable. The marker's indentation is applied to every line of
// the partial so the generated HTML stays tidy.
//
// Fails loud (non-negotiable #3) on a missing partial or a circular include.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Captures the marker's leading indentation so we can re-indent the partial.
const INCLUDE_RE = /^([ \t]*)<!--\s*@include\s+([\w-]+)\s*-->[ \t]*$/gm;

export function expandIncludes(html, partialsDir, seen = new Set()) {
  return html.replace(INCLUDE_RE, (_match, indent, name) => {
    if (seen.has(name)) {
      throw new Error(`Circular @include detected for partial "${name}".`);
    }
    const file = join(partialsDir, `${name}.html`);
    if (!existsSync(file)) {
      throw new Error(`@include "${name}" → missing partial ${file}`);
    }
    const raw = readFileSync(file, "utf8").replace(/\n+$/, "");
    // Recurse so a partial can itself include partials.
    const expanded = expandIncludes(raw, partialsDir, new Set([...seen, name]));
    // Re-indent every non-blank line to the marker's column.
    return expanded
      .split("\n")
      .map((line) => (line.trim() === "" ? "" : indent + line))
      .join("\n");
  });
}
