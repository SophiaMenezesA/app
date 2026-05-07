// ============ GERENCIAMENTO DE DADOS ============
const STORAGE_KEYS = {
    TICKETS: 'app_tickets',
    TICKETS_RESGATADOS: 'app_tickets_resgatados',
    FRASES: 'app_frases',
    FRASES_SALVAS: 'app_frases_salvas',
    ROLETA_OPCOES: 'app_roleta_opcoes'
};

// Dados iniciais
const dadosIniciais = {
    tickets: [
        { id: 1, titulo: "Vale Abraço", descricao: "Um abração de urso pra quando precisar" },
        { id: 2, titulo: "Vale Dança", descricao: "Dança de 30 segundos liberada" },
        { id: 3, titulo: "Vale Massagem", descricao: "Massagem relaxante de 5 minutos" }
    ],
    frases: [
        "Acredite nos seus sonhos! 🌟",
        "Cada dia é uma nova oportunidade ✨",
        "Você é mais forte do que imagina 💪"
    ],
    roletaOpcoes: [
        "Parabéns! +10 pontos",
        "Que sorte! Ganhou um abraço",
        "Tente novamente",
        "Você é incrível!",
        "Dia de sorte!",
        "Mais sorte na próxima"
    ]
};

// Inicializar dados
function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(dadosIniciais.tickets));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS_RESGATADOS)) {
        localStorage.setItem(STORAGE_KEYS.TICKETS_RESGATADOS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FRASES)) {
        localStorage.setItem(STORAGE_KEYS.FRASES, JSON.stringify(dadosIniciais.frases));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FRASES_SALVAS)) {
        localStorage.setItem(STORAGE_KEYS.FRASES_SALVAS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROLETA_OPCOES)) {
        localStorage.setItem(STORAGE_KEYS.ROLETA_OPCOES, JSON.stringify(dadosIniciais.roletaOpcoes));
    }
}

// ============ NAVEGAÇÃO ============
function goBack() {
    window.location.href = 'index.html';
}

// ============ ROLETA ============
if (window.location.pathname.includes('roleta.html')) {
    let canvas = document.getElementById('roletaCanvas');
    let ctx = canvas.getContext('2d');
    let girarBtn = document.getElementById('girarBtn');
    let resultado = document.getElementById('resultado');
    
    let opcoes = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLETA_OPCOES));
    let anguloAtual = 0;
    let girando = false;
    let animationId = null;
    let velocidade = 0;
    let desacelerando = false;
    
    const PI = Math.PI;
    const TAU = PI * 2;
    const ANGULO_POR_OPCAO = TAU / opcoes.length;
    
    function desenharRoleta() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;
        
        for (let i = 0; i < opcoes.length; i++) {
            const inicio = anguloAtual + i * ANGULO_POR_OPCAO;
            const fim = inicio + ANGULO_POR_OPCAO;
            
            // Cores vibrantes
            const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, inicio, fim);
            ctx.fillStyle = cores[i % cores.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Texto
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(inicio + ANGULO_POR_OPCAO / 2);
            ctx.textAlign = "center";
            ctx.fillStyle = "#333";
            ctx.font = "bold 14px Arial";
            const texto = opcoes[i].substring(0, 12);
            ctx.fillText(texto, radius * 0.6, 5);
            ctx.restore();
        }
        
        // Círculo central
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, TAU);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
    }
    
    function animarRoleta() {
        if (!girando && !desacelerando) return;
        
        if (desacelerando) {
            velocidade *= 0.98;
            if (velocidade < 0.5) {
                pararRoleta();
                return;
            }
        }
        
        anguloAtual += velocidade * 0.02;
        anguloAtual %= TAU;
        desenharRoleta();
        
        animationId = requestAnimationFrame(animarRoleta);
    }
    
    function girarRoleta() {
        if (girando || desacelerando) return;
        
        girando = true;
        velocidade = 15 + Math.random() * 10;
        girarBtn.textContent = 'Parar';
        resultado.textContent = '';
        
        if (animationId) cancelAnimationFrame(animationId);
        animarRoleta();
    }
    
    function pararRoleta() {
        if (!girando) return;
        
        desacelerando = true;
        girando = false;
    }
    
    function pararRoleta() {
        if (!girando && !desacelerando) return;
        
        desacelerando = true;
        girando = false;
    }
    
    function finalizarRoleta() {
        desacelerando = false;
        
        // Calcular opção vencedora
        const ponteiroAngulo = PI * 3 / 2; // Ponteiro apontando pra cima
        let anguloVencedor = (TAU - anguloAtual + ponteiroAngulo) % TAU;
        const indiceVencedor = Math.floor(anguloVencedor / ANGULO_POR_OPCAO) % opcoes.length;
        const opcaoVencedora = opcoes[indiceVencedor];
        
        resultado.innerHTML = `<strong>🎉 ${opcaoVencedora} 🎉</strong>`;
        girarBtn.textContent = 'Girar';
        
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Substituir a função pararRoleta
    window.pararRoleta = function() {
        if (!girando && !desacelerando) return;
        
        desacelerando = true;
        girando = false;
        
        // Aguardar desaceleração completar
        const checkStop = setInterval(() => {
            if (velocidade < 0.5) {
                clearInterval(checkStop);
                finalizarRoleta();
            }
        }, 100);
    };
    
    girarBtn.onclick = () => {
        if (girando || desacelerando) {
            if (girando) window.pararRoleta();
        } else {
            girarRoleta();
        }
    };
    
    desenharRoleta();
}

