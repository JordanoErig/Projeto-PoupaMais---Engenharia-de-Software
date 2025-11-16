import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import inicioImg from "../assets/imagens/porquinho.jpg";

export default function TelaInicial() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white text-slate-700 p-6 pt-10">
      
      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <img
          src={inicioImg}
          alt="Logo porquinho"
          className="w-20 h-20 object-contain mb-4"
        />

        <h1 className="text-4xl font-bold" style={{ color: "#4ebfa2" }}>
          PoupaMais
        </h1>

        <p className="text-sm text-slate-500 mt-2 max-w-xs text-center">
          Controle financeiro simples e direto ao ponto.
        </p>
      </motion.div>

      {/* BOTÕES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center gap-3 mb-10"
      >
        <Link to="/login">
          <button
            style={{ backgroundColor: "#4ebfa2" }}
            className="text-white font-semibold py-3 rounded-xl shadow hover:opacity-90 transition w-48"
          >
            Entrar
          </button>
        </Link>

        <Link to="/cadastro">
          <button
            className="border-2 border-[#4ebfa2] text-[#4ebfa2] font-semibold py-3 rounded-xl hover:bg-[#4ebfa210] transition w-48"
          >
            Criar Conta
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
