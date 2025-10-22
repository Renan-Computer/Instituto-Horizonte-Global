// main.js - Instituto Horizonte Global
// Arquivo principal de inicialização e configurações globais

// =============================================
// CONFIGURAÇÕES GLOBAIS
// =============================================

const CONFIG = {
    // URLs de APIs
    API_BASE: 'https://api.horizontoglobal.org/v1',
    
    // Configurações de animação
    ANIMATION_DURATION: 600,
    COUNTER_DURATION: 2000,
    
    // Configurações de performance
    THROTTLE_DELAY: 100,
    DEBOUNCE_DELAY: 300,
    
    // Estados globais
    states: {
        isMobile: window.innerWidth < 768,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        currentPage: window.location.pathname.split('/').pop() || 'index.html'
    }
};

// =============================================
// INICIALIZAÇÃO PRINCIPAL
// =============================================

class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        console.log('🌍 Instituto Horizonte Global - Inicializando aplicação...');
        
        // Detectar ambiente
        this.detectEnvironment();
        
        // Inicializar módulos base
        this.initCoreModules();
        
        // Inicializar módulos específicos da página
        this.initPageSpecificModules();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    }

    detectEnvironment() {
        // Detectar dispositivo
        CONFIG.states.isMobile = window.innerWidth < 768;
        
        // Detectar preferência por movimento reduzido
        CONFIG.states.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Log de ambiente
        console.log(`📱 Dispositivo: ${CONFIG.states.isMobile ? 'Mobile' : 'Desktop'}`);
        console.log(`🎭 Movimento reduzido: ${CONFIG.states.prefersReducedMotion ? 'Sim' : 'Não'}`);
    }

    initCoreModules() {
        // Módulos que sempre devem ser carregados
        const coreModules = [
            'navigation',
            'animations',
            'performance',
            'accessibility'
        ];

        coreModules.forEach(moduleName => {
            try {
                this.loadModule(moduleName);
            } catch (error) {
                console.warn(`⚠️ Módulo ${moduleName} não pôde ser carregado:`, error);
            }
        });
    }

    initPageSpecificModules() {
        const pageModules = {
            'index.html': ['counters', 'testimonials'],
            'sobre.html': ['timeline', 'team'],
            'projetos.html': ['filters', 'modals'],
            'voluntariado.html': ['forms', 'steps'],
            'doacoes.html': ['donations', 'payment'],
            'transparencia.html': ['charts', 'tables'],
            'blog.html': ['search', 'pagination'],
            'contato.html': ['maps', 'forms']
        };

        const currentPageModules = pageModules[CONFIG.states.currentPage] || [];
        
        currentPageModules.forEach(moduleName => {
            try {
                this.loadModule(moduleName);
            } catch (error) {
                console.warn(`⚠️ Módulo ${moduleName} não pôde ser carregado:`, error);
            }
        });
    }

    loadModule(moduleName) {
        // Simular carregamento de módulo
        // Em produção, isso seria feito com import() dinâmico
        console.log(`📦 Carregando módulo: ${moduleName}`);
        
        switch(moduleName) {
            case 'navigation':
                this.modules.navigation = new Navigation();
                break;
            case 'animations':
                this.modules.animations = new Animations();
                break;
            case 'counters':
                this.modules.counters = new Counters();
                break;
            case 'charts':
                this.modules.charts = new Charts();
                break;
            case 'forms':
                this.modules.forms = new Forms();
                break;
            // Outros módulos...
        }
    }

    setupGlobalEvents() {
        // Eventos de redimensionamento
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), CONFIG.THROTTLE_DELAY));
        
        // Eventos de scroll
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), CONFIG.THROTTLE_DELAY));
        
        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Prevenir comportamentos indesejados
        this.preventUnwantedBehaviors();
    }

    // =============================================
    // MANIPULADORES DE EVENTOS GLOBAIS
    // =============================================

    handleResize() {
        CONFIG.states.isMobile = window.innerWidth < 768;
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('app:resize', {
            detail: { isMobile: CONFIG.states.isMobile }
        }));
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('app:scroll', {
            detail: { scrollY }
        }));
    }

    handleKeydown(event) {
        // Navegação por teclado
        if (event.key === 'Escape') {
            this.handleEscapeKey(event);
        }
        
        // Atalhos de teclado
        if (event.ctrlKey || event.metaKey) {
            this.handleKeyboardShortcuts(event);
        }
    }

    handleEscapeKey(event) {
        // Fechar modais abertos
        const openModals = document.querySelectorAll('.modal.active');
        if (openModals.length > 0) {
            event.preventDefault();
            openModals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    handleKeyboardShortcuts(event) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                window.location.href = 'index.html';
                break;
            case '2':
                event.preventDefault();
                window.location.href = 'sobre.html';
                break;
            case '3':
                event.preventDefault();
                window.location.href = 'projetos.html';
                break;
            case '/':
                event.preventDefault();
                this.focusSearch();
                break;
        }
    }

    focusSearch() {
        const searchInput = document.querySelector('.search-input, [type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    preventUnwantedBehaviors() {
        // Prevenir submit de formulários sem ação
        document.addEventListener('submit', (e) => {
            if (e.target.method === 'dialog') {
                e.preventDefault();
            }
        });
        
        // Prevenir contexto menu em elementos interativos
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.interactive-element')) {
                e.preventDefault();
            }
        });
    }

    // =============================================
    // UTILITÁRIOS GLOBAIS
    // =============================================

    throttle(func, limit) {
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

    debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // =============================================
    // API DE COMUNICAÇÃO ENTRE MÓDULOS
    // =============================================

    // Registrar módulo
    registerModule(name, module) {
        this.modules[name] = module;
        console.log(`✅ Módulo registrado: ${name}`);
    }

    // Obter módulo
    getModule(name) {
        return this.modules[name];
    }

    // Disparar evento global
    emit(eventName, data) {
        window.dispatchEvent(new CustomEvent(`app:${eventName}`, {
            detail: data
        }));
    }

    // Escutar eventos globais
    on(eventName, callback) {
        window.addEventListener(`app:${eventName}`, (event) => {
            callback(event.detail);
        });
    }

    // =============================================
    // GERENCIAMENTO DE ESTADO GLOBAL
    // =============================================

    setState(key, value) {
        CONFIG.states[key] = value;
        this.emit('stateChange', { key, value });
    }

    getState(key) {
        return CONFIG.states[key];
    }

    // =============================================
    // SISTEMA DE LOGGING
    // =============================================

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const styles = {
            info: 'color: #3498db;',
            success: 'color: #27ae60;',
            warning: 'color: #f39c12;',
            error: 'color: #e74c3c;'
        };

        console.log(`%c[${timestamp}] ${message}`, styles[type]);
    }

    error(message, error) {
        this.log(`ERROR: ${message}`, 'error');
        if (error) console.error(error);
        
        // Enviar para serviço de tracking em produção
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: message,
                fatal: false
            });
        }
    }
}

