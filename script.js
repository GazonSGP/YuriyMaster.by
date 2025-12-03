// ===== DOM элементы =====
document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Элементы слайдера отзывов
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    
    // Элементы формы
    const orderForm = document.getElementById('orderForm');
    const formMessage = document.getElementById('formMessage');
    const phoneInput = document.getElementById('phone');
    
    // ===== Анимация навигации при скролле =====
    function handleScroll() {
        // Навигационная панель
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
        
        // Анимация появления элементов при скролле (исправленная версия)
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
        
        // Подсветка активного раздела в навигации
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== Плавная прокрутка к разделам =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Закрываем мобильное меню если открыто
                mobileMenu.classList.remove('active');
                
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== Слайдер отзывов (ИСПРАВЛЕННЫЙ) =====
    function showSlide(n) {
        // Скрываем все слайды
        reviewCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Корректируем индекс если вышли за границы
        if (n >= reviewCards.length) currentSlide = 0;
        if (n < 0) currentSlide = reviewCards.length - 1;
        
        // Показываем текущий слайд
        reviewCards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }
    
    // Назначаем обработчики на точки
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            resetSlideInterval();
        });
    });
    
    // Назначаем обработчики на кнопки
    document.querySelector('.slider-prev').addEventListener('click', function() {
        prevSlide();
        resetSlideInterval();
    });
    
    document.querySelector('.slider-next').addEventListener('click', function() {
        nextSlide();
        resetSlideInterval();
    });
    
    // Автопереключение слайдов
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // ===== Мобильное меню =====
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
    });
    
    // ===== Маска для телефона =====
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '+375 (' + value;
            
            if (value.length > 9) {
                value = value.substring(0, 9) + ') ' + value.substring(9);
            }
            if (value.length > 14) {
                value = value.substring(0, 14) + '-' + value.substring(14);
            }
            if (value.length > 17) {
                value = value.substring(0, 17) + '-' + value.substring(17);
            }
            if (value.length > 20) {
                value = value.substring(0, 20);
            }
        }
        
        e.target.value = value;
    });
    
    // ===== Обработка формы =====
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Простая валидация
        if (!data.name || !data.phone) {
            showFormMessage('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        if (data.phone.replace(/\D/g, '').length < 12) {
            showFormMessage('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }
        
        // Имитация отправки формы
        showFormMessage('Заявка отправляется...', 'success');
        
        setTimeout(() => {
            // Показываем успешное сообщение
            showFormMessage('Спасибо! Ваша заявка принята. Я перезвоню вам в течение 30 минут.', 'success');
            
            // Очищаем форму
            orderForm.reset();
        }, 1500);
    });
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // ===== Блестящие эффекты =====
    function createSparkle() {
        const glitterBg = document.querySelector('.glitter-bg');
        
        // Создаем 20 блесток
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            
            // Случайная позиция
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Случайные размеры
            const size = Math.random() * 4 + 1;
            
            // Случайная длительность анимации
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
            // Применяем стили
            sparkle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: twinkle ${duration}s infinite ${delay}s;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            `;
            
            glitterBg.appendChild(sparkle);
        }
    }
    
    // Добавляем CSS для анимации блесток
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
        }
        
        .nav-links a.active {
            color: var(--glam-gold) !important;
        }
        
        .nav-links a.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
    
    // ===== Инициализация =====
    function init() {
        // Инициализация событий скролла
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Вызываем сразу для начального состояния
        
        // Запуск слайдера
        showSlide(currentSlide);
        startSlideInterval();
        
        // Остановка автопереключения при наведении на слайдер
        const slider = document.querySelector('.reviews-slider');
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startSlideInterval);
        
        // Создаем блестки
        createSparkle();
        
        // Кнопка "Наверх"
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Добавляем обработчики для кнопок соцсетей
        document.querySelectorAll('.social-link, .whatsapp-float a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    showFormMessage('Это демо-версия сайта. В реальном проекте здесь будут ссылки на соцсети.', 'success');
                }
            });
        });
        
        // Инициализация всех fade-in элементов
        fadeElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
    }
    
    // Запускаем инициализацию
    init();
    
    // ===== Дополнительные эффекты =====
    // УБРАТЬ параллакс-эффект для героя
    
    // Эффект наведения на карточки услуг
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-15px)';
        });
    });
    
    // Анимация иконок при наведении
    document.querySelectorAll('.service-icon, .step-number').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(15deg) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    });
    
    // Анимация заполнения статистики
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const finalValue = parseInt(statNumber.textContent);
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(currentValue) + (statNumber.textContent.includes('%') ? '%' : '+');
                }, 30);
                
                observer.unobserve(statNumber);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
});