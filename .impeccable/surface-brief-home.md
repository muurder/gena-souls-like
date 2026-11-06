# Surface Brief — Home (Covil Games)

## Escopo e modo do visitante

Portal multi-página: home agregadora (`index.html`) + notícias, ofertas, jogos e sobre. Modo Persuade: o visitante decide ficar, explorar e voltar diariamente.

## Público, tarefa, prova e restrições

- **Público**: jogadores brasileiros de TODOS os gêneros e plataformas (console, PC, mobile) — não mais só soulslike; chegam por busca, comunidades e indicação.
- **Tarefa**: ver num olhar o que há de novo nos games (notícias, ofertas, grátis), buscar jogos, clicar e voltar todo dia.
- **Prova**: notícias reais com fonte e data (robô diário), ofertas ao vivo de APIs oficiais (CheapShark/Epic), busca de jogos real (IGDB).
- **Restrições**: PT-BR, HTML/CSS/JS puro sem build, sem backend próprio (serverless Vercel), disclosure de afiliado Amazon, sem claims comerciais inventados.

## Direção escolhida e momento memorável

**"Marquee do Covil"** (derivada do challenger arcade marquee row, fundida ao mundo dark do produto): o portal como um corredor de fliperama moderno — cada seção é um "gabinete" com sua luz própria (notícias âmbar, ofertas vermelho-neon, grátis verde-fósforo, plataformas azul-elétrico), notícias correm como placas de marquee, e o hero é o letreiro luminoso do covil. Momento memorável: o letreiro-luz do hero com glow real (text-shadow escalonado) sobre o corredor escuro, e o fio de notícias com "chase light" — o item mais recente pulsa como attract mode.

## Decisões não resolvidas

- Nome de domínio continua gena-souls-like.vercel.app até compra de domínio próprio.
- Tag de afiliado Amazon permanece genasoulslike-20 (fixada pela conta).

## Direction contract

THESIS: o portal é um corredor de fliperama moderno — a escuridão é o piso, cada categoria de conteúdo é um gabinete com sua luz de marquee, e as notícias são placas luminosas que se renovam todo dia; recusa tanto o site-branco-notícia-genérica quanto o residual soulslike (brasas, névoa, inscrições).

OWN-WORLD: fundo preto-azulado de salão (#0a0b10), painéis de seção em grafite (#12141c), uma luz por território: âmbar-neon (#ffb454) para notícias e marca, vermelho-sinal (#ff5a4e) para ofertas, verde-fósforo (#4ade80) para grátis, azul-elétrico (#5aa2ff) para plataformas e busca; branco-fósforo (#f4f6fb) para titulos de leitura; glow real só em elementos ativos (títulos hero, itens do fio mais recentes, hovers de carta ativa) via text-shadow/box-shadow em camadas, cantos 10px, bordas 1px na cor da luz a 30%, tipografia display em Sora/Space Grotesk condensed-weight para o letreiro, IBM Plex Sans para leitura, mono IBM Plex Mono para dados (horários, preços, notas).

STORY: o visitante entende em segundos que é um portal completo de games com vida própria (placas se renovando, preços ao vivo); acredita pela densidade e pelas fontes; age entrando numa trilha ou clicando numa manchete do fio.

FIRST VIEWPORT: navbar escura fina com logo Ⓒ Covil Games âmbar à esquerda e links com separador ▪; letreiro hero: "COVIL GAMES" gigante em Sora ExtraBold com glow âmbar em camadas (neon real, não gradiente), sub "As notícias, as ofertas e o arquivo — todo dia, sem ruído", CTAs: primária "Ver as novidades" cheia âmbar com texto preto, secundária "Ofertas ao vivo →"; abaixo do dobra: fio de notícias (14 itens, chase light no mais recente), ofertas relâmpago (4 cartas), trilhas coloridas por luz, loja.

FORM: direção fundamentada "Marquee do Covil" — grounded candidate próprio fundido ao challenger 3 (arcade marquee row, verdict competitive: cedeu o brilho multis-cores de gabinete e a coragem de luz por território); challengers 1 (cracktro) e 2 (cutting bench) declined — disciplina do cracktro adotada: nada de card genérico, rank por tamanho/luz; disciplina do bench adotada: estado é marca, não cor adicional.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
