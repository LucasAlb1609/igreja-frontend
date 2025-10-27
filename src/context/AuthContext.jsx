import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API_URL from '../services/api';

// 1. Cria o Contexto com um valor padrão 'undefined' para garantir que seja usado dentro do Provider
const AuthContext = createContext(undefined);

// 2. Cria o Provedor (Provider) com a lógica de autenticação aprimorada
export function AuthProvider({ children }) {
  // Inicializa os estados como 'null' para garantir um estado limpo no início
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de loading para a verificação inicial

  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authTokens', JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      navigate('/dashboard');
    } else {
      throw new Error('Nome de usuário ou senha inválidos.');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
    navigate('/');
  };

  // 3. Efeito que roda APENAS UMA VEZ para verificar se há um token válido no localStorage
  useEffect(() => {
    const tokens = localStorage.getItem('authTokens');
    if (tokens) {
      const parsedTokens = JSON.parse(tokens);
      const decodedToken = jwtDecode(parsedTokens.access);
      
      // Verifica se o token expirou (a data de expiração é em segundos)
      const isExpired = Date.now() >= decodedToken.exp * 1000;

      if (!isExpired) {
        setAuthTokens(parsedTokens);
        setUser(decodedToken);
      } else {
        // Se o token estiver expirado, limpa tudo
        logoutUser();
      }
    }
    // Finaliza o loading após a verificação inicial
    setLoading(false);
  }, []); // O array vazio [] garante que este efeito rode apenas na montagem inicial

  const contextData = {
    user,
    authTokens,
    loading,
    loginUser,
    logoutUser,
  };

  // Não renderiza o resto da aplicação até a verificação inicial do token terminar
  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook customizado aprimorado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};