// ============ TICKETS ============
if (window.location.pathname.includes('tickets.html')) {
    function carregarTickets() {
        const tickets = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS));
        const resgatados = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS_RESGATADOS));
        const container = document.getElementById('ticketsList');
        
        container.innerHTML = '';
        
        tickets.forEach(ticket => {
            const resgatado = resgatados.includes(ticket.id);
            const card = document.createElement('div');
            card.className = `ticket-card ${resgatado ? 'resgatado' : ''}`;
            card.innerHTML = `
                <div class="ticket-info">
                    <h3>${ticket.titulo}</h3>
                    <p>${ticket.descricao}</p>
                </div>
                <button class="resgatar-btn" ${resgatado ? 'disabled' : ''} data-id="${ticket.id}">
                    ${resgatado ? '✓ Resgatado' : '🎁 Resgatar'}
                </button>
            `;
            
            const btn = card.querySelector('.resgatar-btn');
            if (!resgatado) {
                btn.onclick = () => resgatarTicket(ticket.id, ticket.titulo);
            }
            
            container.appendChild(card);
        });
    }
    
    function resgatarTicket(id, titulo) {
        const resgatados = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS_RESGATADOS));
        if (!resgatados.includes(id)) {
            resgatados.push(id);
            localStorage.setItem(STORAGE_KEYS.TICKETS_RESGATADOS, JSON.stringify(resgatados));
            
            // Mostrar toast
            const toast = document.getElementById('toast');
            toast.textContent = `🎫 ${titulo} resgatado com sucesso!!`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
            
            carregarTickets();
        }
    }
    
    carregarTickets();
}

// ============ FRASES ============
if (window.location.pathname.includes('frases.html')) {
    let fraseAtual = '';
    
    function sortearFrase() {
        const frases = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRASES));
        if (frases.length === 0) return "Nenhuma frase cadastrada!";
        return frases[Math.floor(Math.random() * frases.length)];
    }
    
    function abrirCaixinha() {
        const giftBox = document.getElementById('giftBox');
        const fraseDiv = document.getElementById('fraseSorteada');
        const fraseActions = document.getElementById('fraseActions');
        
        giftBox.classList.add('shake');
        
        setTimeout(() => {
            giftBox.classList.remove('shake');
            fraseAtual = sortearFrase();
            fraseDiv.innerHTML = `<div class="frase-card">✨ ${fraseAtual} ✨</div>`;
            fraseDiv.style.display = 'block';
            fraseActions.style.display = 'block';
        }, 500);
    }
    
    function salvarFrase() {
        if (!fraseAtual) return;
        
        const frasesSalvas = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRASES_SALVAS));
        if (!frasesSalvas.includes(fraseAtual)) {
            frasesSalvas.push(fraseAtual);
            localStorage.setItem(STORAGE_KEYS.FRASES_SALVAS, JSON.stringify(frasesSalvas));
            
            const toast = document.createElement('div');
            toast.textContent = '💾 Frase salva com sucesso!';
            toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#4CAF50;color:white;padding:10px20px;border-radius:50px;z-index:1000';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        } else {
            alert('Essa frase já foi salva antes!');
        }
    }
    
    function mostrarFrasesSalvas() {
        const frasesSalvas = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRASES_SALVAS));
        const modal = document.getElementById('frasesSalvasModal');
        const lista = document.getElementById('frasesSalvasList');
        
        if (frasesSalvas.length === 0) {
            lista.innerHTML = '<p>Nenhuma frase salva ainda 📝</p>';
        } else {
            lista.innerHTML = frasesSalvas.map(frase => `<div class="frase-salva-item">📖 ${frase}</div>`).join('');
        }
        
        modal.style.display = 'block';
    }
    
    document.getElementById('abrirBtn').onclick = abrirCaixinha;
    document.getElementById('salvarFraseBtn').onclick = salvarFrase;
    document.getElementById('verSalvasBtn').onclick = mostrarFrasesSalvas;
    
    // Modal close
    const modal = document.getElementById('frasesSalvasModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

// Inicialização
initData();

// ============ SERVICE WORKER (PWA) ============
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado com sucesso!');
                console.log('Escopo:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// Verificar se pode instalar
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ App pode ser instalado!');
    e.preventDefault();
    deferredPrompt = e;
    
    // Opcional: mostrar um botão "Instalar" no app
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Instalar App';
    installBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#6C63FF;color:white;border:none;padding:12px 20px;border-radius:50px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou instalar');
            }
            deferredPrompt = null;
            installBtn.remove();
        });
    };
    document.body.appendChild(installBtn);
}); 

// Navegação da tela inicial
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    document.querySelectorAll('.home-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const page = icon.dataset.page;
            window.location.href = `${page}.html`;
        });
    });
}