import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RotaProtegida({ children }) {
  // Pega o usuário e o estado de loading do nosso contexto global
  const { user, loading } = useAuth();

  // Se ainda estivermos verificando o token, não renderize nada (ou um spinner)
  if (loading) {
    return <div>Verificando autenticação...</div>;
  }

  // Se a verificação terminou e não há usuário, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se houver usuário, renderiza a página solicitada
  return children;
}

export default RotaProtegida;