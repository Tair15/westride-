// Empty dist/ without removing the directory itself — a running static server
// may hold the folder open (EBUSY on rmdir otherwise).
import { readdirSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
} else {
  for (const entry of readdirSync(DIST)) {
    rmSync(join(DIST, entry), { recursive: true, force: true });
  }
}
