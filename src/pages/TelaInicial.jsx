import React from "react";
import { motion } from "framer-motion";
import inicioImg from "../assets/imagens/porquinho.jpg";

export default function TelaInicial() {
  return (
    <div
      style={{
        width: "100%",
        minWidth: "46.5vh",
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      {/* TOP IMAGE */}
      <motion.img
        src={inicioImg}
        alt="Início"
        style={{
          width: "220px",
          height: "220px",
          objectFit: "cover",
          borderRadius: "20px",
          marginTop: "40px",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#4ebfa2" }}>
          PoupaMais
        </h1>
        <p style={{ fontSize: "14px", color: "#555", maxWidth: "260px", marginTop: "10px", textAlign: "justify", hyphens: "auto" }}>
          Uma maneira simples e fácil de começar a acompanhar suas finanças e ter conhecimento por onde seu dinheiro está indo.
        </p>
      </motion.div>

      {/* BUTTONS */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "40px",
          boxSizing: "border-box",
        }}
      >
        <button
          style={{
            backgroundColor: "#4ebfa2",
            color: "white",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            width: "100%",
            border: "none",
          }}
          onClick={() => (window.location.href = "/login")}
        >
          Entrar
        </button>

        <button
          style={{
            backgroundColor: "white",
            color: "#4ebfa2",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            width: "100%",
            border: "2px solid #4ebfa2",
          }}
          onClick={() => (window.location.href = "/cadastro")}
        >
          Criar Conta
        </button>
      </div>
    </div>
  );
}
