/* ==================================================================
   api/games.js — ponte para a IGDB (banco de jogos da Twitch)
   Roda como Serverless Function na Vercel. As credenciais ficam em
   variáveis de ambiente (TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET),
   NUNCA no navegador.
   ================================================================== */

let tokenCache = { token: null, expiresAt: 0 };

async function getToken(clientId, clientSecret) {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`token HTTP ${res.status}`);
  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return tokenCache.token;
}

module.exports = async (req, res) => {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(503).json({ error: "A busca do arquivo ainda não foi configurada." });
    return;
  }

  const q = (req.query.q || "").toString().trim().slice(0, 80);
  if (!q) {
    res.status(400).json({ error: "Informe o nome do jogo: /api/games?q=elden+ring" });
    return;
  }

  try {
    const token = await getToken(clientId, clientSecret);
    const igdb = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body:
        `search "${q.replace(/"/g, "")}"; ` +
        "fields name,slug,first_release_date,total_rating,aggregated_rating,summary,cover.url; " +
        "limit 12;",
    });
    if (!igdb.ok) throw new Error(`IGDB HTTP ${igdb.status}`);
    const games = await igdb.json();

    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).json(
      games.map((g) => ({
        name: g.name,
        slug: g.slug,
        released: g.first_release_date
          ? new Date(g.first_release_date * 1000).toISOString()
          : null,
        rating: g.total_rating ?? null,           // nota da comunidade IGDB (0–100)
        metacritic: g.aggregated_rating ?? null,  // crítica agregada (0–100)
        summary: g.summary ?? "",
        cover: g.cover?.url
          ? "https:" + g.cover.url.replace("t_thumb", "t_cover_big")
          : null,
      }))
    );
  } catch (err) {
    res.status(502).json({ error: "O arquivo não respondeu: " + err.message });
  }
};
