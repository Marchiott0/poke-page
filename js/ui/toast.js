export function showToastNotification(msg) {
    const existing = document.getElementById('gbToastNotice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'gbToastNotice';
    toast.style.cssText = `
        position: fixed;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        background: #090e1a;
        border: 3px solid #38bdf8;
        color: #facc15;
        padding: 10px 18px;
        border-radius: 6px;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.65rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.8), inset 2px 2px 0px #000;
        z-index: 999999;
        text-align: center;
        animation: fadeIn 0.2s ease;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 2500);
}
