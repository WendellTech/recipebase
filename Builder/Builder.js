document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const recipeForm = document.getElementById('recipeForm');
    const includeTipCheckbox = document.getElementById('includeTip');
    const addTranslationCheckbox = document.getElementById('addTranslation');
    const includeTimerCheckbox = document.getElementById('includeTimer');
    const autoGenerateColorsCheckbox = document.getElementById('autoGenerateColors');
    const primaryColorInput = document.getElementById('primaryColor');
    const uiLanguageToggle = document.getElementById('uiLanguageToggle');
    const defaultLanguageUI = document.getElementById('defaultLanguageUI');
    const alternativeLanguageUI = document.getElementById('alternativeLanguageUI');
    
    const tipSectionDefault = document.getElementById('tipSectionDefault');
    const tipSectionAlt = document.getElementById('tipSectionAlt');
    const translationSection = document.getElementById('translationSection');
    const timersSection = document.getElementById('timersSection');
    const timersContainer = document.getElementById('timersContainer');
    const addTimerButton = document.getElementById('addTimerButton');

    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
    const outputHtmlTextarea = document.getElementById('outputHtml');
    const outputContainer = document.getElementById('outputContainer');

    const manualColorInputs = document.querySelectorAll('.manual-color');

    // Timer counter for multiple timers
    let timerCounter = 1; // Start at 1 because we already have timer 0

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

    // Toggle visibility of timer section
    includeTimerCheckbox.addEventListener('change', () => {
        timersSection.style.display = includeTimerCheckbox.checked ? 'block' : 'none';
    });

    // Toggle UI language sections
    uiLanguageToggle.addEventListener('change', () => {
        defaultLanguageUI.style.display = uiLanguageToggle.checked ? 'none' : 'block';
        alternativeLanguageUI.style.display = uiLanguageToggle.checked ? 'block' : 'none';
    });

    // Auto generate color scheme
    autoGenerateColorsCheckbox.addEventListener('change', toggleColorSchemeGeneration);
    primaryColorInput.addEventListener('input', () => {
        if (autoGenerateColorsCheckbox.checked) {
            generateColorScheme();
        }
    });

    function toggleColorSchemeGeneration() {
        const isAuto = autoGenerateColorsCheckbox.checked;
        manualColorInputs.forEach(item => {
            item.style.opacity = isAuto ? '0.5' : '1';
            item.querySelector('input').disabled = isAuto;
        });
        
        if (isAuto) {
            generateColorScheme();
        }
    }

    function generateColorScheme() {
        const primaryColor = primaryColorInput.value;
        
        let r_hex = parseInt(primaryColor.slice(1, 3), 16);
        let g_hex = parseInt(primaryColor.slice(3, 5), 16);
        let b_hex = parseInt(primaryColor.slice(5, 7), 16);

        let r = r_hex / 255;
        let g = g_hex / 255;
        let b = b_hex / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        // Calculate adjusted hues for secondary and accent based on the example
        const secondaryHue = (h + 0.0135) % 1; // Adjusted to match example's hue shift
        const accentHue = (h - 0.0254 + 1) % 1; // Adjusted to match example's hue shift
        
        // Adjusted saturation and lightness multipliers to match the example
        const secondaryS = s * 1.16;
        const secondaryL = Math.min(1, l + 0.34);
        const accentS = s * 1.16;
        const accentL = l * 0.6;
        
        // Set the derived colors with clamped values
        document.getElementById('secondaryColor').value = hslToHex(secondaryHue, Math.min(1, Math.max(0, secondaryS)), Math.min(1, Math.max(0, secondaryL)));
        document.getElementById('accentColor').value = hslToHex(accentHue, Math.min(1, Math.max(0, accentS)), Math.min(1, Math.max(0, accentL)));
        document.getElementById('textColor').value = hslToHex(h, Math.min(1, Math.max(0, s * 0.5)), Math.min(1, Math.max(0, l * 0.3)));
        document.getElementById('backgroundColor').value = hslToHex(h, Math.min(1, Math.max(0, s * 0.2)), 0.96);
        document.getElementById('cardBackgroundColor').value = hslToHex(h, Math.min(1, Math.max(0, s * 0.1)), 0.98);
        
        // Use accent color's RGB for shadow
        const accentColorHex = document.getElementById('accentColor').value;
        const r_shadow = parseInt(accentColorHex.slice(1, 3), 16);
        const g_shadow = parseInt(accentColorHex.slice(3, 5), 16);
        const b_shadow = parseInt(accentColorHex.slice(5, 7), 16);
        document.getElementById('shadowColor').value = `rgba(${r_shadow}, ${g_shadow}, ${b_shadow}, 0.15)`;
    }

    function hslToHex(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Add timer button
    addTimerButton.addEventListener('click', () => {
        const timerItem = document.createElement('div');
        timerItem.className = 'timer-item';
        timerItem.innerHTML = `
            <button type="button" class="remove-timer" data-timer-id="${timerCounter}"><i class="fas fa-times"></i></button>
            <div class="form-row">
                <div class="form-column">
                    <label for="timerLength${timerCounter}">Timer Length (minutes):</label>
                    <input type="number" id="timerLength${timerCounter}" value="10" min="1">
                </div>
                <div class="form-column">
                    <label for="timerLabel${timerCounter}">Timer Label:</label>
                    <input type="text" id="timerLabel${timerCounter}" value="Timer ${timerCounter + 1}">
                </div>
            </div>
        `;
        timersContainer.appendChild(timerItem);
        
        // Add event listener to remove button
        timerItem.querySelector('.remove-timer').addEventListener('click', function() {
            timersContainer.removeChild(timerItem);
        });
        
        timerCounter++;
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
    if (!includeTimerCheckbox.checked) {
        timersSection.style.display = 'none';
    }
    
    // Event listeners for main buttons
    generateButton.addEventListener('click', generateRecipeHtml);
    downloadButton.addEventListener('click', downloadHtmlFile);

    // Helper function to get form values
    function getFormValue(id) {
        const el = document.getElementById(id);
        return el ? (el.type === 'checkbox' ? el.checked : el.value) : '';
    }

    function getFormTextareaLines(id) {
        const el = document.getElementById(id);
        return el ? el.value.split('\n').map(line => line.trim()).filter(line => line) : [];
    }

    // Get all timer data
    function getAllTimers() {
        const timers = [];
        const timerItems = timersContainer.querySelectorAll('.timer-item');
        timerItems.forEach((item, index) => { // 'index' will be the effective ID (0, 1, 2...)
            // The input IDs are timerLength0, timerLabel0 for the first one, 
            // timerLength1, timerLabel1 for the second (first dynamically added), etc.
            // This 'index' correctly corresponds to these IDs.
            const lengthInput = document.getElementById(`timerLength${index}`);
            const labelInput = document.getElementById(`timerLabel${index}`);
            
            if (lengthInput && labelInput) {
                const length = lengthInput.value;
                const label = labelInput.value || `Timer ${index + 1}`;
                timers.push({
                    id: index, // Use the loop index as the timer's ID for consistency
                    length,
                    label
                });
            }
        });
        return timers;
    }


    function generateRecipeHtml() {
        const data = {
            pageTitle: getFormValue('pageTitle'),
            recipeTitle: getFormValue('recipeTitle'),
            pageHtmlLang: getFormValue('pageHtmlLang'), // Now correctly fetches from id="pageHtmlLang"
            imageName: getFormValue('imageName'),
            includeTimer: getFormValue('includeTimer'),
            includeAnimations: getFormValue('includeAnimations'),
            timers: getAllTimers(),

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
            'RecipeSubtitle': data.subtitleDefault,
            'RecipeImageOverlay': data.imageOverlayTitleDefault,
            'IngredientsTitle': data.ingredientsTitleDefault,
            'InstructionsTitle': data.instructionsTitleDefault,
            'TipTitle': data.tipTitleDefault,
            'TipText': data.tipTextDefault,
            'StartTimer': data.startTimerDefault,
            'Pause': data.pauseDefault,
            'Resume': data.resumeDefault,
            'Reset': data.resetDefault,
            'HideTimer': data.hideTimerDefault,
            'ShowTimer': data.showTimerDefault,
            'TimerHeading': data.timerHeadingDefault,
            'TimeCompleted': data.timeCompletedDefault,
            'Footer': data.footerTextDefault
        };
        
        data.ingredientsDefault.forEach((ing, i) => defaultTranslations[`ing${i+1}`] = ing);
        data.instructionsDefault.forEach((step, i) => defaultTranslations[`step${i+1}`] = step);
        
        data.timers.forEach((timer) => { // timer.id is 0, 1, ...
            defaultTranslations[`timerLabel${timer.id}`] = timer.label;
        });
        
        const altTranslations = data.addTranslation ? {
            'TranslateButtonText': data.translateButtonAlt,
            'RecipeSubtitle': data.subtitleAlt,
            'RecipeImageOverlay': data.imageOverlayTitleAlt,
            'IngredientsTitle': data.ingredientsTitleAlt,
            'InstructionsTitle': data.instructionsTitleAlt,
            'TipTitle': data.tipTitleAlt,
            'TipText': data.tipTextAlt,
            'StartTimer': data.startTimerAlt,
            'Pause': data.pauseAlt,
            'Resume': data.resumeAlt,
            'Reset': data.resetAlt,
            'HideTimer': data.hideTimerAlt,
            'ShowTimer': data.showTimerAlt,
            'TimerHeading': data.timerHeadingAlt,
            'TimeCompleted': data.timeCompletedAlt,
            'Footer': data.footerTextAlt
        } : {};
        
        if (data.addTranslation) {
            data.ingredientsAlt.forEach((ing, i) => altTranslations[`ing${i+1}`] = ing);
            data.instructionsAlt.forEach((step, i) => altTranslations[`step${i+1}`] = step);
            
            data.timers.forEach((timer) => { // timer.id is 0, 1, ...
                // For simplicity, use the same labels if not translated, or allow for specific alt labels if fields were added
                altTranslations[`timerLabel${timer.id}`] = timer.label; // Placeholder: assumes timer labels are not translated explicitly in this UI
            });
        }

        const translationsObject = {};
        translationsObject[data.defaultLangCode || 'en'] = defaultTranslations; // Fallback for defaultLangCode
        if (data.addTranslation) {
            translationsObject[data.altLangCode || 'alt'] = altTranslations; // Fallback for altLangCode
        }

        // Generate animation-related CSS
        const animationCSS = data.includeAnimations ? `
        /* Animations */
        .recipe-image-container:hover .recipe-image { transform: scale(1.03); }
        .recipe-card { transition: transform 0.3s ease; }
        .recipe-card:hover { transform: translateY(-5px); }
        button { transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; }
        button:hover { transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        ` : '';

        // Generate multiple timer buttons HTML
        let timerButtonsHTML = '';
        if (data.includeTimer) {
            data.timers.forEach((timer) => { // timer.id is 0, 1...
                timerButtonsHTML += `
                <button class="timer-button" data-timer-id="${timer.id}" data-timer-length="${timer.length}" data-translate-key-template="StartTimer" data-translate-key-label="timerLabel${timer.id}">
                    <span class="timer-label">${timer.label}</span>: ${data.startTimerDefault.replace('{X}', timer.length)}
                </button>`;
            });
        }

        const html = `
<!DOCTYPE html>
<html lang="${data.pageHtmlLang || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.pageTitle}</title>
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
        /* Base Styles */
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
        .language-switch { position: absolute; top: 10px; right: 10px; background-color: var(--accent-color); color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: background-color 0.3s, transform 0.3s; }
        .language-switch:hover { background-color: var(--primary-color); transform: translateY(-2px); }
        .recipe-image-container { position: relative; margin-bottom: 40px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px var(--shadow-color); }
        .recipe-image { 
            width: 100%; height: 400px; object-fit: cover; 
            ${data.includeAnimations ? 'transition: transform 0.5s ease;' : ''} 
        }
        .recipe-image-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 20px; color: white; }
        .recipe-image-overlay h2 { margin: 0; font-size: 1.8rem; border: none; color: white; }
        .recipe-card { background-color: var(--card-background); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 8px 20px var(--shadow-color); border-left: 4px solid var(--primary-color); }
        h2 { color: var(--accent-color); border-bottom: 2px solid var(--primary-color); padding-bottom: 10px; margin-top: 0; font-family: 'Georgia', serif; }
        .ingredients-list { list-style-type: none; padding: 0; }
        .ingredients-list li { padding: 12px 0; border-bottom: 1px solid var(--secondary-color); display: flex; align-items: center; }
        .ingredients-list li:before { content: "•"; color: var(--primary-color); font-size: 1.5rem; margin-right: 10px; }
        .instructions-list { list-style-type: none; padding-left: 0; counter-reset: step-counter; }
        .instructions-list li { margin-bottom: 20px; position: relative; padding-left: 45px; }
        .instructions-list li::before { content: counter(step-counter); counter-increment: step-counter; position: absolute; left: 0; top: 0; background-color: var(--primary-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .tip { background-color: rgba(211,139,44,0.1); border-left: 4px solid var(--primary-color); padding: 15px 20px; margin: 30px 0; border-radius: 8px; }
        .tip strong { color: var(--accent-color); font-size: 1.1rem; }
        .buttons { display: flex; justify-content: center; gap: 15px; margin-top: 30px; flex-wrap: wrap; }
        button { background-color: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-size: 0.9rem; }
        /* button:hover is handled by animationCSS if enabled, or can have a simpler default here */
        button:not(:active):hover { background-color: var(--accent-color); } /* Basic hover if no animation */

        .timer-container { display: none; text-align: center; margin: 30px 0; padding: 25px; background-color: var(--card-background); border-radius: 12px; box-shadow: 0 8px 20px var(--shadow-color); position: relative; }
        .timer-container::after { content: ""; position: absolute; width: 100%; height: 3px; bottom: 0; left: 0; background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
        #timer { font-size: 3rem; color: var(--accent-color); margin: 15px 0; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
        footer { text-align: center; margin-top: 60px; padding: 30px; color: var(--primary-color); font-size: 0.9rem; border-top: 1px solid var(--secondary-color); }
        .timer-label { font-weight: bold; }
        .timer-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 15px; }
        .active-timer { border: 2px solid white; box-shadow: 0 0 5px var(--accent-color); }
        
        ${animationCSS}
        
        @media (max-width: 768px) {
            .container { padding: 15px; }
            h1 { font-size: 2.5rem; }
            .recipe-image { height: 250px; }
            .buttons { flex-direction: column; }
            button { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.recipeTitle}</h1>
            <div class="subtitle" data-translate-key="RecipeSubtitle">${data.subtitleDefault}</div>
            ${data.addTranslation ? `<button class="language-switch" onclick="toggleLanguage()" data-translate-key="TranslateButtonText">${data.translateButtonDefault}</button>` : ''}
        </header>

        <div class="recipe-image-container">
            <img src="${data.imageName}" alt="${data.recipeTitle}" class="recipe-image" />
            <div class="recipe-image-overlay">
                <h2 data-translate-key="RecipeImageOverlay">${data.imageOverlayTitleDefault}</h2>
            </div>
        </div>

        <div class="recipe-card">
            <h2 data-translate-key="IngredientsTitle">${data.ingredientsTitleDefault}</h2>
            <ul class="ingredients-list">
                ${data.ingredientsDefault.map((ing, i) => `<li data-translate-key="ing${i+1}">${ing}</li>`).join('\n                ')}
            </ul>
        </div>

        <div class="recipe-card">
            <h2 data-translate-key="InstructionsTitle">${data.instructionsTitleDefault}</h2>
            <ol class="instructions-list">
                ${data.instructionsDefault.map((step, i) => `<li data-translate-key="step${i+1}">${step}</li>`).join('\n                ')}
            </ol>
        </div>

        ${data.includeTip ? `
        <div class="tip">
            <strong data-translate-key="TipTitle">${data.tipTitleDefault}</strong>
            <p data-translate-key="TipText">${data.tipTextDefault}</p>
        </div>` : ''}

        ${data.includeTimer ? `
        <div class="timer-buttons">
            ${timerButtonsHTML}
        </div>
        
        <div class="buttons" id="timer-controls" style="display: none;">
            <button id="pause-timer-button" data-translate-key="Pause">${data.pauseDefault}</button>
            <button id="resume-timer-button" style="display: none;" data-translate-key="Resume">${data.resumeDefault}</button>
            <button id="reset-timer-button" data-translate-key="Reset">${data.resetDefault}</button>
            <button id="hide-show-timer-button" data-translate-key="HideTimer">${data.hideTimerDefault}</button>
        </div>

        <div class="timer-container" id="timerContainer">
            <h3 id="active-timer-label-heading" data-translate-key="TimerHeading">${data.timerHeadingDefault}</h3>: <span id="timer-label-display"></span>
            <div id="timer">00:00</div>
        </div>` : ''}

        <footer data-translate-key="Footer">${data.footerTextDefault}</footer>
    </div>

    <script>
        let timerInterval = null;
        let totalSeconds = 0;
        let initialDurationMinutes = 0;
        let activeTimerId = -1;
        let activeTimerLabelKey = ""; // Store the key, e.g., "timerLabel0"
        let isPaused = false;
        let isTimerVisible = true;
        
        const initialDefaultLangCode = '${data.defaultLangCode || 'en'}';
        const initialAltLangCode = '${data.altLangCode || 'alt'}';
        let language = initialDefaultLangCode;
        
        const translations = ${JSON.stringify(translationsObject, null, 2)};

        // DOM Elements
        let elementsToTranslate = {}; // Cache for elements that need translation
        let timerButtons = [];
        let timerControls = null;
        let pauseBtn = null;
        let resumeBtn = null;
        let resetBtn = null;
        let hideShowBtn = null;
        let timerContainer = null;
        let timerEl = null;
        let timerLabelDisplayEl = null;
        let activeTimerLabelHeadingEl = null;


        document.addEventListener('DOMContentLoaded', () => {
            cacheDOMElementsAndSetup();
            if (typeof updateAllText === "function" && ${data.addTranslation}) {
                updateAllText(); // Set initial texts based on current language
            }
            if (typeof updateButtonVisibility === "function") {
                 updateButtonVisibility(); // Initial state of timer buttons
            }
            if (typeof updateTimerDisplay === "function") {
                updateTimerDisplay(); // Ensure timer display is 00:00 initially
            }
        });

        function cacheDOMElementsAndSetup() {
            document.querySelectorAll('[data-translate-key], [data-translate-key-template], [data-translate-key-label]').forEach(el => {
                const key = el.dataset.translateKey || el.dataset.translateKeyTemplate || el.dataset.translateKeyLabel;
                if (key) {
                    elementsToTranslate[key] = elementsToTranslate[key] || [];
                    elementsToTranslate[key].push(el);
                }
            });

            ${data.includeTimer ? `
            timerControls = document.getElementById('timer-controls');
            timerButtons = document.querySelectorAll('.timer-button');
            pauseBtn = document.getElementById('pause-timer-button');
            resumeBtn = document.getElementById('resume-timer-button');
            resetBtn = document.getElementById('reset-timer-button');
            hideShowBtn = document.getElementById('hide-show-timer-button');
            timerContainer = document.getElementById('timerContainer');
            timerEl = document.getElementById('timer');
            timerLabelDisplayEl = document.getElementById('timer-label-display');
            activeTimerLabelHeadingEl = document.getElementById('active-timer-label-heading');
            
            timerButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const currentBtn = e.currentTarget;
                    const timerId = parseInt(currentBtn.dataset.timerId);
                    const timerLength = parseInt(currentBtn.dataset.timerLength);
                    const labelKey = currentBtn.dataset.translateKeyLabel; // e.g. "timerLabel0"
                    
                    startTimer(timerLength, timerId, labelKey);
                    
                    timerButtons.forEach(b => b.classList.remove('active-timer'));
                    currentBtn.classList.add('active-timer');
                });
            });
            
            if(pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
            if(resumeBtn) resumeBtn.addEventListener('click', resumeTimer);
            if(resetBtn) resetBtn.addEventListener('click', resetTimer);
            if(hideShowBtn) hideShowBtn.addEventListener('click', toggleTimerDisplay);
            ` : ''}
            
            ${data.addTranslation ? `
            const langSwitchBtn = document.querySelector('.language-switch');
            if (langSwitchBtn) langSwitchBtn.addEventListener('click', toggleLanguage);
            ` : ''}
        }
        
        ${data.includeTimer ? `
        function updateButtonVisibility() {
            if (!timerControls) return; // Ensure elements are cached

            const timerIsRunningOrPaused = timerInterval !== null && totalSeconds > 0;
            const timerHasEverRun = initialDurationMinutes > 0; // Indicates a timer was started

            timerControls.style.display = timerHasEverRun ? 'flex' : 'none';
            
            if (pauseBtn) pauseBtn.style.display = timerIsRunningOrPaused && !isPaused ? 'inline-block' : 'none';
            if (resumeBtn) resumeBtn.style.display = timerIsRunningOrPaused && isPaused ? 'inline-block' : 'none';
            
            if (hideShowBtn && timerHasEverRun) {
                const currentLangTranslations = translations[language] || translations[initialDefaultLangCode];
                if (currentLangTranslations) {
                     hideShowBtn.textContent = isTimerVisible ? currentLangTranslations['HideTimer'] : currentLangTranslations['ShowTimer'];
                }
            }
            
            if (timerContainer) {
                timerContainer.style.display = timerHasEverRun && isTimerVisible ? 'block' : 'none';
            }
        }

        function startTimer(minutes, timerId, labelKey) {
            if (timerInterval) clearInterval(timerInterval);
            
            initialDurationMinutes = parseInt(minutes);
            activeTimerId = timerId;
            activeTimerLabelKey = labelKey; // Store the key
            
            totalSeconds = initialDurationMinutes * 60;
            isPaused = false;
            isTimerVisible = true; // Always show timer when a new one starts
            
            updateTimerRelatedText(); // Update timer label based on current language
            updateTimerDisplay();

            timerInterval = setInterval(() => {
                if (!isPaused) {
                    totalSeconds--;
                    updateTimerDisplay();
                    
                    if (totalSeconds <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null; // Mark as not running
                        // totalSeconds will be 0, updateButtonVisibility handles this
                        const currentLangTranslations = translations[language] || translations[initialDefaultLangCode];
                        if (currentLangTranslations) {
                            alert(currentLangTranslations['TimeCompleted']);
                        }
                        // After alert, update visibility to hide pause/resume, show only reset/hide effectively
                        updateButtonVisibility(); 
                    }
                }
            }, 1000);
            
            updateButtonVisibility();
        }

        function pauseTimer() {
            isPaused = true;
            updateButtonVisibility();
        }

        function resumeTimer() {
            isPaused = false;
            updateButtonVisibility();
        }

        function resetTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            totalSeconds = 0;
            initialDurationMinutes = 0; // Reset this to hide controls completely
            isPaused = false;
            activeTimerId = -1;
            activeTimerLabelKey = "";
            
            timerButtons.forEach(btn => btn.classList.remove('active-timer'));
            
            if(timerLabelDisplayEl) timerLabelDisplayEl.textContent = ""; // Clear label
            updateTimerDisplay(); // Display 00:00
            updateButtonVisibility(); // Hide controls
        }

        function toggleTimerDisplay() {
            isTimerVisible = !isTimerVisible;
            updateButtonVisibility();
        }

        function updateTimerDisplay() {
            if (!timerEl) return;
            const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
            const seconds = Math.max(0, totalSeconds) % 60;
            timerEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        }

        function updateTimerRelatedText() {
            const currentLangTranslations = translations[language] || translations[initialDefaultLangCode];
            if (currentLangTranslations && timerLabelDisplayEl && activeTimerLabelKey && currentLangTranslations[activeTimerLabelKey]) {
                timerLabelDisplayEl.textContent = currentLangTranslations[activeTimerLabelKey];
            }
            if (currentLangTranslations && activeTimerLabelHeadingEl && currentLangTranslations['TimerHeading']) {
                activeTimerLabelHeadingEl.textContent = currentLangTranslations['TimerHeading'];
            }
        }
        ` : `
        function startTimer() { console.warn("Timer functionality is disabled."); }
        function pauseTimer() { console.warn("Timer functionality is disabled."); }
        function resumeTimer() { console.warn("Timer functionality is disabled."); }
        function resetTimer() { console.warn("Timer functionality is disabled."); }
        function toggleTimerDisplay() { console.warn("Timer functionality is disabled."); }
        function updateTimerDisplay() { console.warn("Timer functionality is disabled."); }
        function updateButtonVisibility() { console.warn("Timer functionality is disabled."); }
        function updateTimerRelatedText() { console.warn("Timer functionality is disabled."); }
        `}
        
        ${data.addTranslation ? `
        function toggleLanguage() {
            language = language === initialDefaultLangCode ? initialAltLangCode : initialDefaultLangCode;
            updateAllText();
        }
        
        function updateAllText() {
            const currentLangTranslations = translations[language] || translations[initialDefaultLangCode]; // Fallback
            if (!currentLangTranslations) return;

            for (const key in elementsToTranslate) {
                const elements = elementsToTranslate[key];
                if (!elements || !elements.length) continue;
                
                elements.forEach(element => {
                    if (element.dataset.translateKey && currentLangTranslations[key]) {
                        element.textContent = currentLangTranslations[key];
                    }
                    else if (element.dataset.translateKeyTemplate && currentLangTranslations[key] && element.classList.contains('timer-button')) {
                        const timerLength = parseInt(element.dataset.timerLength);
                        const labelKey = element.dataset.translateKeyLabel; // e.g., "timerLabel0"
                        let labelText = "";

                        if (labelKey && currentLangTranslations[labelKey]) {
                            labelText = currentLangTranslations[labelKey];
                        } else { // Fallback to original label if translation missing
                            const span = element.querySelector('.timer-label');
                            if(span) labelText = span.textContent; // This might be from previous language
                        }
                        
                        // Reconstruct button text
                        element.innerHTML = \`<span class="timer-label">\${labelText}</span>: \${currentLangTranslations[key].replace('{X}', timerLength)}\`;
                    }
                });
            }
            
            if (typeof updateTimerRelatedText === 'function') {
                updateTimerRelatedText(); // Update active timer label
            }
            if (typeof updateButtonVisibility === 'function') {
                updateButtonVisibility(); // Update hide/show timer button text
            }
        }
        ` : `
        function toggleLanguage() { console.warn("Translation functionality is disabled."); }
        function updateAllText() { console.warn("Translation functionality is disabled."); }
        `}
    <\/script>
</body>
</html>`;

        outputHtmlTextarea.value = html.trim();
        outputContainer.style.display = 'block';
        downloadButton.style.display = 'inline-block';
    }

    function downloadHtmlFile() {
        const recipeTitle = getFormValue('recipeTitle') || getFormValue('pageTitle');
        const filename = (recipeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'recipe') + '.html';
        const content = outputHtmlTextarea.value;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // Initialize color scheme if auto-generate is checked by default
    if (autoGenerateColorsCheckbox.checked) {
        toggleColorSchemeGeneration(); // This will call generateColorScheme()
    }
});