const API = window.localStorage.getItem("freshelf.api") || "http://localhost:5001";
const DIAS_ALERTA = 7;
const FEEDBACK_TIMEOUT = 5000;
const FETCH_TIMEOUT = 8000;
const feedbackTimers = new Map();
const removendoIds = new Set();

function statusValidade(dataStr) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const validade = new Date(dataStr + "T00:00:00");
  const diff = (validade - hoje) / (1000 * 60 * 60 * 24);
  if (diff < 0)            return { texto: "Vencido",        classe: "vencido" };
  if (diff <= DIAS_ALERTA) return { texto: "Vence em breve", classe: "alerta" };
  return                          { texto: "Dentro do prazo", classe: "ok" };
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

function clearFeedback(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;

  window.clearTimeout(feedbackTimers.get(targetId));
  feedbackTimers.delete(targetId);
  el.hidden = true;
  el.textContent = "";
  el.className = targetId === "app-feedback" ? "feedback-banner" : "feedback";
}

function showFeedback(targetId, message, type = "info", timeout = FEEDBACK_TIMEOUT) {
  const el = document.getElementById(targetId);
  if (!el) return;

  window.clearTimeout(feedbackTimers.get(targetId));
  feedbackTimers.delete(targetId);

  el.hidden = false;
  el.textContent = message;
  el.className = targetId === "app-feedback"
    ? `feedback-banner feedback-banner-${type}`
    : `feedback feedback-${type}`;

  if (timeout > 0) {
    const timer = window.setTimeout(() => clearFeedback(targetId), timeout);
    feedbackTimers.set(targetId, timer);
  }
}

function setSubmitState(loading) {
  const button = document.getElementById("submit-produto");
  button.disabled = loading;
  button.textContent = loading ? "Cadastrando..." : "Cadastrar";
}

async function requestJSON(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(`${API}${path}`, {
      ...options,
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      throw new Error(body?.erro || body?.mensagem || `Erro ${response.status}`);
    }

    return body;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("A API demorou demais para responder.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

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

async function carregarProdutos() {
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
        <td><button class="button-secondary" data-action="remover" data-id="${p.id}"${removendoIds.has(p.id) ? " disabled" : ""}>${removendoIds.has(p.id) ? "Removendo..." : "Remover"}</button></td>
      </tr>`;
    }
    html += "</tbody></table>";
    el.innerHTML = html;
  } catch {
    el.innerHTML = '<p class="estado-vazio">Erro ao conectar com a API.</p>';
  }
}

async function recarregarTudo() {
  await Promise.all([carregarEstatisticas(), carregarAlertas(), carregarProdutos()]);
}

async function removerProduto(id) {
  if (removendoIds.has(id)) return;

  removendoIds.add(id);
  await carregarProdutos();

  try {
    await requestJSON(`/produtos/${id}`, { method: "DELETE" });
    removendoIds.delete(id);
    showFeedback("app-feedback", "Produto removido com sucesso.", "success");
    await recarregarTudo();
  } catch (error) {
    removendoIds.delete(id);
    await carregarProdutos();
    showFeedback("app-feedback", error.message || "Erro ao remover produto.", "error");
  }
}

document.getElementById("lista-produtos").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action='remover']");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (!Number.isInteger(id)) return;

  await removerProduto(id);
});

document.getElementById("form-produto").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFeedback("app-feedback");
  setSubmitState(true);

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    quantidade: parseInt(document.getElementById("quantidade").value, 10),
    data_validade: document.getElementById("data_validade").value,
  };

  try {
    await requestJSON("/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    e.target.reset();
    showFeedback("app-feedback", "Produto cadastrado com sucesso.", "success");
    await recarregarTudo();
  } catch (error) {
    showFeedback("app-feedback", error.message || "Erro ao conectar com a API.", "error");
  } finally {
    setSubmitState(false);
  }
});

recarregarTudo();
