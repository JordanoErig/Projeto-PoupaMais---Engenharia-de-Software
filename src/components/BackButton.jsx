import React from "react";
import "../styles/BackButton.css";

export default function BackButton({ to = "/" }) {
  return (
    <button
      className="back-btn"
      onClick={() => (window.location.href = to)}
      aria-label="Voltar"
    >
      ←
    </button>
  );
}
