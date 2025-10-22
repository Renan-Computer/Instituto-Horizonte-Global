// script.js - Instituto Horizonte Global
// Funcionalidades principais do site

// =============================================
// CONFIGURAÇÕES GERAIS
// =============================================

const CONFIG = {
    // URLs de APIs (simuladas)
    API_BASE: 'https://api.horizontoglobal.org/v1',
    
    // Configurações de animação
    ANIMATION_DURATION: 600,
    COUNTER_DURATION: 2000,
    
    // Configurações de formulário
    FORM_TIMEOUT: 5000
};

// =============================================
// INICIALIZAÇÃO GERAL
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Instituto Horizonte Global - Inicializando...');
    
    // Inicializar todos os módulos
    initNavigation();
    initAnimations();
    initCounters();
    initForms();
    initAudioVideoPlayers();
    initScrollEffects();
    initContactMap();
    
    console.log('✅ Todos os módulos inicializados com sucesso!');
});

// =============================================
// MÓDULO DE NAVEGAÇÃO
// =============================================

function initNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu && navMenu) {
        // Menu mobile toggle
        mobileMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('show');
            
            // Atualizar ícone
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                mobileMenu.setAttribute('aria-expanded', 'false');
                mobileMenu.querySelector('i').className = 'fas fa-bars';
            });
        });
        
        // Fechar menu ao pressionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                mobileMenu.setAttribute('aria-expanded', 'false');
                mobileMenu.querySelector('i').className = 'fas fa-bars';
                mobileMenu.focus();
            }
        });
    }
    
    // Highlight menu ativo baseado na página atual
    highlightActiveMenu();
}

function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// =============================================
// MÓDULO DE ANIMAÇÕES
// =============================================

function initAnimations() {
    // Configuração do Intersection Observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Elementos para animar
    const animatedElements = [
        '.projeto-card',
        '.impacto-card',
        '.depoimento-card',
        '.playlist-item',
        '.featured-card',
        '.post-card',
        '.pacote-card',
        '.sede-item',
        '.grafico-card',
        '.beneficio-card'
    ];
    
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            prepareElementForAnimation(el);
            animationObserver.observe(el);
        });
    });
}

