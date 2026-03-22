const removendoIds = new Set();

async function recarregarTudo() {
  await Promise.all([carregarEstatisticas(), carregarAlertas(), carregarProdutos(removendoIds)]);
}

async function removerProduto(id) {
  if (removendoIds.has(id)) return;

  removendoIds.add(id);
  await carregarProdutos(removendoIds);

  try {
    await requestJSON(`/produtos/${id}`, { method: "DELETE" });
    removendoIds.delete(id);
    showFeedback("app-feedback", "Produto removido com sucesso.", "success");
    await recarregarTudo();
  } catch (error) {
    removendoIds.delete(id);
    await carregarProdutos(removendoIds);
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
