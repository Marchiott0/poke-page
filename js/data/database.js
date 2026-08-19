import { GENERATIONS } from './constants.js';

export const POKEMON_DATABASE = [
    { id: 1, name: 'Bulbasaur', gen: 1, type1: 'Grass', type2: 'Poison', height: 0.7, weight: 6.9, stage: '1º Estágio', desc: 'Carrega uma semente nas costas desde o nascimento que cresce com ele.' },
    { id: 2, name: 'Ivysaur', gen: 1, type1: 'Grass', type2: 'Poison', height: 1.0, weight: 13.0, stage: '2º Estágio', desc: 'Quando o botão em suas costas começa a inchar, exala um aroma doce.' },
    { id: 3, name: 'Venusaur', gen: 1, type1: 'Grass', type2: 'Poison', height: 2.0, weight: 100.0, stage: '3º Estágio', desc: 'A flor em suas costas desabrocha totalmente ao absorver energia solar.' },
    { id: 4, name: 'Charmander', gen: 1, type1: 'Fire', type2: 'None', height: 0.6, weight: 8.5, stage: '1º Estágio', desc: 'A chama na ponta de sua cauda indica sua saúde e força vital.' },
    { id: 5, name: 'Charmeleon', gen: 1, type1: 'Fire', type2: 'None', height: 1.1, weight: 19.0, stage: '2º Estágio', desc: 'Derruba seus oponentes usando suas garras afiadas e cauda flamejante.' },
    { id: 6, name: 'Charizard', gen: 1, type1: 'Fire', type2: 'Flying', height: 1.7, weight: 90.5, stage: '3º Estágio', desc: 'Voa pelos céus procurando oponentes poderosos para cuspir fogo.' },
    { id: 7, name: 'Squirtle', gen: 1, type1: 'Water', type2: 'None', height: 0.5, weight: 9.0, stage: '1º Estágio', desc: 'Seu casco não serve apenas para proteção; reduz a resistência na água.' },
    { id: 8, name: 'Wartortle', gen: 1, type1: 'Water', type2: 'None', height: 1.0, weight: 22.5, stage: '2º Estágio', desc: 'É amplamente reconhecido por sua cauda peluda e orelhas felpudas.' },
    { id: 9, name: 'Blastoise', gen: 1, type1: 'Water', type2: 'None', height: 1.6, weight: 85.5, stage: '3º Estágio', desc: 'Lança jatos de água com alta pressão a partir dos canhões em seu casco.' },
    { id: 10, name: 'Caterpie', gen: 1, type1: 'Bug', type2: 'None', height: 0.3, weight: 2.9, stage: '1º Estágio', desc: 'Para se proteger, exala um cheiro forte de suas antenas vermelhas.' },
    { id: 11, name: 'Metapod', gen: 1, type1: 'Bug', type2: 'None', height: 0.7, weight: 9.9, stage: '2º Estágio', desc: 'Seu casco é duro como aço para proteger o corpo macio que está evoluindo.' },
    { id: 12, name: 'Butterfree', gen: 1, type1: 'Bug', type2: 'Flying', height: 1.1, weight: 32.0, stage: '3º Estágio', desc: 'Voa de flor em flor coletando pólen com suas asas repelentes de água.' },
    { id: 13, name: 'Weedle', gen: 1, type1: 'Bug', type2: 'Poison', height: 0.3, weight: 3.2, stage: '1º Estágio', desc: 'Possui um ferrão afiado e venenoso de cinco centímetros na cabeça.' },
    { id: 14, name: 'Kakuna', gen: 1, type1: 'Bug', type2: 'Poison', height: 0.6, weight: 10.0, stage: '2º Estágio', desc: 'Praticamente imóvel enquanto espera para evoluir em sua casca.' },
    { id: 15, name: 'Beedrill', gen: 1, type1: 'Bug', type2: 'Poison', height: 1.0, weight: 29.5, stage: '3º Estágio', desc: 'Ataca em bandos usando três ferrões venenosos nos braços e abdômen.' },
    { id: 16, name: 'Pidgey', gen: 1, type1: 'Normal', type2: 'Flying', height: 0.3, weight: 1.8, stage: '1º Estágio', desc: 'Um Pokémon dócil que prefere bater asas na poeira para se esconder.' },
    { id: 17, name: 'Pidgeotto', gen: 1, type1: 'Normal', type2: 'Flying', height: 1.1, weight: 30.0, stage: '2º Estágio', desc: 'Voa em círculos procurando presas com sua visão aguçada.' },
    { id: 18, name: 'Pidgeot', gen: 1, type1: 'Normal', type2: 'Flying', height: 1.5, weight: 39.5, stage: '3º Estágio', desc: 'Voa na velocidade de Mach 2 e cria rajadas de vento poderosas.' },
    { id: 19, name: 'Rattata', gen: 1, type1: 'Normal', type2: 'Flying', height: 0.3, weight: 3.5, stage: '1º Estágio', desc: 'Rói objetos duros com seus dentes incisivos que nunca param de crescer.' },
    { id: 25, name: 'Pikachu', gen: 1, type1: 'Electric', type2: 'None', height: 0.4, weight: 6.0, stage: '1º Estágio', desc: 'Armazena eletricidade nas bolsas vermelhas contidas em suas bochechas.' },
    { id: 26, name: 'Raichu', gen: 1, type1: 'Electric', type2: 'None', height: 0.8, weight: 30.0, stage: '2º Estágio', desc: 'Se acumular muita eletricidade, descarrega no chão usando sua cauda.' },
    { id: 39, name: 'Jigglypuff', gen: 1, type1: 'Normal', type2: 'Fairy', height: 0.5, weight: 5.5, stage: '1º Estágio', desc: 'Canta uma canção de ninar que faz qualquer oponente adormecer.' },
    { id: 52, name: 'Meowth', gen: 1, type1: 'Normal', type2: 'None', height: 0.4, weight: 4.2, stage: '1º Estágio', desc: 'Adora objetos brilhantes e moedas reluzentes.' },
    { id: 54, name: 'Psyduck', gen: 1, type1: 'Water', type2: 'None', height: 0.8, weight: 19.6, stage: '1º Estágio', desc: 'Sofre constantemente de dor de cabeça e usa poderes misteriosos.' },
    { id: 94, name: 'Gengar', gen: 1, type1: 'Ghost', type2: 'Poison', height: 1.5, weight: 40.5, stage: '3º Estágio', desc: 'Esconde-se nas sombras das pessoas e diminui a temperatura do ambiente.' },
    { id: 130, name: 'Gyarados', gen: 1, type1: 'Water', type2: 'Flying', height: 6.5, weight: 235.0, stage: '2º Estágio', desc: 'Extremamente feroz, é capaz de destruir cidades inteiras quando enfurecido.' },
    { id: 131, name: 'Lapras', gen: 1, type1: 'Water', type2: 'Ice', height: 2.5, weight: 220.0, stage: 'Sem Evolução', desc: 'Um Pokémon gentil que adora transportar pessoas através dos oceanos.' },
    { id: 133, name: 'Eevee', gen: 1, type1: 'Normal', type2: 'None', height: 0.3, weight: 6.5, stage: '1º Estágio', desc: 'Possui uma estrutura genética instável que permite evoluir para várias formas.' },
    { id: 143, name: 'Snorlax', gen: 1, type1: 'Normal', type2: 'None', height: 2.1, weight: 460.0, stage: '2º Estágio', desc: 'Come cerca de 400 quilos de comida por dia antes de cair no sono.' },
    { id: 149, name: 'Dragonite', gen: 1, type1: 'Dragon', type2: 'Flying', height: 2.2, weight: 210.0, stage: '3º Estágio', desc: 'Consegue dar a volta ao mundo em apenas 16 horas.' },
    { id: 150, name: 'Mewtwo', gen: 1, type1: 'Psychic', type2: 'None', height: 2.0, weight: 122.0, stage: 'Lendário', desc: 'Criado por manipulação genética, possui um coração extremamente frio.' },
    { id: 151, name: 'Mew', gen: 1, type1: 'Psychic', type2: 'None', height: 0.4, weight: 4.0, stage: 'Mítico', desc: 'Dizem conter o código genético de todos os Pokémon existentes.' },
    { id: 152, name: 'Chikorita', gen: 2, type1: 'Grass', type2: 'None', height: 0.9, weight: 6.4, stage: '1º Estágio', desc: 'Usa a folha em sua cabeça para medir a temperatura e a umidade do ar.' },
    { id: 155, name: 'Cyndaquil', gen: 2, type1: 'Fire', type2: 'None', height: 0.5, weight: 7.9, stage: '1º Estágio', desc: 'Dispara chamas pelas costas se estiver bravo ou assustado.' },
    { id: 158, name: 'Totodile', gen: 2, type1: 'Water', type2: 'None', height: 0.6, weight: 9.5, stage: '1º Estágio', desc: 'Tem o hábito de morder tudo o que vê pela frente com suas mandíbulas fortes.' },
    { id: 249, name: 'Lugia', gen: 2, type1: 'Psychic', type2: 'Flying', height: 5.2, weight: 216.0, stage: 'Lendário', desc: 'Guardião dos mares; o bater de suas asas cria tempestades de 40 dias.' },
    { id: 250, name: 'Ho-Oh', gen: 2, type1: 'Fire', type2: 'Flying', height: 3.8, weight: 199.0, stage: 'Lendário', desc: 'Deixa um arco-íris brilhante por onde voa com suas asas de sete cores.' },
    { id: 252, name: 'Treecko', gen: 3, type1: 'Grass', type2: 'None', height: 0.5, weight: 5.0, stage: '1º Estágio', desc: 'Consegue escalar paredes verticais usando os ganchos minúsculos das patas.' },
    { id: 255, name: 'Torchic', gen: 3, type1: 'Fire', type2: 'None', height: 0.4, weight: 2.5, stage: '1º Estágio', desc: 'Tem um saco de fogo interno; abraçá-lo passa uma sensação quentinha.' },
    { id: 258, name: 'Mudkip', gen: 3, type1: 'Water', type2: 'None', height: 0.4, weight: 7.6, stage: '1º Estágio', desc: 'A barbatana em sua cabeça funciona como um radar para detectar correntes.' },
    { id: 384, name: 'Rayquaza', gen: 3, type1: 'Dragon', type2: 'Flying', height: 7.0, weight: 206.5, stage: 'Lendário', desc: 'Vive na camada de ozônio e acalma o conflito entre Kyogre e Groudon.' },
    { id: 387, name: 'Turtwig', gen: 4, type1: 'Grass', type2: 'None', height: 0.4, weight: 10.2, stage: '1º Estágio', desc: 'O casco feito de terra endurece quando ele bebe água.' },
    { id: 390, name: 'Chimchar', gen: 4, type1: 'Fire', type2: 'None', height: 0.5, weight: 6.2, stage: '1º Estágio', desc: 'A chama em seu traseiro é alimentada por gás produzido em seu estômago.' },
    { id: 393, name: 'Piplup', gen: 4, type1: 'Water', type2: 'None', height: 0.4, weight: 5.2, stage: '1º Estágio', desc: 'Orgulhoso e independente, não aceita comida de estranhos com facilidade.' },
    { id: 448, name: 'Lucario', gen: 4, type1: 'Fighting', type2: 'Steel', height: 1.2, weight: 54.0, stage: '2º Estágio', desc: 'Sente a aura emitida por todos os seres vivos e consegue ler pensamentos.' },
    { id: 493, name: 'Arceus', gen: 4, type1: 'Normal', type2: 'None', height: 3.2, weight: 320.0, stage: 'Mítico', desc: 'Reconhecido como o criador de todo o universo Pokémon.' },
    { id: 495, name: 'Snivy', gen: 5, type1: 'Grass', type2: 'None', height: 0.6, weight: 8.1, stage: '1º Estágio', desc: 'Realiza fotossíntese com a folha de sua cauda; corre mais rápido ao sol.' },
    { id: 498, name: 'Tepig', gen: 5, type1: 'Fire', type2: 'None', height: 0.5, weight: 9.9, stage: '1º Estágio', desc: 'Sopra bolas de fogo por seu focinho e adora assar bagas antes de comer.' },
    { id: 501, name: 'Oshawott', gen: 5, type1: 'Water', type2: 'None', height: 0.5, weight: 5.9, stage: '1º Estágio', desc: 'Usa a concha de seu barriga como lâmina para cortar alimentos ou lutar.' },
    { id: 643, name: 'Reshiram', gen: 5, type1: 'Dragon', type2: 'Fire', height: 3.2, weight: 330.0, stage: 'Lendário', desc: 'Sua cauda aquece o ar e pode mudar a temperatura do planeta inteiro.' },
    { id: 650, name: 'Chespin', gen: 6, type1: 'Grass', type2: 'None', height: 0.4, weight: 9.0, stage: '1º Estágio', desc: 'O casco pontiagudo em sua cabeça pode ricochetear ataques pesados.' },
    { id: 653, name: 'Fennekin', gen: 6, type1: 'Fire', type2: 'None', height: 0.4, weight: 9.4, stage: '1º Estágio', desc: 'Sopra ar quente de suas orelhas grandes para afastar inimigos.' },
    { id: 656, name: 'Froakie', gen: 6, type1: 'Water', type2: 'None', height: 0.3, weight: 7.0, stage: '1º Estágio', desc: 'Se protege com bolhas de sabão flexíveis no peito e nas costas.' },
    { id: 658, name: 'Greninja', gen: 6, type1: 'Water', type2: 'Dark', height: 1.5, weight: 40.0, stage: '3º Estágio', desc: 'Cria estrelas ninja de água comprimida capazes de cortar aço.' },
    { id: 722, name: 'Rowlet', gen: 7, type1: 'Grass', type2: 'Flying', height: 0.3, weight: 1.5, stage: '1º Estágio', desc: 'Consegue girar seu pescoço em 180 graus e atacar silenciosamente à noite.' },
    { id: 725, name: 'Litten', gen: 7, type1: 'Fire', type2: 'None', height: 0.4, weight: 4.3, stage: '1º Estágio', desc: 'Queima os pelos que engole ao se lamber para cuspir bolas de fogo.' },
    { id: 728, name: 'Popplio', gen: 7, type1: 'Water', type2: 'None', height: 0.4, weight: 7.5, stage: '1º Estágio', desc: 'Cria bolhas de água pelo nariz e as usa para fazer manobras acrobáticas.' },
    { id: 778, name: 'Mimikyu', gen: 7, type1: 'Ghost', type2: 'Fairy', height: 0.2, weight: 0.7, stage: 'Sem Evolução', desc: 'Usa um disfarce de Pikachu para tentar fazer amigos sem assustá-los.' },
    { id: 810, name: 'Grookey', gen: 8, type1: 'Grass', type2: 'None', height: 0.3, weight: 5.0, stage: '1º Estágio', desc: 'Bate sua baqueta de madeira para revitalizar plantas ao seu redor.' },
    { id: 813, name: 'Scorbunny', gen: 8, type1: 'Fire', type2: 'None', height: 0.3, weight: 4.5, stage: '1º Estágio', desc: 'Corre para aquecer sua temperatura corporal e soltar fogo pelas patas.' },
    { id: 816, name: 'Sobble', gen: 8, type1: 'Water', type2: 'None', height: 0.3, weight: 4.0, stage: '1º Estágio', desc: 'Quando chora, suas lágrimas fazem com que todos ao redor chorem também.' },
    { id: 888, name: 'Zacian', gen: 8, type1: 'Fairy', type2: 'Steel', height: 2.8, weight: 355.0, stage: 'Lendário', desc: 'Conhecido como o herói lendário que empunha uma espada reluzente.' },
    { id: 906, name: 'Sprigatito', gen: 9, type1: 'Grass', type2: 'None', height: 0.4, weight: 4.1, stage: '1º Estágio', desc: 'Amasse com as patas para liberar um aroma doce que acalma oponentes.' },
    { id: 909, name: 'Fuecoco', gen: 9, type1: 'Fire', type2: 'None', height: 0.4, weight: 9.8, stage: '1º Estágio', desc: 'Absorve calor através de suas escamas para gerar energia de fogo.' },
    { id: 912, name: 'Quaxly', gen: 9, type1: 'Water', type2: 'None', height: 0.5, weight: 6.1, stage: '1º Estágio', desc: 'Seu topete possui um gel especial que repele água e sujeira.' },
    { id: 1008, name: 'Miraidon', gen: 9, type1: 'Electric', type2: 'Dragon', height: 3.5, weight: 240.0, stage: 'Lendário', desc: 'Um Pokémon vindo do futuro distante que se transforma em um veículo aquático e terrestre.' }
];

export function buildFullDex() {
    const fullList = [...POKEMON_DATABASE];
    const existingIds = new Set(fullList.map(p => p.id));

    GENERATIONS.forEach(g => {
        for (let id = g.start; id <= g.end; id++) {
            if (!existingIds.has(id)) {
                fullList.push({
                    id: id,
                    name: `Pokémon #${id}`,
                    gen: g.gen,
                    type1: ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Flying'][id % 8],
                    type2: id % 3 === 0 ? ['Poison', 'Steel', 'Fairy', 'Ground', 'Ghost'][id % 5] : 'None',
                    height: Math.round(((id % 25) * 0.1 + 0.3) * 10) / 10,
                    weight: Math.round(((id % 80) * 1.5 + 2.0) * 10) / 10,
                    stage: id % 4 === 0 ? '3º Estágio' : (id % 2 === 0 ? '2º Estágio' : '1º Estágio'),
                    desc: `Um incrível Pokémon descoberto na região da ${g.name}.`
                });
            }
        }
    });
    return fullList.sort((a, b) => a.id - b.id);
}

export const ALL_POKEMON = buildFullDex();
