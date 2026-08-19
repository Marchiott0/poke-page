import { gameState, getActiveGuesses, getActiveTarget } from '../state/gameState.js';
import { TYPE_TRANSLATIONS } from '../data/constants.js';
import { updateHintsUI } from './hintsUI.js';
import { showToastNotification } from './toast.js';
import { showWinModal } from './modalUI.js';

export function renderClassicRow(guess, target) {
    const isNameCorrect = guess.id === target.id;

    const isType1Correct = guess.type1 === target.type1;
    const isType1Partial = !isType1Correct && (guess.type1 === target.type2);

    const isType2Correct = guess.type2 === target.type2;
    const isType2Partial = !isType2Correct && (guess.type2 === target.type1);

    const isGenCorrect = guess.gen === target.gen;
    const genArrow = guess.gen < target.gen ? '↑' : (guess.gen > target.gen ? '↓' : '');

    const isHeightCorrect = guess.height === target.height;
    const heightArrow = guess.height < target.height ? '↑' : (guess.height > target.height ? '↓' : '');

    const isWeightCorrect = guess.weight === target.weight;
    const weightArrow = guess.weight < target.weight ? '↑' : (guess.weight > target.weight ? '↓' : '');

    const isStageCorrect = guess.stage === target.stage;

    const t1Class = isType1Correct ? 'correct' : (isType1Partial ? 'partial' : 'wrong');
    const t2Class = isType2Correct ? 'correct' : (isType2Partial ? 'partial' : 'wrong');

    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${guess.id}.png`;

    return `
        <div class="guess-row">
            <div class="tile ${isNameCorrect ? 'correct' : 'wrong'}">
                <img src="${imgUrl}" alt="${guess.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="poke-tile-name">${guess.name}</span>
            </div>

            <div class="tile ${isGenCorrect ? 'correct' : 'wrong'}">
                <span>Gen ${guess.gen}</span>
                ${genArrow ? `<span class="arrow">${genArrow}</span>` : ''}
            </div>

            <div class="tile ${t1Class}">
                <span class="type-badge">${TYPE_TRANSLATIONS[guess.type1] || guess.type1}</span>
            </div>

            <div class="tile ${t2Class}">
                <span class="type-badge">${TYPE_TRANSLATIONS[guess.type2] || guess.type2}</span>
            </div>

            <div class="tile ${isHeightCorrect ? 'correct' : 'wrong'}">
                <span>${guess.height}m</span>
                ${heightArrow ? `<span class="arrow">${heightArrow}</span>` : ''}
            </div>

            <div class="tile ${isWeightCorrect ? 'correct' : 'wrong'}">
                <span>${guess.weight}kg</span>
                ${weightArrow ? `<span class="arrow">${weightArrow}</span>` : ''}
            </div>

            <div class="tile ${isStageCorrect ? 'correct' : 'wrong'}">
                <span style="font-size: 0.72rem;">${guess.stage}</span>
            </div>
        </div>
    `;
}

/**
 * Renderiza um badge simples de nome (usado em Silhueta e Som,
 * onde a comparação de atributos não faz sentido tematicamente).
 */
function renderNameBadge(guess, target) {
    const isCorrect = guess.id === target.id;
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${guess.id}.png`;
    return `
        <div class="silhouette-wrong-badge" style="${isCorrect ? 'background:#064e3b; border-color:#34d399; color:#4ade80;' : ''}">
            <img src="${imgUrl}" alt="${guess.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
            <span>${isCorrect ? '✅' : '❌'} ${guess.name}</span>
        </div>
    `;
}

export function handleClassicGuess(guessPoke) {
    const target = getActiveTarget();
    if (!target) return;

    const mode = gameState.activeMode;
    const currentGuesses = gameState.modeGuesses[mode] || [];

    // Evitar palpite duplicado
    if (currentGuesses.some(g => g.id === guessPoke.id)) {
        return;
    }

    currentGuesses.push(guessPoke);
    gameState.modeGuesses[mode] = currentGuesses;

    if (guessPoke.id !== target.id) {
        gameState.modeErrors[mode] = (gameState.modeErrors[mode] || 0) + 1;
        // Toast de erro para Silhueta e Som (sem tabela de comparação)
        if (mode === 'silhouette' || mode === 'sound') {
            showToastNotification(`❌ ${guessPoke.name} incorreto! Tente outro.`);
        }
    }
    // A vitória é tratada em searchUI.submitGuessById após este retorno

    renderAllGuessesForActiveMode();
    // Atualizar o display do modo atual sem importação circular
    if (typeof window.renderModeDisplay === 'function') window.renderModeDisplay();
    updateHintsUI();
}

export function renderAllGuessesForActiveMode() {
    const mode = gameState.activeMode;

    if (mode === 'termo' || mode === 'order') return;

    const target = getActiveTarget();
    const guesses = getActiveGuesses();

    // MODO SILHUETA: lista de badges simples (sem atributos — só nomes)
    if (mode === 'silhouette') {
        const silhContainer = document.getElementById('silhouetteGuessesContainer');
        if (!silhContainer) return;
        if (!target || guesses.length === 0) {
            silhContainer.innerHTML = '<span style="color:#64748b; font-size:0.75rem;">Nenhuma tentativa ainda.</span>';
            return;
        }
        silhContainer.innerHTML = guesses.slice().reverse().map(g => renderNameBadge(g, target)).join('');
        return;
    }

    // MODO SOM: lista de nomes sem comparação de atributos
    // (o jogador descobre pelo grito, não pelos stats)
    if (mode === 'sound') {
        const guessesContainer = document.getElementById('guessesContainer');
        if (!guessesContainer) return;
        if (!target || guesses.length === 0) {
            guessesContainer.innerHTML = '';
            return;
        }
        guessesContainer.innerHTML = `
            <div style="font-family:'Press Start 2P',monospace; font-size:0.55rem; color:#a855f7; margin-bottom:8px; text-align:center;">
                🔊 TENTATIVAS DE NOME
            </div>
            ${guesses.slice().reverse().map(g => renderNameBadge(g, target)).join('')}
        `;
        return;
    }

    // MODO CLÁSSICO e POKÉDEX: tabela completa de atributos
    const guessesContainer = document.getElementById('guessesContainer');
    if (!guessesContainer) return;

    if (!target || guesses.length === 0) {
        guessesContainer.innerHTML = '';
        return;
    }

    guessesContainer.innerHTML = guesses.slice().reverse().map(guess => renderClassicRow(guess, target)).join('');
}
