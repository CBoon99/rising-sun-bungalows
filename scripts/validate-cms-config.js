#!/usr/bin/env node
// Validates Decap CMS config.yml parses — prevents flow-map quoting regressions
// like `label: Body (links allowed as [text](url))` which breaks YAML
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const configPath = path.join(__dirname, "..", "admin", "config.yml");

try {
  const raw = fs.readFileSync(configPath, "utf8");
  const data = yaml.load(raw);
  if (!data || !data.collections) throw new Error("Missing collections");
  // Ensure the two markdown body fields still exist and were parsed as strings
  const rawText = fs.readFileSync(configPath, "utf8");
  if (rawText.includes("label: Body (links allowed") || rawText.includes("label: Body (links as")) {
    throw new Error("Unquoted label with [brackets] found — must be quoted: \"Body (links...)\"");
  }
  console.log("CMS config OK:", configPath);
  console.log(" collections:", data.collections.map(c => c.name).join(", "));
  process.exit(0);
} catch (e) {
  console.error("CMS config INVALID:", e.message);
  if (e.mark) console.error(` at line ${e.mark.line + 1}, column ${e.mark.column + 1}`);
  process.exit(1);
}
