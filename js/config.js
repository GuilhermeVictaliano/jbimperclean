/* =========================================================
   CONFIGURAÇÃO DO SITE — JB Imper Clean
   ---------------------------------------------------------
   Edite aqui preços, descontos e fotos de resultados.
   Não precisa mexer em nenhum outro arquivo.

   - preco: valor em reais por unidade (ou por m², se unidade = "m²")
   - O preço "a partir de" exibido na seção Serviços é o do
     PRIMEIRO item de cada categoria. Deixe em primeiro o item
     mais comum e de menor valor daquele tipo.
   ========================================================= */

window.JB_CONFIG = {
  // Número que recebe os orçamentos (DDI + DDD + número, só dígitos)
  whatsapp: "5515996649167",

  // Impermeabilização: acréscimo sobre o valor da limpeza do item (0.5 = +50%)
  impermeabilizacaoPercentual: 0.5,

  // Valor mínimo de atendimento (se o total ficar abaixo, cobra este valor). 0 = desativado
  valorMinimo: 150,

  // Desconto progressivo por quantidade TOTAL de peças (vale para todos os clientes).
  // Ordene do maior para o menor.
  descontos: [
    { minPecas: 30, percentual: 0.15 },
    { minPecas: 15, percentual: 0.10 },
    { minPecas: 6,  percentual: 0.05 }
  ],

  /* -------------------------------------------------------
     RESULTADOS (fotos de antes e depois)
     - Coloque as fotos em img/resultados/
     - "antes" e "depois" podem ser de ângulos diferentes.
     - Para um trabalho só com foto final, deixe antes: "".
     - Itens cujas fotos não existirem não aparecem no site.
     ------------------------------------------------------- */
  resultados: [
    {
      titulo: "Sofá 3 lugares",
      detalhe: "Higienização completa · Residencial · Sorocaba",
      antes: "img/resultados/sofa-3-lugares-antes.jpg",
      depois: "img/resultados/sofa-3-lugares-depois.jpg"
    }
    // Exemplo para adicionar outro:
    // ,{
    //   titulo: "Cadeiras de escritório (24 un.)",
    //   detalhe: "Higienização · Escritório · Votorantim",
    //   antes: "img/resultados/cadeiras-antes.jpg",
    //   depois: "img/resultados/cadeiras-depois.jpg"
    // }
  ],

  // Categorias e opções do simulador.
  // icone: sofa, colchao, poltrona, cadeira, veiculo, tapete, outros
  categorias: [
    {
      id: "sofa", nome: "Sofá", icone: "sofa",
      opcoes: [
        { nome: "Sofá 2 lugares", preco: 150 },
        { nome: "Sofá 3 lugares", preco: 180 },
        { nome: "Sofá 4 lugares", preco: 220 },
        { nome: "Sofá de canto (5–6 lugares)", preco: 280 },
        { nome: "Sofá retrátil/reclinável 2 lugares", preco: 190 },
        { nome: "Sofá retrátil/reclinável 3 lugares", preco: 230 },
        { nome: "Sofá-cama", preco: 200 }
      ]
    },
    {
      id: "colchao", nome: "Colchão", icone: "colchao",
      opcoes: [
        { nome: "Colchão solteiro", preco: 120 },
        { nome: "Colchão casal", preco: 150 },
        { nome: "Colchão queen", preco: 170 },
        { nome: "Colchão king", preco: 190 },
        { nome: "Colchão de berço", preco: 80 }
      ]
    },
    {
      id: "poltrona", nome: "Poltrona", icone: "poltrona",
      opcoes: [
        { nome: "Poltrona simples", preco: 80 },
        { nome: "Poltrona do papai / reclinável", preco: 120 },
        { nome: "Poltrona de auditório / cinema", preco: 35 }
      ]
    },
    {
      id: "cadeira", nome: "Cadeira", icone: "cadeira",
      opcoes: [
        { nome: "Cadeira (só assento estofado)", preco: 25 },
        { nome: "Cadeira (assento + encosto)", preco: 40 },
        { nome: "Cadeira de escritório", preco: 45 },
        { nome: "Cadeira gamer / presidente", preco: 60 },
        { nome: "Banqueta estofada", preco: 25 }
      ]
    },
    {
      id: "veiculo", nome: "Veículo", icone: "veiculo",
      opcoes: [
        { nome: "Carro de passeio (bancos completos)", preco: 250 },
        { nome: "SUV / 7 lugares (bancos completos)", preco: 320 },
        { nome: "Picape cabine dupla", preco: 280 },
        { nome: "Cabine de caminhão", preco: 300 },
        { nome: "Van (bancos completos)", preco: 450 },
        { nome: "Ônibus / micro-ônibus (por poltrona)", preco: 30 }
      ]
    },
    {
      id: "tapete", nome: "Tapete", icone: "tapete", unidade: "m²",
      opcoes: [
        { nome: "Carpete instalado (por m²)", preco: 18 },
        { nome: "Tapete (por m²)", preco: 25 }
      ]
    },
    {
      id: "outros", nome: "Outros", icone: "outros",
      opcoes: [
        { nome: "Cabeceira estofada", preco: 90 },
        { nome: "Puff", preco: 40 },
        { nome: "Almofada avulsa", preco: 15 },
        { nome: "Divã / recamier", preco: 110 }
      ]
    }
  ]
};
