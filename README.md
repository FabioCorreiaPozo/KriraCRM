
# OmniAI CRM - Meta Integration SaaS

Software CRM Omnichannel completo com atendimento humanizado por Inteligência Artificial (Gemini 3) e integração com Meta Cloud API.

## 🚀 Arquitetura Proposta

### Backend (Node.js/FastAPI)
- **Multi-tenant:** Gerenciamento de múltiplas empresas isoladas.
- **Webhook Handler:** Endpoint para receber `messages` do WhatsApp Cloud e Instagram Graph API.
- **Worker de Follow-up:** Task assíncrona que verifica a última interação. Se > 24h e dentro do horário comercial (08h-19h), a IA dispara um "quebra-gelo" para retomar a negociação.

### Inteligência Artificial
- **Classificação de Intenção:** Utiliza LLM para detectar se o lead quer comprar, tem dúvida ou reclamação, movendo-o automaticamente no Kanban.
- **Humanização:** Prompt estruturado para agir como atendente real (Laura), respeitando tom de voz e limites de desconto.

## 🛠 Configuração Webhook (Meta)

1. Vá ao [Meta for Developers](https://developers.facebook.com/).
2. Adicione os produtos **WhatsApp** e **Instagram**.
3. Em Webhooks, selecione `WhatsApp Business Account`.
4. Endpoint: `https://sua-api.com/webhooks/meta`.
5. Verfication Token: `SEU_TOKEN_SEGURO`.
6. Subscreva aos campos: `messages`.

### Exemplo de Prompt Interno (AI Engine)
```
Você é {ai_name}, assistente virtual humanizada de {empresa}. 
Seu tom é {ai_tone}.
Regra 1: Nunca revele ser uma IA.
Regra 2: Utilize estes produtos: {products}.
Regra 3: Se o cliente sumir por 24h, envie um follow-up amigável entre 08:00 e 19:00.
```

## 📦 Como Rodar (Frontend)

1. Instale as dependências: `npm install`.
2. Configure sua chave Gemini no ambiente: `API_KEY=sua_chave`.
3. Rode o projeto: `npm start`.

## 🔒 Segurança
- Autenticação via JWT para atendentes.
- Verificação de Assinatura (X-Hub-Signature) em todos os webhooks da Meta.
- Logs auditáveis de todas as interações IA vs Humano.
