import { gameState, getActiveTarget } from '../state/gameState.js';
import { ALL_POKEMON } from '../data/database.js';
import { handleClassicGuess } from './classicUI.js';
import { handleOrderCorrectGuess } from './orderUI.js';
import { submitTermoGuess } from './termoUI.js';
import { showWinModal } from './modalUI.js';
import { showToastNotification } from './toast.js';
import { fetchPokemonDetails } from '../services/pokeapi.js';

let selectedIndex = -1;

export function setupSearchUI() {
    const searchBox = document.getElementById('searchBox');
    const autocompleteList = document.getElementById('autocompleteList');

    if (!searchBox || !autocompleteList) return;

    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        renderAutocomplete(query);
    });

    searchBox.addEventListener('keydown', (e) => {
        const items = autocompleteList.querySelectorAll('.autocomplete-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (items.length === 0) return;
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (items.length === 0) return;
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                items[selectedIndex].click();
            } else if (items.length > 0) {
                items[0].click();
            }
        } else if (e.key === 'Escape') {
            autocompleteList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.style.display = 'none';
        }
    });
}

export function renderAutocomplete(query) {
    const autocompleteList = document.getElementById('autocompleteList');
    if (!autocompleteList) return;

    selectedIndex = -1;

    if (!query) {
        // No modo Termo, sugerir Pokémon com o mesmo número de letras
        if (gameState.activeMode === 'termo') {
            renderTermoFilteredAutocomplete('');
            return;
        }
        autocompleteList.style.display = 'none';
        return;
    }

    if (gameState.activeMode === 'termo' || gameState.activeMode === 'dueto' || gameState.activeMode === 'quarteto') {
        renderTermoFilteredAutocomplete(query);
        return;
    }

    const matches = gameState.currentPool.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const idMatch = String(p.id).includes(query);
        return nameMatch || idMatch;
    }).slice(0, 10);

    if (matches.length === 0) {
        autocompleteList.style.display = 'none';
        return;
    }

    autocompleteList.innerHTML = matches.map((poke) => {
        const padId = String(poke.id).padStart(3, '0');
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
        return `
            <div class="autocomplete-item" data-id="${poke.id}" onclick="submitGuessById(${poke.id})">
                <img src="${imgUrl}" alt="${poke.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="poke-name">${poke.name}</span>
                <span class="poke-id">#${padId}</span>
            </div>
        `;
    }).join('');

    autocompleteList.style.display = 'block';
}

/* FILTRO EXCLUSIVO PARA O MODO WORDLE: MOSTRA APENAS POKÉMON COM O NÚMERO DE LETRAS IGUAL AO ALVO */
function renderTermoFilteredAutocomplete(query) {
    const autocompleteList = document.getElementById('autocompleteList');
    const mode = gameState.activeMode;
    const targets = gameState.modeTargets[mode];
    if (!targets || targets.length === 0 || !autocompleteList) return;

    const targetCleanName = targets[0].name.replace(/[^a-zA-Z]/g, '');
    const requiredLength = targetCleanName.length;

    const matches = gameState.currentPool.filter(p => {
        const cleanName = p.name.replace(/[^a-zA-Z]/g, '');
        if (cleanName.length !== requiredLength) return false;
        if (!query) return true;
        return cleanName.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query);
    }).slice(0, 12);

    if (matches.length === 0) {
        autocompleteList.innerHTML = `
            <div class="autocomplete-item" style="color: #ef4444; justify-content: center; font-size: 0.85rem;">
                Nenhum Pokémon encontrado com ${requiredLength} letras.
            </div>
        `;
        autocompleteList.style.display = 'block';
        return;
    }

    autocompleteList.innerHTML = matches.map(poke => {
        const padId = String(poke.id).padStart(3, '0');
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
        const cleanName = poke.name.replace(/[^a-zA-Z]/g, '');
        return `
            <div class="autocomplete-item" data-id="${poke.id}" onclick="submitTermoByPokeName('${cleanName}')">
                <img src="${imgUrl}" alt="${poke.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="poke-name" style="color: #4ade80;">${poke.name}</span>
                <span class="poke-id" style="font-size: 0.75rem; color: #facc15;">(${cleanName.length} Letras) #${padId}</span>
            </div>
        `;
    }).join('');

    autocompleteList.style.display = 'block';
}

function updateSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedIndex);
    });
}

/**
 * Submete um palpite pelo ID do Pokémon.
 * Para modos com comparação de atributos (Classic, Pokédex, Silhueta, Som),
 * busca os dados reais da PokéAPI antes de comparar, garantindo precisão.
 */
export async function submitGuessById(id) {
    const searchBox = document.getElementById('searchBox');
    const autocompleteList = document.getElementById('autocompleteList');
    if (searchBox) searchBox.value = '';
    if (autocompleteList) autocompleteList.style.display = 'none';

    const poke = ALL_POKEMON.find(p => p.id === id);
    if (!poke) return;

    const mode = gameState.activeMode;
    const target = getActiveTarget();

    if (mode === 'order') {
        if (target && poke.id === target.id) {
            handleOrderCorrectGuess(poke);
        } else {
            const errList = gameState.modeGuesses.order || [];
            errList.push(poke);
            gameState.modeGuesses.order = errList;
            showToastNotification(`❌ Incorreto! O Pokémon #${String(target.id).padStart(3, '0')} não é ${poke.name}.`);
        }
        return;
    }

    if (mode === 'termo' || mode === 'dueto' || mode === 'quarteto') {
        // Nos modos diários, a busca auxiliar usa submitTermoByPokeName
        return;
    }

    // Para Classic, Silhueta, Pokédex e Som:
    // Busca dados reais (height, weight, stage, types) do alvo e do palpite
    // antes de fazer qualquer comparação de atributos.
    if (target && !target.isFetched) {
        await fetchPokemonDetails(target).catch(() => {});
    }
    if (!poke.isFetched) {
        await fetchPokemonDetails(poke).catch(() => {});
    }

    handleClassicGuess(poke);

    if (target && poke.id === target.id) {
        showWinModal(poke);
    }
}

export function submitTermoByPokeName(cleanName) {
    const searchBox = document.getElementById('searchBox');
    const autocompleteList = document.getElementById('autocompleteList');
    if (searchBox) searchBox.value = '';
    if (autocompleteList) autocompleteList.style.display = 'none';

    submitTermoGuess(cleanName.toUpperCase());
}

window.submitGuessById = submitGuessById;
window.submitTermoByPokeName = submitTermoByPokeName;
