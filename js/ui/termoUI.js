import { gameState, getActiveTarget } from '../state/gameState.js';
import { ALL_POKEMON } from '../data/database.js';
import { showToastNotification } from './toast.js';
import { showWinModal } from './modalUI.js';
import { updateHintsUI } from './hintsUI.js';

let currentTermoRow = [];

export function renderTermoGrid() {
    const termoGridContainer = document.getElementById('termoGridContainer');
    const badgeAttempts = document.getElementById('termoBadgeAttempts');
    const badgeLetters = document.getElementById('termoBadgeLetters');

    if (!termoGridContainer) return;

    const target = getActiveTarget();
    if (!target) return;

    const targetCleanName = target.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const wordLength = targetCleanName.length;

    if (badgeLetters) badgeLetters.innerText = `${wordLength} LETRAS`;

    const guesses = gameState.modeGuesses.termo || [];
    if (badgeAttempts) badgeAttempts.innerText = `${guesses.length}/6 TENTATIVAS`;

    const isGameOver = guesses.length >= 6 && !guesses.includes(targetCleanName);
    const isWon = guesses.includes(targetCleanName);

    let html = '';

    for (let r = 0; r < 6; r++) {
        const rowGuess = guesses[r];
        html += `<div class="termo-row">`;

        for (let c = 0; c < wordLength; c++) {
            let letter = '';
            let statusClass = '';

            if (rowGuess) {
                letter = rowGuess[c] || '';
                statusClass = getLetterStatusClass(rowGuess, c, targetCleanName);
            } else if (r === guesses.length && !isGameOver && !isWon) {
                letter = currentTermoRow[c] || '';
                statusClass = letter ? 'filled' : '';
            }

            html += `<div class="termo-tile ${statusClass}">${letter}</div>`;
        }

        html += `</div>`;
    }

    // Banner de Game Over inline (sem modal para Termo)
    if (isGameOver) {
        html += `
            <div class="termo-gameover-banner">
                <div class="termo-gameover-title">❌ FIM DE JOGO!</div>
                <div class="termo-gameover-answer">
                    Era: <span class="termo-gameover-name">${target.name.toUpperCase()}</span>
                </div>
                <button type="button" class="btn-primary" style="margin-top:12px;" onclick="resetGame('termo')">
                    🔄 TENTAR NOVAMENTE
                </button>
            </div>
        `;
    }

    termoGridContainer.innerHTML = html;

    // Limpar teclado virtual (se existir no DOM, manter vazio)
    renderTermoKeyboard(targetCleanName);
}

function getLetterStatusClass(guessWord, index, targetWord) {
    const char = guessWord[index];
    if (!char) return '';

    if (targetWord[index] === char) {
        return 'correct';
    }

    if (targetWord.includes(char)) {
        return 'partial';
    }

    return 'wrong';
}

export function renderTermoKeyboard(targetWord) {
    const container = document.getElementById('termoKeyboardContainer');
    // Teclado virtual removido — usuário usa teclado físico/nativo
    if (container) container.innerHTML = '';
}

export function handleTermoKeyClick(key) {
    const target = getActiveTarget();
    if (!target) return;

    const targetCleanName = target.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const wordLength = targetCleanName.length;
    const guesses = gameState.modeGuesses.termo || [];

    // Bloquear input se já ganhou ou perdeu
    if (guesses.length >= 6) return;
    if (guesses.includes(targetCleanName)) return;

    if (key === '⌫' || key === 'BACKSPACE') {
        currentTermoRow.pop();
        renderTermoGrid();
    } else if (key === 'ENTER') {
        if (currentTermoRow.length < wordLength) {
            showToastNotification(`A palavra deve ter ${wordLength} letras!`);
            shakeTermoRow();
            return;
        }
        const attemptedWord = currentTermoRow.join('').toUpperCase();
        submitTermoGuess(attemptedWord);
    } else if (/^[A-Z]$/.test(key)) {
        if (currentTermoRow.length < wordLength) {
            currentTermoRow.push(key);
            renderTermoGrid();
        }
    }
}

export function submitTermoGuess(attemptedWord) {
    const target = getActiveTarget();
    if (!target) return;

    const targetCleanName = target.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const wordLength = targetCleanName.length;

    if (attemptedWord.length !== wordLength) {
        showToastNotification(`A palavra deve ter ${wordLength} letras!`);
        return;
    }

    // Validação estrita: apenas Pokémon reais cadastrados
    const isValidPokemon = ALL_POKEMON.some(p => {
        const clean = p.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
        return clean === attemptedWord;
    });

    if (!isValidPokemon) {
        showToastNotification(`"${attemptedWord}" não é um Pokémon válido!`);
        shakeTermoRow();
        return;
    }

    const guesses = gameState.modeGuesses.termo || [];
    guesses.push(attemptedWord);
    gameState.modeGuesses.termo = guesses;
    currentTermoRow = [];

    renderTermoGrid();
    updateHintsUI();

    if (attemptedWord === targetCleanName) {
        const fullPoke = ALL_POKEMON.find(p => p.id === target.id) || target;
        setTimeout(() => showWinModal(fullPoke), 400);
    }
    // Game Over é renderizado inline no grid (sem modal separado para Termo)
}

function shakeTermoRow() {
    const rows = document.querySelectorAll('.termo-row');
    const guesses = gameState.modeGuesses.termo || [];
    const activeRow = rows[guesses.length];
    if (activeRow) {
        activeRow.classList.add('shake');
        setTimeout(() => activeRow.classList.remove('shake'), 400);
    }
}

export function setupTermoPhysicalKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (gameState.activeMode !== 'termo') return;

        // Não interferir quando o usuário está digitando na barra de busca
        if (document.activeElement && document.activeElement.id === 'searchBox') return;

        const key = e.key.toUpperCase();
        if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
            handleTermoKeyClick(key === 'BACKSPACE' ? '⌫' : key);
        }
    });
}

window.handleTermoKeyClick = handleTermoKeyClick;
