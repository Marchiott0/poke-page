import { gameState, updatePool } from '../state/gameState.js';
import { GENERATIONS } from '../data/constants.js';

export function renderGenButtons() {
    const genGrid = document.getElementById('genGrid');
    if (!genGrid) return;

    genGrid.innerHTML = GENERATIONS.map(g => {
        const isActive = gameState.selectedGens.has(g.gen);
        return `
            <button type="button" class="gen-btn ${isActive ? 'active' : ''}" onclick="toggleGen(${g.gen})">
                <span>GEN ${g.gen}</span>
            </button>
        `;
    }).join('');
}

export const renderGenFilterUI = renderGenButtons;

export function toggleGen(genNum) {
    if (gameState.selectedGens.has(genNum)) {
        if (gameState.selectedGens.size === 1) return;
        gameState.selectedGens.delete(genNum);
    } else {
        gameState.selectedGens.add(genNum);
    }

    renderGenButtons();
    updatePool();

    if (window.resetGame) {
        window.resetGame(gameState.activeMode);
    }
}

export function selectGens(presetArr) {
    if (presetArr.includes('all')) {
        gameState.selectedGens = new Set(GENERATIONS.map(g => g.gen));
    } else {
        gameState.selectedGens = new Set(presetArr);
    }

    renderGenButtons();
    updatePool();

    if (window.resetGame) {
        window.resetGame(gameState.activeMode);
    }
}
