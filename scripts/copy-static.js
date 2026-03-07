/**
 * Copy static site files and admin build output into a single `dist/` directory
 * for Vercel deployment.
 *
 * Static files: index.html, about.html, collections.html, contact.html, process.html,
 *               css/, js/, images/, content/
 * Admin build:  admin/dist/ → dist/admin/
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// Ensure dist exists and is clean
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/**
 * Recursively copy `src` directory into `dest`.
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static HTML files
const htmlFiles = ["index.html", "about.html", "collections.html", "contact.html", "process.html"];
for (const file of htmlFiles) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
    console.log(`Copied ${file}`);
  }
}

// Copy static asset directories
const dirs = ["css", "js", "images", "content"];
for (const dir of dirs) {
  const src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(DIST, dir));
    console.log(`Copied ${dir}/`);
  }
}

// Copy admin build output to dist/admin/
const adminDist = path.join(ROOT, "admin", "dist");
if (fs.existsSync(adminDist)) {
  copyDir(adminDist, path.join(DIST, "admin"));
  console.log("Copied admin/dist/ → dist/admin/");
} else {
  console.warn("Warning: admin/dist/ not found. Run npm run build:admin first.");
}

console.log("Build complete → dist/");
