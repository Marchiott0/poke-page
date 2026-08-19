/**
 * Proteções de segurança leves para o jogo.
 * Mantém o bloqueio de clique direito (contextmenu) para evitar
 * inspeção fácil da resposta, mas respeita a liberdade do desenvolvedor.
 */
export function initSecurityProtections() {
    document.addEventListener('contextmenu', e => e.preventDefault());
}

export const setupSecurity = initSecurityProtections;
