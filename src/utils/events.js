// utils/events.js

export function sendUpdate() {
  window.dispatchEvent(new Event("data-updated"));
}

export const emitUpdate = sendUpdate;

export function subscribeUpdate(handler) {
  window.addEventListener("data-updated", handler);
  return () => window.removeEventListener("data-updated", handler);
}
