async function carregarEstatisticas() {
  try {
    const s = await requestJSON("/produtos/estatisticas");
    document.getElementById("stats").textContent =
      `Total: ${s.total} | Ok: ${s.ok} | Vencendo: ${s.vencendo} | Vencidos: ${s.vencidos}`;
  } catch {
    document.getElementById("stats").textContent = "Estatísticas indisponíveis.";
  }
}

async function carregarAlertas() {
  const el = document.getElementById("alertas-lista");
  el.innerHTML = '<p class="estado-vazio">Carregando alertas...</p>';
  try {
    const lista = await requestJSON("/produtos/vencendo");
    if (lista.length === 0) {
      el.innerHTML = '<p class="estado-vazio">Nenhum item próximo do vencimento.</p>';
      return;
    }
    el.innerHTML = lista.map(p => {
      const st = statusValidade(p.data_validade);
      return `<article class="alerta-item ${st.classe}">
        <div class="alerta-topo">
          <strong>${esc(p.nome)}</strong>
          <span class="status-chip ${st.classe}">${st.texto}</span>
        </div>
        <p>Quantidade: ${p.quantidade}</p>
        <p>Validade: ${fmtData(p.data_validade)}</p>
      </article>`;
    }).join("");
  } catch {
    el.innerHTML = '<p class="estado-vazio">Erro ao carregar alertas.</p>';
  }
}

async function carregarProdutos(removendoIds) {
  const el = document.getElementById("lista-produtos");
  el.innerHTML = '<p class="estado-vazio">Carregando produtos...</p>';
  try {
    const produtos = await requestJSON("/produtos");
    if (produtos.length === 0) {
      el.innerHTML = '<p class="estado-vazio">Nenhum produto cadastrado.</p>';
      return;
    }
    let html = `<table><thead><tr>
      <th>Nome</th><th>Qtd</th><th>Validade</th><th>Status</th><th></th>
    </tr></thead><tbody>`;
    for (const p of produtos) {
      const st = statusValidade(p.data_validade);
      html += `<tr>
        <td>${esc(p.nome)}</td>
        <td>${p.quantidade}</td>
        <td>${fmtData(p.data_validade)}</td>
        <td><span class="status-chip ${st.classe}">${st.texto}</span></td>
        <td><span class="tooltip-wrap"><button class="button-secondary" data-action="remover" data-id="${p.id}"${removendoIds.has(p.id) ? " disabled" : ""}>${removendoIds.has(p.id) ? "Removendo..." : "🗑️"}</button><span class="tooltip-label">Remover</span></span></td>
      </tr>`;
    }
    html += "</tbody></table>";
    el.innerHTML = html;
  } catch {
    el.innerHTML = '<p class="estado-vazio">Erro ao conectar com a API.</p>';
  }
}
