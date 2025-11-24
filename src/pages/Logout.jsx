import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    
    // 🚨 CHAVE DE USUÁRIO: Obtém o email do usuário antes de limpar, 
    // caso você precise de chaves específicas de saldo (saldo_email@exemplo.com)
    const userEmail = localStorage.getItem("userEmailLogado"); 

    useEffect(() => {
        // 1. Limpa a chave de sessão do usuário
        localStorage.removeItem("userEmailLogado"); 
        
        // 2. Opcional: Se você tiver salvo o saldo numa chave específica do usuário
        if (userEmail) {
            localStorage.removeItem(`saldo_${userEmail}`);
        }
        
        // 3. Redireciona para a tela de login
        // 'replace: true' evita que o usuário volte para o dashboard com o botão "Voltar"
        navigate("/login", { replace: true }); 
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executa apenas uma vez ao montar o componente

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Saindo...</h2>
            <p>Seus dados foram salvos e sua sessão está sendo encerrada.</p>
        </div>
    );
}