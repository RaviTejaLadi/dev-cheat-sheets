import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (value) => value.replace(/[&<>"']/g, (character) => entities[character]);
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

export function staticPages(siteOrigin) {
  let config;
  return {
    name: "devsheets-static-pages",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      const { root, base, build, publicDir } = config;
      const origin = siteOrigin ? new URL(siteOrigin).origin : "";
      const output = resolve(root, build.outDir);
      const indexPath = resolve(output, "index.html");
      const template = await readFile(indexPath, "utf8");
      const catalog = await readJson(resolve(root, "src/catalog.json"));
      catalog.push({ name: "Developer tools", slug: "developer-tools" });
      const topics = [...new Map(catalog.reverse().map((topic) => [topic.slug, topic])).values()]
        .sort((left, right) => left.name.localeCompare(right.name, "en", { numeric: true }));
      const sheetPath = (slug) => base + "sheet/" + encodeURIComponent(slug) + "/";
      const withContent = (html, path, content) => {
        const url = escape(origin + path);
        const canonical = origin ? `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">` : "";
        return html.replace("<!-- canonical -->", () => canonical)
          .replace('<div id="root"></div>', () => `<div id="root"><main class="static-page content">${content}</main></div>`);
      };
      await writeFile(indexPath, withContent(template, base,
        `<h1>Developer cheat sheets</h1><p>Browse commands, syntax, and documentation by topic.</p>
        <ul class="index-grid">${topics.map(({ name, slug }) => `<li><a href="${escape(sheetPath(slug))}">${escape(name)}</a></li>`).join("")}</ul>`));

      for (const { name, slug } of topics) {
        const groups = await readJson(resolve(publicDir, "references", slug + ".json"));
        const title = escape(name + " cheat sheet | DevSheets");
        const description = escape(`Browse the ${name} cheat sheet for quick reference and related resources on DevSheets.`);
        const html = template
          .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
          .replace(/((?:name="description"|property="og:description") content=")[^"]*/g, (_, prefix) => prefix + description)
          .replace(/(property="og:title" content=")[^"]*/, (_, prefix) => prefix + title);
        const content = `<a class="back" href="${escape(base)}">Explore library</a>
          <h1>${escape(name)} cheat sheet</h1>
          <div class="reference-grid">${groups.map(({ title, section, links }) => `<section class="reference-card">
            <header><p class="eyebrow">${escape(section)}</p><h2>${escape(title)}</h2></header>
            <ul class="reference-entries">${links.map(({ name, url, unavailable, note }) => {
              const path = url?.startsWith("#/sheet/") ? base + url.slice(2) + "/" : url;
              const entry = escape(name);
              const safeLink = path && (path.startsWith(base + "sheet/") || /^https?:\/\//i.test(path));
              return `<li>${safeLink && !unavailable ? `<a href="${escape(path)}">${entry}</a>` : `<span class="${note ? "reference-note" : "reference-token"}">${entry}</span>`}</li>`;
            }).join("")}</ul></section>`).join("")}</div>`;
        const folder = resolve(output, "sheet", slug);
        await mkdir(folder, { recursive: true });
        await writeFile(resolve(folder, "index.html"), withContent(html, sheetPath(slug), content));
      }

      if (origin) {
        const sitemap = [base, ...topics.map(({ slug }) => sheetPath(slug))]
          .map((path) => `  <url><loc>${escape(origin + path)}</loc></url>`).join("\n");
        await writeFile(resolve(output, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);
      }
    },
  };
}
