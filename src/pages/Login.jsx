import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Login.css"; 
import loginImg from "../assets/imagens/loginImg.jpeg";

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarioSalvo = JSON.parse(localStorage.getItem("user"));

    if (!usuarioSalvo) {
      alert("Nenhum usuário cadastrado!");
      return;
    }

    if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
      // Salva sessão
      localStorage.setItem("isLogged", "true");

      alert("Login realizado com sucesso!");
      window.location.href = "/dashboard";
    } else {
      alert("E-mail ou senha inválidos!");
    }
  };

  return (
    <div className="login-container">

      <button
        onClick={() => (window.location.href = "/")}
        className="back-btn"
        aria-label="Voltar"
      >
        ←
      </button>

      <motion.img
        src={loginImg}
        alt="Ilustração Login"
        className="login-image"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      <form className="form-section" onSubmit={handleLogin}>
        <p className="login-title">Login</p>

        <input
          type="email"
          placeholder="E-mail"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          className="input-field"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">
          Entrar
        </button>
      </form>
    </div>
  );
}
