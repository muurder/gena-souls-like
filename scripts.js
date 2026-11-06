/* GENA SOULS LIKE — brasas, névoa e mídia */
/* brasas de fogueira em canvas + YouTube sob clique + revelação ao rolar */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     BRASAS DE FOGUEIRA — canvas full-page, leve
     ------------------------------------------------------------------ */
  const canvas = document.getElementById("embers");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, embers = [];
    const COUNT = Math.min(70, Math.floor(window.innerWidth / 22));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a, b) => a + Math.random() * (b - a);

    const spawn = (initial) => ({
      x: rand(0, W),
      y: initial ? rand(0, H) : H + 10,
      r: rand(0.6, 2.4),
      vy: rand(0.12, 0.5),
      drift: rand(-0.25, 0.25),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.25, 0.8),
      hue: rand(28, 44),
    });

    embers = Array.from({ length: COUNT }, () => spawn(true));

    let running = true;
    let last = performance.now();

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(50, now - last) / 16.7;
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (const e of embers) {
        e.y -= e.vy * dt;
        e.phase += 0.012 * dt;
        e.x += (Math.sin(e.phase) * 0.35 + e.drift) * dt;
        if (e.y < -12) Object.assign(e, spawn(false));
        const twinkle = 0.62 + 0.38 * Math.sin(e.phase * 2.1);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 70%, 62%, ${e.alpha * twinkle})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      }
    });
  }

  /* ------------------------------------------------------------------
     VÍDEOS — facade: o iframe só entra com clique/Enter
     ------------------------------------------------------------------ */
  document.querySelectorAll(".video__facade").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".video");
      const id = btn.dataset.videoId;
      if (!wrap || !id) return;
      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
        "?autoplay=1&rel=0";
      iframe.title = btn.dataset.title || "Vídeo";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;border:0";
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* ------------------------------------------------------------------
     REVELAÇÃO AO ROLAR — a inscrição surge do véu
     .reveal em elementos; classe .is-visible quando entra na viewport
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------
     LINKS DE AFILIADO (Amazon Associates)
     Preencha AMAZON_TAG com seu ID (ex.: "genasoulsli-20") quando
     cadastrar no affiliates.amazon.com.br; sem tag, os links abrem
     a busca da Amazon normalmente (sem comissão).
     ------------------------------------------------------------------ */
  const AMAZON_TAG = "genasoulslike-20";
  document.querySelectorAll("a[data-amazon]").forEach((a) => {
    if (!AMAZON_TAG) return;
    try {
      const url = new URL(a.href);
      url.searchParams.set("tag", AMAZON_TAG);
      a.href = url.toString();
    } catch { /* href inválido: deixa como está */ }
  });

  /* ------------------------------------------------------------------
     IMAGENS QUE FALHAM — o véu engole, o alt carrega o peso
     ------------------------------------------------------------------ */
  document.querySelectorAll("img[data-fadeable]").forEach((img) => {
    const fail = () => {
      const card = img.closest(".card__media, .video__facade, .deal__media");
      if (card) card.classList.add("media-failed");
    };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ------------------------------------------------------------------
     OFERTAS DO ABISMO — Epic grátis + CheapShark (só na página de ofertas)
     ------------------------------------------------------------------ */
  const epicGrid = document.getElementById("epic-grid");
  const dealsGrid = document.getElementById("deals-grid");

  const BRL = (v) =>
    v == null ? "" :
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const STORES = { 1: "Steam", 7: "GOG", 11: "Humble", 15: "GreenManGaming", 25: "Epic" };

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const dealCard = ({ store, title, thumb, now, was, ends, href, free }) => {
    const c = el("article", "deal reveal is-visible");
    const media = el("div", "deal__media");
    if (thumb) {
      const img = document.createElement("img");
      img.src = thumb; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      img.setAttribute("data-fadeable", "");
      media.appendChild(img);
    }
    const body = el("div", "deal__body");
    body.appendChild(el("p", "deal__store", store));
    body.appendChild(el("h3", "deal__title", title));
    const price = el("p", "deal__price");
    if (free) price.appendChild(el("span", "deal__free", "Grátis"));
    else if (now) price.appendChild(el("span", "deal__now", now));
    if (was && was !== now) price.appendChild(el("span", "deal__was", was));
    body.appendChild(price);
    if (ends) body.appendChild(el("p", "deal__ends", ends));
    c.appendChild(media);
    c.appendChild(body);
    const a = el("a", "deal__link");
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", `Abrir ${title} na ${store} (abre em nova aba)`);
    c.appendChild(a);
    return c;
  };

  const setGridMessage = (grid, msg) => {
    grid.replaceChildren(el("p", "deals__loading", msg));
  };

  if (epicGrid) {
    /* Jogos grátis atuais na Epic, via CheapShark (storeID 25 = Epic). */
    fetch("https://www.cheapshark.com/api/1.0/deals?storeID=25&upperPrice=0&pageSize=6")
      .then((r) => r.json())
      .then((deals) => {
        if (!Array.isArray(deals) || !deals.length) {
          setGridMessage(epicGrid, "Nenhum resgate gratuito no altar desta semana.");
          return;
        }
        epicGrid.replaceChildren(...deals.map((d) => dealCard({
          store: "Epic Games Store",
          title: d.title,
          thumb: d.thumb,
          free: true,
          ends: d.endDate ? "Resgate até " + new Date(d.endDate).toLocaleDateString("pt-BR") : "",
          href: "https://www.epicgames.com/store/product/" + d.steamAppID,
        })));
      })
      .catch(() => setGridMessage(epicGrid, "Os arautos da Epic não responderam. Tente de novo em instantes."));
  }

  if (dealsGrid) {
    const loadDeals = (q) => {
      setGridMessage(dealsGrid, "Consultando os mercadores…");
      const url = q
        ? "https://www.cheapshark.com/api/1.0/deals?title=" + encodeURIComponent(q) + "&pageSize=12&sortBy=savings"
        : "https://www.cheapshark.com/api/1.0/deals?pageSize=12&sortBy=savings";
      fetch(url)
        .then((r) => r.json())
        .then((deals) => {
          if (!Array.isArray(deals) || !deals.length) {
            setGridMessage(dealsGrid, "Nenhuma oferta encontrada para essa busca.");
            return;
          }
          dealsGrid.replaceChildren(...deals.map((d) => dealCard({
            store: STORES[d.storeID] || "Loja parceira",
            title: d.title,
            thumb: d.thumb,
            now: "US$ " + Number(d.salePrice).toFixed(2),
            was: "US$ " + Number(d.normalPrice).toFixed(2),
            ends: d.metacriticScore ? "Metacritic " + d.metacriticScore : "",
            href: "https://www.cheapshark.com/redirect?dealID=" + d.dealID,
          })));
        })
        .catch(() => setGridMessage(dealsGrid, "Os mercadores não responderam. Tente de novo em instantes."));
    };
    loadDeals("");
    const form = document.getElementById("deals-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        loadDeals(document.getElementById("deals-q").value.trim());
      });
    }
  }

  /* ------------------------------------------------------------------
     BUSCA DE JOGOS — RAWG (só na página Jogos)
     ------------------------------------------------------------------ */
  const rawgGrid = document.getElementById("rawg-grid");
  const rawgForm = document.getElementById("rawg-form");

  if (rawgGrid && rawgForm) {
    const KEY = (window.GENA_CONFIG && window.GENA_CONFIG.RAWG_KEY) || "";
    if (!KEY) {
      setGridMessage(rawgGrid, "A busca aguarda a chave do arquivo (RAWG). Crie a sua grátis em rawg.io/apidocs.");
    } else {
      const gameCard = (g) => {
        const c = el("article", "deal game-card reveal is-visible");
        const media = el("div", "deal__media deal__media--portrait");
        if (g.background_image) {
          const img = document.createElement("img");
          img.src = g.background_image; img.alt = `Capa de ${g.name}`;
          img.loading = "lazy"; img.decoding = "async";
          img.setAttribute("data-fadeable", "");
          media.appendChild(img);
        }
        const body = el("div", "deal__body");
        body.appendChild(el("p", "deal__store", g.released ? new Date(g.released).toLocaleDateString("pt-BR") : "Sem data"));
        body.appendChild(el("h3", "deal__title", g.name));
        if (g.rating) body.appendChild(el("p", "game-card__rating", `◆ ${g.rating.toFixed(1)} / 5`));
        if (g.metacritic) body.appendChild(el("p", "game-card__note", `Metacritic ${g.metacritic}`));
        c.appendChild(media);
        c.appendChild(body);
        const a = el("a", "deal__link");
        a.href = "https://rawg.io/games/" + g.slug;
        a.target = "_blank"; a.rel = "noopener";
        a.setAttribute("aria-label", `Ver ficha de ${g.name} no RAWG (abre em nova aba)`);
        c.appendChild(a);
        return c;
      };

      const search = (q) => {
        setGridMessage(rawgGrid, "Invocando o arquivo…");
        fetch("https://api.rawg.io/api/games?key=" + encodeURIComponent(KEY) +
              "&search=" + encodeURIComponent(q) + "&page_size=12")
          .then((r) => r.json())
          .then((data) => {
            const games = data && data.results;
            if (!Array.isArray(games) || !games.length) {
              setGridMessage(rawgGrid, "O arquivo não conhece esse nome. Tente outro.");
              return;
            }
            rawgGrid.replaceChildren(...games.map(gameCard));
          })
          .catch(() => setGridMessage(rawgGrid, "O arquivo não respondeu. Tente de novo em instantes."));
      };

      rawgForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = document.getElementById("rawg-q").value.trim();
        if (q) search(q);
      });
    }
  }
})();
