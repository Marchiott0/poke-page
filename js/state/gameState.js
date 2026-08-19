import { ALL_POKEMON } from '../data/database.js';

export const gameState = {
    selectedGens: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    activeMode: 'classic',

    modeTargets: {
        classic: null,
        silhouette: null,
        pokedex: null,
        sound: null,
        termo: null
    },

    modeGuesses: {
        classic: [],
        silhouette: [],
        pokedex: [],
        sound: [],
        termo: []
    },

    modeErrors: {
        classic: 0,
        silhouette: 0,
        pokedex: 0,
        sound: 0,
        termo: 0
    },

    TERMO_MAX_ATTEMPTS: 6,

    currentPool: [],
    unlockedDexIds: new Set(JSON.parse(localStorage.getItem('pokedle_unlocked_dex') || '[]')),
    activeDexSlotId: null,
    slotErrors: {},
    activeHintRevealed: null,

    stats: {
        wins: parseInt(localStorage.getItem('pokedle_wins') || '0'),
        streak: parseInt(localStorage.getItem('pokedle_streak') || '0'),
        attempts: 0
    }
};

export function updatePool() {
    gameState.currentPool = ALL_POKEMON.filter(p => gameState.selectedGens.has(p.gen));
    const poolCounter = document.getElementById('poolCounter');
    if (poolCounter) {
        poolCounter.innerText = `${gameState.currentPool.length} POKÉMON`;
    }

    if (gameState.currentPool.length > 0) {
        const firstEmpty = gameState.currentPool.find(p => !gameState.unlockedDexIds.has(p.id));
        gameState.activeDexSlotId = firstEmpty ? firstEmpty.id : gameState.currentPool[0].id;
    }
}

export function resetGame(modeToReset = null) {
    updatePool();
    if (gameState.currentPool.length === 0) return;

    const modes = modeToReset ? [modeToReset] : ['classic', 'silhouette', 'pokedex', 'sound', 'termo'];
    modes.forEach(mode => {
        const randomIndex = Math.floor(Math.random() * gameState.currentPool.length);
        gameState.modeTargets[mode] = gameState.currentPool[randomIndex];
        gameState.modeGuesses[mode] = [];
        gameState.modeErrors[mode] = 0;
    });

    if (window.switchMode) {
        window.switchMode(gameState.activeMode);
    }
}

export function getActiveTarget() {
    if (gameState.activeMode === 'order') {
        return ALL_POKEMON.find(p => p.id === gameState.activeDexSlotId) || gameState.currentPool[0];
    }
    return gameState.modeTargets[gameState.activeMode];
}

export function getActiveErrors() {
    if (gameState.activeMode === 'order') {
        return gameState.slotErrors[gameState.activeDexSlotId] || 0;
    }
    return gameState.modeErrors[gameState.activeMode] || 0;
}

export function getActiveGuesses() {
    if (gameState.activeMode === 'order') return [];
    return gameState.modeGuesses[gameState.activeMode] || [];
}
