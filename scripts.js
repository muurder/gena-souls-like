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
      const card = img.closest(".card__media, .video__facade");
      if (card) card.classList.add("media-failed");
    };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });
})();
