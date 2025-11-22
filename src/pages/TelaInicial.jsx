import React from "react";
import { motion } from "framer-motion";
// Importe o CSS que criamos acima
import "../styles/TelaInicial.css"; 
import inicioImg from "../assets/imagens/porquinho.jpg";

// Dica: Se você estiver usando react-router-dom, use o hook useNavigate
// em vez de window.location.href para uma transição mais suave (SPA).
// import { useNavigate } from "react-router-dom";

export default function TelaInicial() {
  // const navigate = useNavigate();

  return (
    <div className="container">
      
      {/* TOP IMAGE */}
      <motion.img
        src={inicioImg}
        alt="Início - Porquinho"
        className="hero-image"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* TEXT */}
      <motion.div
        className="text-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h1 className="title">PoupaMais</h1>
        <p className="description">
          Uma maneira simples e fácil de começar a acompanhar suas finanças e
          ter conhecimento por onde seu dinheiro está indo.
        </p>
      </motion.div>

      {/* BUTTONS */}
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/login")} 
          /* Se usar Router: onClick={() => navigate("/login")} */
        >
          Entrar
        </button>

        <button
          className="btn btn-outline"
          onClick={() => (window.location.href = "/cadastro")}
           /* Se usar Router: onClick={() => navigate("/cadastro")} */
        >
          Criar Conta
        </button>
      </div>
    </div>
  );
}