function prepareElementForAnimation(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease`;
}

function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Efeito cascata para elementos em grid
    if (element.parentElement && element.parentElement.children) {
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        element.style.transitionDelay = `${index * 100}ms`;
    }
}

// =============================================
// MÓDULO DE CONTADORES ANIMADOS
// =============================================

function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const counterSections = document.querySelectorAll('.impacto-grid, .metricas-voluntariado');
    counterSections.forEach(section => counterObserver.observe(section));
}

function startCounters(container) {
    const counters = container.querySelectorAll('.impacto-numero, .metrica-number, .dado-valor');
    
    counters.forEach((counter, index) => {
        const target = parseCounterTarget(counter);
        setTimeout(() => {
            animateCounter(counter, target, CONFIG.COUNTER_DURATION);
        }, index * 300);
    });
}

function parseCounterTarget(counter) {
    const text = counter.textContent;
    
    // Extrair número do texto
    let number = text.replace(/[^\d,.]/g, '');
    
    // Converter para número
    if (number.includes(',')) {
        number = parseFloat(number.replace(',', '').replace('.', ''));
    } else if (number.includes('.')) {
        number = parseFloat(number);
    } else {
        number = parseInt(number);
    }
    
    return isNaN(number) ? 1000 : number;
}

function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toLocaleString();
}

// =============================================
// MÓDULO DE FORMULÁRIOS
// =============================================

function initForms() {
    // Formulário de Contato
    initContactForm();
    
    // Formulário de Voluntariado
    initVolunteerForm();
    
    // Formulário de Doações
    initDonationForm();
    
    // Newsletter
    initNewsletter();
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        initFormValidation(contactForm);
    }
}

function initVolunteerForm() {
    // Navegação entre steps
    const nextButtons = document.querySelectorAll('[onclick^="nextStep"]');
    const prevButtons = document.querySelectorAll('[onclick^="prevStep"]');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('onclick').match(/\d+/)[0]);
            navigateToStep(step);
        });
    });
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('onclick').match(/\d+/)[0]);
            navigateToStep(step);
        });
    });
    
    // Seleção de projetos
    document.querySelectorAll('.projeto-option').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            // Mostrar/ocultar campo de sugestão
            if (this.dataset.projeto === 'sugestao') {
                const sugestaoField = document.getElementById('sugestao-projeto');
                if (sugestaoField) {
                    sugestaoField.style.display = this.classList.contains('selected') ? 'block' : 'none';
                }
            }
        });
    });
}

function initDonationForm() {
    // Seleção de pacotes de doação
    document.querySelectorAll('.pacote-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.pacote-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const pacote = this.dataset.pacote;
            const valor = this.dataset.valor;
            openDonationModal(pacote, valor);
        });
    });
    
    // Botões de doar individual
    document.querySelectorAll('.btn-doar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const pacote = this.dataset.pacote;
            const card = document.querySelector(`.pacote-card[data-pacote="${pacote}"]`);
            const valor = card ? card.dataset.valor : '';
            
            document.querySelectorAll('.pacote-card').forEach(c => c.classList.remove('selected'));
            if (card) card.classList.add('selected');
            
            openDonationModal(pacote, valor);
        });
    });
    
    // Doação personalizada
    const btnPersonalizada = document.getElementById('btn-doacao-personalizada');
    if (btnPersonalizada) {
        btnPersonalizada.addEventListener('click', function() {
            openDonationModal('personalizada', '');
        });
    }
    
    // Modal de pagamento
    initPaymentModal();
}

function initPaymentModal() {
    const modal = document.getElementById('modal-pagamento');
    if (!modal) return;
    
    // Fechar modal
    document.getElementById('close-modal')?.addEventListener('click', closeDonationModal);
    document.getElementById('btn-cancelar')?.addEventListener('click', closeDonationModal);
    
    // Navegação entre steps do modal
    document.getElementById('btn-continuar-pagamento')?.addEventListener('click', function() {
        if (validateDonorData()) {
            showPaymentStep();
        }
    });
    
    document.getElementById('btn-voltar-dados')?.addEventListener('click', showDonorDataStep);
    
    // Tabs de pagamento
    document.querySelectorAll('.pagamento-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const pagamento = this.dataset.pagamento;
            switchPaymentTab(pagamento);
        });
    });
    
    // Copiar chave PIX
    document.querySelector('.copy-btn')?.addEventListener('click', copyPixKey);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDonationModal();
        }
    });
    
    // Máscaras de formulário
    initFormMasks();
}

function initFormMasks() {
    // Máscara de telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    });
    
    // Máscara de CPF/CNPJ
    const cpfInputs = document.querySelectorAll('input[data-validation="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    });
    
    // Máscara de CEP
    const cepInputs = document.querySelectorAll('input[data-cep="true"]');
    cepInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            if (value.length > 9) value = value.slice(0, 9);
            e.target.value = value;
        });
        
        // Buscar endereço automático
        input.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetchCEP(cep, this);
            }
        });
    });
}

function fetchCEP(cep, input) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                showFieldSuccess(input, 'CEP encontrado!');
                // Preencher automaticamente campos de endereço se existirem
                autoFillAddress(data);
            } else {
                showFieldError(input, 'CEP não encontrado');
            }
        })
        .catch(() => {
            showFieldError(input, 'Erro ao buscar CEP');
        });
}

function autoFillAddress(data) {
    const fields = {
        'cidade': data.localidade,
        'estado': data.uf,
        'bairro': data.bairro,
        'logradouro': data.logradouro
    };
    
    Object.keys(fields).forEach(key => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field && !field.value) {
            field.value = fields[key];
        }
    });
}

function initNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                subscribeNewsletter(email, this);
            }
        });
    });
}

// =============================================
// HANDLERS DE FORMULÁRIOS
// =============================================

function handleContactSubmit(e) {
    e.preventDefault();
    
    if (validateForm(e.target)) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        showLoading('Enviando mensagem...');
        
        // Simular envio
        setTimeout(() => {
            hideLoading();
            showSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            e.target.reset();
        }, 2000);
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Validações específicas
            if (field.type === 'email' && !validateEmail(field.value)) {
                showFieldError(field, 'Por favor, insira um e-mail válido');
                isValid = false;
            }
            
            if (field.dataset.validation === 'cpf' && !validateCPF(field.value)) {
                showFieldError(field, 'CPF/CNPJ inválido');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function validateDonorData() {
    return validateForm(document.getElementById('form-doador'));
}

function navigateToStep(step) {
    document.querySelectorAll('.form-step').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.step').forEach(stepEl => stepEl.classList.remove('active'));
    
    document.getElementById(`step${step}`)?.classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`)?.classList.add('active');
    
    // Marcar steps anteriores como completos
    document.querySelectorAll('.step').forEach(stepEl => {
        if (parseInt(stepEl.dataset.step) < step) {
            stepEl.classList.add('completed');
        }
    });
}

