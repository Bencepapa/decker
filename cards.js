// cards.js - Modern Card System Implementation

// ===== BASE CLASSES =====

/**
 * BaseCard - Foundation for all card types
 */
class BaseCard {
    constructor(type, data, options = {}) {
        this.type = type;
        this.data = data;
        this.options = options;
        this.element = null;
        this.eventHandlers = new Map();
        this.animationQueue = [];
        this.isDestroyed = false;
    }
    
    /**
     * Create the DOM element for the card
     */
    createElement() {
        const wrapper = document.createElement('div');
        wrapper.className = `card-wrapper card-type-${this.type}`;
        wrapper.innerHTML = this.render();
        
        this.element = wrapper.firstElementChild;
        this.applyBaseClasses();
        this.bindEvents();
        
        // Trigger entrance animation
        if (this.options.animate !== false) {
            this.animateEntrance();
        }
        
        return wrapper;
    }
    
    /**
     * Apply common base classes to the card element
     */
    applyBaseClasses() {
        if (this.element) {
            this.element.classList.add('card-base', `card-${this.type}`);
            
            // Add state classes based on options
            if (this.options.interactive !== false) {
                this.element.classList.add('card-interactive');
            }
            
            if (this.options.draggable) {
                this.element.classList.add('card-draggable');
                this.element.draggable = true;
            }
            
            if (this.options.disabled) {
                this.element.classList.add('card-disabled');
            }
        }
    }
    
    /**
     * Render the card content - to be overridden by subclasses
     */
    render() {
        return `
            <div class="card-content">
                <div class="card-header">
                    <div class="card-title">${this.data.name || 'Unknown'}</div>
                </div>
                <div class="card-body">
                    <div class="card-description">Base card content</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Bind events - to be overridden by subclasses
     */
    bindEvents() {
        // Common click handling
        if (this.options.onClick) {
            this.element.addEventListener('click', (e) => {
                if (!this.isDestroyed && this.options.onClick) {
                    this.options.onClick(this.data, e);
                }
            });
        }
        
        // Common hover effects
        this.element.addEventListener('mouseenter', () => {
            if (!this.isDestroyed) {
                this.element.classList.add('card-hover');
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            if (!this.isDestroyed) {
                this.element.classList.remove('card-hover');
            }
        });
    }
    
    /**
     * Update card data and re-render
     */
    update(newData) {
        Object.assign(this.data, newData);
        
        if (this.element && this.element.parentElement) {
            const wrapper = this.element.parentElement;
            wrapper.innerHTML = this.render();
            this.element = wrapper.firstElementChild;
            this.applyBaseClasses();
            this.bindEvents();
        }
    }
    
    /**
     * Add animation to queue
     */
    animate(animationType, options = {}) {
        this.animationQueue.push({ type: animationType, options });
        this.processAnimationQueue();
    }
    
    /**
     * Process animation queue
     */
    processAnimationQueue() {
        if (this.animationQueue.length > 0 && this.element) {
            const animation = this.animationQueue.shift();
            
            switch (animation.type) {
                case 'entrance':
                    this.animateEntrance(animation.options);
                    break;
                case 'exit':
                    this.animateExit(animation.options);
                    break;
                case 'highlight':
                    this.animateHighlight(animation.options);
                    break;
                case 'shake':
                    this.animateShake(animation.options);
                    break;
                case 'pulse':
                    this.animatePulse(animation.options);
                    break;
            }
        }
    }
    
    /**
     * Animate card entrance
     */
    animateEntrance(options = {}) {
        if (!this.element) return;
        
        const duration = options.duration || 300;
        const delay = options.delay || 0;
        const type = options.type || 'fadeIn';
        
        this.element.style.animation = `card-${type} ${duration}ms ease-out ${delay}ms`;
        this.element.style.animationFillMode = 'both';
        
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.element.style.animation = '';
                this.element.style.animationFillMode = '';
            }
            this.processAnimationQueue();
        }, duration + delay);
    }
    
    /**
     * Animate card exit
     */
    animateExit(options = {}) {
        if (!this.element) return;
        
        const duration = options.duration || 300;
        const type = options.type || 'fadeOut';
        const callback = options.callback;
        
        this.element.style.animation = `card-${type} ${duration}ms ease-in`;
        this.element.style.animationFillMode = 'both';
        
        setTimeout(() => {
            if (callback) callback();
            this.processAnimationQueue();
        }, duration);
    }
    
    /**
     * Animate card highlight
     */
    animateHighlight(options = {}) {
        if (!this.element) return;
        
        const duration = options.duration || 600;
        const color = options.color || '#0ff';
        
        this.element.style.animation = `card-highlight ${duration}ms ease-in-out`;
        this.element.style.setProperty('--highlight-color', color);
        
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.element.style.animation = '';
            }
            this.processAnimationQueue();
        }, duration);
    }
    
    /**
     * Animate card shake
     */
    animateShake(options = {}) {
        if (!this.element) return;
        
        const duration = options.duration || 500;
        
        this.element.style.animation = `card-shake ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.element.style.animation = '';
            }
            this.processAnimationQueue();
        }, duration);
    }
    
    /**
     * Animate card pulse
     */
    animatePulse(options = {}) {
        if (!this.element) return;
        
        const duration = options.duration || 1000;
        const iterations = options.iterations || 2;
        
        this.element.style.animation = `card-pulse ${duration}ms ease-in-out ${iterations}`;
        
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.element.style.animation = '';
            }
            this.processAnimationQueue();
        }, duration * iterations);
    }
    
    /**
     * Show loading state
     */
    setLoading(isLoading) {
        if (this.element) {
            if (isLoading) {
                this.element.classList.add('card-loading');
                this.animate('pulse', { iterations: 10 });
            } else {
                this.element.classList.remove('card-loading');
            }
        }
    }
    
    /**
     * Set card as disabled/enabled
     */
    setDisabled(disabled) {
        this.options.disabled = disabled;
        if (this.element) {
            if (disabled) {
                this.element.classList.add('card-disabled');
            } else {
                this.element.classList.remove('card-disabled');
            }
        }
    }
    
    /**
     * Cleanup event listeners and references
     */
    destroy() {
        this.isDestroyed = true;
        
        if (this.element && this.element.parentElement) {
            this.animate('exit', {
                callback: () => {
                    this.element.parentElement.remove();
                }
            });
        }
        
        this.eventHandlers.clear();
        this.animationQueue = [];
    }
}

