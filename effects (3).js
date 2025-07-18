document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.getElementById('main-title');

    if (mainTitle) {
        scrambleEffect(mainTitle);
    }
});

function scrambleEffect(element, callback) {
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
            if (callback) {
                callback(); // Llamar al callback cuando la animación termina
            }
        }

        iterations += 1; // Aumenta la velocidad de revelado
    }, 40); // Ajustamos la velocidad para que se aprecie mejor
}

// --- Lógica para la animación de bienvenida ---
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-journey-btn');
    const welcomeBox = document.querySelector('.welcome-box');
    const careerCarousel = document.getElementById('career-carousel-container');

    if (startBtn && welcomeBox && careerCarousel) {
        const welcomeTitle = welcomeBox.querySelector('h2');
        if (!welcomeTitle) return;

        // Guardamos el texto original y lo dejamos visible para el efecto
        const originalTitleText = welcomeTitle.innerText;

        startBtn.addEventListener('click', () => {
            // 1. Ocultar el botón de inicio
            startBtn.style.transition = 'opacity 0.5s ease';
            startBtn.style.opacity = '0';
            startBtn.style.pointerEvents = 'none';

            // 2. Mostrar el cuadro de bienvenida
            welcomeBox.style.opacity = '1';

            // 3. Iniciar el efecto de "scramble" creativo
            scrambleEffect(welcomeTitle, () => {
                // 4. Cuando termine, mostrar el carrusel de carreras
                careerCarousel.classList.add('visible');
            });

        }, { once: true }); // El evento solo se dispara una vez
    }
});

function typewriterEffect(element, text, callback) {
    let i = 0;
    const speed = 70; // Velocidad en milisegundos por caracter

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); // Llama al callback cuando la animación termina
        }
    }

    type();
}

// --- Lógica para el Simulador de Recursividad ---
document.addEventListener('DOMContentLoaded', () => {
    const startSimBtn = document.getElementById('start-recursion-sim-btn');
    const resetSimBtn = document.getElementById('reset-recursion-sim-btn');
    const numberInput = document.getElementById('factorial-input');
    const callStackContainer = document.getElementById('call-stack');
    const explanationBox = document.getElementById('recursion-explanation');
    const codeLines = document.querySelectorAll('#recursion-simulation-container .code-display code span');

    let simulationTimeout;

    function resetSimulation() {
        clearTimeout(simulationTimeout);
        callStackContainer.innerHTML = '';
        explanationBox.innerHTML = '<p>Introduce un número y haz clic en "Iniciar Simulación" para ver la magia de la recursividad.</p>';
        codeLines.forEach(line => line.classList.remove('highlight'));
        startSimBtn.disabled = false;
    }

    function highlightLine(lineNumber) {
        codeLines.forEach(line => line.classList.remove('highlight'));
        const lineToHighlight = document.querySelector(`#recursion-simulation-container .code-display code span:nth-child(${lineNumber})`);
        if (lineToHighlight) {
            lineToHighlight.classList.add('highlight');
        }
    }

    async function runFactorialSimulation(n) {
        resetSimulation();
        startSimBtn.disabled = true;
        let delay = 1500; // ms

        async function factorialStep(num) {
            if (num < 0) {
                explanationBox.innerHTML = '<p>Error: El factorial no está definido para números negativos.</p>';
                return;
            }

            // 1. Añadir llamada a la pila
            const callId = `call-${num}`;
            const callDiv = document.createElement('div');
            callDiv.id = callId;
            callDiv.className = 'call-stack-item';
            callDiv.innerText = `factorial(${num})`;
            callStackContainer.appendChild(callDiv);
            explanationBox.innerHTML = `<p>Llamando a <strong>factorial(${num})</strong>. La función se añade a la pila de llamadas.</p>`;
            highlightLine(1);
            await new Promise(r => simulationTimeout = setTimeout(r, delay));

            // 2. Comprobar la condición base
            explanationBox.innerHTML = `<p>Comprobando la condición base: <strong>if (${num} <= 1)</strong>.</p>`;
            highlightLine(2);
            await new Promise(r => simulationTimeout = setTimeout(r, delay));

            if (num <= 1) {
                // 3. Condición base cumplida
                explanationBox.innerHTML = `<p>La condición <strong>(${num} <= 1)</strong> es verdadera. La función retornará <strong>1</strong>.</p>`;
                callDiv.classList.add('returning');
                highlightLine(3);
                await new Promise(r => simulationTimeout = setTimeout(r, delay));
                return 1;
            } else {
                // 4. Llamada recursiva
                explanationBox.innerHTML = `<p>La condición es falsa. Se necesita calcular <strong>factorial(${num - 1})</strong>. Se realiza una llamada recursiva.</p>`;
                highlightLine(5);
                await new Promise(r => simulationTimeout = setTimeout(r, delay));

                const result = await factorialStep(num - 1);

                // 5. Retornando de la llamada recursiva
                explanationBox.innerHTML = `<p><strong>factorial(${num - 1})</strong> retornó <strong>${result}</strong>. Ahora calculamos <strong>${num} * ${result}</strong>.</p>`;
                highlightLine(5);
                await new Promise(r => simulationTimeout = setTimeout(r, delay));

                const finalResult = num * result;
                explanationBox.innerHTML = `<p><strong>factorial(${num})</strong> retorna <strong>${finalResult}</strong>.</p>`;
                callDiv.classList.add('returning');
                highlightLine(5);
                await new Promise(r => simulationTimeout = setTimeout(r, delay));
                return finalResult;
            }
        }

        const finalValue = await factorialStep(parseInt(numberInput.value, 10));
        explanationBox.innerHTML = `<p><strong>¡Simulación completada!</strong> El factorial de ${numberInput.value} es <strong>${finalValue}</strong>. La pila de llamadas está vacía.</p>`;
        startSimBtn.disabled = false;
    }

    // Reestructurar el código para poder resaltar líneas
    const codeContainer = document.querySelector('#recursion-simulation-container .code-display code');
    if (codeContainer) {
        const codeText = codeContainer.innerText;
        codeContainer.innerHTML = ''; // Limpiar
        codeText.split('\n').forEach(line => {
            if (line.trim() !== '') {
                const span = document.createElement('span');
                span.textContent = line + '\n';
                codeContainer.appendChild(span);
            }
        });
    }

    startSimBtn.addEventListener('click', () => {
        const n = parseInt(numberInput.value, 10);
        if (!isNaN(n)) {
            runFactorialSimulation(n);
        }
    });

    resetSimBtn.addEventListener('click', resetSimulation);
});
