document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM (compartidos o globales) ---
    const sidebar = document.querySelector('.sidebar-nav');
    const contentWrapper = document.querySelector('.content-wrapper');
    const topicSections = document.querySelectorAll('.topic-section');
    const menuToggleButton = document.getElementById('menu-toggle');
    const topicSelectionContainer = document.getElementById('topic-selection-container');
    const floatingSaveBtn = document.getElementById('floating-save-btn');
    const careerCarousel = document.getElementById('career-carousel-container');

    // --- Sistema de Gestión de Vistas Centralizado ---
    function updateView(viewName) {
        // Ocultar todos los componentes principales primero
        document.querySelector('.welcome-box').style.display = 'none';
        careerCarousel.classList.remove('visible');
        topicSelectionContainer.style.display = 'none';
        topicSections.forEach(section => section.classList.remove('active'));
        floatingSaveBtn.classList.remove('visible');

        // Determinar qué vista mostrar
        switch (viewName) {
            case 'welcome':
                document.querySelector('.welcome-box').style.display = 'block';
                menuToggleButton.style.display = 'none';
                sidebar.classList.remove('active');
                contentWrapper.classList.remove('sidebar-active');
                break;
            case 'careers':
                careerCarousel.classList.add('visible');
                menuToggleButton.style.display = 'flex';
                break;
            case 'topics':
                topicSelectionContainer.style.display = 'block';
                menuToggleButton.style.display = 'flex';
                break;
            default: // Para vistas de temas específicos como '#punteros'
                const targetSection = document.querySelector(viewName);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const topicsWithSaveButton = ['#punteros', '#recursividad', '#funciones'];
                    if (topicsWithSaveButton.includes(viewName)) {
                        floatingSaveBtn.classList.add('visible');
                    }
                }
                menuToggleButton.style.display = 'flex';
                break;
        }
    }

    // --- Inicialización de Módulos ---
    initializeUI(updateView);
    initializeCourses(updateView);

    // Estado inicial de la aplicación
    updateView('welcome');
});
