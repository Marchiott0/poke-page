import { gameState, resetGame } from './state/gameState.js';
import { setupSecurity } from './core/security.js';
import { renderGenFilterUI, toggleGen, selectGens } from './ui/genFilterUI.js';
import { setupSearchUI } from './ui/searchUI.js';
import { switchMode, renderModeDisplay, drawSilhouetteCanvas } from './ui/modeDisplayUI.js';
import { triggerHint, updateHintsUI } from './ui/hintsUI.js';
import { playCry, fetchOfficialPokemonNames, fetchPokemonDetails } from './services/pokeapi.js';
import { closeModalAndNext } from './ui/modalUI.js';
import { clearUnlockedDex, selectDexSlot } from './ui/orderUI.js';
import { setupTermoPhysicalKeyboard, handleTermoKeyClick } from './ui/termoUI.js';

// Atribuição imediata no objeto global window para garantir responsividade total aos eventos HTML inline (onclick, etc.)
window.switchMode = switchMode;
window.renderModeDisplay = renderModeDisplay;
window.triggerHint = triggerHint;
window.selectGens = selectGens;
window.toggleGen = toggleGen;
window.resetGame = resetGame;
window.playCry = playCry;
window.closeModalAndNext = closeModalAndNext;
window.clearUnlockedDex = clearUnlockedDex;
window.selectDexSlot = selectDexSlot;
window.handleTermoKeyClick = handleTermoKeyClick;
window.drawSilhouetteCanvas = drawSilhouetteCanvas;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Segurança
    setupSecurity();

    // 2. Renderizar UI de Filtro de Gerações
    renderGenFilterUI();

    // 3. Configurar cliques nas abas de modo (única fonte de verdade, sem onclick inline no HTML)
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const btn = e.target.closest('.mode-tab');
            if (btn && btn.dataset.mode) {
                switchMode(btn.dataset.mode);
            }
        });
    });

    // 4. Configurar Eventos da Barra de Busca
    setupSearchUI();

    // 5. Configurar Teclado Físico do Termo
    setupTermoPhysicalKeyboard();

    // 6. Inicializar Jogo e Sorteio (SOMENTE aqui, não no módulo de estado)
    resetGame();

    // 7. Pré-buscar dados reais dos alvos sorteados em background
    //    Garante que Height/Weight/Stage/Type sejam reais antes da primeira comparação
    const modesWithAtributes = ['classic', 'silhouette', 'pokedex', 'sound'];
    modesWithAtributes.forEach(mode => {
        const target = gameState.modeTargets[mode];
        if (target) {
            fetchPokemonDetails(target).catch(() => {});
        }
    });

    // 8. Atualizar nomes e tipos oficiais em segundo plano via PokéAPI
    fetchOfficialPokemonNames(() => {
        renderModeDisplay();
    });

    console.log('🎮 Poké-Page Game Boy Edition carregado e pronto para jogar!');
});
