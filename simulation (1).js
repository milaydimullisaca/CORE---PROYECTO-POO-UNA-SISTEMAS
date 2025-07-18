class PointerSimulation {
    constructor(containerId) {
        const simContainer = document.getElementById(containerId);
        if (!simContainer) return;

        this.varBox = document.getElementById('sim-var-x');
        this.ptrBox = document.getElementById('sim-ptr');
        this.varValue = document.getElementById('sim-var-value');
        this.ptrValue = document.getElementById('sim-ptr-value');
        this.varAddress = document.getElementById('sim-var-address');
        this.arrow = document.getElementById('simulation-arrow');
        this.arrowSvg = document.getElementById('simulation-arrow-svg');
        this.codeDisplay = document.getElementById('sim-code-display');
        this.explanationBox = document.getElementById('simulation-explanation').querySelector('p');
        this.nextStepBtn = document.getElementById('sim-next-step-btn');

        this.currentStep = -1;
        this.steps = this.getSimulationSteps();

        this.initialize();
    }

    getSimulationSteps() {
        return [
            {
                code: `int x = 10;`,
                explanation: 'Se declara una variable entera <strong>x</strong> y se le asigna el valor <strong>10</strong>. Observa cómo la caja de memoria para <strong>x</strong> ahora contiene ese valor.',
                action: () => {
                    this.varBox.classList.add('highlight');
                    this.ptrBox.classList.remove('highlight');
                    this.varValue.textContent = '10';
                }
            },
            {
                code: `int *ptr;`,
                explanation: 'Se declara un puntero llamado <strong>ptr</strong>. Este puntero está diseñado para almacenar la dirección de memoria de una variable entera. Por ahora, no apunta a ningún lado (su valor es nulo o indefinido).',
                action: () => {
                    this.varBox.classList.remove('highlight');
                    this.ptrBox.classList.add('highlight');
                    this.ptrValue.textContent = 'null';
                }
            },
            {
                code: `ptr = &x;`,
                explanation: 'Ahora, asignamos al puntero <strong>ptr</strong> la dirección de memoria de <strong>x</strong> (usando el operador <strong>&</strong>). El valor dentro de <strong>ptr</strong> es ahora la dirección de <strong>x</strong>, y una flecha visualiza que <strong>ptr</strong> está apuntando a <strong>x</strong>.',
                action: () => {
                    this.ptrBox.classList.add('highlight');
                    this.ptrValue.textContent = this.varAddress.textContent;
                    this.drawArrow();
                }
            },
            {
                code: `*ptr = 25;`,
                explanation: 'Usando el operador de indirección (*), podemos acceder al valor en la dirección de memoria a la que apunta ptr y modificarlo. Cambiamos el valor de x a 25 a través del puntero.',
                action: () => {
                    this.varBox.classList.add('highlight');
                    this.ptrBox.classList.remove('highlight');
                    this.varValue.textContent = '25';
                    this.hideArrow();
                }
            },
            {
                code: 'Simulación Completa',
                explanation: '¡Felicidades! Has completado la simulación. Puedes reiniciar la página para volver a empezar.',
                action: () => {
                    this.varBox.classList.remove('highlight');
                    this.ptrBox.classList.remove('highlight');
                    this.nextStepBtn.textContent = 'Reiniciar Simulación';
                    // Desbloquear el logro al completar la simulación
                    if (window.achievementManager) {
                        window.achievementManager.unlock('pointer_master');
                    }
                }
            }
        ];
    }

    initialize() {
        this.currentStep = -1;
        this.codeDisplay.innerHTML = this.steps.map(s => s.code).slice(0, -1).join('<br>');
        this.explanationBox.innerHTML = 'Haz clic en "Siguiente Paso" para comenzar la simulación.';
        this.ptrValue.textContent = '?';
        this.varValue.textContent = '?';
        this.hideArrow();
        this.varBox.classList.remove('highlight');
        this.ptrBox.classList.remove('highlight');
        this.nextStepBtn.textContent = 'Siguiente Paso';
        this.nextStepBtn.onclick = () => this.next();
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateUI();
        } else {
            this.steps[this.steps.length - 1].action();
        }
    }

    updateUI() {
        const step = this.steps[this.currentStep];
        
        let fullCode = '';
        for (let i = 0; i < this.steps.length - 1; i++) {
            if (i === this.currentStep) {
                fullCode += `<span class="line-highlight">${this.steps[i].code}</span>`;
            } else {
                fullCode += this.steps[i].code + '\n';
            }
        }
        this.codeDisplay.innerHTML = fullCode.replace(/\n/g, '<br>');

        this.explanationBox.innerHTML = step.explanation;
        step.action();
    }

    drawArrow() {
        const rect1 = this.ptrBox.getBoundingClientRect();
        const rect2 = this.varBox.getBoundingClientRect();
        const svgRect = this.arrowSvg.getBoundingClientRect();

        const startX = rect1.left + rect1.width / 2 - svgRect.left;
        const startY = rect1.top + rect1.height - svgRect.top;
        const endX = rect2.left + rect2.width / 2 - svgRect.left;
        const endY = rect2.top - svgRect.top;

        this.arrow.setAttribute('x1', startX);
        this.arrow.setAttribute('y1', startY);
        this.arrow.setAttribute('x2', endX);
        this.arrow.setAttribute('y2', endY + 20);
        this.arrow.classList.add('visible');
    }

    hideArrow() {
        this.arrow.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PointerSimulation('pointer-simulation-container');
});
