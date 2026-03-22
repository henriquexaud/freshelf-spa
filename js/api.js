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
