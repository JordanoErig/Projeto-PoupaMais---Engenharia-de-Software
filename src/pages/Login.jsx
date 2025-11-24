import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 👈 Importa o Hook
import "../styles/Login.css"; 
import loginImg from "../assets/imagens/loginImg.jpeg";

export default function Login() {
  const navigate = useNavigate(); // 👈 Ativa o Hook
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. 🚨 BUSCA A LISTA COMPLETA DE USUÁRIOS
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosCadastrados"));

    if (!listaUsuarios || listaUsuarios.length === 0) {
      alert("Nenhum usuário cadastrado!");
      return;
    }

    // 2. ENCONTRA O USUÁRIO PELO EMAIL E SENHA
    const usuarioEncontrado = listaUsuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      
      // 🚨 PASSO CRÍTICO: LIMPA sessões antigas e salva o NOVO IDENTIFICADOR
      localStorage.removeItem("isLogged");
      localStorage.removeItem("userEmailLogado"); 

      // 3. Salva a sessão como logada
      localStorage.setItem("isLogged", "true");

      // 4. Salva o IDENTIFICADOR UNICO (Email) para carregar os dados financeiros corretos.
      localStorage.setItem("userEmailLogado", usuarioEncontrado.email); 

      alert(`Login realizado com sucesso! Bem-vindo(a), ${usuarioEncontrado.nome}.`);
      
      // 5. Usa a navegação correta do React
      navigate("/dashboard");

    } else {
      alert("E-mail ou senha inválidos!");
    }
  };

  return (
    <div className="login-container">

      <button
        onClick={() => navigate("/")} // 👈 Usando navigate
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