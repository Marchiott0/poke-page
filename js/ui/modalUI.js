import { gameState, updatePool } from '../state/gameState.js';

export function handleWin(target) {
    if (!target) return;

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    gameState.stats.wins++;
    gameState.stats.streak++;
    localStorage.setItem('pokedle_wins', gameState.stats.wins);
    localStorage.setItem('pokedle_streak', gameState.stats.streak);

    if (gameState.activeMode === 'order') {
        gameState.unlockedDexIds.add(target.id);
        localStorage.setItem('pokedle_unlocked_dex', JSON.stringify([...gameState.unlockedDexIds]));
        updatePool();
    }

    const modal = document.getElementById('winModal');
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalGuessesCount = document.getElementById('modalGuessesCount');
    const modalModeName = document.getElementById('modalModeName');
    const modalScore = document.getElementById('modalScore');

    const artUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${target.id}.png`;
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${target.id}.png`;

    if (modalImg) {
        modalImg.onerror = () => { modalImg.src = fallbackUrl; };
        modalImg.src = artUrl;
    }

    if (modalName) {
        modalName.innerText = target.name;
    }

    let attemptsCount = 1;
    if (gameState.activeMode === 'termo') {
        attemptsCount = (gameState.modeGuesses.termo || []).length || 1;
    } else if (gameState.activeMode === 'order') {
        attemptsCount = (gameState.slotErrors[target.id] || 0) + 1;
    } else {
        attemptsCount = (gameState.modeGuesses[gameState.activeMode] || []).length || 1;
    }

    if (modalGuessesCount) modalGuessesCount.innerText = attemptsCount;

    const modeNames = {
        classic: 'CLÁSSICO',
        order: 'ORDEM',
        silhouette: 'SILHUETA',
        pokedex: 'POKÉDEX',
        sound: 'SOM',
        termo: 'TERMO'
    };
    if (modalModeName) modalModeName.innerText = modeNames[gameState.activeMode] || 'GERAL';

    let scorePct = Math.max(10, Math.round(100 / attemptsCount));
    if (modalScore) modalScore.innerText = `${scorePct}%`;

    if (modal) modal.classList.add('active');
}

export const showWinModal = handleWin;

export function closeModalAndNext() {
    const modal = document.getElementById('winModal');
    if (modal) modal.classList.remove('active');

    if (window.resetGame) {
        window.resetGame(gameState.activeMode);
    }
}
