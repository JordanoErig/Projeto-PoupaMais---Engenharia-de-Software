import React from "react";
import { motion } from "framer-motion";
import loginImg from "../assets/imagens/porquinho.jpg"; // substitua depois

export default function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          alignSelf: "flex-start",
          fontSize: "22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          backgroundColor: "black",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        ←
      </button>

      {/* IMAGE */}
      <motion.img
        src={loginImg}
        style={{
          width: "200px",
          height: "200px",
          objectFit: "cover",
          borderRadius: "20px",
          marginTop: "10px",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      />

      {/* FORM */}
      <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        <p style={{ fontWeight: "bold", color: "#4ebfa2", fontSize: "20px" }}>Login</p>

        <input
          type="email"
          placeholder="E-mail"
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          style={inputStyle}
        />

        {/* BUTTON */}
        <button style={buttonStyle}>Entrar</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};


const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  backgroundColor: "#4ebfa2",
  color: "white",
  border: "none",
  fontWeight: "bold",
  borderRadius: "10px",
  cursor: "pointer",
};
