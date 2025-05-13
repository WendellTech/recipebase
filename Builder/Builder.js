document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipeForm');
    const includeTipCheckbox = document.getElementById('includeTip');
    const addTranslationCheckbox = document.getElementById('addTranslation');
    
    const tipSectionDefault = document.getElementById('tipSectionDefault');
    const tipSectionAlt = document.getElementById('tipSectionAlt');
    const translationSection = document.getElementById('translationSection');

    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
    const outputHtmlTextarea = document.getElementById('outputHtml');
    const outputContainer = document.getElementById('outputContainer');

    // Toggle visibility of tip sections
    includeTipCheckbox.addEventListener('change', () => {
        const display = includeTipCheckbox.checked ? 'block' : 'none';
        tipSectionDefault.style.display = display;
        if (addTranslationCheckbox.checked) {
            tipSectionAlt.style.display = display;
        } else {
            tipSectionAlt.style.display = 'none';
        }
    });

    // Toggle visibility of translation section
    addTranslationCheckbox.addEventListener('change', () => {
        translationSection.style.display = addTranslationCheckbox.checked ? 'block' : 'none';
        if (includeTipCheckbox.checked && addTranslationCheckbox.checked) {
            tipSectionAlt.style.display = 'block';
        } else {
            tipSectionAlt.style.display = 'none';
        }
    });

    // Initial state checks
    if (includeTipCheckbox.checked) {
        tipSectionDefault.style.display = 'block';
    }
    if (addTranslationCheckbox.checked) {
        translationSection.style.display = 'block';
        if (includeTipCheckbox.checked) {
            tipSectionAlt.style.display = 'block';
        }
    }
    
    generateButton.addEventListener('click', generateRecipeHtml);
    downloadButton.addEventListener('click', downloadHtmlFile);

    function getFormValue(id) {
        const el = document.getElementById(id);
        return el ? (el.type === 'checkbox' ? el.checked : el.value) : '';
    }

    function getFormTextareaLines(id) {
        const el = document.getElementById(id);
        return el ? el.value.split('\n').map(line => line.trim()).filter(line => line) : [];
    }

    function generateRecipeHtml() {
        const data = {
            pageHtmlLang: getFormValue('pageHtmlLang'),
            pageTitle: getFormValue('pageTitle'),
            imageName: getFormValue('imageName'),
            timerLength: getFormValue('timerLength'),

            primaryColor: getFormValue('primaryColor'),
            secondaryColor: getFormValue('secondaryColor'),
            accentColor: getFormValue('accentColor'),
            textColor: getFormValue('textColor'),
            backgroundColor: getFormValue('backgroundColor'),
            cardBackgroundColor: getFormValue('cardBackgroundColor'),
            shadowColor: getFormValue('shadowColor'),

            defaultLangCode: getFormValue('defaultLangCode'),
            subtitleDefault: getFormValue('subtitleDefault'),
            imageOverlayTitleDefault: getFormValue('imageOverlayTitleDefault'),
            ingredientsTitleDefault: getFormValue('ingredientsTitleDefault'),
            ingredientsDefault: getFormTextareaLines('ingredientsDefault'),
            instructionsTitleDefault: getFormValue('instructionsTitleDefault'),
            instructionsDefault: getFormTextareaLines('instructionsDefault'),
            includeTip: getFormValue('includeTip'),
            tipTitleDefault: getFormValue('tipTitleDefault'),
            tipTextDefault: getFormValue('tipTextDefault'),
            footerTextDefault: getFormValue('footerTextDefault'),

            addTranslation: getFormValue('addTranslation'),
            altLangCode: getFormValue('altLangCode'),
            subtitleAlt: getFormValue('subtitleAlt'),
            imageOverlayTitleAlt: getFormValue('imageOverlayTitleAlt'),
            ingredientsTitleAlt: getFormValue('ingredientsTitleAlt'),
            ingredientsAlt: getFormTextareaLines('ingredientsAlt'),
            instructionsTitleAlt: getFormValue('instructionsTitleAlt'),
            instructionsAlt: getFormTextareaLines('instructionsAlt'),
            tipTitleAlt: getFormValue('tipTitleAlt'),
            tipTextAlt: getFormValue('tipTextAlt'),
            footerTextAlt: getFormValue('footerTextAlt'),

            // UI Texts Default
            translateButtonDefault: getFormValue('translateButtonDefault'),
            startTimerDefault: getFormValue('startTimerDefault'),
            pauseDefault: getFormValue('pauseDefault'),
            resumeDefault: getFormValue('resumeDefault'),
            resetDefault: getFormValue('resetDefault'),
            hideTimerDefault: getFormValue('hideTimerDefault'),
            showTimerDefault: getFormValue('showTimerDefault'),
            timerHeadingDefault: getFormValue('timerHeadingDefault'),
            timeCompletedDefault: getFormValue('timeCompletedDefault'),

            // UI Texts Alt
            translateButtonAlt: getFormValue('translateButtonAlt'),
            startTimerAlt: getFormValue('startTimerAlt'),
            pauseAlt: getFormValue('pauseAlt'),
            resumeAlt: getFormValue('resumeAlt'),
            resetAlt: getFormValue('resetAlt'),
            hideTimerAlt: getFormValue('hideTimerAlt'),
            showTimerAlt: getFormValue('showTimerAlt'),
            timerHeadingAlt: getFormValue('timerHeadingAlt'),
            timeCompletedAlt: getFormValue('timeCompletedAlt'),
        };

        const defaultTranslations = {
            'TranslateButtonText': data.translateButtonDefault,
            'Un postre clásico español': data.subtitleDefault,
            'Flan Casero': data.imageOverlayTitleDefault,
            'Ingredientes': data.ingredientsTitleDefault,
            // Ingredients and Instructions will be mapped
            'Instrucciones': data.instructionsTitleDefault,
            'Consejo:': data.tipTitleDefault,
            'El flan debe temblar ligeramente en el centro cuando está listo. ¡No lo cocines demasiado!': data.tipTextDefault,
            'Iniciar Temporizador {X} min': data.startTimerDefault,
            'Pausar': data.pauseDefault,
            'Reanudar': data.resumeDefault,
            'Reiniciar': data.resetDefault,
            'Ocultar Temporizador': data.hideTimerDefault,
            'Mostrar Temporizador': data.showTimerDefault,
            'Temporizador': data.timerHeadingDefault,
            '¡Tiempo completado!': data.timeCompletedDefault,
            '© Footer': data.footerTextDefault // Special key for footer
        };
        data.ingredientsDefault.forEach((ing, i) => defaultTranslations[`ing${i+1}`] = ing);
        data.instructionsDefault.forEach((step, i) => defaultTranslations[`step${i+1}`] = step);
        
        const altTranslations = data.addTranslation ? {
            'TranslateButtonText': data.translateButtonAlt,
            'Un postre clásico español': data.subtitleAlt,
            'Flan Casero': data.imageOverlayTitleAlt,
            'Ingredientes': data.ingredientsTitleAlt,
            'Instrucciones': data.instructionsTitleAlt,
            'Consejo:': data.tipTitleAlt,
            'El flan debe temblar ligeramente en el centro cuando está listo. ¡No lo cocines demasiado!': data.tipTextAlt,
            'Iniciar Temporizador {X} min': data.startTimerAlt,
            'Pausar': data.pauseAlt,
            'Reanudar': data.resumeAlt,
            'Reiniciar': data.resetAlt,
            'Ocultar Temporizador': data.hideTimerAlt,
            'Mostrar Temporizador': data.showTimerAlt,
            'Temporizador': data.timerHeadingAlt,
            '¡Tiempo completado!': data.timeCompletedAlt,
            '© Footer': data.footerTextAlt
        } : {};
        if (data.addTranslation) {
            data.ingredientsAlt.forEach((ing, i) => altTranslations[`ing${i+1}`] = ing);
            data.instructionsAlt.forEach((step, i) => altTranslations[`step${i+1}`] = step);
        }

        const translationsObject = {};
        translationsObject[data.defaultLangCode] = defaultTranslations;
        if (data.addTranslation) {
            translationsObject[data.altLangCode] = altTranslations;
        }

        const html = `
<!DOCTYPE html>
<html lang="${data.pageHtmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receta de ${data.pageTitle}</title>
    <style>
        :root {
            --primary-color: ${data.primaryColor};
            --secondary-color: ${data.secondaryColor};
            --accent-color: ${data.accentColor};
            --text-color: ${data.textColor};
            --background-color: ${data.backgroundColor};
            --card-background: ${data.cardBackgroundColor};
            --shadow-color: ${data.shadowColor};
        }
        /* ... (Paste the full CSS from FlanRecipe.html here, it uses the CSS variables) ... */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: var(--background-color); color: var(--text-color); line-height: 1.6; }
        body::-webkit-scrollbar { width: 12px; }
        body::-webkit-scrollbar-track { background: var(--secondary-color); }
        body::-webkit-scrollbar-thumb { background-color: var(--primary-color); border-radius: 10px; border: 3px solid var(--secondary-color); }
        body::-webkit-scrollbar-thumb:hover { background-color: var(--accent-color); }
        html { scrollbar-width: thin; scrollbar-color: var(--primary-color) var(--secondary-color); }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        header { text-align: center; padding: 30px 0; position: relative; }
        h1 { font-size: 3.5rem; color: var(--accent-color); margin-bottom: 10px; font-family: 'Georgia', serif; text-shadow: 1px 1px 3px rgba(0,0,0,0.1); }
        .subtitle { font-size: 1.3rem; color: var(--primary-color); margin-bottom: 20px; font-style: italic; }
        .language-switch { position: absolute; top: 10px; right: 10px; background-color: var(--accent-color); color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.3s, transform 0.2s; box-shadow: 0 2px 5px var(--shadow-color); }
        .language-switch:hover { background-color: #a05a17; /* Consider deriving from accent */ transform: translateY(-2px); }
        .recipe-image-container { position: relative; margin-bottom: 40px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px var(--shadow-color); }
        .recipe-image { width: 100%; height: 400px; object-fit: cover; transition: transform 0.5s; }
        .recipe-image-container:hover .recipe-image { transform: scale(1.03); }
        .recipe-image-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 20px; color: white; }
        .recipe-image-overlay h2 { margin: 0; font-size: 1.8rem; border: none; color: white; }
        .recipe-card { background-color: var(--card-background); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 8px 20px var(--shadow-color); transition: transform 0.3s; border-left: 5px solid var(--primary-color); }
        .recipe-card:hover { transform: translateY(-5px); }
        h2 { color: var(--accent-color); border-bottom: 2px solid var(--primary-color); padding-bottom: 10px; margin-top: 0; font-family: 'Georgia', serif; }
        .ingredients-list { list-style-type: none; padding: 0; }
        .ingredients-list li { padding: 12px 0; border-bottom: 1px solid var(--secondary-color); display: flex; align-items: center; }
        .ingredients-list li:before { content: "•"; color: var(--primary-color); font-size: 1.5rem; margin-right: 10px; }
        .instructions-list { list-style-type: none; padding-left: 0; counter-reset: step-counter; }
        .instructions-list li { margin-bottom: 20px; position: relative; padding-left: 45px; }
        .instructions-list li::before { content: counter(step-counter); counter-increment: step-counter; position: absolute; left: 0; top: 0; background-color: var(--primary-color); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .tip { background-color: rgba(211,139,44,0.1); /* Consider deriving from primary */ border-left: 4px solid var(--primary-color); padding: 15px 20px; margin: 30px 0; border-radius: 8px; }
        .tip strong { color: var(--accent-color); font-size: 1.1rem; }
        .buttons { display: flex; justify-content: center; gap: 15px; margin-top: 30px; flex-wrap: wrap; }
        button { background-color: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.3s, transform 0.2s; box-shadow: 0 4px 10px var(--shadow-color); }
        button:hover { background-color: var(--accent-color); transform: translateY(-3px); }
        .timer-container { display: none; text-align: center; margin: 30px 0; padding: 25px; background-color: var(--card-background); border-radius: 12px; box-shadow: 0 8px 20px var(--shadow-color); position: relative; }
        .timer-container::after { content: ""; position: absolute; width: 100%; height: 3px; bottom: 0; left: 0; background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); border-radius: 0 0 8px 8px; }
        #timer { font-size: 3rem; color: var(--accent-color); margin: 15px 0; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
        footer { text-align: center; margin-top: 60px; padding: 30px; color: var(--primary-color); font-size: 0.9rem; border-top: 1px solid var(--secondary-color); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.pageTitle}</h1>
            <div class="subtitle" data-translate-key="Un postre clásico español">${data.subtitleDefault}</div>
            ${data.addTranslation ? `<button class="language-switch" onclick="toggleLanguage()">${data.translateButtonDefault}</button>` : ''}
        </header>

        <div class="recipe-image-container">
            <img src="${data.imageName}" alt="${data.pageTitle}" class="recipe-image" />
            <div class="recipe-image-overlay">
                <h2 data-translate-key="Flan Casero">${data.imageOverlayTitleDefault}</h2>
            </div>
        </div>

        <div class="recipe-card">
            <h2 id="ingredients-title" data-translate-key="Ingredientes">${data.ingredientsTitleDefault}</h2>
            <ul class="ingredients-list">
                ${data.ingredientsDefault.map((ing, i) => `<li data-translate-key="ing${i+1}">${ing}</li>`).join('\n                ')}
            </ul>
        </div>

        <div class="recipe-card">
            <h2 id="instructions-title" data-translate-key="Instrucciones">${data.instructionsTitleDefault}</h2>
            <ol class="instructions-list">
                ${data.instructionsDefault.map((step, i) => `<li data-translate-key="step${i+1}">${step}</li>`).join('\n                ')}
            </ol>
        </div>

        ${data.includeTip ? `
        <div class="tip">
            <strong data-translate-key="Consejo:">${data.tipTitleDefault}</strong>
            <p data-translate-key="El flan debe temblar ligeramente en el centro cuando está listo. ¡No lo cocines demasiado!">${data.tipTextDefault}</p>
        </div>` : ''}

        <div class="buttons">
            <button id="timer-button" data-translate-key-template="Iniciar Temporizador {X} min">${data.startTimerDefault.replace('{X}', data.timerLength)}</button>
            <button id="pause-timer-button" style="display: none;" data-translate-key="Pausar">${data.pauseDefault}</button>
            <button id="resume-timer-button" style="display: none;" data-translate-key="Reanudar">${data.resumeDefault}</button>
            <button id="reset-timer-button" style="display: none;" data-translate-key="Reiniciar">${data.resetDefault}</button>
            <button id="hide-show-timer-button" style="display: none;" data-translate-key-show="Mostrar Temporizador" data-translate-key-hide="Ocultar Temporizador">${data.hideTimerDefault}</button>
        </div>

        <div class="timer-container" id="timerContainer">
            <h3 id="timer-heading" data-translate-key="Temporizador">${data.timerHeadingDefault}</h3>
            <div id="timer">${String(data.timerLength).padStart(2, '0')}:00</div>
        </div>

        <footer id="footer-text" data-translate-key="© Footer">${data.footerTextDefault}</footer>
    </div>

    <script>
        let timerInterval = null;
        let totalSeconds = 0;
        let initialDurationMinutes = ${data.timerLength};
        let isPaused = false;
        let isTimerVisible = false; 
        let language = '${data.defaultLangCode}';
        const translations = ${JSON.stringify(translationsObject, null, 2)};

        // DOM Elements (cached in setup)
        let elementsToTranslate = {}; // Will hold elements by key

        document.addEventListener('DOMContentLoaded', () => {
            cacheDOMElementsAndSetup();
            updateButtonVisibility();
            if (typeof updateAllText === "function" && ${data.addTranslation}) updateAllText(); // Initial text setup
        });

        function cacheDOMElementsAndSetup() {
            // Cache all elements with data-translate-key or data-translate-key-template
            document.querySelectorAll('[data-translate-key], [data-translate-key-template], [data-translate-key-show]').forEach(el => {
                const key = el.dataset.translateKey || el.dataset.translateKeyTemplate || (el.id === 'hide-show-timer-button' ? 'hide-show-special' : null);
                if (key) elementsToTranslate[key] = el;
            });
            // Manually add elements not covered by querySelectorAll if needed
            elementsToTranslate.timerButtonEl = document.getElementById('timer-button');
            elementsToTranslate.pauseBtn = document.getElementById('pause-timer-button');
            elementsToTranslate.resumeBtn = document.getElementById('resume-timer-button');
            elementsToTranslate.resetBtn = document.getElementById('reset-timer-button');
            elementsToTranslate.hideShowBtn = document.getElementById('hide-show-timer-button');
            elementsToTranslate.timerContainerEl = document.getElementById('timerContainer');
            elementsToTranslate.timerDisplayEl = document.getElementById('timer');
            elementsToTranslate.timerHeadingEl = document.getElementById('timer-heading');
            elementsToTranslate.languageSwitchBtn = document.querySelector('.language-switch');
            
            if (elementsToTranslate.timerButtonEl) elementsToTranslate.timerButtonEl.onclick = () => startTimer(initialDurationMinutes);
            if (elementsToTranslate.pauseBtn) elementsToTranslate.pauseBtn.onclick = pauseTimer;
            if (elementsToTranslate.resumeBtn) elementsToTranslate.resumeBtn.onclick = resumeTimer;
            if (elementsToTranslate.resetBtn) elementsToTranslate.resetBtn.onclick = resetTimer;
            if (elementsToTranslate.hideShowBtn) elementsToTranslate.hideShowBtn.onclick = toggleTimerDisplay;
        }
        
        function updateButtonVisibility() {
            const timerIsRunningOrPaused = timerInterval !== null;
            const elCache = elementsToTranslate; // Use cached elements

            if(elCache.timerButtonEl) elCache.timerButtonEl.style.display = timerIsRunningOrPaused ? 'none' : 'inline-block';
            if(elCache.pauseBtn) elCache.pauseBtn.style.display = timerIsRunningOrPaused && !isPaused && isTimerVisible ? 'inline-block' : 'none';
            if(elCache.resumeBtn) elCache.resumeBtn.style.display = timerIsRunningOrPaused && isPaused && isTimerVisible ? 'inline-block' : 'none';
            if(elCache.resetBtn) elCache.resetBtn.style.display = timerIsRunningOrPaused ? 'inline-block' : 'none';
            
            if(elCache.hideShowBtn) {
                elCache.hideShowBtn.style.display = timerIsRunningOrPaused ? 'inline-block' : 'none';
                if (timerIsRunningOrPaused && translations[language]) {
                     elCache.hideShowBtn.textContent = isTimerVisible ? translations[language]['Ocultar Temporizador'] : translations[language]['Mostrar Temporizador'];
                }
            }
            if(elCache.timerContainerEl) elCache.timerContainerEl.style.display = timerIsRunningOrPaused && isTimerVisible ? 'block' : 'none';
        }

        function startTimer(minutes) {
            if (timerInterval) clearInterval(timerInterval);
            initialDurationMinutes = minutes;
            totalSeconds = minutes * 60;
            isPaused = false;
            isTimerVisible = true; 
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    totalSeconds--;
                    updateTimerDisplay();
                    if (totalSeconds <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        alert(translations[language]['¡Tiempo completado!']);
                        totalSeconds = initialDurationMinutes * 60; 
                        updateButtonVisibility(); 
                    }
                }
            }, 1000);
            updateButtonVisibility();
        }

        function pauseTimer() { isPaused = true; updateButtonVisibility(); }
        function resumeTimer() { isPaused = false; updateButtonVisibility(); }
        function resetTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            totalSeconds = 0; 
            isPaused = false;
            isTimerVisible = false;
            updateTimerDisplay();
            updateButtonVisibility();
        }
        function toggleTimerDisplay() { isTimerVisible = !isTimerVisible; updateButtonVisibility(); }
        
        function updateTimerDisplay() {
            if (!elementsToTranslate.timerDisplayEl) elementsToTranslate.timerDisplayEl = document.getElementById('timer'); // Ensure it's cached
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            if(elementsToTranslate.timerDisplayEl) elementsToTranslate.timerDisplayEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        }
        ${data.addTranslation ? `
        function toggleLanguage() {
            const defaultLang = '${data.defaultLangCode}';
            const altLang = '${data.altLangCode}';
            language = language === defaultLang ? altLang : defaultLang;
            updateAllText();
        }
        
        function updateAllText() {
            const currentTranslations = translations[language];
            if (!currentTranslations) return;

            for (const key in elementsToTranslate) {
                const element = elementsToTranslate[key];
                if (!element) continue;

                if (element.dataset.translateKey && currentTranslations[element.dataset.translateKey]) {
                    element.textContent = currentTranslations[element.dataset.translateKey];
                } else if (element.dataset.translateKeyTemplate && currentTranslations[element.dataset.translateKeyTemplate]) {
                    element.textContent = currentTranslations[element.dataset.translateKeyTemplate].replace('{X}', initialDurationMinutes);
                }
            }
            // Specific handling for language switch button
            if (elementsToTranslate.languageSwitchBtn) elementsToTranslate.languageSwitchBtn.textContent = currentTranslations['TranslateButtonText'];
            
            updateButtonVisibility(); // Ensures hide/show timer button text is also updated
        }
        ` : `function toggleLanguage(){ console.warn("Translation not enabled."); } function updateAllText(){ console.warn("Translation not enabled."); }`}
    <\/script>
</body>
</html>`;
        outputHtmlTextarea.value = html.trim();
        outputContainer.style.display = 'block';
        downloadButton.style.display = 'inline-block';
    }

    function downloadHtmlFile() {
        const filename = (getFormValue('pageTitle').replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'recipe') + '.html';
        const content = outputHtmlTextarea.value;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

});