/**
 * CardFactory - Creates and manages card instances
 */
class CardFactory {
    static registeredTypes = new Map();
    static defaultOptions = {};
    
    /**
     * Register a new card type
     */
    static register(type, cardClass, defaultOptions = {}) {
        this.registeredTypes.set(type, cardClass);
        this.defaultOptions[type] = defaultOptions;
    }
    
    /**
     * Create a card instance
     */
    static create(type, data, options = {}) {
        const CardClass = this.registeredTypes.get(type);
        if (!CardClass) {
            throw new Error(`Unknown card type: ${type}. Available types: ${Array.from(this.registeredTypes.keys()).join(', ')}`);
        }
        
        // Merge default options with provided options
        const mergedOptions = { ...this.defaultOptions[type], ...options };
        
        const card = new CardClass(data, mergedOptions);
        return card;
    }
    
    /**
     * Create multiple cards of the same type
     */
    static createBatch(type, dataArray, options = {}) {
        return dataArray.map(data => this.create(type, data, options));
    }
    
    /**
     * Get all registered card types
     */
    static getRegisteredTypes() {
        return Array.from(this.registeredTypes.keys());
    }
    
    /**
     * Check if a card type is registered
     */
    static isRegistered(type) {
        return this.registeredTypes.has(type);
    }
}

// ===== GLOBAL ACCESS =====
window.BaseCard = BaseCard;
window.CardFactory = CardFactory;

// ===== UTILITY FUNCTIONS =====

/**
 * Create a card container with grid layout
 */
function createCardContainer(options = {}) {
    const container = document.createElement('div');
    container.className = 'card-container';
    
    if (options.columns) {
        container.style.gridTemplateColumns = `repeat(${options.columns}, 1fr)`;
    }
    
    if (options.gap) {
        container.style.gap = `${options.gap}px`;
    }
    
    if (options.className) {
        container.classList.add(options.className);
    }
    
    return container;
}

/**
 * Add cards to a container
 */
function addCardsToContainer(container, cards) {
    cards.forEach(card => {
        const cardElement = card.createElement();
        container.appendChild(cardElement);
    });
}

