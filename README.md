# Poke Page - Game Boy Color Edition

Um jogo web retro inspirado na estética clássica do Game Boy Color, focado em adivinhações e desafios do universo Pokémon. O projeto traz 5 modos de jogo interativos, filtros por geração e sistema de dicas dinâmico.

## Modos de Jogo

### 1. Modo Clássico
No modo clássico, seu objetivo é adivinhar o Pokémon secreto a partir das propriedades de cada palpite realizado.
- **Dicas visuais**: Cada tentativa exibe se o Tipo 1, Tipo 2, Geração, Altura, Peso e Estágio Evolutivo correspondem ao Pokémon correto.
- **Indicadores numéricos**: Setas indicam se a geração, altura ou peso do Pokémon alvo são maiores ou menores em relação ao seu palpite.

### 2. Modo Ordem
Um desafio para completar a Pokédex numérica sequencialmente.
- O jogo destaca um número de slot da Pokédex (ex: #001, #002...).
- Você deve digitar o nome correto do Pokémon correspondente àquela posição.
- Cada acerto revela o Pokémon na Pokédex e avança para a próxima vaga pendente.

### 3. Modo Silhueta
Inspirado no clássico segmento "Quem é esse Pokémon?".
- O Pokémon da rodada é renderizado como uma silhueta totalmente preta em uma tela Canvas.
- Ao acertar o palpite, a silhueta é revelada em cores e com sua arte oficial.

### 4. Modo Pokédex
Um teste de conhecimento sobre as descrições oficiais dos jogos.
- Exibe o trecho da entrada da Pokédex pertencente ao Pokémon da rodada.
- O nome do Pokémon é censurado no texto.
- Ao acertar, a descrição completa e sem censuras é liberada.

### 5. Modo Som
Adivinhação auditiva através dos brados clássicos dos Pokémon.
- Um botão de áudio permite reproduzir o som oficial do Pokémon.
- O jogador precisa reconhecer o Pokémon apenas ouvindo o áudio da voz/grito.

---

## Sistema de Dicas

Cada desafio conta com um painel lateral de suporte que desbloqueia dicas à medida que erros ocorrem:
- **Dica 1 (3 Erros)**: Revela a Geração, Tipos primário/secundário e o Estágio Evolutivo.
- **Dica 2 (6 Erros)**: Revela a primeira e última letra do nome do Pokémon, além do número total de letras.

---

## Recursos e Funcionalidades

- **Filtro de Gerações**: Escolha jogar com gerações específicas (Gen 1 a Gen 9) ou com a base de dados completa (1025 Pokémon).
- **Proteção Anti-Cheat**: Variáveis de estado e dados encapsulados em escopo privado (IIFE), prevenindo inspeções diretas no console.
- **Interface Retro**: Design inteiramente responsivo simulando o console Game Boy Color em CSS puro.

---

## Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Marchiott0/poke-page.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador web.
