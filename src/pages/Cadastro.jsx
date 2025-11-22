import React, { useState } from "react"; 
import { motion } from "framer-motion"; 
import "../styles/Cadastro.css";
import cadastroImg from "../assets/imagens/cadastroImg.jpeg"; 

export default function Cadastro() {

  // Estados para capturar os dados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();

    // Salva no localStorage
    const novoUsuario = { nome, email, senha };
    localStorage.setItem("user", JSON.stringify(novoUsuario));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "/login";
  };

  return (
    <div className="cadastro-container">

      <button
        onClick={() => (window.location.href = "/")}
        className="back-btn"
        aria-label="Voltar para o início"
      >
        ←
      </button>

      <motion.img
        src={cadastroImg}
        alt="Ilustração Cadastro"
        className="cadastro-image"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      /> 

      <form className="form-section" onSubmit={handleCadastro}>
        <h2 className="cadastro-title">
          Cadastro
        </h2>

        <input 
          type="text" 
          placeholder="Nome" 
          className="input-field"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required 
        />
        
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
          Cadastrar
        </button>
      </form>

    </div>
  );
}
