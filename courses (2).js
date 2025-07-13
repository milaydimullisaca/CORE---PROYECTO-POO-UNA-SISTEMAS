function initializeCourses(updateView) {
    const startJourneyBtn = document.getElementById('start-journey-btn');
    const careerButtons = document.querySelectorAll('.career-btn');
    const topicSelectionContainer = document.getElementById('topic-selection-container');

    // Botón para iniciar el viaje -> Muestra las carreras
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => updateView('careers'));
    }

    // Botones de carrera
    careerButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.career === 'sistemas') {
                updateView('topics');
            } else {
                alert('Los temas para esta carrera estarán disponibles muy pronto.');
            }
        });
    });

    // Tarjetas de temas
    if (topicSelectionContainer) {
        topicSelectionContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.topic-card');
            if (card) {
                e.preventDefault();
                const targetId = card.getAttribute('href');
                updateView(targetId);
            }
        });
    }
}
