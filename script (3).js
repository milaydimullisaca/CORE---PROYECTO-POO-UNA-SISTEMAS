document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const sidebar = document.querySelector('.sidebar-nav');
    const contentWrapper = document.querySelector('.content-wrapper');
    const topicSections = document.querySelectorAll('.topic-section');
    const menuToggleButton = document.getElementById('menu-toggle');
    const topicSelectionContainer = document.getElementById('topic-selection-container');
    const floatingSaveBtn = document.getElementById('floating-save-btn');
    const careerCarousel = document.getElementById('career-carousel-container');

    // --- GESTIÓN DE VISTAS PRINCIPAL ---
    function updateView(viewName) {
        document.querySelector('.welcome-box').style.display = 'none';
        careerCarousel.classList.remove('visible');
        topicSelectionContainer.style.display = 'none';
        topicSections.forEach(section => section.classList.remove('active'));
        floatingSaveBtn.classList.remove('visible');

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
            default:
                const targetSection = document.querySelector(viewName);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Si la vista es de punteros, inicializamos la simulación
                    if (viewName === '#punteros') {
                        initializePointerSimulation();
                    }
                    if (['#punteros', '#recursividad', '#funciones'].includes(viewName)) {
                        floatingSaveBtn.classList.add('visible');
                    }
                }
                menuToggleButton.style.display = 'flex';
                break;
        }
    }

    // --- LÓGICA DE LA SIMULACIÓN DE PUNTEROS ---
    const simulationSection = document.getElementById('punteros-simulation');
    
    function initializePointerSimulation() {
        if (!simulationSection) return;

        // --- DOM Elements ---
        const codeDisplay = document.getElementById('code-display-sim');
        const explanationBox = document.getElementById('explanation-box-sim');
        const memoryGrid = document.getElementById('memory-simulation-grid');
        const nextStepBtn = document.getElementById('next-step-btn');
        const svgArrow = document.getElementById('pointer-arrow-svg');
        const levelButtons = document.querySelectorAll('.level-btn');
        const modeSelector = document.getElementById('mode-selector-container');
        const visualModeContent = document.getElementById('visual-mode-content');
        const textualModeContent = document.getElementById('textual-mode-content');
        const textOutput = document.getElementById('text-output');

        // --- State ---
        let currentLevel = 1;
        let currentStep = 0;
        let currentMode = 'visual'; // 'visual' or 'textual'
        let simulationSteps = [];
        let memoryState = {};

        // --- Simulation Data ---
        const simulationData = {
            1: {
                steps: [
                    { 
                        code: 'int x = 10;', 
                        explanation: 'Se declara una variable entera <code>x</code> y se le asigna el valor 10.',
                        action: () => { memoryState.x = { address: '0x1000', value: 10, id: 'cell-x' }; renderMemory(); },
                        textAction: () => { memoryState.x = { address: '0x1000', value: 10 }; textOutput.innerHTML += `> Variable 'x' creada. Valor: 10, Dirección: 0x1000\n`; }
                    },
                    { 
                        code: 'int* ptr;', 
                        explanation: 'Se declara un puntero a entero llamado <code>ptr</code>.',
                        action: () => { memoryState.ptr = { address: '0x1004', value: 'NULL', id: 'cell-ptr', type: 'ptr' }; renderMemory(); },
                        textAction: () => { memoryState.ptr = { address: '0x1004', value: 'NULL' }; textOutput.innerHTML += `> Puntero 'ptr' creado. Valor: NULL, Dirección: 0x1004\n`; }
                    },
                    { 
                        code: 'ptr = &x;', 
                        explanation: 'Se asigna al puntero <code>ptr</code> la dirección de memoria de <code>x</code>.', 
                        action: async () => {
                            await animateAddressTransfer(memoryState.x, memoryState.ptr);
                            memoryState.ptr.value = memoryState.x.address;
                            renderMemory();
                            drawArrow(memoryState.ptr, memoryState.x);
                        },
                        textAction: () => { memoryState.ptr.value = memoryState.x.address; textOutput.innerHTML += `> 'ptr' ahora apunta a 'x'. Valor de ptr: ${memoryState.x.address}\n`; }
                    },
                    {
                        code: '*ptr = 20;',
                        explanation: 'Se modifica el valor de <code>x</code> a 20 a través del puntero.',
                        action: async () => {
                            const xCell = document.getElementById(memoryState.x.id);
                            if(xCell) xCell.classList.add('highlight-update');
                            await new Promise(r => setTimeout(r, 800));
                            memoryState.x.value = 20;
                            renderMemory();
                            if(xCell) xCell.classList.remove('highlight-update');
                        },
                        textAction: () => { memoryState.x.value = 20; textOutput.innerHTML += `> Valor de 'x' modificado a 20 via 'ptr'.\n> printf("%d", x) -> 20\n`; }
                    },
                    {
                        code: 'int y = 30;',
                        explanation: 'Se declara una nueva variable entera <code>y</code> con el valor 30.',
                        action: () => { memoryState.y = { address: '0x1008', value: 30, id: 'cell-y' }; renderMemory(); },
                        textAction: () => { memoryState.y = { address: '0x1008', value: 30 }; textOutput.innerHTML += `> Variable 'y' creada. Valor: 30, Dirección: 0x1008\n`; }
                    },
                    {
                        code: 'ptr = &y;',
                        explanation: 'El puntero <code>ptr</code> se reasigna para apuntar a <code>y</code>.',
                        action: async () => {
                            await animateAddressTransfer(memoryState.y, memoryState.ptr);
                            memoryState.ptr.value = memoryState.y.address;
                            renderMemory();
                            drawArrow(memoryState.ptr, memoryState.y);
                        },
                        textAction: () => { memoryState.ptr.value = memoryState.y.address; textOutput.innerHTML += `> 'ptr' ahora apunta a 'y'. Valor de ptr: ${memoryState.y.address}\n`; }
                    }
                ]
            },
            2: { steps: [] }, 3: { steps: [] }, 4: { steps: [] }
        };

        // --- Core Functions ---
        async function executeNextStep() {
            if (currentStep >= simulationSteps.length) return;

            const step = simulationSteps[currentStep];
            codeDisplay.innerHTML = `<div class="code-line">${step.code}</div>`;
            explanationBox.innerHTML = `<p>${step.explanation}</p>`;

            nextStepBtn.disabled = true;
            if (currentMode === 'visual') {
                if (step.action) await step.action();
            } else {
                if (step.textAction) step.textAction();
            }
            nextStepBtn.disabled = false;

            currentStep++;

            if (currentStep >= simulationSteps.length) {
                explanationBox.innerHTML = "<p>Simulación completada.</p>";
                nextStepBtn.textContent = 'Reiniciar';
            }
        }

        function loadLevel(level) {
            currentLevel = level;
            simulationSteps = simulationData[level].steps;
            levelButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.level == level));
            resetSimulation();
        }

        function switchMode(newMode) {
            if (newMode === currentMode) return;
            currentMode = newMode;

            modeSelector.querySelector('.active').classList.remove('active');
            modeSelector.querySelector(`[data-mode=${newMode}]`).classList.add('active');
            
            visualModeContent.style.display = newMode === 'visual' ? 'flex' : 'none';
            textualModeContent.style.display = newMode === 'textual' ? 'flex' : 'none';
            
            resetSimulation();
        }
        
        function resetSimulation() {
            currentStep = 0;
            memoryState = {};
            resetSimulationView();
            nextStepBtn.textContent = 'Siguiente Paso';
        }

        function resetSimulationView() {
            memoryGrid.innerHTML = '';
            svgArrow.innerHTML = '';
            textOutput.innerHTML = '';
            codeDisplay.innerHTML = '';
            explanationBox.innerHTML = '<p>Selecciona un nivel y presiona "Siguiente Paso" para comenzar.</p>';
            nextStepBtn.disabled = false;
        }

        // --- Rendering Functions ---
        function renderMemory() {
            memoryGrid.innerHTML = '';
            for (const key in memoryState) {
                const cell = memoryState[key];
                const cellDiv = document.createElement('div');
                cellDiv.className = 'memory-cell';
                cellDiv.id = cell.id;
                cellDiv.innerHTML = `
                    <div class="mem-name">${key}</div>
                    <div class="mem-address">${cell.address}</div>
                    <div class="mem-value">${cell.value}</div>
                `;
                memoryGrid.appendChild(cellDiv);
            }
        }

        function drawArrow(from, to) {
            const fromCell = document.getElementById(from.id);
            const toCell = document.getElementById(to.id);
            if (!fromCell || !toCell) return;

            svgArrow.innerHTML = ''; // Clear previous arrows
            const containerRect = svgArrow.getBoundingClientRect();
            const fromRect = fromCell.getBoundingClientRect();
            const toRect = toCell.getBoundingClientRect();

            const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
            const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
            let endX = toRect.left + toRect.width / 2 - containerRect.left;
            let endY = toRect.top + toRect.height / 2 - containerRect.top;

            const dx = endX - startX; const dy = endY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const padding = (toRect.width / 2) + 5; // Adjust padding to not cover the box
            if (dist > padding) { 
                endX -= (dx / dist) * padding; 
                endY -= (dy / dist) * padding; 
            }

            svgArrow.innerHTML = `
                <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="5" refX="0" refY="2.5" orient="auto">
                        <polygon points="0 0, 8 2.5, 0 5" fill="#e74c3c" />
                    </marker>
                </defs>
                <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowhead)" />
            `;
        }

        function animateAddressTransfer(from, to) {
            return new Promise(resolve => {
                const fromCell = document.getElementById(from.id);
                const toCell = document.getElementById(to.id);
                if (!fromCell || !toCell) return resolve();

                const addressElement = fromCell.querySelector('.mem-address');
                const valueElement = toCell.querySelector('.mem-value');
                const flyingAddress = document.createElement('div');
                flyingAddress.textContent = from.address;
                flyingAddress.className = 'address-fly-effect';
                document.body.appendChild(flyingAddress);

                const startRect = addressElement.getBoundingClientRect();
                const endRect = valueElement.getBoundingClientRect();

                flyingAddress.style.top = `${startRect.top + startRect.height / 2}px`;
                flyingAddress.style.left = `${startRect.left + startRect.width / 2}px`;
                addressElement.classList.add('highlight-source');

                setTimeout(() => {
                    flyingAddress.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.8)`;
                    flyingAddress.style.opacity = '0';
                    flyingAddress.addEventListener('transitionend', () => {
                        addressElement.classList.remove('highlight-source');
                        document.body.removeChild(flyingAddress);
                        resolve();
                    }, { once: true });
                }, 50);
            });
        }

        // --- Event Listeners ---
        nextStepBtn.onclick = () => {
            if (currentStep >= simulationSteps.length) {
                resetSimulation();
            }
            executeNextStep();
        };

        levelButtons.forEach(button => {
            button.onclick = () => { if (!button.disabled) loadLevel(button.dataset.level); };
        });

        modeSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('mode-btn')) {
                switchMode(e.target.dataset.mode);
            }
        });

        // --- Initial Load ---
        loadLevel(1);
    }

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    initializeUI(updateView);
    initializeCourses(updateView);
    updateView(window.location.hash.length > 1 ? window.location.hash : 'welcome');
});
