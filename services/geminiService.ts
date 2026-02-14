
import { GoogleGenAI, Type } from "@google/genai";
import { AISettings, Product, Message, Lead, Sender, KanbanStage, InstagramPost } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private model = 'gemini-3-flash-preview';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Generates a humanized response based on business context and requests missing data
   */
  async generateResponse(
    settings: AISettings,
    products: Product[],
    history: Message[],
    clientMessage: string,
    lead: Lead,
    contextPost?: InstagramPost
  ): Promise<string> {
    const productsList = products
      .filter(p => p.active)
      .map(p => `- ${p.name}: R$ ${p.price} (${p.description})`)
      .join('\n');

    const conversationHistory = history
      .slice(-10)
      .map(m => `${m.sender === Sender.CLIENT ? 'Cliente' : 'Você'}: ${m.content}`)
      .join('\n');

    // Logic to identify which data is missing for the final registration
    const missingFields = [];
    if (!lead.name || lead.name.includes('WhatsApp')) missingFields.push('nome completo');
    if (!lead.email) missingFields.push('e-mail');
    if (!lead.birthday) missingFields.push('data de nascimento');
    if (!lead.address) missingFields.push('endereço para entrega/medição');

    const dataCollectionInstruction = missingFields.length > 0 
      ? `\nSTATUS DO CADASTRO: Faltam os seguintes dados: ${missingFields.join(', ')}. 
         Apenas quando o cliente demonstrar que a dúvida principal foi sanada ou estiver pronto para avançar, solicite esses dados de forma natural e acolhedora.`
      : '\nSTATUS DO CADASTRO: Cliente já possui cadastro completo.';

    const systemInstruction = `
      Você é ${settings.ai_name}, especialista em móveis e decoração da MóveisIA.
      Seu tom é ${settings.ai_tone}.
      Postura: ${settings.ai_behavior_prompt}.
      
      REGRAS DE OURO:
      1. NUNCA diga que é uma IA.
      2. Seja empática e consultiva.
      3. Você pode oferecer estes móveis: ${productsList}.
      4. Limite de desconto máximo: ${settings.max_discount_percent}%.
      ${dataCollectionInstruction}
      5. No final da conversa, SEMPRE certifique-se de que temos o Nome, E-mail, Endereço e Data de Nascimento para o CRM.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Histórico:\n${conversationHistory}\n\nCliente: ${clientMessage}\nResposta Sugerida:`,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "Olá! Como posso ajudar a transformar seu lar hoje?";
    } catch (error) {
      console.error("AI Error:", error);
      return "Olá! Sou a Malu da MóveisIA. Tivemos uma pequena oscilação no sinal, mas estou aqui! Como posso te ajudar?";
    }
  }

  /**
   * Generates a creative Instagram caption for a product
   */
  async generateInstagramCaption(product: Product): Promise<string> {
    const systemInstruction = `
      Você é um Social Media Manager de elite especializado em móveis de luxo e decoração.
      Crie uma legenda cativante, elegante e persuasiva para o Instagram.
      Use emojis de forma sofisticada e inclua 5 hashtags relevantes ao final.
      Foque nos benefícios emocionais do produto: conforto, elegância, status e bem-estar.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Crie uma legenda para este produto:
          Nome: ${product.name}
          Descrição: ${product.description}
          Preço: R$ ${product.price}
          Categoria: ${product.category}`,
        config: { systemInstruction, temperature: 0.8 }
      });
      return response.text?.trim() || `Conheça nosso(a) ${product.name}. Elegância e conforto para sua casa! ✨`;
    } catch (error) {
      return `Conheça nosso(a) ${product.name}. Elegância e conforto para sua casa! ✨`;
    }
  }

  /**
   * Free grammar correction and text suggestion for attendants
   */
  async correctAndSuggestText(
    inputText: string,
    history: Message[],
    settings: AISettings
  ): Promise<string> {
    const systemInstruction = `
      Você é um revisor de texto de elite para CRMs de luxo. 
      Corrija a gramática e melhore a fluidez do texto do atendente em Português do Brasil.
      Mantenha o tom: ${settings.ai_tone}.
      Retorne APENAS o texto corrigido.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Texto original: "${inputText}"`,
        config: { systemInstruction, temperature: 0.3 }
      });
      return response.text?.trim() || inputText;
    } catch (error) {
      return inputText;
    }
  }

  /**
   * Analyzes intent and product interest
   */
  async classifyIntent(
    message: string, 
    stages: KanbanStage[]
  ): Promise<{ stage_id: string | null; interest: string | null }> {
    const prompt = `
      Analise a mensagem do cliente de uma loja de móveis.
      Etapas do Funil: ${stages.map(s => `${s.id}: ${s.name}`).join(', ')}.
      
      Retorne um JSON com:
      - target_stage_id: ID da etapa mais adequada.
      - detected_interest: Nome do móvel ou categoria mencionada.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Mensagem: "${message}"\n${prompt}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              target_stage_id: { type: Type.STRING },
              detected_interest: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch {
      return { stage_id: null, interest: null };
    }
  }
}
