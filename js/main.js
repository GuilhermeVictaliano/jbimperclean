(function () {
  "use strict";

  var CFG = window.JB_CONFIG;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var brl = function (v) {
    var dec = Math.round(v * 100) % 100 === 0 ? 0 : 2;
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: dec, maximumFractionDigits: dec });
  };

  $("#ano").textContent = new Date().getFullYear();

  /* ---------------- Menu mobile ---------------- */
  var toggle = $("#navToggle");
  var nav = $("#nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", nav).forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  function icon(id, cls) {
    return '<svg class="' + (cls || "ico") + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* ---------------- Preços de referência (vêm do config) ---------------- */
  // "A partir de" = primeiro item da categoria (o caso mais comum), não o menor preço,
  // para não anunciar valores de itens específicos como ônibus por poltrona.
  function precoBase(cat) {
    return cat.opcoes[0].preco;
  }
  function catById(id) {
    return CFG.categorias.filter(function (c) { return c.id === id; })[0];
  }

  // Lista "a partir de" na seção Serviços
  $$(".pricelist__row[data-cat]").forEach(function (row) {
    var c = catById(row.dataset.cat);
    if (!c) { row.hidden = true; return; }
    $(".pricelist__price strong", row).textContent = brl(precoBase(c)) + (c.unidade === "m²" ? "/m²" : "");
  });
  $("#imperPrice").textContent = "+" + Math.round(CFG.impermeabilizacaoPercentual * 100) + "%";
  $("#minNote").textContent = brl(CFG.valorMinimo);

  // Cartão do topo: itens mais procurados por empresas e residências
  var destaques = [
    ["sofa", "Sofá 3 lugares"],
    ["colchao", "Colchão casal"],
    ["cadeira", "Cadeira de escritório"],
    ["poltrona", "Poltrona simples"],
    ["veiculo", "Carro de passeio (bancos completos)"]
  ];
  $("#priceCardList").innerHTML = destaques.map(function (d) {
    var c = catById(d[0]);
    var o = c && c.opcoes.filter(function (x) { return x.nome === d[1]; })[0];
    if (!o) return "";
    var label = o.nome.replace(/\s*\(.*\)$/, "");
    return "<li><span>" + esc(label) + "</span><strong>" + brl(o.preco) + "</strong></li>";
  }).join("");

  var menorFaixa = CFG.descontos.reduce(function (m, d) { return Math.min(m, d.minPecas); }, Infinity);
  var maiorDesc = CFG.descontos.reduce(function (m, d) { return Math.max(m, d.percentual); }, 0);
  $("#pcMinPecas").textContent = isFinite(menorFaixa) ? menorFaixa : "";
  $("#trustMaxDisc").textContent = Math.round(maiorDesc * 100) + "%";

  /* ---------------- Resultados ---------------- */
  var lightbox = $("#lightbox");
  var lbImg = $("#lightboxImg");
  var lbCap = $("#lightboxCap");

  function openLightbox(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap;
    lbCap.textContent = cap;
    if (lightbox.showModal) lightbox.showModal(); else window.open(src, "_blank");
  }
  $("#lightboxClose").addEventListener("click", function () { lightbox.close(); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });

  function loadImg(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  function photoButton(img, label, cap) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "result__photo";
    b.setAttribute("aria-label", "Ampliar foto: " + cap);
    img.alt = cap;
    b.appendChild(img);
    if (label) {
      var tag = document.createElement("span");
      tag.className = "result__label result__label--" + label.toLowerCase();
      tag.textContent = label;
      b.appendChild(tag);
    }
    b.addEventListener("click", function () { openLightbox(img.src, cap); });
    return b;
  }

  var grid = $("#resultsGrid");
  Promise.all((CFG.resultados || []).map(function (r) {
    return Promise.all([loadImg(r.antes), loadImg(r.depois)]).then(function (imgs) {
      return { r: r, antes: imgs[0], depois: imgs[1] };
    });
  })).then(function (list) {
    list.forEach(function (it) {
      if (!it.antes && !it.depois) return; // fotos ainda não enviadas: não exibe
      var fig = document.createElement("figure");
      fig.className = "result";
      var photos = document.createElement("div");
      photos.className = "result__photos" + (it.antes && it.depois ? "" : " result__photos--single");
      if (it.antes) photos.appendChild(photoButton(it.antes, "Antes", it.r.titulo + " — antes"));
      if (it.depois) photos.appendChild(photoButton(it.depois, it.antes ? "Depois" : "", it.r.titulo + (it.antes ? " — depois" : "")));
      fig.appendChild(photos);
      var cap = document.createElement("figcaption");
      cap.innerHTML = "<strong>" + esc(it.r.titulo) + "</strong>" + (it.r.detalhe ? "<span>" + esc(it.r.detalhe) + "</span>" : "");
      fig.appendChild(cap);
      grid.appendChild(fig);
    });

    var cta = document.createElement("div");
    cta.className = "result result--cta";
    cta.innerHTML = icon("instagram") +
      "<strong>Mais trabalhos no Instagram</strong>" +
      "<p>Publicamos resultados, bastidores e dicas de conservação no perfil @jbimperclean.</p>" +
      '<a class="btn btn--outline" href="https://www.instagram.com/jbimperclean/" target="_blank" rel="noopener">Ver perfil</a>';
    grid.appendChild(cta);
  });

  /* ---------------- Simulador ---------------- */
  var state = { cat: CFG.categorias[0], items: [] };

  var catGrid = $("#catGrid");
  var optSelect = $("#optSelect");
  var qtyInput = $("#qtyInput");
  var qtyLabel = $("#qtyLabel");
  var imperCheck = $("#imperCheck");
  var sendBtn = $("#sendBtn");

  // Tipo de cliente
  function tipoCliente() { return $("input[name=tipoCliente]:checked").value; }
  function syncTipo() {
    var emp = tipoCliente() === "empresa";
    $("#segmentoWrap").hidden = !emp;
    $("#empresaWrap").hidden = !emp;
  }
  $$("input[name=tipoCliente]").forEach(function (r) { r.addEventListener("change", syncTipo); });

  // Botões "simular para empresa" já marcam Empresa
  $$("[data-tipo=empresa]").forEach(function (a) {
    a.addEventListener("click", function () {
      $("input[name=tipoCliente][value=empresa]").checked = true;
      syncTipo();
    });
  });

  // Categorias
  CFG.categorias.forEach(function (c, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cat" + (i === 0 ? " is-active" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", i === 0);
    b.innerHTML = icon(c.icone, "") + "<span>" + c.nome + "</span>";
    b.addEventListener("click", function () {
      $$(".cat", catGrid).forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-active");
      b.setAttribute("aria-selected", "true");
      state.cat = c;
      renderOptions();
    });
    catGrid.appendChild(b);
  });

  function renderOptions() {
    var c = state.cat;
    var un = c.unidade || "un";
    optSelect.innerHTML = c.opcoes.map(function (o, i) {
      return '<option value="' + i + '">' + o.nome + " — " + brl(o.preco) + (un === "m²" ? "/m²" : "") + "</option>";
    }).join("");
    qtyLabel.textContent = un === "m²" ? "Área (m²)" : "Quantidade";
    qtyInput.step = un === "m²" ? "0.5" : "1";
    qtyInput.min = un === "m²" ? "0.5" : "1";
    qtyInput.inputMode = un === "m²" ? "decimal" : "numeric";
    qtyInput.value = 1;
  }

  // +/- quantidade
  $$(".qty__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var step = parseFloat(qtyInput.step) || 1;
      var min = parseFloat(qtyInput.min) || 1;
      var v = (parseFloat(qtyInput.value) || 0) + step * parseInt(b.dataset.step, 10);
      qtyInput.value = Math.max(min, Math.round(v * 2) / 2);
    });
  });

  // Adicionar item
  $("#addBtn").addEventListener("click", function () {
    var c = state.cat;
    var o = c.opcoes[parseInt(optSelect.value, 10)];
    var qty = parseFloat(String(qtyInput.value).replace(",", "."));
    var min = parseFloat(qtyInput.min) || 1;
    if (!qty || qty < min) { qty = min; }
    if (!c.unidade) { qty = Math.round(qty); }
    var imper = imperCheck.checked;

    // Junta com item igual já existente
    var existing = state.items.find(function (it) { return it.nome === o.nome && it.imper === imper; });
    if (existing) {
      existing.qty += qty;
    } else {
      state.items.push({
        icone: c.icone, nome: o.nome, preco: o.preco, qty: qty,
        unidade: c.unidade || "un", imper: imper
      });
    }
    qtyInput.value = 1;
    imperCheck.checked = false;
    renderSummary();

    var btn = $("#addBtn");
    btn.classList.add("is-done");
    btn.textContent = "Item adicionado";
    setTimeout(function () { btn.classList.remove("is-done"); btn.textContent = "Adicionar ao orçamento"; }, 1100);
  });

  function itemTotal(it) {
    var base = it.preco * it.qty;
    return it.imper ? base * (1 + CFG.impermeabilizacaoPercentual) : base;
  }

  // Peças contam por unidade; tapetes (m²) contam como 1 peça por linha
  function totalPecas() {
    return state.items.reduce(function (s, it) { return s + (it.unidade === "m²" ? 1 : it.qty); }, 0);
  }

  function descontoAtual(pecas) {
    for (var i = 0; i < CFG.descontos.length; i++) {
      if (pecas >= CFG.descontos[i].minPecas) return CFG.descontos[i];
    }
    return null;
  }

  function proximoDesconto(pecas) {
    var next = null;
    CFG.descontos.forEach(function (d) { if (d.minPecas > pecas && (!next || d.minPecas < next.minPecas)) next = d; });
    return next;
  }

  function calc() {
    var sub = state.items.reduce(function (s, it) { return s + itemTotal(it); }, 0);
    var pecas = totalPecas();
    var d = descontoAtual(pecas);
    var disc = d ? sub * d.percentual : 0;
    var total = sub - disc;
    var minApplied = CFG.valorMinimo > 0 && total > 0 && total < CFG.valorMinimo;
    if (minApplied) total = CFG.valorMinimo;
    return { sub: sub, pecas: pecas, d: d, disc: disc, total: total, minApplied: minApplied };
  }

  function fmtQty(it) {
    return it.unidade === "m²" ? String(it.qty).replace(".", ",") + " m²" : it.qty + "x";
  }

  function renderSummary() {
    var list = $("#summaryList");
    if (!state.items.length) {
      list.innerHTML = '<li class="summary__empty">Nenhum item adicionado ainda.</li>';
      $("#summaryTotals").hidden = true;
      sendBtn.disabled = true;
      updateBar();
      return;
    }

    list.innerHTML = "";
    state.items.forEach(function (it, i) {
      var li = document.createElement("li");
      li.className = "summary__item";
      li.innerHTML =
        icon(it.icone, "summary__icon") +
        '<div class="summary__info"><strong>' + it.nome + "</strong>" +
        "<small>" + fmtQty(it) + (it.imper ? " · com impermeabilização" : "") + "</small></div>" +
        '<span class="summary__price">' + brl(itemTotal(it)) + "</span>" +
        '<button type="button" class="summary__rm" aria-label="Remover ' + it.nome + '">×</button>';
      $(".summary__rm", li).addEventListener("click", function () {
        state.items.splice(i, 1);
        renderSummary();
      });
      list.appendChild(li);
    });

    var r = calc();
    $("#summaryTotals").hidden = false;
    $("#tSub").textContent = brl(r.sub);
    $("#tDiscRow").hidden = !r.d;
    if (r.d) {
      $("#tDiscLabel").textContent = "Desconto por volume (" + Math.round(r.d.percentual * 100) + "%)";
      $("#tDisc").textContent = "-" + brl(r.disc);
    }
    $("#tMinRow").hidden = !r.minApplied;
    $("#tMin").textContent = brl(CFG.valorMinimo);
    $("#tTotal").textContent = brl(r.total);

    var next = proximoDesconto(r.pecas);
    $("#discHint").textContent = next
      ? "Faltam " + (next.minPecas - r.pecas) + " peça(s) para ganhar " + Math.round(next.percentual * 100) + "% de desconto."
      : "";

    sendBtn.disabled = false;
    updateBar();
  }

  // Barra fixa no celular: mostra total enquanto o resumo está fora da tela
  var bar = $("#simBar");
  var simInView = false, summaryInView = false;
  function updateBar() {
    var n = state.items.length;
    if (n) {
      var p = totalPecas();
      $("#simBarCount").textContent = p + (p === 1 ? " peça" : " peças");
      $("#simBarTotal").textContent = brl(calc().total);
    }
    var show = n > 0 && simInView && !summaryInView;
    bar.classList.toggle("is-visible", show);
    document.body.classList.toggle("in-sim", simInView);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      simInView = es[0].isIntersecting;
      updateBar();
    }).observe($("#simulador"));
    new IntersectionObserver(function (es) {
      summaryInView = es[0].isIntersecting;
      updateBar();
    }, { threshold: 0.25 }).observe($(".summary"));
  }
  $("#simBarBtn").addEventListener("click", function () {
    $(".summary").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Enviar para o WhatsApp
  sendBtn.addEventListener("click", function () {
    if (!state.items.length) return;
    var r = calc();
    var emp = tipoCliente() === "empresa";
    var nome = $("#fNome").value.trim();
    var empresa = $("#fEmpresa").value.trim();
    var bairro = $("#fBairro").value.trim();
    var obs = $("#fObs").value.trim();

    var L = [];
    L.push("Olá, JB Imper Clean! Fiz uma simulação no site e gostaria de confirmar o orçamento:");
    L.push("");
    L.push("*Cliente:* " + (emp ? "Empresa" : "Residência"));
    if (emp) L.push("*Segmento:* " + $("#segmento").value);
    if (nome) L.push("*Nome:* " + nome);
    if (emp && empresa) L.push("*Empresa:* " + empresa);
    L.push("*Local:* " + (bairro ? bairro + " - " : "") + $("#fCidade").value);
    L.push("*Melhor período:* " + $("#fPeriodo").value);
    L.push("");
    L.push("*Itens:*");
    state.items.forEach(function (it) {
      L.push("• " + fmtQty(it) + " " + it.nome + (it.imper ? " + impermeabilização" : "") + " — " + brl(itemTotal(it)));
    });
    L.push("");
    L.push("Subtotal: " + brl(r.sub));
    if (r.d) L.push("Desconto por volume (" + Math.round(r.d.percentual * 100) + "%): -" + brl(r.disc));
    if (r.minApplied) L.push("Valor mínimo de atendimento aplicado");
    L.push("*Estimativa total: " + brl(r.total) + "*");
    if (obs) { L.push(""); L.push("*Observações:* " + obs); }
    L.push("");
    L.push("Posso enviar fotos dos estofados para confirmar o valor.");

    var url = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(L.join("\n"));
    // Se o navegador bloquear a nova aba, abre na mesma
    var w = window.open(url, "_blank");
    if (w) { w.opener = null; } else { window.location.href = url; }
  });

  renderOptions();
  syncTipo();
})();
