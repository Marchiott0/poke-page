import { gameState, getActiveTarget } from '../state/gameState.js';
import { ALL_POKEMON } from '../data/database.js';
import { renderOrderDexBoard } from './orderUI.js';
import { renderTermoGrid } from './termoUI.js';
import { renderAllGuessesForActiveMode } from './classicUI.js';
import { updateHintsUI } from './hintsUI.js';
import { fetchPokemonDetails, playCry } from '../services/pokeapi.js';
import { showWordleIntroModal } from './modalUI.js';

export function switchMode(mode) {
    gameState.activeMode = mode;
    gameState.activeHintRevealed = null;

    document.querySelectorAll('.mode-tab').forEach(tab => {
        if (mode === 'dueto' || mode === 'quarteto') {
            tab.classList.toggle('active', tab.dataset.mode === 'termo');
        } else {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        }
    });

    const classicBoard = document.getElementById('classicBoard');
    const orderBoard = document.getElementById('orderBoard');
    const termoPanel = document.getElementById('termoPanel');
    const silhouetteBoard = document.getElementById('silhouetteBoard');
    
    const searchContainer = document.getElementById('searchContainer');
    const defaultSearchSlot = document.getElementById('defaultSearchSlot');
    const silhouetteSearchSlot = document.getElementById('silhouetteSearchSlot');

    if (classicBoard) {
        classicBoard.style.display = (mode === 'classic' || mode === 'pokedex' || mode === 'sound') ? 'flex' : 'none';
        // sound-mode oculta a tabela de atributos via CSS, exibindo apenas lista de nomes
        classicBoard.classList.toggle('sound-mode', mode === 'sound');
    }
    if (orderBoard) orderBoard.style.display = (mode === 'order') ? 'flex' : 'none';
    if (termoPanel) termoPanel.style.display = (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') ? 'flex' : 'none';
    if (silhouetteBoard) silhouetteBoard.style.display = (mode === 'silhouette') ? 'flex' : 'none';

    // Mover dinamicamente a barra de busca para o local correto dependendo do modo
    if (searchContainer) {
        searchContainer.style.display = 'block';
        if (mode === 'silhouette' && silhouetteSearchSlot) {
            silhouetteSearchSlot.appendChild(searchContainer);
        } else if (defaultSearchSlot) {
            defaultSearchSlot.appendChild(searchContainer);
        }

        const searchInput = document.getElementById('searchBox');
        if (searchInput) {
            if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
                const targets = gameState.modeTargets[mode];
                const targetNameLen = targets && targets.length > 0 ? targets[0].name.replace(/[^a-zA-Z]/g, '').length : 0;
                searchInput.placeholder = `🔍 Busca Auxiliar: Pokémon com ${targetNameLen} letras...`;
            } else if (mode === 'silhouette') {
                searchInput.placeholder = "🔍 Quem é esse Pokémon? Digite o palpite...";
            } else {
                searchInput.placeholder = "Digite o nome ou nº do Pokémon...";
            }
        }
    }

    renderModeDisplay();

    if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
        showWordleIntroModal();
    }

    if (mode === 'order') {
        renderOrderDexBoard();
    } else if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
        renderTermoGrid();
    } else {
        renderAllGuessesForActiveMode();
    }

    updateHintsUI();

    const searchBox = document.getElementById('searchBox');
    if (searchBox) searchBox.focus();
}

