# JB Imper Clean — site

Site estático (HTML, CSS e JS puros) da JB Imper Clean, higienização profissional de estofados em Sorocaba e Votorantim. Hospedado no GitHub Pages em https://jbimperclean.com.br.

## Estrutura

```
index.html                 página única com todas as seções
css/style.css              estilos
js/config.js               PREÇOS, descontos e fotos de resultados (edite aqui)
js/main.js                 menu, comparação antes/depois, resultados e simulador
img/resultados/            fotos de antes e depois (veja LEIA-ME.txt)
img/logo.png               logo (favicon.png e apple-touch-icon.png derivam dela)
```

## Tarefas comuns

- **Mudar preços:** edite `js/config.js` (os preços aparecem só no simulador).
- **Fotos:** `destaque` no `js/config.js` é a comparação do topo; `resultados` é a seção extra. Veja `img/resultados/LEIA-ME.txt`.
- **Mudar o WhatsApp:** campo `whatsapp` em `js/config.js` e os links `wa.me/...` no `index.html`.

## Rodar localmente

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080. Use `?static` na URL para desligar as animações de entrada (útil para capturas de tela).

## Publicar

Ao alterar CSS ou JS, aumente o número `?v=` nos links do `index.html` para os visitantes não verem a versão antiga em cache.

Todo push na branch `main` atualiza o site no GitHub Pages automaticamente.

## Domínio

`jbimperclean.com.br` foi registrado no Registro.br, que também cuida do DNS. O arquivo `CNAME` diz ao GitHub Pages qual é o domínio. Registros na zona DNS:

| Tipo  | Nome | Valor |
|-------|------|-------|
| A     | (vazio) | 185.199.108.153 |
| A     | (vazio) | 185.199.109.153 |
| A     | (vazio) | 185.199.110.153 |
| A     | (vazio) | 185.199.111.153 |
| CNAME | www  | guilhermevictaliano.github.io |
