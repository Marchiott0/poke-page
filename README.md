# Poke Page — Game Boy Color Edition

> Um jogo web retrô inspirado na estética clássica do **Game Boy Color**, focado em adivinhações e desafios do universo Pokémon. O projeto traz **6 modos de jogo** interativos, filtros por geração, sistema de dicas dinâmico e dados oficiais em tempo real via **PokéAPI**.

---

## 🎮 Modos de Jogo

### 1. Modo Clássico
Adivinhe o Pokémon secreto comparando os atributos de cada palpite.

- **Comparação de atributos**: Cada tentativa exibe se Tipo 1, Tipo 2, Geração, Altura, Peso e Estágio Evolutivo são iguais ao Pokémon alvo.
- **Indicadores direcionais**: Setas ↑↓ indicam se Geração, Altura ou Peso do alvo são maiores ou menores que seu palpite.
- **Dados reais**: Todos os atributos são buscados em tempo real via PokéAPI, garantindo precisão para os 1025 Pokémon.

---

### 2. Modo Ordem
Complete a Pokédex descobrindo qual Pokémon ocupa cada posição numérica.

- O jogo destaca um slot específico da Pokédex (ex: `#037`, `#152`...).
- Você deve adivinhar o nome do Pokémon correspondente àquela posição.
- Cada acerto revela o Pokémon na grade da Pokédex e avança para a próxima vaga pendente.
- O progresso é salvo automaticamente via `localStorage`.

---

### 3. Modo Silhueta
Inspirado no clássico segmento **"Quem é esse Pokémon?"** do anime.

- O Pokémon é exibido como uma silhueta preta com brilho neon.
- Ao acertar, a arte oficial é revelada com animação.
- Erros são exibidos como badges simples — sem spoiler de atributos.

---

### 4. Modo Pokédex
Teste seus conhecimentos sobre as descrições oficiais dos jogos.

- Exibe o trecho da entrada da Pokédex do Pokémon da rodada.
- O nome do Pokémon é censurado (█████) no texto exibido.
- Ao acertar, a descrição completa e sem censura é revelada.

---

### 5. Modo Som
Adivinhação auditiva pelos gritos clássicos dos Pokémon.

- Um botão reproduz o áudio oficial do Pokémon (via PokéAPI Cries).
- O jogador precisa reconhecer o Pokémon apenas pelo som.
- Apenas uma lista de nomes tentados é exibida — sem revelar atributos que facilitem a dedução.

---

### 6. Modo Termo
Um **Wordle Pokémon** com grid de letras estilo arcade.

- Adivinhe o nome do Pokémon secreto em até **6 tentativas**.
- Cada letra é colorida após o palpite:
  - 🟩 **Verde** — letra correta na posição certa.
  - 🟨 **Amarelo** — letra existe no nome, mas na posição errada.
  - 🟥 **Vermelho** — letra não pertence ao nome.
- A busca auxiliar filtra apenas Pokémon com o **mesmo número de letras** que o alvo, facilitando o raciocínio sem revelar a resposta.
- Validação estrita: apenas nomes reais de Pokémon cadastrados são aceitos.

---

## 💡 Sistema de Dicas

Cada modo conta com um painel lateral que desbloqueia dicas conforme os erros acumulam:

| Modo | Dica 1 | Dica 2 |
|------|--------|--------|
| Clássico / Pokédex / Som / Silhueta | Após **3 erros**: Primeira letra + Geração | Após **6 erros**: Entrada da Pokédex (censurada) |
| Termo | Após **2 erros**: Tipos do Pokémon | Após **4 erros**: Quantidade de letras + 1ª letra |

---

## ⚙️ Recursos e Funcionalidades

- **🌐 Dados Oficiais em Tempo Real**: Tipos, Altura, Peso, Estágio Evolutivo e Descrições são buscados diretamente da [PokéAPI](https://pokeapi.co/) com cache em memória para evitar requisições repetidas.
- **🔢 Filtro de Gerações**: Jogue com Gerações específicas (Gen 1 a Gen 9) ou com a base completa de 1025 Pokémon.
- **💾 Progresso Persistente**: O progresso do Modo Ordem é salvo automaticamente no navegador via `localStorage`.
- **📱 Totalmente Responsivo**: Interface replica o console Game Boy Color em CSS puro, adaptável a desktops e celulares.
- **🎨 Estética Retro**: Tipografia pixel art com `Press Start 2P` e `Pixelify Sans`, gradientes neon, temas visuais únicos por modo e micro-animações.
- **🔒 Proteção Anti-Cheat**: Bloqueio de clique direito para dificultar a inspeção direta do Pokémon alvo no código.

---

## 🗂️ Estrutura do Projeto

```
pokemon/
├── index.html
├── css/
│   ├── style.css        # Ponto de entrada do CSS
│   ├── variables.css    # Tokens de cor e tipografia
│   ├── base.css         # Reset e estilos globais
│   ├── components.css   # Componentes reutilizáveis
│   └── modes.css        # Temas visuais por modo de jogo
└── js/
    ├── app.js           # Bootstrap e registro de eventos
    ├── core/
    │   └── security.js  # Proteções de segurança
    ├── data/
    │   ├── database.js  # Base de dados local dos Pokémon
    │   └── constants.js # Gerações, traduções de tipo
    ├── services/
    │   └── pokeapi.js   # Integração com a PokéAPI
    ├── state/
    │   └── gameState.js # Estado global do jogo
    └── ui/
        ├── app.js
        ├── classicUI.js      # Tabela de palpites (Clássico/Pokédex)
        ├── genFilterUI.js    # Filtro de gerações
        ├── hintsUI.js        # Painel de dicas
        ├── modalUI.js        # Modal de vitória
        ├── modeDisplayUI.js  # Roteamento e display por modo
        ├── orderUI.js        # Grade da Pokédex (Modo Ordem)
        ├── searchUI.js       # Barra de busca e autocomplete
        ├── termoUI.js        # Grid de letras (Modo Termo)
        └── toast.js          # Notificações temporárias
```

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Marchiott0/poke-page.git
   cd poke-page
   ```

2. Abra com um servidor local (necessário para ES Modules):
   - **VS Code**: extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → clique direito em `index.html` → *Open with Live Server*
   - **Python**:
     ```bash
     python -m http.server 8080
     ```
   - Acesse `http://localhost:8080`

> ⚠️ **Não abra o `index.html` diretamente** pelo sistema de arquivos (`file://`). O uso de ES Modules (`type="module"`) exige um servidor HTTP.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 | Estrutura e layout Game Boy Color |
| JavaScript (ES Modules) | Lógica modular do jogo |
| PokéAPI | Dados oficiais de todos os 1025 Pokémon |
| LocalStorage | Persistência do progresso do Modo Ordem |
| Canvas API | Renderização da silhueta (fallback) |
| Canvas Confetti | Animação de vitória |

---

## 🌿 Branches

| Branch | Finalidade |
|---|---|
| `main` | Versão estável e publicada |
| `develop` | Desenvolvimento ativo — novas features e correções |