export function renderModeDisplay() {
    const displayBox = document.getElementById('modeDisplayBox');
    if (!displayBox) return;

    const mode = gameState.activeMode;
    const target = getActiveTarget();

    displayBox.className = "mode-display-box " + `mode-theme-${mode}`;

    if (!target) {
        displayBox.innerHTML = '<div style="color:#94a3b8; font-family:\'Press Start 2P\', monospace; font-size:0.65rem;">CARREGANDO POKÉMON...</div>';
        return;
    }

    if (mode === 'classic') {
        displayBox.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <div style="font-family: 'Press Start 2P', monospace; font-size: 0.72rem; color: #38bdf8; margin-bottom: 6px; letter-spacing: 1px;">
                    ⚡ DIAGNÓSTICO POKÉDEX
                </div>
                <div style="font-size: 0.88rem; color: #cbd5e1; font-family: 'Pixelify Sans', monospace;">
                    Adivinhe o Pokémon por Tipo, Geração, Altura, Peso e Estágio Evolutivo!
                </div>
            </div>
        `;
    } else if (mode === 'silhouette') {
        displayBox.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <div style="font-family: 'Press Start 2P', monospace; font-size: 0.72rem; color: #ef4444; margin-bottom: 6px; letter-spacing: 1px;">
                    👤 MODO SILHUETA
                </div>
                <div style="font-size: 0.88rem; color: #cbd5e1; font-family: 'Pixelify Sans', monospace;">
                    Adivinhe o Pokémon por sua sombra no painel principal!
                </div>
            </div>
        `;
        renderSilhouetteBoardContent(target);
    } else if (mode === 'pokedex') {
        let descText = target.desc || 'Consultando arquivos da Pokédex de Kanto...';
        const isRevealed = (gameState.modeGuesses.pokedex || []).some(g => g.id === target.id);

        if (!isRevealed && target.name && !target.name.startsWith('Pokémon #')) {
            const escapedName = target.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            descText = descText.replace(new RegExp(escapedName, 'gi'), '<span class="dex-censor">██████</span>');
        }

        const padId = String(target.id).padStart(3, '0');
        displayBox.innerHTML = `
            <div style="width: 100%; position: relative;">
                <div class="pokedex-dossier-badge">CONFIDENCIAL #${padId}</div>
                <div class="dex-quote">
                    "${descText}"
                </div>
            </div>
        `;
        fetchPokemonDetails(target).then(updated => {
            if (gameState.activeMode === 'pokedex' && getActiveTarget().id === updated.id) {
                let freshDesc = updated.desc || descText;
                if (!isRevealed && updated.name && !updated.name.startsWith('Pokémon #')) {
                    const escaped = updated.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    freshDesc = freshDesc.replace(new RegExp(escaped, 'gi'), '<span class="dex-censor">██████</span>');
                }
                const quoteEl = displayBox.querySelector('.dex-quote');
                if (quoteEl) quoteEl.innerHTML = `"${freshDesc}"`;
            }
        });
    } else if (mode === 'sound') {
        displayBox.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div style="font-family: 'Press Start 2P', monospace; font-size: 0.65rem; color: #c084fc; letter-spacing: 1px;">
                    🔊 SOUND TEST POKÉMON
                </div>
                <button type="button" class="audio-btn-gb" onclick="window.playCry()">🔊</button>
                <div class="equalizer-bars-container">
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                </div>
            </div>
        `;
    } else if (mode === 'order') {
        const padId = String(target.id).padStart(3, '0');
        displayBox.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <div style="font-family: 'Press Start 2P', monospace; font-size: 0.72rem; color: #facc15;">
                    📖 CADERNETA POKÉDEX: SLOT #${padId}
                </div>
                <div style="font-size: 0.88rem; color: #4ade80; margin-top: 4px; font-family: 'Pixelify Sans', monospace;">
                    Qual Pokémon ocupa a posição #${padId} na Pokédex?
                </div>
            </div>
        `;
    } else if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
        const targetNameLen = target && target.length > 0 ? target[0].name.replace(/[^a-zA-Z]/g, '').length : 0;
        
        let title = '🔤 POKÉ-TERMO ARCADE';
        if (mode === 'dueto') title = '👯 DUETO ARCADE';
        if (mode === 'quarteto') title = '🧩 QUARTETO ARCADE';

        displayBox.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <div style="font-family: 'Press Start 2P', monospace; font-size: 0.72rem; color: #22c55e;">
                    ${title}
                </div>
                <div style="font-size: 0.85rem; color: #86efac; margin-top: 4px; font-family: 'Pixelify Sans', monospace;">
                    Descubra os Pokémon de <strong>${targetNameLen} letras</strong> em até 6 tentativas!
                </div>
                <div style="display: flex; gap: 4px; justify-content: center; margin-top: 10px;">
                    <button class="preset-btn" style="font-size: 0.6rem; padding: 4px 6px; ${mode === 'termo' ? 'background: #0f172a; border-color: #3b82f6;' : ''}" onclick="switchMode('termo')">TERMO</button>
                    <button class="preset-btn" style="font-size: 0.6rem; padding: 4px 6px; ${mode === 'dueto' ? 'background: #0f172a; border-color: #3b82f6;' : ''}" onclick="switchMode('dueto')">DUETO</button>
                    <button class="preset-btn" style="font-size: 0.6rem; padding: 4px 6px; ${mode === 'quarteto' ? 'background: #0f172a; border-color: #3b82f6;' : ''}" onclick="switchMode('quarteto')">QUARTETO</button>
                </div>
            </div>
        `;
    }
}

function renderSilhouetteBoardContent(target) {
    const imgEl = document.getElementById('silhouetteImg');
    const canvas = document.getElementById('silhouetteCanvas');
    if (!imgEl) return;

    if (canvas) canvas.style.display = 'none';
    imgEl.style.display = 'block';

    const isRevealed = (gameState.modeGuesses.silhouette || []).some(g => g.id === target.id);
    const artUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${target.id}.png`;

    imgEl.onerror = () => {
        imgEl.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${target.id}.png`;
    };

    imgEl.src = artUrl;
    imgEl.classList.toggle('revealed', isRevealed);
}

export function drawSilhouetteCanvas(id) {
    const canvas = document.getElementById('silhouetteCanvas');
    const imgEl = document.getElementById('silhouetteImg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const sprite = new Image();
    sprite.crossOrigin = "Anonymous";
    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    sprite.onload = () => {
        if (imgEl) imgEl.style.display = 'none';
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, 180, 180);
        ctx.drawImage(sprite, 0, 0, 180, 180);

        const isRevealed = (gameState.modeGuesses.silhouette || []).some(g => g.id === id);
        if (!isRevealed) {
            const imgData = ctx.getImageData(0, 0, 180, 180);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) {
                    data[i] = 10;
                    data[i + 1] = 15;
                    data[i + 2] = 25;
                }
            }
            ctx.putImageData(imgData, 0, 0);
        }
    };
}

window.drawSilhouetteCanvas = drawSilhouetteCanvas;