// ===== SPECIFIC CARD IMPLEMENTATIONS =====

/**
 * HardwareCard - Displays hardware items (CPU, chips, etc.)
 */
class HardwareCard extends BaseCard {
    constructor(data, options = {}) {
        super('hardware', data, options);
    }
    
    render() {
        const { name, rating, type } = this.data;
        const iconPath = this.getIconPath(type);
        
        return `
            <div class="card-content">
                <div class="rating-display">
                    <div class="rating-number">${rating || 1}</div>
                </div>
                <div class="hardware-name">${name || 'Unknown Hardware'}</div>
            </div>
        `;
    }
    
    bindEvents() {
        super.bindEvents();
        
        // Hardware-specific click handling
        if (this.options.onSelect) {
            this.element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.options.onSelect(this.data, this);
            });
        }
    }
    
    getIconPath(type) {
        // Map hardware type to icon path
        const iconMap = {
            'CPU': 'img/chip_cpu.png',
            'Coprocessor': 'img/chip_coproc.png',
            'Attack FW': 'img/chip_attack.png',
            'Defense FW': 'img/chip_defense.png',
            'Stealth FW': 'img/chip_stealth.png',
            'Analysis FW': 'img/chip_analysis.png'
        };
        return iconMap[type] || 'img/chip_generic.png';
    }
}

/**
 * ProgramCard - Displays software programs with complex interactions
 */
class ProgramCard extends BaseCard {
    constructor(data, options = {}) {
        super('program', data, options);
        this.dragHandlers = {
            start: this.handleDragStart.bind(this),
            over: this.handleDragOver.bind(this),
            drop: this.handleDrop.bind(this),
            end: this.handleDragEnd.bind(this)
        };
    }
    
    render() {
        const program = this.data;
        const isLoaded = program.m_nLoadedRating > 0;
        const isDefault = this.checkIfDefault(program);
        const iconPos = this.getIconPosition(program.m_nClass);
        
        return `
            <div class="card-content">
                <div class="program-info-row">
                    <div class="program-icon" style="background: url(img/software.png) ${iconPos};"></div>
                    <div class="program-name-large clickable-name">${this.getProgramName(program)}</div>
                </div>
                <div class="program-meta">
                    <span class="program-type-rating">(${g_szProgramClassName[program.m_nClass]} ${program.m_nRating})</span>
                    <span class="program-size-label">Size: ${this.getProgramSize(program)} MP</span>
                </div>
                <div class="program-actions-row">
                    <button class="prog-btn load-btn" data-action="load">${isLoaded ? "Unload" : "Load"}</button>
                    <button class="prog-btn default-btn" data-action="default">${isDefault ? "Undefault" : "Default"}</button>
                    <button class="prog-btn trash-btn" data-action="trash">Trash</button>
                </div>
            </div>
        `;
    }
    
    applyBaseClasses() {
        super.applyBaseClasses();
        
        const program = this.data;
        const isLoaded = program.m_nLoadedRating > 0;
        const isDefault = this.checkIfDefault(program);
        
        if (isLoaded) {
            this.element.classList.add('card-loaded');
        }
        
        if (isDefault) {
            this.element.classList.add('card-default');
        }
    }
    
