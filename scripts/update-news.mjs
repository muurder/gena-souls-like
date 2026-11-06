#!/usr/bin/env node
/**
 * Covil Games — atualização automática de notícias (diária)
 *
 * Busca APITube (se APITUBE_KEY no ambiente), Google News (PT-BR) e
 * Gematsu, filtra pelo gênero, injeta as manchetes novas no
 * noticias.html entre os marcadores NEWS:AUTO:START/END e atualiza a
 * data do hero. Sem dependências.
 */
import { execSync } from "node:child_process";

const NEWS_PAGE = new URL("../noticias.html", import.meta.url);
const HOME_PAGE = new URL("../index.html", import.meta.url);
const MAX_CARDS = 10;

/* Portal completo: qualquer assunto de games passa. Palavras-chave agora
   servem para ROTULAR a categoria no fio de notícias, não para filtrar. */
const CATEGORIES = [
  { cat: "Ofertas",   cls: "wire__cat--ofertas",   terms: ["oferta", "promoção", "promocao", "desconto", "cupom", "grátis", "gratis", "free", "sale", "barato", "preço", "preco", "r$", "us$"] },
  { cat: "Grátis",    cls: "wire__cat--gratis",    terms: ["jogos grátis", "jogo grátis", "epic games store", "ps plus", "psn", "game pass", "nintendo switch online", "prime gaming", "reivindique"] },
  { cat: "Plataformas", cls: "wire__cat--plataformas", terms: ["steam", "epic games", "playstation", "xbox", "nintendo", "switch 2", "ps5", "ps6", "pc gamer", "steam deck", "geforce now", "mobile", "android", "ios"] },
  { cat: "Lançamentos", cls: "", terms: ["lançamento", "lancamento", "chega", "estreia", "release", "disponível", "disponivel", "lançou", "lancou", "pré-venda", "demo"] },
  { cat: "DLC & Updates", cls: "", terms: ["dlc", "expansão", "expansao", "patch", "atualização", "atualizacao", "update", "season pass", "passe"] },
  { cat: "Indústria", cls: "", terms: ["vendas", "milhões de cópias", "milhoes de copias", "record", "layoff", "demissão", "demissao", "fechamento", "aquisição", "aquisicao", "bilheteria"] },
];

const GENERIC_GAMES = [
  "jogo", "games", "gaming", "gamer", "videogame", "video game",
  "rpg", "fps", "moba", "mmo", "action", "aventura",
  "playstation", "xbox", "nintendo", "switch", "steam", "epic",
  "ps5", "ps4", "pc", "console", "trailer", "gameplay", "remake", "remaster",
];

/* Filtro mínimo: a manchete precisa parecer de games (evita política/acidente) */
const looksLikeGames = (title) => {
  const t = title.toLowerCase();
  return GENERIC_GAMES.some((k) => t.includes(k));
};

const categorize = (title) => {
  const t = title.toLowerCase();
  for (const { cat, cls, terms } of CATEGORIES) {
    if (terms.some((k) => t.includes(k))) return { cat, cls };
  }
  return { cat: "Games", cls: "" };
};

