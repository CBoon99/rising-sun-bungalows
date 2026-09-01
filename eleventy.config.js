const markdownIt = require("markdown-it");
const load = require("./lib/load-content");
const jsonld = require("./lib/jsonld");
let imageMeta = {};
try {
  imageMeta = require("./lib/image-meta.json");
} catch (e) {
  imageMeta = {};
}

const md = markdownIt({ html: false, breaks: true, linkify: true });
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener noreferrer");
  tokens[idx].attrSet("class", "link-accent");
  return defaultLinkOpen(tokens, idx, options, env, self);
};

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("content/");

  eleventyConfig.addGlobalData("settings", load.settings);
  eleventyConfig.addGlobalData("home", load.home);
  eleventyConfig.addGlobalData("thanks", load.thanks);
  eleventyConfig.addGlobalData("faqs", load.faqs);
  eleventyConfig.addGlobalData("jsonld", jsonld);
  eleventyConfig.addGlobalData("build_date", () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("nl2br", (s) =>
    escapeHtml(String(s ?? "").replace(/\n+$/, "")).replace(/\n/g, "<br>")
  );
  eleventyConfig.addFilter("md", (s) => md.render(String(s || "")));
  eleventyConfig.addFilter("mdi", (s) => md.renderInline(String(s || "")));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("urlencode", (s) => encodeURIComponent(s || ""));
  function assetPath(p) {
    if (!p) return "";
    if (/^https?:\/\//.test(p) || p.startsWith("/")) return p;
    return "/" + p;
  }
  eleventyConfig.addFilter("asset", assetPath);
  eleventyConfig.addFilter("towebp", (p) => String(assetPath(p)).replace(/\.(jpe?g)$/i, ".webp"));
  eleventyConfig.addFilter("w800", (p) => String(assetPath(p)).replace(/(\.[^.]+)$/, "-800$1"));
  eleventyConfig.addFilter("imgmeta", (p) => imageMeta[assetPath(p)] || { w: 1200, h: 1600 });
  eleventyConfig.addFilter("imgw", (p) => (imageMeta[assetPath(p)] || {}).w || 1200);
  eleventyConfig.addFilter("imgh", (p) => (imageMeta[assetPath(p)] || {}).h || 1600);
  eleventyConfig.addFilter("abs", (p, siteUrl) => {
    const base = String(siteUrl || "").replace(/\/$/, "");
    if (!p) return base;
    if (/^https?:\/\//.test(p)) return p;
    return base + (p.startsWith("/") ? p : "/" + p);
  });
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("humans.txt");
  eleventyConfig.addPassthroughCopy("browserconfig.xml");

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};
