# JB Imper Clean — site

Site estático (HTML, CSS e JS puros) da JB Imper Clean, higienização profissional de estofados em Sorocaba e Votorantim. Hospedado no GitHub Pages.

## Estrutura

```
index.html                 página única com todas as seções
css/style.css              estilos
js/config.js               PREÇOS, itens e descontos do simulador (edite aqui)
js/main.js                 menu, antes/depois e simulador
img/antes-depois/          fotos de antes e depois (veja LEIA-ME.txt)
img/favicon.svg            ícone da aba
```

## Tarefas comuns

- **Mudar preços:** edite `js/config.js`.
- **Trocar fotos de antes e depois:** coloque `1-antes.jpg`, `1-depois.jpg` etc. em `img/antes-depois/`.
- **Mudar o WhatsApp:** campo `whatsapp` em `js/config.js` e os links `wa.me/...` no `index.html`.

## Rodar localmente

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080.

## Publicar

Todo push na branch `main` atualiza o site no GitHub Pages automaticamente.
