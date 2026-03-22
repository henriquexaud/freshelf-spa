function statusValidade(dataStr) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const validade = new Date(dataStr + "T00:00:00");
  const diff = (validade - hoje) / (1000 * 60 * 60 * 24);
  if (diff < 0)            return { texto: "Vencido",              classe: "vencido" };
  if (diff === 0)           return { texto: "Vence hoje",          classe: "hoje"    };
  if (diff <= DIAS_ALERTA) return { texto: `Vence em ${diff} dias`, classe: "alerta"  };
  return                          { texto: "Dentro do prazo",      classe: "ok"      };
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
