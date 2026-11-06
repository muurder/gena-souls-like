---
name: Gena Souls Like
description: Portal de notícias soulslike com a linguagem de tela de Dark Souls — preto profundo, ouro brasa, serifas monumentais.
colors:
  ink: "#0b0a08"
  pit: "#14110e"
  pit-2: "#1a1613"
  veil: "#0e0c0a"
  ash: "#b3aca3"
  ash-dim: "#8f877d"
  stone: "#d8d2c8"
  ember: "#d9a860"
  ember-hi: "#f0cd92"
  ember-deep: "#8a6a34"
typography:
  display:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(2.9rem, 8.2vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "0.045em"
  headline:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  title:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "1.42rem"
    fontWeight: 600
    lineHeight: 1.22
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "0.82rem"
    fontWeight: 400
    letterSpacing: "0.14em"
    textTransform: uppercase
rounded:
  none: "0"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section-y: "clamp(4.5rem, 10vw, 8.5rem)"
  measure: "68ch"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ember}"
    rounded: "{rounded.none}"
    padding: "0.95rem 2.2rem"
  button-primary-hover:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "rgba(26, 22, 19, 0.65)"
    textColor: "{colors.ash}"
    rounded: "{rounded.none}"
---

# Design System: Gena Souls Like

## Overview

**Creative North Star: "Inscrições de Firelink"**

O site é um pergaminho de mensagens de tela do jogo: cada notícia é uma inscrição deixada por outro jogador, e a home é o santuário onde elas se revelam. A linguagem visual replica a UI de Dark Souls — manchetes monumentais em serifa garamond como "YOU DIED" e nomes de áreas, cartas translúcidas com borda dupla fina como descrições de item, névoa que respira, brasas de fogueira em canvas, e a régua-diamante-◆ que anuncia áreas. Nada de cantos arredondados, sombras coloridas ou badges saturados: o mundo é preto-cinza profundo e uma única cor, o ouro brasa, usada como tinta rara. O contraste faz a hierarquia; o espaço faz o luxo.

**Key Characteristics:**
- Uma cor só (ouro brasa) sobre preto profundo; brasa aparece em ≤10% de cada tela.
- Cantos chanfrados via `clip-path` octogonal em cartas e vídeos, nunca `border-radius`.
- Serifas garamond em dois papéis: Cormorant Garamond = mensagens de tela; EB Garamond = leitura.
- ◆ diamante como único glifo decorativo, herdado da navegação de menu do jogo.

## Colors

Paleta de uma voz: cinco neutros quentes de fundo/tinta e três tons de brasa. Sem segunda cor.

