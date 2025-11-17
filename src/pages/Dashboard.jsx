import React from "react";
import { getLoggedUser, logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getLoggedUser();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user.nome}!</h1>

      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={() => {
          logoutUser();
          navigate("/");
        }}
      >
        Sair
      </button>
    </div>
  );
}
