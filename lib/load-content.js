const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const contentDir = path.join(__dirname, "..", "content");

function load(name) {
  const file = path.join(contentDir, name);
  return yaml.load(fs.readFileSync(file, "utf8"));
}

module.exports = {
  settings: () => load("settings.yml"),
  home: () => load("homepage.yml"),
  thanks: () => load("thank-you.yml"),
  faqs: () => load("faqs.yml"),
};
