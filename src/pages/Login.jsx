import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-700 px-6">
      
      {/* Título */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-8"
        style={{ color: "#4ebfa2" }}
      >
        Entrar
      </motion.h1>

      {/* Formulário */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col w-full max-w-xs gap-4"
      >
        <input
          type="email"
          placeholder="E-mail"
          className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ebfa2]"
        />

        <input
          type="password"
          placeholder="Senha"
          className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ebfa2]"
        />

        {/* Botão de Login */}
        <button
          type="submit"
          style={{ backgroundColor: "#4ebfa2" }}
          className="text-white font-semibold py-3 rounded-xl shadow hover:opacity-90 transition mt-2"
        >
          Acessar
        </button>
      </motion.form>

      {/* Link para cadastro */}
      <p className="text-sm text-slate-500 mt-6">
        Não tem conta?{" "}
        <Link to="/cadastro" className="text-[#4ebfa2] font-semibold">
          Criar Conta
        </Link>
      </p>
    </div>
  );
}
