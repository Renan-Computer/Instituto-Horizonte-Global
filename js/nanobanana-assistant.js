// nanobanana-assistant.js
class NanoBananaAssistant {
    constructor() {
        this.config = {
            apiKey: 'SUA_API_KEY_NANOBANANA',
            model: 'balanced',
            maxTokens: 800,
            temperature: 0.7
        };
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    createChatbotHTML() {
        const chatbotHTML = `
        <div id="nanobanana-chatbot">
            <!-- Container do Chat -->
            <div id="chat-container" class="chat-container">
                <!-- Cabeçalho -->
                <div class="chat-header">
                    <div class="header-info">
                        <i class="fas fa-globe-americas"></i>
                        <div>
                            <h4>Instituto Horizonte Global</h4>
                            <small>Assistente Virtual</small>
                        </div>
                    </div>
                    <button id="close-chat" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Mensagens -->
                <div id="chat-messages" class="chat-messages">
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Olá! Sou o assistente do Instituto Horizonte Global. Posso ajudar com:</p>
                            <ul>
                                <li>📋 Informações sobre projetos</li>
                                <li>💚 Como ser voluntário</li>
                                <li>💰 Fazer doações</li>
                                <li>🌍 Nossa expansão global</li>
                            </ul>
                            <small>Como posso ajudar você hoje?</small>
                        </div>
                    </div>
                </div>

                <!-- Input -->
                <div class="chat-input-container">
                    <div class="input-group">
                        <input type="text" id="user-input" placeholder="Digite sua mensagem..." class="chat-input">
                        <button id="send-message" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="quick-actions">
                        <button class="quick-btn" data-question="Quais projetos vocês desenvolvem?">
                            📋 Projetos
                        </button>
                        <button class="quick-btn" data-question="Como ser voluntário?">
                            💚 Voluntariado
                        </button>
                        <button class="quick-btn" data-question="Como fazer doação?">
                            💰 Doações
                        </button>
                    </div>
                </div>
            </div>

            <!-- Botão Flutuante -->
            <button id="chat-toggle" class="chat-toggle-btn">
                <i class="fas fa-comments"></i>
                <span class="notification-dot"></span>
            </button>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    async generateResponse(userMessage) {
        try {
            const context = this.getPageContext();
            const prompt = this.buildPrompt(userMessage, context);

            const response = await fetch('https://api.nanobanana.ai/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        {
                            role: "system",
                            content: `Você é um assistente especializado do Instituto Horizonte Global. 
                                    Use informações específicas da ONG e seja empático.`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('Erro NanoBanana:', error);
            return "Desculpe, estou com dificuldades no momento. Você pode entrar em contato pelo email contato@horizontoglobal.org ou telefone (81) 3333-3333";
        }
    }

    getPageContext() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        const contexts = {
            'index.html': 'Página inicial - Transformando vidas, projetos em destaque, impacto social',
            'sobre.html': 'Sobre nós - História, missão, valores, expansão global 2025-2030',
            'projetos.html': 'Projetos - Educação Infantil, Juventude Conectada, Energia Solar, Agricultura Sustentável',
            'voluntariado.html': 'Voluntariado - Como participar, oportunidades, benefícios',
            'doacoes.html': 'Doações - Formas de doar, transparência, impacto do recurso',
            'transparencia.html': 'Transparência - Prestação de contas, relatórios, governança',
            'contato.html': 'Contato - Formulário, endereço, telefone, email'
        };

        return contexts[page] || 'Site do Instituto Horizonte Global';
    }

    buildPrompt(userMessage, context) {
        return `CONTEXTO DA ONG:
        Instituto Horizonte Global - 16 anos transformando vidas
        Fundado em 2009 no Sertão pernambucano (Petrolina-PE)
        Projetos: Educação Infantil, Juventude Conectada, Energia Solar Comunitária, Agricultura Sustentável
        Impacto: 45.320+ pessoas, 80+ comunidades, 2.847 voluntários, 15.200+ crianças educadas
        Expansão global: 2025 (África), 2027 (Oriente Médio), 2028 (Suíça), 2029 (Ásia)
        Valores: Transparência, sustentabilidade, empoderamento comunitário

        PÁGINA ATUAL: ${context}

        PERGUNTA DO USUÁRIO: ${userMessage}

        Responda de forma útil, precisa e alinhada com os valores da ONG. Seja empático e ofereça informações concretas.`;
    }

    attachEventListeners() {
        // Toggle chat
        document.getElementById('chat-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('close-chat').addEventListener('click', () => this.toggleChat());

        // Enviar mensagem
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Ações rápidas
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                document.getElementById('user-input').value = question;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chat-container');
        const toggleBtn = document.getElementById('chat-toggle');

        if (this.isOpen) {
            container.style.display = 'block';
            toggleBtn.classList.add('active');
            document.getElementById('user-input').focus();
        } else {
            container.style.display = 'none';
            toggleBtn.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        const typingIndicator = this.showTypingIndicator();

        try {
            const response = await this.generateResponse(message);
            typingIndicator.remove();
            this.addMessage(response, 'bot');
        } catch (error) {
            typingIndicator.remove();
            this.addMessage(this.getFallbackResponse(), 'bot');
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        
        typingDiv.className = 'message bot-message typing';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    getFallbackResponse() {
        const fallbacks = [
            "Desculpe, não consegui processar sua pergunta. Você pode reformular?",
            "Estou com dificuldades técnicas. Entre em contato: contato@horizontoglobal.org",
            "Vamos tentar novamente? Pode reformular sua pergunta?",
            "No momento, prefiro que você entre em contato diretamente: (81) 3333-3333"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    saveChatHistory() {
        // Salva histórico localmente (opcional)
        const messages = document.getElementById('chat-messages').innerHTML;
        localStorage.setItem('nanobanana_chat_history', messages);
    }

    loadChatHistory() {
        // Carrega histórico salvo (opcional)
        const saved = localStorage.getItem('nanobanana_chat_history');
        if (saved) {
            document.getElementById('chat-messages').innerHTML = saved;
        }
    }
}

// Inicialização automática quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new NanoBananaAssistant();
});