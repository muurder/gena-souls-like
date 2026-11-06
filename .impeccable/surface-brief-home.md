# Surface Brief — Home (Gena Souls Like)

## Escopo e modo do visitante

Surface única: página inicial estática (`index.html`) com seções âncora. Modo Persuade: o visitante decide ficar, explorar o arquivo e voltar para as notícias.

## Público, tarefa, prova e restrições

- **Público**: fãs de soulslike (Dark Souls, Elden Ring, Bloodborne, Lies of P) chegando por busca/comunidades; leitura casual em desktop e mobile.
- **Tarefa**: ver o que há de novo no gênero, entender o panorama histórico, clicar numa notícia/vídeo.
- **Prova**: notícias reais verificáveis com fonte e data; linha do tempo verificada 1994→2026; trailers oficiais via YouTube embed.
- **Restrições**: site preto (identidade), PT-BR, HTML/CSS/JS puro sem build, sem backend, sem claims comerciais inventados.

## Direção escolhida e momento memorável

**"Inscrições de Firelink"** — o site reproduz a linguagem de tela do próprio jogo. Momento memorável: a manchete hero tratada como mensagem de tela do jogo ("VOCÊ MORREU" garamond gigante sobre o véu escuro, com brasas de fogueira em canvas) e cartas de notícia que se comportam como descrições de item translúcidas.

## Decisões não resolvidas

- Mídia final (screenshots oficiais) será embutida via URLs oficiais; se alguma falhar, o `onerror` esconde e o `alt` carrega o peso.
- Data de "atualização do site" usa a data da notícia mais recente encontrada na pesquisa.

## Direction contract

THESIS: o portal é um pergaminho de mensagens de tela do jogo — cada notícia é uma "inscrição" deixada por outro jogador, e a home é o santuário onde elas se revelam; recusa o layout-carteirinha de portal de games com cards arredondados e badges coloridos.

OWN-WORLD: fundo preto-cinza profundo (#0c0a09 → #1a1512), véu de névoa radial, uma cor só — ouro brasa (#d4a968/#e8c58a) para títulos e filetes, texto cinza-pedra (#a8a29a) para corpo, serifas garamond monumental (Cormorant Garamond) para mensagens de tela, EB Garamond para títulos e conteúdo, filetes de 1px ouro-escuro (#5c4a2e) como réguas, cartas translúcidas com borda dupla fina e cantos chanfrados, sem cantos arredondados em nada, sem sombras coloridas, sem badges coloridos.

STORY: o visitante entende em segundos que isto é o "Dark Souls de portais de notícias" — santuário, inscrições, arquivo; acredita que a cobertura é profunda e verificável; age lendo a manchete, rolando o arquivo e clicando em trailers.

FIRST VIEWPORT: navbar fina fixa com o sigilo GENA à esquerda e âncoras (Notícias / Vídeos / O Arquivo / Sobre) à direita com separador ◆; abaixo, hero full-viewport com véu radial e 2 camadas de névoa animada sutil, canvas de brasas subindo devagar, manchete em Cormorant Garamond 5.5rem tratada como tela do jogo — sobretítulo mono pequeno "AS INSCRIÇÕES DO ABISMO · TERÇA, 3 NOV 2026" em letterspacing largo, título "AS NOTÍCIAS QUE VOCÊ LEVA PRA LÁ" em duas linhas com "PRA LÁ" em ouro, sub 20px cinza-pedra 2 linhas, CTA dupla: botão primário "Ler as inscrições" (borda dupla ouro, hover enche ouro-escuro) e link secundário "Conheça o Arquivo →", scroll-hint "▼ desça ao abismo" pulsando devagar embaixo.

FORM: direção fundamentada "Inscrições de Firelink", atribuída pelo seed 0f2eb9c3 (assigned index 3), modo Persuade; challengers pesados e derrotados — "Expedição no gelo" (declined: forma jornal-impresso não leva a mecânica de inscrição de jogo) e "Osciloscópio" (declined: phosphor green contradiz o mundo preto-ouro do briefing).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
