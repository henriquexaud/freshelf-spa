const feedbackTimers = new Map();

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
