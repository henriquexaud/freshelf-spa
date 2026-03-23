const STATUS_DISPLAY = {
  vencido:    { texto: "Vencido",         classe: "vencido" },
  vence_hoje: { texto: "Vence hoje",      classe: "hoje"    },
  ok:         { texto: "Dentro do prazo", classe: "ok"      },
};

function statusValidade(produto) {
  if (produto.status === "vencendo") {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const validade = new Date(produto.data_validade + "T00:00:00");
    const dias = Math.round((validade - hoje) / (1000 * 60 * 60 * 24));
    return { texto: `Vence em ${dias} dias`, classe: "alerta" };
  }
  return STATUS_DISPLAY[produto.status] || STATUS_DISPLAY.ok;
}

function fmtData(dataStr) {
  const [a, m, d] = dataStr.split("-");
  return `${d}/${m}/${a}`;
}

function esc(str) {
  const el = document.createElement("div");
  el.textContent = str;
  return el.innerHTML;
}
