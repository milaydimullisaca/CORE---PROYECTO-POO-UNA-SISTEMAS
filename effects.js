document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.getElementById('main-title');

    if (mainTitle) {
        scrambleEffect(mainTitle);
    }
});

function scrambleEffect(element) {
    const originalText = element.innerText;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
    let iterations = 0;

    const interval = setInterval(() => {
        element.innerText = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                // No cambiar los espacios en blanco
                if (char === ' ') {
                    return ' ';
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.innerText = originalText; // Asegurarse de que el texto final es correcto
        }

        iterations += 1; // Aumenta la velocidad de revelado
    }, 30); // Aumenta la velocidad de la animación
}
