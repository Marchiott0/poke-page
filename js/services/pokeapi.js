import { ALL_POKEMON } from '../data/database.js';
import { gameState, getActiveTarget, updatePool } from '../state/gameState.js';

const pokemonDataCache = new Map();

export async function fetchPokemonDetails(poke) {
    if (!poke) return poke;
    if (poke.isFetched) return poke;
    if (pokemonDataCache.has(poke.id)) {
        Object.assign(poke, pokemonDataCache.get(poke.id));
        poke.isFetched = true;
        return poke;
    }

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.id}`);
        if (res.ok) {
            const data = await res.json();

            const rawType1 = data.types[0]?.type?.name || 'normal';
            poke.type1 = rawType1.charAt(0).toUpperCase() + rawType1.slice(1);

            if (data.types[1]) {
                const rawType2 = data.types[1].type.name;
                poke.type2 = rawType2.charAt(0).toUpperCase() + rawType2.slice(1);
            } else {
                poke.type2 = 'None';
            }

            poke.height = data.height / 10;
            poke.weight = data.weight / 10;

            let formattedName = data.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
            if (formattedName.toLowerCase() === 'nidoran-f') formattedName = 'Nidoran♀';
            if (formattedName.toLowerCase() === 'nidoran-m') formattedName = 'Nidoran♂';
            if (formattedName.toLowerCase() === 'mr-mime') formattedName = 'Mr. Mime';
            poke.name = formattedName;
        }

        const specRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}`);
        if (specRes.ok) {
            const specData = await specRes.json();

            const ptEntry = specData.flavor_text_entries.find(e => e.language.name === 'pt' || e.language.name === 'pt-BR');
            const enEntry = specData.flavor_text_entries.find(e => e.language.name === 'en');
            if (ptEntry) {
                poke.desc = ptEntry.flavor_text.replace(/[\n\f]/g, ' ');
            } else if (enEntry) {
                poke.desc = enEntry.flavor_text.replace(/[\n\f]/g, ' ');
            }

            if (specData.is_legendary) {
                poke.stage = 'Lendário';
            } else if (specData.is_mythical) {
                poke.stage = 'Mítico';
            } else if (!specData.evolves_from_species) {
                poke.stage = '1º Estágio';
            } else {
                const parentName = specData.evolves_from_species.name;
                const parentSpec = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${parentName}`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null);
                if (parentSpec && parentSpec.evolves_from_species) {
                    poke.stage = '3º Estágio';
                } else {
                    poke.stage = '2º Estágio';
                }
            }
        }

        poke.isFetched = true;
        pokemonDataCache.set(poke.id, {
            type1: poke.type1,
            type2: poke.type2,
            height: poke.height,
            weight: poke.weight,
            name: poke.name,
            desc: poke.desc,
            stage: poke.stage,
            isFetched: true
        });
    } catch (err) {
        console.log(`Erro ao buscar dados do Pokémon #${poke.id}`, err);
    }

    return poke;
}

export async function fetchOfficialPokemonNames(onCompleteCallback) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        if (!response.ok) return;
        const data = await response.json();

        // Atualizar nomes dos Pokémon placeholder
        data.results.forEach((item, idx) => {
            const id = idx + 1;
            const target = ALL_POKEMON.find(p => p.id === id);
            if (target && target.name.startsWith('Pokémon #')) {
                let formattedName = item.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
                if (formattedName.toLowerCase() === 'nidoran-f') formattedName = 'Nidoran♀';
                if (formattedName.toLowerCase() === 'nidoran-m') formattedName = 'Nidoran♂';
                if (formattedName.toLowerCase() === 'mr-mime') formattedName = 'Mr. Mime';
                target.name = formattedName;
            }
        });

        // Buscar tipos de todos os 18 tipos em paralelo (corrigido: Promise.all garante
        // que o callback só é chamado DEPOIS que todos os tipos forem processados)
        const types = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
                       'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
                       'dragon', 'steel', 'fairy', 'dark'];

        await Promise.all(types.map(async (t) => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/type/${t}`);
                if (!res.ok) return;
                const typeData = await res.json();
                const typeFormatted = t.charAt(0).toUpperCase() + t.slice(1);
                typeData.pokemon.forEach(p => {
                    const id = parseInt(p.pokemon.url.split('/').filter(Boolean).pop());
                    const pokeObj = ALL_POKEMON.find(item => item.id === id);
                    if (pokeObj) {
                        if (p.slot === 1) {
                            pokeObj.type1 = typeFormatted;
                        } else if (p.slot === 2) {
                            pokeObj.type2 = typeFormatted;
                        }
                    }
                });
            } catch (err) { /* tipo indisponível, manter dado local */ }
        }));

        updatePool();

        if (typeof onCompleteCallback === 'function') {
            onCompleteCallback();
        }
    } catch (err) {
        console.log('Modo offline / API indisponível — usando dados locais.');
        // Chamar callback mesmo offline para que a UI inicialize
        if (typeof onCompleteCallback === 'function') {
            onCompleteCallback();
        }
    }
}

export function playCry() {
    const target = getActiveTarget();
    if (!target) return;
    const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${target.id}.ogg`;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
        const legacyAudio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${target.id}.ogg`);
        legacyAudio.play().catch(() => console.log('Áudio indisponível'));
    });
}
