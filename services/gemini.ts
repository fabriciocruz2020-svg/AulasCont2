
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAudit = async (
  currentTransaction: any, 
  accounts: any[], 
  errorDescription?: string
) => {
  try {
    const prompt = `
      Você é um Auditor Contábil Sênior e tutor pedagógico.
      Contexto: O usuário está tentando realizar um lançamento contábil em um app de ensino.
      
      Transação Atual Tentada: ${JSON.stringify(currentTransaction)}
      Contas Disponíveis e Saldos: ${JSON.stringify(accounts)}
      ${errorDescription ? `Erro Detectado pelo Sistema: ${errorDescription}` : ""}

      Instruções:
      1. NÃO dê a resposta pronta imediatamente.
      2. Explique a lógica por trás do erro ou do conceito envolvido.
      3. Use a analogia de "Origem" e "Aplicação" de recursos.
      4. Se o usuário creditou um Ativo quando deveria debitar, explique que "Crédito em Ativo significa que o recurso está SAINDO dessa conta".
      5. Seja encorajador e profissional.
      6. Responda em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Erro no Auditor IA:", error);
    return "O auditor está ocupado revisando os livros. Tente novamente em breve.";
  }
};
