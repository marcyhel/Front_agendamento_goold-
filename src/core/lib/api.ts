import axios from "axios";
import { getSession } from "next-auth/react";

/**
 * Cliente HTTP configurado para comunicação com a API do backend
 */
const api_client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * Interceptor para adicionar token de autenticação em todas as requisições
 */
api_client.interceptors.request.use(
  async (request_config) => {
    // Verifica se está rodando no navegador
    if (typeof window !== "undefined") {
      // Obtém a sessão atual do usuário
      const user_session = await getSession();

      // Adiciona o token de autenticação ao cabeçalho se disponível
      if (user_session?.accessToken) {
        request_config.headers.Authorization = `Bearer ${user_session.accessToken}`;
      }
    }

    return request_config;
  },
  (request_error) => {
    // Propaga erros na requisição
    return Promise.reject(request_error);
  }
);

export default api_client;
