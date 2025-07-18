function initializeUI(updateView) {
    // --- Referencias a elementos del DOM ---
    const sidebar = document.querySelector('.sidebar-nav');
    const menuToggleButton = document.getElementById('menu-toggle');
    const contentWrapper = document.querySelector('.content-wrapper');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    const focusModeToggle = document.getElementById('focus-mode-toggle');
    const mainTitle = document.querySelector('.welcome-box h2');
    const scrollContainer = document.getElementById('career-selection');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    const floatingSaveBtn = document.getElementById('floating-save-btn');

    // Evento para el botón de menú
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            contentWrapper.classList.toggle('sidebar-active');
        });
    }

    // Eventos para la navegación de la barra lateral
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                e.preventDefault();
                const targetId = menuItem.getAttribute('href');

                if (targetId === '#inicio') {
                    updateView('welcome');
                } else if (targetId === '#topic-selection-container') {
                    updateView('topics');
                } else if (targetId.startsWith('#')) {
                    updateView(targetId);
                } else {
                    alert('Esta sección estará disponible pronto.');
                }

                // Ocultar el menú después de la selección
                sidebar.classList.remove('active');
                contentWrapper.classList.remove('sidebar-active');
            }
        });
    }

    // Eventos para el panel de ajustes
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('active');
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsPanel.classList.remove('active');
        });
    }

    // Cierra el panel de ajustes si se hace clic en el fondo
    if (settingsPanel) {
        settingsPanel.addEventListener('click', (e) => {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove('active');
            }
        });
    }

    // --- Eventos para el Modal de Login ---
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // --- Evento para el Botón Flotante de Guardar ---
    if (floatingSaveBtn) {
        floatingSaveBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    // --- Evento para Modo Concentración ---
    if (focusModeToggle) {
        focusModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('focus-mode', focusModeToggle.checked);
        });
    }

    // --- Lógica para las flechas del carrusel ---
    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        const scrollAmount = 300; // Píxeles a desplazar

        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // --- Efecto de texto en el título principal ---
    if (mainTitle) {
        // Función para el efecto de texto aleatorio (scramble)
        function scrambleEffect(element) {
            const originalText = element.innerText;
            let interval;

            element.addEventListener('mouseenter', () => {
                let iteration = 0;
                clearInterval(interval);

                interval = setInterval(() => {
                    element.innerText = originalText
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return originalText[index];
                            }
                            return String.fromCharCode(33 + Math.random() * 94);
                        })
                        .join("");

                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }

                    iteration += 1 / 3;
                }, 30);
            });
        }
        scrambleEffect(mainTitle);
    }
}