function openDonationModal(pacote, valor) {
    const modal = document.getElementById('modal-pagamento');
    const valorInput = document.getElementById('valor-doacao');
    
    if (!modal || !valorInput) return;
    
    if (pacote === 'personalizada') {
        valorInput.removeAttribute('readonly');
        valorInput.value = '';
        valorInput.placeholder = 'Digite o valor desejado';
    } else {
        valorInput.setAttribute('readonly', 'true');
        valorInput.value = `R$ ${valor},00`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showDonorDataStep();
}

function closeDonationModal() {
    const modal = document.getElementById('modal-pagamento');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetDonationForm();
    }
}

function showDonorDataStep() {
    document.getElementById('step-dados')?.classList.add('active');
    document.getElementById('step-pagamento')?.classList.remove('active');
}

function showPaymentStep() {
    document.getElementById('step-dados')?.classList.remove('active');
    document.getElementById('step-pagamento')?.classList.add('active');
}

function switchPaymentTab(pagamento) {
    // Remove active de todas as tabs e conteúdos
    document.querySelectorAll('.pagamento-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pagamento-content').forEach(c => c.classList.remove('active'));
    
    // Adiciona active à tab e conteúdo clicados
    document.querySelector(`.pagamento-tab[data-pagamento="${pagamento}"]`)?.classList.add('active');
    document.getElementById(`content-${pagamento}`)?.classList.add('active');
}

function copyPixKey() {
    const chaveElement = document.getElementById('pix-chave');
    if (chaveElement) {
        const chave = chaveElement.textContent;
        navigator.clipboard.writeText(chave).then(() => {
            showSuccess('Chave PIX copiada para a área de transferência!');
        }).catch(() => {
            showError('Erro ao copiar chave PIX');
        });
    }
}

function resetDonationForm() {
    document.getElementById('form-doador')?.reset();
    showDonorDataStep();
    
    // Reset tabs para PIX
    switchPaymentTab('pix');
    
    // Remove seleção dos cards
    document.querySelectorAll('.pacote-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function subscribeNewsletter(email, form) {
    showLoading('Inscrevendo...');
    
    // Simular API call
    setTimeout(() => {
        hideLoading();
        showSuccess(`Obrigado por se inscrever com o e-mail: ${email}`);
        form.reset();
        
        // Analytics
        trackEvent('newsletter_subscription', { email: email });
    }, 1500);
}

// =============================================
// MÓDULO DE ÁUDIO E VÍDEO
// =============================================

function initAudioVideoPlayers() {
    // Controles da playlist de áudio
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', function() {
            playAudioItem(this);
        });
    });
    
    // Estatísticas de visualização dinâmicas
    updateViewCounts();
    setInterval(updateViewCounts, 30000); // Atualizar a cada 30 segundos
    
    // Analytics para players de mídia
    initMediaAnalytics();
}

