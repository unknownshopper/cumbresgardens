// Toggle menú móvil
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Toggle dropdown en móvil
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (menuToggle && navMenu && !e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
    }
});

// ============ SLIDER DE IMÁGENES ============
class ImageSlider {
    constructor(container) {
        this.container = container;
        this.gallery = container.querySelector('.image-gallery');
        this.images = container.querySelectorAll('.gallery-image');
        this.currentIndex = 0;
        this.totalImages = this.images.length;
        
        if (this.totalImages === 0) return;
        
        this.init();
    }
    
    init() {
        // Crear controles
        this.createControls();
        this.createIndicators();
        this.createCounter();
        
        // Event listeners
        this.addEventListeners();
        
        // Mostrar primera imagen
        this.updateSlider();
    }
    
    createControls() {
        // Botón anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');
        
        // Botón siguiente
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');
        
        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);
        
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    }
    
    createIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        
        for (let i = 0; i < this.totalImages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.index = i;
            indicatorsContainer.appendChild(indicator);
        }
        
        this.container.appendChild(indicatorsContainer);
        this.indicators = indicatorsContainer.querySelectorAll('.indicator');
    }
    
    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        this.container.appendChild(counter);
        this.counter = counter;
    }
    
    addEventListeners() {
        // Botones
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Indicadores
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch/Swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.next();
            if (touchEndX > touchStartX + 50) this.prev();
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.updateSlider();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }
    
    updateSlider() {
        // Mover galería
        const offset = -this.currentIndex * 100;
        this.gallery.style.transform = `translateX(${offset}%)`;
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        // Actualizar contador
        this.counter.textContent = `${this.currentIndex + 1} / ${this.totalImages}`;
    }
}

// Inicializar slider si existe
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        new ImageSlider(sliderContainer);
    }
});


// ============ MODAL DE CONTACTO ============
const contactModal = document.getElementById('contactModal');
const openModalBtn = document.getElementById('openContactModal');
const closeModalBtn = document.querySelector('.close-modal');

if (openModalBtn && contactModal) {
    // Abrir modal
    openModalBtn.addEventListener('click', () => {
        contactModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    });
    
    // Cerrar modal con X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('show')) {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}


// ============ AUDIO DE FONDO ============
const bgAudio = document.getElementById('bgAudio');
const audioControl = document.getElementById('audioControl');
const audioIcon = document.getElementById('audioIcon');

if (bgAudio && audioControl) {
    let isPlaying = false;
    
    // Intentar reproducir automáticamente
    const playAudio = () => {
        bgAudio.play()
            .then(() => {
                isPlaying = true;
                audioControl.classList.remove('muted');
            })
            .catch((error) => {
                console.log('Autoplay bloqueado por el navegador:', error);
                isPlaying = false;
                audioControl.classList.add('muted');
            });
    };
    
    // Intentar reproducir al cargar
    playAudio();
    
    // También intentar al primer clic en la página
    document.addEventListener('click', function initAudio() {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener('click', initAudio);
    }, { once: true });
    
    // Control manual del audio
    audioControl.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (bgAudio.paused) {
            bgAudio.play();
            isPlaying = true;
            audioControl.classList.remove('muted');
        } else {
            bgAudio.pause();
            isPlaying = false;
            audioControl.classList.add('muted');
        }
    });
    
    // Ajustar volumen (opcional, puedes cambiar el valor)
    bgAudio.volume = 0.3; // 30% del volumen máximo
}