// =============================================
// MÓDULO DE NAVEGAÇÃO
// =============================================

class Navigation {
    constructor() {
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navMenu = document.querySelector('nav ul');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.highlightActiveMenu();
        this.setupKeyboardNavigation();
    }

    setupMobileMenu() {
        if (this.mobileMenu && this.navMenu) {
            this.mobileMenu.addEventListener('click', () => this.toggleMobileMenu());
            
            // Fechar menu ao clicar em links
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Fechar menu ao pressionar Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('show')) {
                    this.closeMobileMenu();
                    this.mobileMenu.focus();
                }
            });
        }
    }

    toggleMobileMenu() {
        const isExpanded = this.mobileMenu.getAttribute('aria-expanded') === 'true';
        this.mobileMenu.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('show');

        // Atualizar ícone
        const icon = this.mobileMenu.querySelector('i');
        if (icon) {
            icon.className = this.navMenu.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('show');
        this.mobileMenu.setAttribute('aria-expanded', 'false');
        this.mobileMenu.querySelector('i').className = 'fas fa-bars';
    }

    highlightActiveMenu() {
        const currentPage = CONFIG.states.currentPage;
        document.querySelectorAll('nav a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupKeyboardNavigation() {
        // Navegação por tab nos menus
        const menuItems = document.querySelectorAll('nav a');
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextItem = menuItems[index + 1] || menuItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                    prevItem.focus();
                }
            });
        });
    }
}

