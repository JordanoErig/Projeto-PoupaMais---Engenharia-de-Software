import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeUpdate, emitUpdate } from "../utils/events";
import { useNavigate } from "react-router-dom"; 
import "../styles/RegistrarReceita.css";
import BackButton from "../components/BackButton";

export default function RegistrarReceita() {
    const navigate = useNavigate(); 
    
    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [receitas, setReceitas] = useState([]);

    // 🚨 CHAVE DE USUÁRIO: Obtém o email do usuário logado
    const userEmail = localStorage.getItem("userEmailLogado"); 

    // Função para carregar e filtrar receitas
    function loadReceitas() {
        // 🚨 SEGURANÇA: Verifica se o usuário está logado
        if (!userEmail) {
            navigate("/login");
            return;
        }

        const allReceitas = JSON.parse(localStorage.getItem("receitas")) || [];
        
        // 🚨 FILTRA: Apenas receitas onde o 'userEmail' corresponde ao usuário logado
        const userReceitas = allReceitas
            .filter(r => r.userEmail === userEmail)
            .sort((a, b) => new Date(b.data) - new Date(a.data)); // Opcional: Ordenar por data
        
        setReceitas(userReceitas);
    }

    useEffect(() => {
        loadReceitas();

        const unsub = subscribeUpdate(() => {
            loadReceitas();
        });

        return unsub;
    }, [userEmail, navigate]); 

    function registrar() {
        if (!userEmail) {
            alert("Sessão expirada. Faça login novamente.");
            navigate("/login");
            return;
        }
        
        const valorNumero = parseFloat(valor.replace(",", "."));
        
        if (!valorNumero || !descricao || !data) {
            alert("Preencha todos os campos e insira um valor válido!");
            return;
        }

        const nova = {
            id: Date.now(),
            valor: valorNumero,
            descricao,
            data,
            userEmail: userEmail, // ✅ Associa a receita ao usuário
        };

        // 1. Salva a receita (Lista Global)
        const allReceitas = JSON.parse(localStorage.getItem("receitas")) || [];
        allReceitas.push(nova);
        localStorage.setItem("receitas", JSON.stringify(allReceitas));
        
        // 2. 🚨 ATUALIZA SALDO DO USUÁRIO
        // Lendo e salvando na chave ESPECÍFICA do usuário (`saldo_${userEmail}`)
        const saldoKey = `saldo_${userEmail}`;
        const saldoAtual = parseFloat(localStorage.getItem(saldoKey) || "0");
        
        const novoSaldo = Number((saldoAtual + valorNumero).toFixed(2));
        localStorage.setItem(saldoKey, String(novoSaldo)); // ✅ Usa a chave correta
        
        // 3. Atualiza o estado local
        setReceitas(prev => [nova, ...prev]);
        
        // 4. Atualiza dashboard
        emitUpdate();
        
        alert("Receita registrada com sucesso!");

        // Limpa campos
        setValor("");
        setDescricao("");
        setData("");
    }

    return (
        <div className="receita-container">
            <BackButton to="/dashboard" /> 

            <motion.div
                className="receita-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2>Registrar Receita</h2>
            </motion.div>

            <div className="form-area">

                <label>Descrição</label>
                <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />

                <label>Valor (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                />

                <label>Data</label>
                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />

                <button className="btn-registrar" onClick={registrar}>
                    Salvar Receita
                </button>
            </div>

            <div className="lista-receitas">
                <h3>Receitas Registradas</h3>

                {receitas.length === 0 && (
                    <p className="muted">Nenhuma receita registrada.</p>
                )}

                <ul>
                    {/* Exibe apenas as receitas do usuário logado */}
                    {receitas.map((r) => (
                        <li key={r.id} className="receita-item">
                            <div>
                                <p className="desc">{r.descricao}</p>
                                <p className="data">
                                    {new Date(r.data).toLocaleDateString()}
                                </p>
                            </div>

                            <p className="valor">R$ {r.valor.toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}