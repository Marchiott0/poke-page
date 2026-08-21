import { gameState, getActiveTargets, saveDailyGuesses } from '../state/gameState.js';
import { ALL_POKEMON } from '../data/database.js';
import { showToastNotification } from './toast.js';
import { updateHintsUI } from './hintsUI.js';

let currentTermoRow = [];

export function renderTermoGrid() {
    const wrapper = document.getElementById('termoGridContainer');
    const badgeAttempts = document.getElementById('termoBadgeAttempts');
    const badgeLetters = document.getElementById('termoBadgeLetters');

    if (!wrapper) return;

    const mode = gameState.activeMode;
    wrapper.className = `wordle-boards-wrapper ${mode}`;

    const targets = getActiveTargets();
    if (!targets || targets.length === 0) return;

    const targetCleanNames = targets.map(t => t.name.replace(/[^a-zA-Z]/g, '').toUpperCase());
    const wordLength = targetCleanNames[0].length;

    wrapper.style.setProperty('--word-length', wordLength);

    if (badgeLetters) badgeLetters.innerText = `${wordLength} LETRAS`;

    const guesses = gameState.modeGuesses[mode] || [];
    const MAX_ATTEMPTS = 6;
    if (badgeAttempts) badgeAttempts.innerText = `${guesses.length}/${MAX_ATTEMPTS} TENTATIVAS`;

    const allWon = targetCleanNames.every(name => guesses.includes(name));
    const isGameOver = allWon || guesses.length >= MAX_ATTEMPTS;

    let html = '';

    // Renderizar os tabuleiros
    targetCleanNames.forEach((targetCleanName) => {
        const winIndex = guesses.indexOf(targetCleanName);
        const isWon = winIndex !== -1;
        
        html += `<div class="termo-grid-container">`;
        for (let r = 0; r < MAX_ATTEMPTS; r++) {
            // Se já ganhou neste tabuleiro, não exibir os palpites subsequentes
            const rowGuess = (isWon && r > winIndex) ? undefined : guesses[r];
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
        html += `</div>`;
    });

    // Banner de Game Over / Vitória inline (Movido para o topo)
    let bannerHtml = '';
    if (isGameOver) {
        const missed = targetCleanNames.filter(name => !guesses.includes(name));
        if (missed.length > 0) {
            bannerHtml = `
                <div class="termo-gameover-banner" style="width: 100%; margin-bottom: 12px; margin-top: 0;">
                    <div class="termo-gameover-title">❌ FIM DE JOGO!</div>
                    <div class="termo-gameover-answer">
                        Era(m): <span class="termo-gameover-name">${missed.join(', ')}</span>
                    </div>
                    <div style="font-size:0.7rem; color:#94a3b8; margin-top:8px;">Volte amanhã para um novo desafio.</div>
                </div>
            `;
        } else {
            bannerHtml = `
                <div class="termo-gameover-banner" style="width: 100%; border-color:#22c55e; box-shadow:0 0 20px rgba(34,197,94,0.3); margin-bottom: 12px; margin-top: 0;">
                    <div class="termo-gameover-title" style="color:#4ade80;">🏆 VITÓRIA!</div>
                    <div style="font-size:0.7rem; color:#94a3b8; margin-top:8px;">Volte amanhã para um novo desafio.</div>
                </div>
            `;
        }
    }

    wrapper.innerHTML = bannerHtml + html;
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

export function handleTermoKeyClick(key) {
    const mode = gameState.activeMode;
    const targets = getActiveTargets();
    if (!targets || targets.length === 0) return;

    const targetCleanNames = targets.map(t => t.name.replace(/[^a-zA-Z]/g, '').toUpperCase());
    const wordLength = targetCleanNames[0].length;
    const guesses = gameState.modeGuesses[mode] || [];

    const MAX_ATTEMPTS = 6;
    const allWon = targetCleanNames.every(name => guesses.includes(name));

    // Bloquear input se já ganhou ou perdeu
    if (guesses.length >= MAX_ATTEMPTS || allWon) return;

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
    const mode = gameState.activeMode;
    const targets = getActiveTargets();
    if (!targets || targets.length === 0) return;

    const targetCleanNames = targets.map(t => t.name.replace(/[^a-zA-Z]/g, '').toUpperCase());
    const wordLength = targetCleanNames[0].length;

    if (attemptedWord.length !== wordLength) {
        showToastNotification(`A palavra deve ter ${wordLength} letras!`);
        return;
    }

    const isValidPokemon = ALL_POKEMON.some(p => p.name.replace(/[^a-zA-Z]/g, '').toUpperCase() === attemptedWord);

    if (!isValidPokemon) {
        showToastNotification(`"${attemptedWord}" não é um Pokémon válido!`);
        shakeTermoRow();
        return;
    }

    const guesses = gameState.modeGuesses[mode] || [];
    guesses.push(attemptedWord);
    gameState.modeGuesses[mode] = guesses;
    currentTermoRow = [];

    saveDailyGuesses(mode);
    renderTermoGrid();
    updateHintsUI();
}

function shakeTermoRow() {
    // Shake animation só nas linhas que estão ativas (tabuleiros não resolvidos)
    const activeRows = document.querySelectorAll('.termo-grid-container:not(.won) .termo-row:last-child'); // Lógica simplificada: CSS puro lida com o shake se adicionarmos na classe
    // Melhor usar a classe no wrapper
    const wrapper = document.getElementById('termoGridContainer');
    if (wrapper) {
        wrapper.classList.add('shake');
        setTimeout(() => wrapper.classList.remove('shake'), 400);
    }
}

export function setupTermoPhysicalKeyboard() {
    document.addEventListener('keydown', (e) => {
        const mode = gameState.activeMode;
        if (mode !== 'termo' && mode !== 'dueto' && mode !== 'quarteto') return;

        // Não interferir quando o usuário está digitando na barra de busca
        if (document.activeElement && document.activeElement.id === 'searchBox') return;

        const key = e.key.toUpperCase();
        if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
            handleTermoKeyClick(key === 'BACKSPACE' ? '⌫' : key);
        }
    });
}

window.handleTermoKeyClick = handleTermoKeyClick;