const FEEDS = [
  {
    name: "Google News BR",
    url:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(
        "videogames OR games OR 'playstation' OR 'xbox' OR 'nintendo' OR 'steam' OR gta OR 'elden ring' OR fortnite OR minecraft OR 'call of duty' OR zelda OR final fantasy OR dragon ball"
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
      headers: { "User-Agent": "CovilGamesBot/1.0 (+https://gena-souls-like.vercel.app)" },
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

/* item compacto para o fio de novidades da home */
function wireHtml(item) {
  const title = escapeHtml(item.title);
  const source = escapeHtml(item.source);
  const time = formatTime(item.pubDate);
  const { cat, cls } = categorize(item.title);
  const catCls = cls ? ` ${cls}` : "";
  return [
    '      <div class="wire__item">',
    `        <span class="wire__time">${time}</span>`,
    `        <span class="wire__title">${title} <span class="wire__src">· ${source}</span></span>`,
    `        <span class="wire__cat${catCls}">${cat}</span>`,
    `        <a class="wire__link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener" aria-label="Ler: ${title} (abre em nova aba)"></a>`,
    "      </div>",
  ].join("\n");
}

function formatTime(pubDate) {
  const d = new Date(pubDate);
  if (isNaN(d)) return "";
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const hoje = new Date();
  const mesmoDia = d.toDateString() === hoje.toDateString();
  if (mesmoDia) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return `${d.getDate()} ${meses[d.getMonth()]}`;
}

/* ---------- execução ---------- */
const all = [];

/* APITube (opcional): queries por título em PT. Chave vem do ambiente. */
const APITUBE_KEY = process.env.APITUBE_KEY || "";
if (APITUBE_KEY) {
  const queries = ["videogames", "playstation 5", "xbox", "nintendo switch", "steam"];
  for (const q of queries) {
    try {
      const res = await fetch(
        "https://api.apitube.io/v1/news/everything?title=" + encodeURIComponent(q) +
        "&language.code=pt" +
        "&per_page=10&published_at.gte=" + new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
        { headers: { "X-API-Key": APITUBE_KEY }, signal: AbortSignal.timeout(20000) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      for (const a of data.results ?? []) {
        if (a.title && a.href) {
          let src = a.source?.name?.trim() || "";
          if (!src) {
            try { src = new URL(a.href).hostname.replace(/^www\./, ""); } catch { src = "APITube"; }
          }
          all.push({ title: a.title, link: a.href, pubDate: a.published_at ?? "", source: src });
        }
      }
    } catch (err) {
      console.warn(`[aviso] APITube "${q}" falhou: ${err.message}`);
    }
  }
}

for (const feed of FEEDS) all.push(...(await fetchFeed(feed)));

const seen = new Set();
const news = [];
const pt = [];
const other = [];
const isPt = (s) => /[\u00C0-\u00FF]/.test(s) || /\b(de|da|do|dos|das|em|para|com|não|no|na|um|uma|que|seu|sua|chega|lança|grátis)\b/i.test(s);
for (const item of all) {
  // Google News anexa " - Fonte" (ou " | Fonte") ao título; remove e memoriza
  const cleanTitle = item.title.replace(/\s+[-|]\s+[^-|]{2,45}$/, "").trim();
  const key = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (seen.has(key) || !looksLikeGames(item.title)) continue;
  seen.add(key);
  const knownSource = /\s+[-|]\s+[^-|]{2,45}$/.test(item.title) ? item.title.match(/\s+[-|]\s+([^-|]{2,45})$/)?.[1] : null;
  const enriched = { ...item, title: cleanTitle, source: item.source && item.source !== "APITube" && item.source !== "" ? item.source : (knownSource || item.source) };
  news.push(enriched);
  (isPt(cleanTitle) || enriched.source === "Google News BR" ? pt : other).push(enriched);
}
// fio: português primeiro, internacionais completam
const ranked = [...pt, ...other].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
const selected = news.slice(0, MAX_CARDS);
const wireItems = ranked.slice(0, 14);

const fs = await import("node:fs/promises");
let html = await fs.readFile(NEWS_PAGE, "utf8");

const START = "<!-- NEWS:AUTO:START -->";
const END = "<!-- NEWS:AUTO:END -->";
const sIdx = html.indexOf(START);
const eIdx = html.indexOf(END);
if (sIdx === -1 || eIdx === -1) {
  console.error("[erro] marcadores NEWS:AUTO não encontrados no noticias.html");
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

const newsChanged = html !== before;
if (newsChanged) await fs.writeFile(NEWS_PAGE, html, "utf8");

/* fio de novidades da home: WIRE:AUTO:START/END */
let wireCount = 0;
try {
  let home = await fs.readFile(HOME_PAGE, "utf8");
  const WSTART = "<!-- WIRE:AUTO:START -->";
  const WEND = "<!-- WIRE:AUTO:END -->";
  const wsIdx = home.indexOf(WSTART);
  const weIdx = home.indexOf(WEND);
  if (wsIdx !== -1 && weIdx !== -1) {
    const wireBlock = wireItems.length
      ? `${WSTART}\n${wireItems.map(wireHtml).join("\n\n")}\n      ${WEND}`
      : `${WSTART}\n      ${WEND}`;
    const homeBefore = home;
    home = home.slice(0, wsIdx) + wireBlock + home.slice(weIdx + WEND.length);
    if (home !== homeBefore) {
      await fs.writeFile(HOME_PAGE, home, "utf8");
      wireCount = wireItems.length;
    }
  }
} catch (err) {
  console.warn(`[aviso] fio da home falhou: ${err.message}`);
}

console.log(
  (newsChanged ? `${selected.length} inscrições atualizadas` : "Notícias sem mudança") +
  ` + ${wireCount} no fio. Latest: ${selected[0]?.title ?? "-"}`
);
