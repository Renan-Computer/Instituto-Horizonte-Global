// ===== FORMULARIOS.JS - Instituto Horizonte Global =====
// Validações customizadas e utilitários de formulário
// Versão: 1.1.0

class CustomValidations {
    constructor() {
        this.masks = new Map();
        this.validators = new Map();
        this.debounceTimers = new Map();
        this.initValidators();
    }

    // ===== INICIALIZAÇÃO =====
    init() {
        this.initCPFValidation();
        this.initCNPJValidation();
        this.initEmailValidation();
        this.initPhoneValidation();
        this.initCEPLookup();
        this.initPasswordStrength();
        this.initFileValidations();
        this.initRealTimeValidation();
        this.initCustomMasks();
        
        console.log('📝 CustomValidations v1.1.0 - Inicializado com sucesso');
    }

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    initRealTimeValidation() {
        // Validação em tempo real com debounce
        document.querySelectorAll('input[data-validation], input[required]').forEach(input => {
            input.addEventListener('input', this.debounce((e) => {
                this.handleRealTimeValidation(e.target);
            }, 500));
        });
    }

    handleRealTimeValidation(input) {
        const validatorType = input.getAttribute('data-validation');
        
        if (validatorType && this.validators.has(validatorType)) {
            this.validateField(input, validatorType);
            return;
        }

        // Validação básica para campos required
        if (input.hasAttribute('required') && !input.value.trim()) {
            this.showFieldError(input, 'Este campo é obrigatório');
        } else if (input.value.trim()) {
            this.clearFieldStatus(input);
        }
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimers.get(func));
            this.debounceTimers.set(func, setTimeout(() => func.apply(this, args), wait));
        };
    }

    // ===== MÁSCARAS PERSONALIZADAS =====
    initCustomMasks() {
        this.initCurrencyMask();
        this.initDateMask();
        this.initPercentageMask();
    }

    initCurrencyMask() {
        document.querySelectorAll('input[data-mask="currency"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyCurrencyMask(e.target);
            });
        });
    }

    applyCurrencyMask(input) {
        let value = input.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+,)/g, '$1.');
        
        if (value === '0,00') {
            input.value = '';
        } else {
            input.value = `R$ ${value}`;
        }
    }

    initDateMask() {
        document.querySelectorAll('input[data-mask="date"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyDateMask(e.target);
            });
        });
    }

    applyDateMask(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
        }
        if (value.length > 5) {
            value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
        }
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        input.value = value;
    }

    initPercentageMask() {
        document.querySelectorAll('input[data-mask="percentage"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyPercentageMask(e.target);
            });
        });
    }

    applyPercentageMask(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 3);
        }
        
        input.value = value ? `${value}%` : '';
    }

    // ===== VALIDAÇÃO DE CPF (OTIMIZADA) =====
    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        // Algoritmo de validação otimizado
        let sum = 0;
        let remainder;
        
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        return { isValid: true, message: 'CPF válido' };
    }

    // ===== VALIDAÇÃO DE CNPJ (OTIMIZADA) =====
    validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
            return { isValid: false, message: 'CNPJ inválido' };
        }
        
        // Tamanho + dígitos
        const size = cnpj.length - 2;
        const numbers = cnpj.substring(0, size);
        const digits = cnpj.substring(size);
        const calc = (x) => {
            const slice = numbers.slice(0, x);
            let factor = x - 7;
            let sum = 0;
            
            for (let i = x; i >= 1; i--) {
                const n = slice[x - i];
                sum += n * factor--;
                if (factor < 2) factor = 9;
            }
            
            const result = 11 - (sum % 11);
            return result > 9 ? 0 : result;
        };
        
        // Validar dígitos
        if (calc(12) !== parseInt(digits.charAt(0)) || 
            calc(13) !== parseInt(digits.charAt(1))) {
            return { isValid: false, message: 'CNPJ inválido' };
        }
        
        return { isValid: true, message: 'CNPJ válido' };
    }

    // ===== VALIDAÇÃO DE TELEFONE MELHORADA =====
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const hasDDD = cleanPhone.length === 11 || cleanPhone.length === 10;
        const isCellphone = cleanPhone.length === 11;
        const isValid = hasDDD && (/^[1-9]{2}/.test(cleanPhone));
        
        if (!isValid) {
            return {
                isValid: false,
                message: 'Digite um telefone válido com DDD'
            };
        }
        
        const type = isCellphone ? 'celular' : 'telefone fixo';
        return {
            isValid: true,
            message: `${type} válido`,
            data: {
                ddd: cleanPhone.substring(0, 2),
                number: cleanPhone.substring(2),
                type: type
            }
        };
    }

    // ===== BUSCA DE CEP MELHORADA =====
    async lookupCEP(input) {
        const cep = input.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            this.showFieldError(input, 'CEP deve ter 8 dígitos');
            return null;
        }
        
        // Verificar se CEP não mudou durante a requisição
        const currentCep = cep;
        
        try {
            this.showFieldLoading(input, 'Buscando CEP...');
            
            // Timeout de 10 segundos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Erro na resposta da API');
            
            const data = await response.json();
            
            // Verificar se o CEP ainda é o mesmo
            if (input.value.replace(/\D/g, '') !== currentCep) {
                return null;
            }
            
            this.hideFieldLoading(input);
            
            if (data.erro) {
                this.showFieldError(input, 'CEP não encontrado');
                return null;
            }
            
            this.fillAddressFields(input, data);
            this.showFieldSuccess(input, 'CEP encontrado');
            
            return data;
            
        } catch (error) {
            this.hideFieldLoading(input);
            
            if (error.name === 'AbortError') {
                this.showFieldError(input, 'Tempo limite excedido');
            } else {
                this.showFieldError(input, 'Erro ao buscar CEP');
            }
            
            console.error('Erro na busca de CEP:', error);
            return null;
        }
    }

    // ===== FORÇA DE SENHA MELHORADA =====
    checkPasswordStrength(input) {
        const password = input.value;
        
        if (!password) {
            this.updatePasswordStrengthMeter(input, 0, []);
            return;
        }
        
        let strength = 0;
        const messages = [];
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };
        
        // Pontuação baseada em critérios
        Object.values(checks).forEach(check => {
            if (check) strength++;
        });
        
        // Bônus por comprimento
        if (password.length >= 12) strength++;
        if (password.length >= 16) strength++;
        
        // Limitar força máxima
        strength = Math.min(strength, 5);
        
        // Mensagens específicas
        if (!checks.length) messages.push('Mínimo 8 caracteres');
        if (!checks.lowercase) messages.push('Letras minúsculas');
        if (!checks.uppercase) messages.push('Letras maiúsculas');
        if (!checks.numbers) messages.push('Números');
        if (!checks.symbols) messages.push('Símbolos especiais');
        
        this.updatePasswordStrengthMeter(input, strength, messages);
    }

    updatePasswordStrengthMeter(input, strength, messages) {
        let meter = input.parentElement.querySelector('.password-strength');
        
        if (!meter) {
            meter = this.createPasswordStrengthMeter(input);
        }
        
        const fill = meter.querySelector('.strength-fill');
        const message = meter.querySelector('.strength-message');
        
        const config = {
            0: { color: '#e74c3c', label: 'Muito Fraca', width: '20%' },
            1: { color: '#e67e22', label: 'Fraca', width: '40%' },
            2: { color: '#f1c40f', label: 'Média', width: '60%' },
            3: { color: '#2ecc71', label: 'Forte', width: '80%' },
            4: { color: '#27ae60', label: 'Muito Forte', width: '95%' },
            5: { color: '#229954', label: 'Excelente', width: '100%' }
        };
        
        const currentConfig = config[strength] || config[0];
        
        fill.style.width = currentConfig.width;
        fill.style.backgroundColor = currentConfig.color;
        
        if (strength === 0) {
            message.textContent = 'Digite uma senha';
        } else if (strength < 3) {
            message.textContent = `${currentConfig.label}. Falta: ${messages.join(', ')}`;
        } else {
            message.textContent = currentConfig.label;
        }
        
        // Adicionar classe de segurança
        meter.className = `password-strength strength-${strength}`;
    }

    // ===== VALIDAÇÃO DE ARQUIVOS MELHORADA =====
    validateSingleFile(file, maxSizeMB, allowedTypes) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        
        // Tamanho
        if (file.size > maxSizeBytes) {
            return {
                isValid: false,
                message: `Arquivo muito grande (${this.formatFileSize(file.size)}). Máximo: ${maxSizeMB}MB`
            };
        }
        
        // Tipo por extensão e MIME type
        if (allowedTypes !== '*') {
            const allowedExtensions = allowedTypes.split(',').map(ext => ext.trim());
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const isTypeValid = allowedExtensions.some(allowed => {
                return file.type.includes(allowed.replace('.', '')) || 
                       allowed === fileExtension ||
                       (allowed.startsWith('.') && fileExtension === allowed);
            });
            
            if (!isTypeValid) {
                return {
                    isValid: false,
                    message: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes}`
                };
            }
        }
        
        return { 
            isValid: true, 
            message: 'Arquivo válido',
            data: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        };
    }

    // ===== NOVOS MÉTODOS UTILITÁRIOS =====
    
    // Limpar status do campo
    clearFieldStatus(input) {
        input.classList.remove('input-error', 'input-success', 'input-loading');
        this.clearFieldMessage(input);
    }

    // Validar múltiplos campos
    validateFields(fields) {
        const results = {};
        let allValid = true;
        
        fields.forEach(field => {
            const validatorType = field.getAttribute('data-validation');
            let result;
            
            if (validatorType && this.validators.has(validatorType)) {
                result = this.validators.get(validatorType)(field.value);
            } else if (field.hasAttribute('required')) {
                result = {
                    isValid: !!field.value.trim(),
                    message: field.value.trim() ? 'Campo preenchido' : 'Este campo é obrigatório'
                };
            } else {
                result = { isValid: true, message: '' };
            }
            
            results[field.name] = result;
            if (!result.isValid) allValid = false;
            
            // Aplicar estilo visual
            if (result.isValid && field.value.trim()) {
                this.showFieldSuccess(field, result.message);
            } else if (!result.isValid) {
                this.showFieldError(field, result.message);
            }
        });
        
        return { allValid, results };
    }

    // Criar validador customizado
    createCustomValidator(name, validatorFn) {
        this.validators.set(name, validatorFn);
        
        // Aplicar a campos existentes
        document.querySelectorAll(`[data-validation="${name}"]`).forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target, name);
            });
        });
    }

    // Validar data
    createDateValidator() {
        this.createCustomValidator('date', (value) => {
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const match = value.match(dateRegex);
            
            if (!match) {
                return { isValid: false, message: 'Formato de data inválido (DD/MM/AAAA)' };
            }
            
            const [, day, month, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            
            if (isNaN(date.getTime()) || 
                date.getDate() !== parseInt(day) || 
                date.getMonth() + 1 !== parseInt(month)) {
                return { isValid: false, message: 'Data inválida' };
            }
            
            // Validar se é data futura (exemplo)
            if (date > new Date()) {
                return { isValid: false, message: 'Data não pode ser futura' };
            }
            
            return { isValid: true, message: 'Data válida' };
        });
    }

    // ===== DESTRUIDOR =====
    destroy() {
        // Limpar todos os event listeners e timers
        this.debounceTimers.forEach((timer, func) => {
            clearTimeout(timer);
        });
        this.debounceTimers.clear();
        
        console.log('🧹 CustomValidations - Recursos limpos');
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
const CustomValidationsManager = new CustomValidations();

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CustomValidationsManager.init();
    });
} else {
    CustomValidationsManager.init();
}

// ===== UTILITÁRIOS GLOBAIS MELHORADOS =====
window.FormUtils = {
    // Gerenciador principal
    manager: CustomValidationsManager,
    
    // Validações básicas
    validate: (form) => CustomValidationsManager.validateForm(form),
    validateFields: (fields) => CustomValidationsManager.validateFields(fields),
    clear: (form) => CustomValidationsManager.clearFormValidation(form),
    serialize: (form) => CustomValidationsManager.serializeForm(form),
    
    // Validações específicas
    validateCPF: (cpf) => CustomValidationsManager.validateCPF(cpf),
    validateCNPJ: (cnpj) => CustomValidationsManager.validateCNPJ(cnpj),
    validateEmail: (email) => CustomValidationsManager.validateEmail(email),
    validatePhone: (phone) => CustomValidationsManager.validatePhone(phone),
    
    // Utilitários avançados
    createValidator: (name, fn) => CustomValidationsManager.createCustomValidator(name, fn),
    lookupCEP: (input) => CustomValidationsManager.lookupCEP(input),
    formatFileSize: (bytes) => CustomValidationsManager.formatFileSize(bytes),
    
    // Máscaras
    applyCurrencyMask: (input) => CustomValidationsManager.applyCurrencyMask(input),
    applyDateMask: (input) => CustomValidationsManager.applyDateMask(input),
    
    // Status dos campos
    showSuccess: (input, message) => CustomValidationsManager.showFieldSuccess(input, message),
    showError: (input, message) => CustomValidationsManager.showFieldError(input, message),
    clearStatus: (input) => CustomValidationsManager.clearFieldStatus(input)
};

// ===== EXPORTAÇÃO PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CustomValidations, FormUtils };
}

// ===== POLYFILL PARA ABORT CONTROLLER =====
if (typeof AbortController === 'undefined') {
    class AbortController {
        constructor() {
            this.signal = new AbortSignal();
        }
        abort() {
            this.signal.aborted = true;
        }
    }
    
    class AbortSignal {
        constructor() {
            this.aborted = false;
        }
    }
    
    window.AbortController = AbortController;
}