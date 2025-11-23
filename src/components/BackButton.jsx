import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  function handleBack() {
    if (to) return navigate(to);
    navigate(-1);
  }

  return (
    <button className="back-btn" onClick={handleBack}>
      ←
    </button>
  );
}