### Primary
- **Ember** (#d9a860): títulos de destaque, links, filetes vivos, números de era no arquivo. A cor da brasa — nunca em blocos grandes.
- **Ember High** (#f0cd92): hover de links e títulos de carta; a faísca que acorda no toque.
- **Ember Deep** (#8a6a34): bordas, réguas, diamantes. Brasa morta, para estrutura sem grito.

### Neutral
- **Ink** (#0b0a08): o abismo. Fundo da página.
- **Pit** (#14110e) / **Pit 2** (#1a1613): cartas e superfícies erguidas (base/hover).
- **Veil** (#0e0c0a): véu sobre mídia.
- **Stone** (#d8d2c8): títulos de leitura e dek do hero; a pedra clara.
- **Ash** (#b3aca3): corpo de texto (7.9:1 sobre Ink).
- **Ash Dim** (#8f877d): meta, datas, legendas (5.6:1 sobre Ink).

### Named Rules
**The One Flame Rule.** O ouro brasa é a única cor. Nada de azul de link, vermelho de erro ou verde de sucesso: estados usam peso, borda e o próprio ouro.

## Typography

**Display Font:** Cormorant Garamond (fallback Times New Roman) — mensagens de tela.
**Body Font:** EB Garamond (fallback Georgia) — leitura e títulos de carta.

**Character:** Duas serifas irmãs: a display é monumental e cinematográfica (tela do jogo), a de leitura é calma e editorial. Uppercase com tracking largo só em rótulos curtos; nunca em parágrafos.

### Hierarchy
- **Display** (700, clamp(2.9rem, 8.2vw, 5.5rem), 1.04): a manchete hero e nada mais.
- **Headline** (700, clamp(1.9rem, 3.6vw, 2.9rem), 0.06em): títulos de seção, sempre com em brasa.
- **Title** (600, 1.42rem, 1.22): títulos de carta; na carta destaque, usa a display em clamp(1.7rem, 2.6vw, 2.3rem).
- **Body** (400, 1.125rem, 1.65, máx. 68ch): deks e notas de era.
- **Label** (400, 0.82rem, 0.14em, uppercase): meta, tags, navegação, legendas.

### Named Rules
**The Screen Message Rule.** Cormorant Garamond só aparece onde o site "fala como o jogo": hero, títulos de seção, anos do arquivo, carta destaque e a linha final do rodapé.

## Layout

Container de `min(1200px, 92vw)` centralizado; med de leitura 68ch. Seções respiram com `clamp(4.5rem, 10vw, 8.5rem)` vertical. Notícias: destaque em grade 7/5 que colapsa a 1 coluna ≤900px; grid de cartas `auto-fill minmax(min(21rem, 100%), 1fr)`. Vídeos: `auto-fit minmax(min(24rem, 100%), 1fr)`. Arquivo: linha do tempo com fio à esquerda (1px, gradiente de brasa morta) e nós-diamante; colapsa gracefully em mobile. Hero: `100svh` com conteúdo centrado.

## Elevation & Depth

Sem sombras projetadas — profundidade é tonal e atmosférica. Superfícies erguem por camadas de preto (Pit sobre Ink), véus de gradiente radial, e a névoa animada fixa atrás de tudo. A única "luz" é a brasa: hover acende filetes e bordas (`border-color: var(--ember)`), nunca adiciona sombra.

### Named Rules
**The No Shadow Rule.** Nenhum `box-shadow` externo. Profundidade vem de camadas de fundo e luz de borda; `box-shadow` aparece apenas como `inset` para desenhar a borda dupla dos botões.

## Shapes

Raio zero em tudo. O vocabulário de canto é o chanfro octogonal de 10px via `clip-path: polygon(...)` nas cartas e altares de vídeo — a silhueta de placa/metal do jogo. Bordas: 1px sólido de Ember Deep (50% de opacidade em repouso, brasa cheia em hover). A borda dupla dos botões é desenhada com `box-shadow: inset 0 0 0 3px ink, inset 0 0 0 4px ember-deep`. Linha-diamante-linha (`—◆—`) marca "anúncio de área" no hero.

## Components

### Buttons
- **Shape:** retangular, raio 0, borda dupla inset (3px ink + 1px brasa).
- **Primary:** transparente com texto Ember; padding 0.95rem 2.2rem; label uppercase 0.24em.
- **Hover / Focus:** fundo Ember cheio, texto Ink (10.6:1); focus-visible = outline 1px brasa com offset 3px.
- **Ghost:** sem borda, texto Ash Dim; hover vira Ember High.

### Cards (Inscrições)
- **Corner Style:** chanfro octogonal 10px (clip-path), nunca raio.
- **Background:** gradiente Pit 2 → Pit a 65% de opacidade; hover escurece para 80%.
- **Border:** 1px rgba(Ember Deep, 0.5); hover vira brasa e um fio de luz varre o topo.
- **Internal Padding:** 1.4rem 1.5rem 1.6rem; media 16/9 com véu que abre no hover.
- **Meta:** filete superior, uppercase 0.14em, fonte e data separadas por ◆.

### Video Altars
- Moldura de carta com thumbnail como fachada; botão-play 4.4rem com borda dupla que enche de brasa no hover. O iframe só entra com clique (privacy: youtube-nocookie).

### Navigation
- Fixa, com blur de 10px e gradiente de Ink; sigilo de fogueira SVG à esquerda; links uppercase com separador ◆; hover acende sublinhado de brasa morta. Em ≤720px, apenas sigilo + links compactos.

## Do's and Don'ts

### Do:
- **Do** usar ◆ como único ornamento tipográfico e a régua-diamante como marcador de área.
- **Do** manter o corpo em EB Garamond com contraste ≥ 5.6:1 sobre Ink.
- **Do** desenhover com luz: borda, filete e filtro de mídia — nunca sombra.
- **Do** respeitar `prefers-reduced-motion`: névoa, brasas e revelações desligam.

### Don't:
- **Don't** usar `border-radius`, gradientes coloridos, badges saturados ou ícones emoji.
- **Don't** introduzir uma segunda cor de acento; estados usam peso, borda e o ouro.
- **Don't** aplicar uppercase com tracking largo a parágrafos — só a rótulos curtos.
- **Don't** carregar iframes do YouTube sem facade; o santuário não abre portões sem visita.