// =============================================
// MÓDULO DE ANIMAÇÕES
// =============================================

class Animations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if (CONFIG.states.prefersReducedMotion) {
            console.log('🎭 Animações desativadas (preferência por movimento reduzido)');
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos animáveis
        const animatedSelectors = [
            '.projeto-card',
            '.impacto-card',
            '.depoimento-card',
            '.featured-card',
            '.post-card',
            '.pacote-card',
            '.sede-item',
            '.grafico-card',
            '.beneficio-card'
        ];

        animatedSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.prepareElementForAnimation(el);
                this.observer.observe(el);
            });
        });
    }

    prepareElementForAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${CONFIG.ANIMATION_DURATION}ms ease, transform ${CONFIG.ANIMATION_DURATION}ms ease`;
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Efeito cascata para elementos em grid
        if (element.parentElement && element.parentElement.children) {
            const siblings = Array.from(element.parentElement.children);
            const index = siblings.indexOf(element);
            element.style.transitionDelay = `${index * 100}ms`;
        }
    }

    setupScrollAnimations() {
        // Header transparente no scroll
        window.addEventListener('app:scroll', (detail) => {
            this.handleHeaderScroll(detail.scrollY);
        });

        // Botão "Voltar ao Topo"
        this.createBackToTopButton();
    }

    handleHeaderScroll(scrollY) {
        const header = document.querySelector('header');
        if (header) {
            if (scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'white';
                header.style.backdropFilter = 'none';
            }
        }
    }

    createBackToTopButton() {
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
            pointer-events: none;
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

        // Mostrar/ocultar baseado no scroll
        window.addEventListener('app:scroll', (detail) => {
            button.style.opacity = detail.scrollY > 500 ? '1' : '0';
            button.style.pointerEvents = detail.scrollY > 500 ? 'auto' : 'none';
        });
    }
}

// =============================================
// MÓDULO DE PERFORMANCE
// =============================================

class Performance {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.setupResourceOptimization();
    }

    setupPerformanceMonitoring() {
        // Monitorar Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.observeLargestContentfulPaint();
            this.observeCumulativeLayoutShift();
            this.observeFirstInputDelay();
        }

        // Monitorar tempo de carregamento
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            this.logPerformanceMetrics();
        });
    }

    observeLargestContentfulPaint() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeCumulativeLayoutShift() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    observeFirstInputDelay() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.fid = entry.processingStart - entry.startTime;
                break;
            }
        });
        observer.observe({ entryTypes: ['first-input'] });
    }

    logPerformanceMetrics() {
        console.group('📊 Métricas de Performance');
        console.log(`⏱️ Tempo de carregamento: ${this.metrics.loadTime?.toFixed(2)}ms`);
        console.log(`🎯 LCP: ${this.metrics.lcp?.toFixed(2)}ms`);
        console.log(`📐 CLS: ${this.metrics.cls?.toFixed(4)}`);
        console.log(`⚡ FID: ${this.metrics.fid?.toFixed(2)}ms`);
        console.groupEnd();

        // Enviar para analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', this.metrics);
        }
    }

    setupResourceOptimization() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Preconnect para domínios importantes
        this.setupResourceHints();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupResourceHints() {
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = true;
            document.head.appendChild(link);
        });
    }
}

// =============================================
// MÓDULO DE ACESSIBILIDADE
// =============================================

class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.setupFocusManagement();
        this.setupSkipLinks();
        this.setupAriaLiveRegions();
        this.setupReducedMotion();
    }

    setupFocusManagement() {
        // Manter foco dentro de modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.querySelector('.modal.active')) {
                this.trapFocus(e);
            }
        });

        // Foco visível melhorado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    trapFocus(event) {
        const modal = document.querySelector('.modal.active');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }

    setupSkipLinks() {
        // Criar skip link se não existir
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Pular para o conteúdo principal';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }

    setupAriaLiveRegions() {
        // Criar regiões ARIA live para atualizações dinâmicas
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    setupReducedMotion() {
        if (CONFIG.states.prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    announce(message, priority = 'polite') {
        const liveRegion = document.querySelector('[aria-live]');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
}

// =============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.App = new App();
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, CONFIG };
}