function playAudioItem(item) {
    const title = item.querySelector('h4')?.textContent || 'Áudio';
    
    // Adicionar efeito visual de item ativo
    document.querySelectorAll('.playlist-item').forEach(i => {
        i.style.background = 'var(--light)';
        i.style.color = 'var(--text)';
    });
    
    item.style.background = 'var(--primary)';
    item.style.color = 'white';
    
    // Simular play do áudio
    showSuccess(`Reproduzindo: ${title}`);
    
    // Analytics
    trackEvent('audio_play', { title: title });
}

function updateViewCounts() {
    const viewElements = document.querySelectorAll('.fa-eye');
    viewElements.forEach((element, index) => {
        const baseViews = [25000, 18000, 32000][index] || 10000;
        const randomIncrement = Math.floor(Math.random() * 1000);
        const parent = element.parentElement;
        if (parent) {
            parent.textContent = ` ${(baseViews + randomIncrement).toLocaleString()} visualizações`;
        }
    });
}

function initMediaAnalytics() {
    // Track video plays
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('load', function() {
            trackEvent('video_loaded', { src: this.src });
        });
    });
    
    // Track audio interactions
    document.querySelectorAll('audio').forEach(audio => {
        audio.addEventListener('play', function() {
            trackEvent('audio_played', { duration: this.duration });
        });
        
        audio.addEventListener('ended', function() {
            trackEvent('audio_completed', { duration: this.duration });
        });
    });
}

// =============================================
// MÓDULO DE EFEITOS DE SCROLL
// =============================================

function initScrollEffects() {
    // Header transparente no scroll
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Botão "Voltar ao Topo"
    createBackToTopButton();
}

function handleScroll() {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    if (header) {
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    }
    
    // Mostrar/ocultar botão "Voltar ao Topo"
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.style.opacity = scrollY > 500 ? '1' : '0';
        backToTop.style.pointerEvents = scrollY > 500 ? 'auto' : 'none';
    }
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function createBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.setAttribute('aria-label', 'Voltar ao topo');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.background = 'var(--accent)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.background = 'var(--primary)';
    });
    
    document.body.appendChild(button);
}

// =============================================
// MÓDULO DE MAPA DE CONTATO
// =============================================

function initContactMap() {
    // Inicializar mapas interativos se existirem
    const mapLinks = document.querySelectorAll('.map-link');
    mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            trackEvent('map_opened', { location: this.textContent.trim() });
        });
    });
}

// =============================================
// UTILITÁRIOS
// =============================================

// Validações
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Throttle para performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Sistema de notificações
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.global-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `global-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Loading states
function showLoading(message = 'Carregando...') {
    const loading = document.createElement('div');
    loading.id = 'global-loading';
    loading.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>${message}</span>
        </div>
    `;
    
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
    `;
    
    document.body.appendChild(loading);
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.remove();
        document.body.style.overflow = 'auto';
    }
}

// Field validation helpers
function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#e74c3c';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 5px;';
    
    field.parentNode.appendChild(errorElement);
}

function showFieldSuccess(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#27ae60';
    
    const successElement = document.createElement('div');
    successElement.className = 'field-success';
    successElement.textContent = message;
    successElement.style.cssText = 'color: #27ae60; font-size: 0.8rem; margin-top: 5px;';
    
    field.parentNode.appendChild(successElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    const existingSuccess = field.parentNode.querySelector('.field-success');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

// Analytics (simulado)
function trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Event: ${eventName}`, properties);
    }
}

// =============================================
// ANIMAÇÕES CSS ADICIONAIS
// =============================================

const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .loading-spinner {
        text-align: center;
    }
    
    .loading-spinner i {
        font-size: 2rem;
        margin-bottom: 10px;
        display: block;
    }
    
    .field-error, .field-success {
        animation: slideInRight 0.3s ease;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =============================================
// EXPORTAÇÕES PARA USO EXTERNO (se necessário)
// =============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initAnimations,
        initCounters,
        validateEmail,
        validateCPF,
        trackEvent
    };
}