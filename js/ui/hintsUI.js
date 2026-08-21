import { gameState, getActiveErrors, getActiveTarget } from '../state/gameState.js';
import { TYPE_TRANSLATIONS } from '../data/constants.js';

export function getHintRequirements() {
    if (gameState.activeMode === 'termo' || gameState.activeMode === 'dueto' || gameState.activeMode === 'quarteto') {
        return { req1: 2, req2: 4 };
    }
    return { req1: 3, req2: 6 };
}

export function updateHintsUI() {
    const errorCount = getActiveErrors();
    const errorBadge = document.getElementById('errorBadge');
    if (errorBadge) errorBadge.innerText = `${errorCount} ERROS`;

    const { req1, req2 } = getHintRequirements();

    const btn1 = document.getElementById('hintBtn1');
    const reqText1 = document.getElementById('hintReq1');
    if (btn1 && reqText1) {
        if (errorCount >= req1) {
            btn1.classList.remove('locked');
            btn1.classList.add('unlocked');
            reqText1.innerText = "DESBLOQUEADA";
        } else {
            btn1.classList.add('locked');
            btn1.classList.remove('unlocked');
            reqText1.innerText = `Falta ${req1 - errorCount} erro(s)`;
        }
    }

    const btn2 = document.getElementById('hintBtn2');
    const reqText2 = document.getElementById('hintReq2');
    if (btn2 && reqText2) {
        if (errorCount >= req2) {
            btn2.classList.remove('locked');
            btn2.classList.add('unlocked');
            reqText2.innerText = "DESBLOQUEADA";
        } else {
            btn2.classList.add('locked');
            btn2.classList.remove('unlocked');
            reqText2.innerText = `Falta ${req2 - errorCount} erro(s)`;
        }
    }

    const displayBox = document.getElementById('hintDisplayBox');
    if (displayBox) {
        if (gameState.activeHintRevealed !== null) {
            displayBox.style.display = 'block';
            displayBox.innerHTML = renderHintContent(gameState.activeHintRevealed);
        } else {
            displayBox.style.display = 'none';
        }
    }
}

export function triggerHint(num) {
    const errorCount = getActiveErrors();
    const { req1, req2 } = getHintRequirements();
    const req = num === 1 ? req1 : req2;

    if (errorCount < req) {
        const btn = document.getElementById(`hintBtn${num}`);
        if (btn) {
            btn.classList.add('shake');
            setTimeout(() => btn.classList.remove('shake'), 400);
        }
        return;
    }

    if (gameState.activeHintRevealed === num) {
        gameState.activeHintRevealed = null;
    } else {
        gameState.activeHintRevealed = num;
    }
    updateHintsUI();
}

export function renderHintContent(num) {
    const mode = gameState.activeMode;
    const isWordle = mode === 'termo' || mode === 'dueto' || mode === 'quarteto';
    
    // Para modos Wordle, a dica foca sempre no primeiro alvo (tabuleiro superior esquerdo)
    const targets = isWordle ? gameState.modeTargets[mode] : [getActiveTarget()];
    if (!targets || targets.length === 0) return "";
    
    const target = targets[0];
    const boardPrefix = (mode === 'dueto' || mode === 'quarteto') ? "Do Tabuleiro 1: " : "";

    if (num === 1) {
        let text = "";
        if (mode === 'silhouette' || mode === 'sound' || isWordle) {
            const t1 = TYPE_TRANSLATIONS[target.type1] || target.type1;
            const t2 = target.type2 !== 'None' ? ` / ${TYPE_TRANSLATIONS[target.type2] || target.type2}` : '';
            text = `${boardPrefix}O tipo principal deste Pokémon é <span class="hint-highlight">${t1}${t2}</span>.`;
        } else if (mode === 'pokedex') {
            text = `Este Pokémon pertence à <span class="hint-highlight">Geração ${target.gen}</span>.`;
        } else {
            text = `A primeira letra do nome é <span class="hint-highlight">'${target.name.charAt(0).toUpperCase()}'</span> e ele pertence à <span class="hint-highlight">Gen ${target.gen}</span>.`;
        }
        return `<div class="hint-content-inner"><span class="hint-title">💡 DICA #1:</span>${text}</div>`;
    }

    if (num === 2) {
        let text = "";
        if (isWordle) {
            const cleanName = target.name.replace(/[^a-zA-Z]/g, '');
            text = `${boardPrefix}A palavra tem <span class="hint-highlight">${cleanName.length} letras</span> e começa com <span class="hint-highlight">'${cleanName.charAt(0).toUpperCase()}'</span>.`;
        } else if (target.desc && !target.desc.includes("Pokémon #")) {
            text = `Pokedex Entry: <em>"${target.desc.replace(new RegExp(target.name, 'gi'), '█████')}"</em>`;
        } else {
            text = `Estágio evolutivo: <span class="hint-highlight">${target.stage}</span> | Altura: <span class="hint-highlight">${target.height}m</span>.`;
        }
        return `<div class="hint-content-inner"><span class="hint-title">💡 DICA #2:</span>${text}</div>`;
    }
    return "";
}
