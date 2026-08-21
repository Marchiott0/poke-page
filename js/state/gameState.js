import { ALL_POKEMON } from '../data/database.js';

export const gameState = {
    selectedGens: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    activeMode: 'classic',

    modeTargets: {
        classic: null,
        silhouette: null,
        pokedex: null,
        sound: null,
        termo: [],
        dueto: [],
        quarteto: []
    },

    modeGuesses: {
        classic: [],
        silhouette: [],
        pokedex: [],
        sound: [],
        termo: [],
        dueto: [],
        quarteto: []
    },

    modeErrors: {
        classic: 0,
        silhouette: 0,
        pokedex: 0,
        sound: 0,
        termo: 0,
        dueto: 0,
        quarteto: 0
    },

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

export function getDailyDateString() {
    return new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split('/').reverse().join('-');
}

export function getGenKey() {
    if (gameState.selectedGens.has('all') || gameState.selectedGens.size === 9) return 'all';
    return Array.from(gameState.selectedGens).sort((a, b) => a - b).join('-');
}

function seededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
    }
    return function() {
        hash = Math.imul(741103597, hash) + 1 | 0;
        let t = hash >>> 16;
        return (t & 0xFFFF) / 0x10000;
    }
}

export function getDailyTargets(mode) {
    const today = getDailyDateString();
    const genKey = getGenKey();
    const rng = seededRandom(today + mode + genKey);

    const byLength = {};
    // Aplica o filtro de gerações (currentPool) e remove nomes compostos ou com hífen
    const pool = gameState.currentPool.filter(p => !p.name.includes('-') && !p.name.includes(' '));
    
    if (pool.length === 0) return [gameState.currentPool[0]]; // fallback

    pool.forEach(p => {
        const len = p.name.replace(/[^a-zA-Z]/g, '').length;
        if (!byLength[len]) byLength[len] = [];
        byLength[len].push(p);
    });

    const count = mode === 'termo' ? 1 : (mode === 'dueto' ? 2 : 4);
    const validLengths = Object.keys(byLength).filter(len => byLength[len].length >= count);
    
    // Garantir que exista opções suficientes
    if (validLengths.length === 0) return [ALL_POKEMON[0]]; 

    const selectedLength = validLengths[Math.floor(rng() * validLengths.length)];
    const candidates = byLength[selectedLength];
    
    const targets = [];
    const indices = new Set();
    while(indices.size < count) {
        indices.add(Math.floor(rng() * candidates.length));
    }
    
    indices.forEach(idx => targets.push(candidates[idx]));
    return targets;
}

export function saveDailyGuesses(mode) {
    const today = getDailyDateString();
    const genKey = getGenKey();
    localStorage.setItem(`pokedle_${mode}_${today}_${genKey}`, JSON.stringify(gameState.modeGuesses[mode]));
}

export function resetGame(modeToReset = null) {
    updatePool();
    if (gameState.currentPool.length === 0) return;

    const today = getDailyDateString();
    const genKey = getGenKey();
    const modes = modeToReset ? [modeToReset] : ['classic', 'silhouette', 'pokedex', 'sound', 'termo', 'dueto', 'quarteto'];
    
    modes.forEach(mode => {
        if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
            gameState.modeTargets[mode] = getDailyTargets(mode);
            
            // Carregar estado diário
            const saved = localStorage.getItem(`pokedle_${mode}_${today}_${genKey}`);
            let parsed = [];
            if (saved) {
                try {
                    parsed = JSON.parse(saved);
                } catch (e) {
                    parsed = [];
                }
            }
            
            const targetLen = gameState.modeTargets[mode][0].name.replace(/[^a-zA-Z]/g, '').length;
            if (parsed.length > 0 && parsed[0].length !== targetLen) {
                // Save corrompido ou incompatível (tamanho de palavra mudou)
                parsed = [];
                localStorage.removeItem(`pokedle_${mode}_${today}_${genKey}`);
            }
            
            gameState.modeGuesses[mode] = parsed;
        } else {
            const randomIndex = Math.floor(Math.random() * gameState.currentPool.length);
            gameState.modeTargets[mode] = gameState.currentPool[randomIndex];
            gameState.modeGuesses[mode] = [];
        }
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
    // Para modos diários de múltiplas palavras (Wordle), retornar o array no novo getter
    return gameState.modeTargets[gameState.activeMode];
}

export function getActiveTargets() {
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