    bindEvents() {
        super.bindEvents();
        
        // Button events
        this.element.querySelectorAll('.prog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(btn.dataset.action);
            });
        });
        
        // Name click for rename
        this.element.querySelector('.clickable-name').addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRename();
        });
        
        // Drag & drop events
        if (this.options.draggable !== false) {
            // Ensure drag events don't bubble to prevent conflicts
            ['dragstart', 'dragover', 'drop', 'dragend'].forEach(eventType => {
                this.element.addEventListener(eventType, (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                });
            });
            
            this.element.addEventListener('dragstart', this.dragHandlers.start);
            this.element.addEventListener('dragover', this.dragHandlers.over);
            this.element.addEventListener('drop', this.dragHandlers.drop);
            this.element.addEventListener('dragend', this.dragHandlers.end);
        }
    }
    
    handleAction(action) {
        const handlers = {
            'load': () => this.toggleLoad(),
            'default': () => this.toggleDefault(),
            'trash': () => this.trash()
        };
        
        if (handlers[action]) {
            handlers[action]();
        }
    }
    
    toggleLoad() {
        if (this.options.onToggleLoad) {
            this.options.onToggleLoad(this.data, this);
        }
    }
    
    toggleDefault() {
        if (this.options.onToggleDefault) {
            this.options.onToggleDefault(this.data, this);
        }
    }
    
    trash() {
        if (this.options.onTrash) {
            this.animate('shake');
            this.options.onTrash(this.data, this);
        }
    }
    
    handleRename() {
        if (this.options.onRename) {
            this.options.onRename(this.data, this);
        }
    }
    
    handleDragStart(e) {
        console.log('Drag Start:', this.data);
        this.element.classList.add('dragging');
        // Set drag data for HTML5 API
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.options.index);
        // Call callback for data handling, but don't call back to card methods
        if (this.options.onDragStart) {
            this.options.onDragStart(e, this.data, this);
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        console.log('Drag Over:', this.data);
        // Call callback for visual feedback only
        if (this.options.onDragOver) {
            this.options.onDragOver(e, this.data, this);
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        console.log('Drop on:', this.data);
        // Call callback for data handling only
        if (this.options.onDrop) {
            this.options.onDrop(e, this.data, this);
        }
    }
    
    handleDragEnd(e) {
        console.log('Drag End:', this.data);
        this.element.classList.remove('dragging');
        // Call callback for cleanup only
        if (this.options.onDragEnd) {
            this.options.onDragEnd(e, this.data, this);
        }
    }
    
    checkIfDefault(program) {
        return g_pChar && (
            g_pChar.m_pDefAttackProgram === program || 
            g_pChar.m_pDefArmorProgram === program || 
            g_pChar.m_pDefShieldProgram === program || 
            g_pChar.m_pDefHideProgram === program || 
            g_pChar.m_pDefReflectProgram === program
        );
    }
    
    getProgramName(program) {
        return (program.m_szName && program.m_szName !== "") ? 
            program.m_szName : 
            GetSoftwareText(program.m_nClass, program.m_nRating);
    }
    
    getProgramSize(program) {
        return GetProgramSize(program.m_nClass, program.m_nRating);
    }
    
    getIconPosition(programClass) {
        // Map program class to sprite position
        const positions = {
            0: "0 0",      // ATTACK
            1: "-40px 0",  // ATTACK_A  
            2: "-80px 0",  // ATTACK_P
            3: "-120px 0", // SLOW
            4: "-160px 0", // VIRUS
            5: "-200px 0", // SILENCE
            6: "-240px 0", // CONFUSE
            7: "-280px 0", // WEAKEN
            8: "0 -40px",  // SHIELD
            9: "-40px -40px", // SMOKE
            10: "-80px -40px", // DECOY
            11: "-120px -40px", // MEDIC
            12: "-160px -40px", // ARMOR
            13: "-200px -40px", // HIDE
            14: "-240px -40px", // DECEIVE
            15: "-280px -40px", // RELOCATE
        };
        return positions[programClass] || "0 0";
    }
}

/**
 * ShopCard - Displays purchasable items in shop
 */
class ShopCard extends BaseCard {
    constructor(data, options = {}) {
        super('shop', data, options);
    }
    
