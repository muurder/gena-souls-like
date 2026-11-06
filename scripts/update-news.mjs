#!/usr/bin/env node
/**
 * GENA SOULS LIKE — atualização automática de notícias (diária)
 *
 * Busca Google News (PT-BR) + Gematsu, filtra pelo gênero soulslike,
 * injeta as manchetes novas no index.html entre os marcadores
 * NEWS:AUTO:START/END e atualiza a data do hero. Sem dependências.
 */
import { execSync } from "node:child_process";

const INDEX = new URL("../noticias.html", import.meta.url);
const MAX_CARDS = 10;

const KEYWORDS = [
  "soulslike", "souls-like", "souls like", "soulsborne",
  "elden ring", "fromsoftware", "dark souls", "bloodborne",
  "demon's souls", "demons souls", "sekiro", "nightreign", "duskbloods",
  "hollow knight", "silksong", "team cherry",
  "nioh", "team ninja", "wo long",
  "lies of p", "code vein", "lords of the fallen",
  "mortal shell", "remnant", "wuchang", "khazan",
  "phantom blade", "crimson desert", "black myth",
];

const FEEDS = [
  {
    name: "Google News BR",
    url:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(
        'soulslike OR "elden ring" OR fromsoftware OR "dark souls" OR "hollow knight" OR nioh OR "lies of p" OR silksong'
      ) +
      "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    lang: "pt",
  },
  {
    name: "Gematsu",
    url: "https://www.gematsu.com/feed",
    lang: "en",
  },
];

const stripCdata = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
const decode = (s) =>
  stripCdata(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function parseRss(xml, feedName) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];
  for (const block of blocks) {
    const pick = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? decode(m[1]) : "";
    };
    const title = pick("title");
    const link = pick("link");
    const pubDate = pick("pubDate");
    const source = pick("source") || feedName;
    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "GenaSoulsLikeBot/1.0 (+https://gena-souls-like.vercel.app)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseRss(await res.text(), feed.name);
  } catch (err) {
    console.warn(`[aviso] falha ao buscar ${feed.name}: ${err.message}`);
    return [];
  }
}

const matchesGenre = (title) => {
  const t = title.toLowerCase();
  return KEYWORDS.some((k) => t.includes(k));
};

function formatDate(pubDate, lang) {
  const d = new Date(pubDate);
  if (isNaN(d)) return "";
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getUTCDate()} ${meses[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function cardHtml(item) {
  const title = escapeHtml(item.title);
  const source = escapeHtml(item.source);
  const date = formatDate(item.pubDate);
  const meta = [date, "Fonte: " + source].filter(Boolean).join(' <span class="diamond" aria-hidden="true">◆</span> ');
  return [
    '      <article class="card card--text card--auto reveal">',
    '        <div class="card__body">',
    `          <h3 class="card__title">${title}</h3>`,
    `          <p class="card__meta">${meta}</p>`,
    "        </div>",
    `        <a class="card__link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener" aria-label="Ler a notícia completa na fonte ${source} (abre em nova aba)"></a>`,
    "      </article>",
  ].join("\n");
}

/* ---------- execução ---------- */
const all = [];
for (const feed of FEEDS) all.push(...(await fetchFeed(feed)));

const seen = new Set();
const news = [];
for (const item of all) {
  // Google News anexa " - Fonte" ao título; remove para dedupe limpo
  const cleanTitle = item.title.replace(/\s+-\s+[^-]{2,40}$/, "").trim();
  const key = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (seen.has(key) || !matchesGenre(item.title)) continue;
  seen.add(key);
  news.push({ ...item, title: cleanTitle });
}
news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
const selected = news.slice(0, MAX_CARDS);

const fs = await import("node:fs/promises");
let html = await fs.readFile(INDEX, "utf8");

const START = "<!-- NEWS:AUTO:START -->";
const END = "<!-- NEWS:AUTO:END -->";
const sIdx = html.indexOf(START);
const eIdx = html.indexOf(END);
if (sIdx === -1 || eIdx === -1) {
  console.error("[erro] marcadores NEWS:AUTO não encontrados no index.html");
  process.exit(1);
}

const block = selected.length
  ? `${START}\n${selected.map(cardHtml).join("\n\n")}\n      ${END}`
  : `${START}\n      ${END}`;

const before = html;
html = html.slice(0, sIdx) + block + html.slice(eIdx + END.length);

// data do hero = data da manchete mais recente
const USTART = "<!-- UPDATED:START -->";
const UEND = "<!-- UPDATED:END -->";
if (selected.length && html.includes(USTART) && html.includes(UEND)) {
  const heroDate = formatDate(selected[0].pubDate);
  html = html.replace(
    new RegExp(`${USTART}[\\s\\S]*?${UEND}`),
    `${USTART}atualizado em ${heroDate}${UEND}`
  );
}

if (html === before) {
  console.log("Nenhuma mudança nas notícias.");
  process.exit(0);
}

await fs.writeFile(INDEX, html, "utf8");
console.log(`${selected.length} inscrições injetadas. Latest: ${selected[0]?.title ?? "-"}`);
