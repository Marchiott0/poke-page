import { gameState, updatePool } from '../state/gameState.js';
import { ALL_POKEMON } from '../data/database.js';
import { updateHintsUI } from './hintsUI.js';
import { showToastNotification } from './toast.js';
import { showWinModal } from './modalUI.js';

export function renderOrderDexBoard() {
    const dexGrid = document.getElementById('orderDexGrid');
    const progressBar = document.getElementById('orderProgressBar');
    const progressText = document.getElementById('orderProgressText');

    if (!dexGrid) return;

    const list = gameState.currentPool;

    if (progressBar && progressText) {
        const total = list.length;
        const unlockedCount = list.filter(p => gameState.unlockedDexIds.has(p.id)).length;
        const pct = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;
        progressBar.style.width = `${pct}%`;
        progressText.innerText = `${unlockedCount} / ${total} REGISTRADOS (${pct}%)`;
    }

    dexGrid.innerHTML = list.map(poke => {
        const isUnlocked = gameState.unlockedDexIds.has(poke.id);
        const isActive = gameState.activeDexSlotId === poke.id;
        const padId = String(poke.id).padStart(3, '0');
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;

        return `
            <div id="dexSlot_${poke.id}" class="dex-slot ${isUnlocked ? 'unlocked' : ''} ${isActive ? 'active-focus' : ''}" onclick="selectDexSlot(${poke.id})">
                <span class="slot-num">#${padId}</span>
                ${isUnlocked ? `
                    <img src="${imgUrl}" alt="${poke.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                    <span class="slot-name">${poke.name}</span>
                ` : `
                    <span class="slot-locked-icon">❓</span>
                    <span class="slot-name" style="color: #64748b;">???</span>
                `}
            </div>
        `;
    }).join('');
}

export function handleOrderCorrectGuess(poke) {
    gameState.unlockedDexIds.add(poke.id);
    localStorage.setItem('pokedle_unlocked_dex', JSON.stringify([...gameState.unlockedDexIds]));

    // Atualizar pool e encontrar próximo slot bloqueado
    updatePool();
    renderOrderDexBoard();

    // Efeito visual de desbloqueio imediato no slot
    const newlyUnlockedSlot = document.getElementById(`dexSlot_${poke.id}`);
    if (newlyUnlockedSlot) {
        newlyUnlockedSlot.classList.add('just-unlocked');
        setTimeout(() => newlyUnlockedSlot.classList.remove('just-unlocked'), 1000);
    }

    if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    // Mostrar modal de vitória — consistente com os outros modos
    setTimeout(() => showWinModal(poke), 400);
}

export function selectDexSlot(id) {
    if (gameState.unlockedDexIds.has(id)) {
        showToastNotification('Pokémon já registrado na Pokédex!');
        return;
    }
    gameState.activeDexSlotId = id;
    gameState.activeHintRevealed = null;
    renderOrderDexBoard();
    updateHintsUI();
    const searchBox = document.getElementById('searchBox');
    if (searchBox) searchBox.focus();
}

export function clearUnlockedDex() {
    if (confirm('Deseja realmente reiniciar todo o progresso da Pokédex Salva?')) {
        gameState.unlockedDexIds.clear();
        localStorage.removeItem('pokedle_unlocked_dex');
        updatePool();
        renderOrderDexBoard();
        showToastNotification('Pokédex reiniciada!');
    }
}
