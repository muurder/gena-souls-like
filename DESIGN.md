---
name: Covil Games
description: Portal brasileiro de games com a linguagem do corredor de fliperama moderno — salão escuro, uma luz de marquee por território, tipografia de letreiro.
colors:
  ink: "#0a0b10"
  pit-base: "#101219"
  veil: "#0d0e14"
  ash: "#a8afbf"
  ash-dim: "#7d8494"
  stone: "#f4f6fb"
  ember: "#ffb454"
  ember-hi: "#ffd18a"
  ember-deep: "#8a5a1e"
  flame: "#ff5a4e"
  jade: "#4ade80"
  arcane: "#5aa2ff"
typography:
  display:
    fontFamily: "Sora, Segoe UI, sans-serif"
    fontSize: "clamp(2.1rem, 11vw, 5.2rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "0.01em"
    textTransform: uppercase
  headline:
    fontFamily: "Sora, Segoe UI, sans-serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.15
    textTransform: uppercase
  title:
    fontFamily: "Sora, Segoe UI, sans-serif"
    fontSize: "1.22rem"
    fontWeight: 700
    lineHeight: 1.28
  body:
    fontFamily: "IBM Plex Sans, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.65
  mono:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
    usage: "dados — horários, preços, notas, labels, categorias"
components:
  card: "painel grafite gradiente, borda 1px na cor da luz a 16-30%, raio 10px, hover com glow real (box-shadow em duas camadas) e translateY(-3px)"
  wire: "lista de manchetes com hora mono, título branco-fósforo, categoria na cor do território; item mais recente com text-shadow âmbar (chase light)"
  cat-card: "gabinete da trilha com borda e título na sua cor (âmbar/flame/arcane/jade)"
  btn: "primária cheia âmbar com texto preto; ghost com borda âmbar e fundo transparente; uppercase Sora 700"
motion: "marquee-rise (opacity+translateY+blur) escalonado 120/300/480/700ms; reveal ao rolar 700ms; glow em hovers; reduce-motion desliga tudo"
glow: "text-shadow/box-shadow em 2 camadas (18px 35% + 46px 14%) — só em elementos ativos: em do hero, item novo do fio, hover de carta, logo"
---

# Covil Games — mundo visual "Marquee do Covil"

## A metáfora

O portal é um corredor de fliperama moderno: o piso é preto-azulado de salão, cada território de conteúdo é um gabinete com sua luz de marquee (âmbar = notícias/marca, vermelho = ofertas, verde = grátis, azul = plataformas/busca), e o hero é o letreiro luminoso do covil. Nada de névoa, brasas ou serifas medievais — é games de todos os tempos, hoje.

## Regras do mundo

1. **Uma luz por território** — cada cor tem dono; não espalhar âmbar onde a luz é azul.
2. **Glow só onde há vida** — título hero, item mais recente do fio, hover ativo, logo. Corpo de texto nunca brilha.
3. **Dados em mono** — horário, preço, nota, fonte e categoria sempre em IBM Plex Mono uppercase.
4. **Letreiro em Sora 800 uppercase** — seções e títulos; leitura em IBM Plex Sans.
5. **Cantos 10px** — cartas, botões, inputs. Nada de raio 0 (era do mundo antigo) nem pill.
6. **Bordas na cor da luz a baixa opacidade** — a estrutura é a luz contida, não linhas cinza.
7. **Recusa** — serifas garamond, chanfros octogonais, ◆ como glifo estrutural (vira ▪ nos separadores), brasas em canvas, névoa, texturas medievais.