    render() {
        const { item, currentLevel, price, canAfford } = this.data;
        const iconPath = this.getIconPath(item.type);
        const statusColor = this.getStatusColor(currentLevel);
        
        return `
            <div class="card-content">
                <div class="shop-card-header">
                    <span class="shop-card-title">${item.name}</span>
                </div>
                <div class="shop-card-body">
                    <div class="shop-card-info">
                        <span style="color: ${statusColor}">Current: ${currentLevel || 'None'}</span>
                        <span style="color: ${canAfford ? '#0f0' : '#f00'}">Cost: ${price}cr</span>
                    </div>
                </div>
                <div class="shop-card-footer">
                    <div class="shop-card-icon-container">
                        <img src="${iconPath}" class="modern-shop-icon" alt="${item.type}">
                    </div>
                    <button class="buy-btn" ${!canAfford ? 'disabled' : ''}>Buy</button>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        super.bindEvents();
        
        const buyBtn = this.element.querySelector('.buy-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.data.canAfford && this.options.onBuy) {
                    this.animate('highlight', { color: '#0f0' });
                    this.options.onBuy(this.data, this);
                } else {
                    this.animate('shake');
                }
            });
        }
    }
    
    getStatusColor(level) {
        if (!level) return '#f00';
        if (level >= 5) return '#ff0';
        if (level >= 3) return '#0f0';
        return '#0ff';
    }
    
    getIconPath(type) {
        const iconMap = {
            'software': 'img/icon_software.png',
            'hardware': 'img/icon_hardware.png',
            'chip': 'img/icon_chip.png'
        };
        return iconMap[type] || 'img/icon_generic.png';
    }
}

/**
 * ContractCard - Display available contracts
 */
class ContractCard extends BaseCard {
    constructor(data, options = {}) {
        super('contract', data, options);
    }
    
    render() {
        const { type, pay, target, difficulty, daysLeft } = this.data;
        
        return `
            <div class="card-content">
                <div class="contract-card-header">
                    <div class="contract-card-type">${type}</div>
                    <div class="contract-card-pay">${pay}cr</div>
                </div>
                <div class="contract-card-body">
                    <div class="contract-card-info">
                        <span>Target:</span>
                        <span>${target}</span>
                    </div>
                    <div class="contract-card-info">
                        <span>Difficulty:</span>
                        <span>${difficulty}%</span>
                    </div>
                    <div class="contract-card-info">
                        <span>Deadline:</span>
                        <span>${daysLeft} days</span>
                    </div>
                </div>
                <div class="contract-card-footer">
                    <button class="accept-btn">Accept</button>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        super.bindEvents();
        
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept-btn')) {
                e.stopPropagation();
                if (this.options.onAccept) {
                    this.animate('highlight', { color: '#0f0' });
                    this.options.onAccept(this.data, this);
                }
            } else {
                if (this.options.onView) {
                    this.options.onView(this.data, this);
                }
            }
        });
    }
}

/**
 * CharacterStatCard - Display character statistics (Future use)
 */
class CharacterStatCard extends BaseCard {
    constructor(data, options = {}) {
        super('character-stat', data, options);
    }
    
    render() {
        const { name, value, max, color } = this.data;
        const percentage = max > 0 ? (value / max) * 100 : 0;
        
        return `
            <div class="card-content">
                <div class="stat-name">${name}</div>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${percentage}%; background: ${color || 'linear-gradient(90deg, #0f0, #0ff)'};"></div>
                </div>
                <div class="stat-values">${value}/${max}</div>
            </div>
        `;
    }
    
    updateValue(newValue) {
        this.data.value = newValue;
        this.update(this.data);
    }
}

/**
 * ProjectCard - Display project progress (Future use)
 */
class ProjectCard extends BaseCard {
    constructor(data, options = {}) {
        super('project', data, options);
    }
    
    render() {
        const { name, type, daysLeft, progress } = this.data;
        
        return `
            <div class="card-content">
                <div class="project-header">
                    <span class="project-name">${name}</span>
                    <span class="project-type">${type}</span>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%;"></div>
                    </div>
                    <span class="progress-text">${progress}% - ${daysLeft} days left</span>
                </div>
                <div class="project-actions">
                    <button class="work-btn">Work Day</button>
                    <button class="finish-btn">Finish</button>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        super.bindEvents();
        
        this.element.querySelector('.work-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.options.onWork) {
                this.animate('pulse');
                this.options.onWork(this.data, this);
            }
        });
        
        this.element.querySelector('.finish-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.options.onFinish) {
                this.animate('highlight', { color: '#ff0' });
                this.options.onFinish(this.data, this);
            }
        });
    }
}

// ===== REGISTER CARD TYPES =====
CardFactory.register('hardware', HardwareCard, {
    animate: true,
    interactive: true
});

CardFactory.register('program', ProgramCard, {
    animate: true,
    interactive: true,
    draggable: true
});

CardFactory.register('shop', ShopCard, {
    animate: true,
    interactive: true
});

CardFactory.register('contract', ContractCard, {
    animate: true,
    interactive: true
});

CardFactory.register('character-stat', CharacterStatCard, {
    animate: true,
    interactive: false
});

CardFactory.register('project', ProjectCard, {
    animate: true,
    interactive: true
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        BaseCard, 
        CardFactory, 
        createCardContainer, 
        addCardsToContainer,
        HardwareCard,
        ProgramCard,
        ShopCard,
        ContractCard,
        CharacterStatCard,
        ProjectCard
    };
}