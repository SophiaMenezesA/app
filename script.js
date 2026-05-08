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
        { id: 2, titulo: "Vale Dança", descricao: "Consigo te puxar para uma dança com isso aqui, hein" },
        { id: 3, titulo: "Vale Cafuné", descricao: "Cafuné de tempo indeterminado" }, 
        { id: 4, titulo: "Vale 1000 Beijos!", descricao: "Beijos, beijos e mais beijos" }, 
        { id: 5, titulo: "Vale “SIM”", descricao: "Pelo visto, preciso dizer sim pra qualquer coisa.." }, 
        { id: 6, titulo: "Vale Filminho", descricao: "Um filme com pipoca, o que achas?" }
    ],
    frases: [
        "Você consegue, monamú. Acredito em você <3",
        "Pode ter certeza de que estou pensando em você AGORA.", 
        "Eu te amo, presunto 4 olhos",
        "Você é meu pão com requeijão",
        "IIIh... se tirou essa frase, saiba que está me devendo um zilhão de beijos.",
        "Você consegue, monamú. Acredito em você <3",
        "Um passarinho me contou que tem uma moranguete te amando...", 
        "Amo seus olhinhos, estou com saudades!", 
        "Per ardua ad Astra"

    ],
    roletaOpcoes: [
        "SIIIIM",
        "NÃÃÃÃÃO",
        "SIIIIM",
        "NÃÃÃÃÃO",
        "Hmm, tô na dúvida...",
        "TALVEEEEZ",
        "Gire novamente, estou pensando", 
        "A Sophia diria sim?", 
        "TALVEEEEZ"
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
            // Cores combinando com a paleta
            const cores = ['#be3135', '#4F6815', '#FFEDAB', '#F0E6DA', '#be3135', '#4F6815'];
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
            ctx.fillStyle = "#030000";
            ctx.font = "bold 14px Arial";
            const texto = opcoes[i].substring(0, 12);
            ctx.fillText(texto, radius * 0.6, 5);
            ctx.restore();
        }

        // Círculo central
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, TAU);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#6b0606';
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
    window.pararRoleta = function () {
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
        
        // Separar tickets disponíveis e resgatados
        const disponiveis = tickets.filter(t => !resgatados.includes(t.id));
        const resgatadosList = tickets.filter(t => resgatados.includes(t.id));
        
        // Container dos disponíveis
        const containerDisponiveis = document.getElementById('ticketsList');
        if (containerDisponiveis) {
            if (disponiveis.length === 0) {
                containerDisponiveis.innerHTML = '<div class="empty-state">🍓 nenhum ticket disponível no momento</div>';
            } else {
                containerDisponiveis.innerHTML = '';
                disponiveis.forEach(ticket => {
                    const card = document.createElement('div');
                    card.className = 'ticket-card';
                    card.innerHTML = `
                        <div class="ticket-info">
                            <h3>${ticket.titulo}</h3>
                            <p>${ticket.descricao}</p>
                        </div>
                        <button class="resgatar-btn" data-id="${ticket.id}">🎁 resgatar</button>
                    `;
                    const btn = card.querySelector('.resgatar-btn');
                    btn.onclick = () => resgatarTicket(ticket.id, ticket.titulo);
                    containerDisponiveis.appendChild(card);
                });
            }
        }
        
        // Container dos resgatados
        const containerResgatados = document.getElementById('ticketsResgatadosList');
        if (containerResgatados) {
            if (resgatadosList.length === 0) {
                containerResgatados.innerHTML = '<div class="empty-state">✨ nenhum ticket resgatado ainda</div>';
            } else {
                containerResgatados.innerHTML = '';
                resgatadosList.forEach(ticket => {
                    const card = document.createElement('div');
                    card.className = 'ticket-card resgatado-card';
                    card.innerHTML = `
                        <div class="ticket-info">
                            <h3>✓ ${ticket.titulo}</h3>
                            <p>${ticket.descricao}</p>
                        </div>
                        <span class="resgatado-badge">resgatado</span>
                    `;
                    containerResgatados.appendChild(card);
                });
            }
        }
    }
    
    function resgatarTicket(id, titulo) {
        const resgatados = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS_RESGATADOS));
        if (!resgatados.includes(id)) {
            resgatados.push(id);
            localStorage.setItem(STORAGE_KEYS.TICKETS_RESGATADOS, JSON.stringify(resgatados));
            
            // Mostrar toast
            const toast = document.getElementById('toast');
            toast.textContent = `🍓 ${titulo} resgatado com sucesso!!`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
            
            carregarTickets(); // Recarregar a lista
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

// ============ PWA - INSTALAÇÃO FORÇADA ============
let deferredPrompt;
let installButton = null;

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('✅ Service Worker registrado'))
        .catch(err => console.log('❌ Erro:', err));
}

// Tentar capturar evento de instalação nativo
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ Evento beforeinstallprompt capturado!');
    e.preventDefault();
    deferredPrompt = e;
    mostrarBotaoInstalar();
});

// Função para mostrar o botão
function mostrarBotaoInstalar() {
    if (installButton) return; // já existe
    
    installButton = document.createElement('button');
    installButton.textContent = '🍓 instalar app';
    installButton.id = 'pwa-install-btn';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #75070C;
        color: #FFEDAB;
        border: none;
        border-radius: 60px;
        padding: 12px 24px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 0.85rem;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    
    installButton.onclick = async () => {
        if (deferredPrompt) {
            // Instalação nativa
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('App instalado!');
                installButton.remove();
                installButton = null;
            }
            deferredPrompt = null;
        } else {
            // Fallback: mostrar instruções
            alert('🍓 Para instalar o app:\n\n1. Toque nos 3 pontinhos ⋮\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"\n3. Confirme a instalação');
        }
    };
    
    document.body.appendChild(installButton);
}

// Se o evento beforeinstallprompt não disparar em 3 segundos, mostra botão alternativo
setTimeout(() => {
    if (!installButton && !deferredPrompt) {
        console.log('⚠️ Evento beforeinstallprompt não detectado, mostrando botão alternativo');
        mostrarBotaoInstalar();
    }
}, 3000);

// Se já estiver instalado, remove botão
window.addEventListener('appinstalled', () => {
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
    deferredPrompt = null;
});

// Verificar se já está instalado (via localStorage)
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App já está instalado (modo standalone)');
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
}

// ============ CARA OU COROA ============
// Primeiro, define o path baseado na URL atual
const currentPath = window.location.pathname;

if (currentPath.includes('caracoroa.html')) {
    console.log('🪙 Carregando Cara ou Coroa...');

    const STORAGE_HISTORICO = 'app_caracoroa_historico';

    // Inicializar histórico
    if (!localStorage.getItem(STORAGE_HISTORICO)) {
        localStorage.setItem(STORAGE_HISTORICO, JSON.stringify([]));
    }

    let jogando = false;

    function jogarMoeda() {
        if (jogando) return;

        jogando = true;
        const moeda = document.getElementById('moeda');
        const resultadoDiv = document.getElementById('resultadoMoeda');
        const jogarBtn = document.getElementById('jogarBtn');

        if (!moeda) {
            console.error('Moeda não encontrada!');
            return;
        }

        // Desabilitar botão durante animação
        if (jogarBtn) {
            jogarBtn.disabled = true;
            jogarBtn.style.opacity = '0.6';
        }

        // Sortear resultado (0 = cara, 1 = coroa)
        const resultado = Math.random() < 0.5 ? 'cara' : 'coroa';

        // Adicionar animação
        moeda.classList.add('girando');

        // Remover classe anterior
        moeda.classList.remove('virada-cara', 'virada-coroa');

        // Mostrar resultado após animação
        setTimeout(() => {
            moeda.classList.remove('girando');

            if (resultado === 'cara') {
                moeda.classList.add('virada-cara');
                if (resultadoDiv) {
                    resultadoDiv.innerHTML = `
                        <div style="font-size: 3em;">🪙</div>
                        <div><strong>CARAAAAAA!</strong></div>
                    `;
                    resultadoDiv.className = 'resultado-moeda cara';
                }
            } else {
                moeda.classList.add('virada-coroa');
                if (resultadoDiv) {
                    resultadoDiv.innerHTML = `
                        <div style="font-size: 3em;">💰</div>
                        <div><strong>COROAAAAA!</strong></div>
                    `;
                    resultadoDiv.className = 'resultado-moeda coroa';
                }
            }

            // Salvar no histórico
            const historico = JSON.parse(localStorage.getItem(STORAGE_HISTORICO));
            historico.unshift({
                resultado: resultado,
                data: new Date().toLocaleString('pt-BR'),
                timestamp: Date.now()
            });
            if (historico.length > 20) historico.pop();
            localStorage.setItem(STORAGE_HISTORICO, JSON.stringify(historico));

            carregarHistorico();

            // Reabilitar botão
            jogando = false;
            if (jogarBtn) {
                jogarBtn.disabled = false;
                jogarBtn.style.opacity = '1';
            }

            // Efeito de vibração (se suportado)
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }, 800);
    }

    function salvarHistorico(resultado) {
        const historico = JSON.parse(localStorage.getItem(STORAGE_HISTORICO));
        const novoRegistro = {
            resultado: resultado,
            data: new Date().toLocaleString('pt-BR'),
            timestamp: Date.now()
        };

        historico.unshift(novoRegistro);

        if (historico.length > 20) {
            historico.pop();
        }

        localStorage.setItem(STORAGE_HISTORICO, JSON.stringify(historico));
    }

    function carregarHistorico() {
        const historico = JSON.parse(localStorage.getItem(STORAGE_HISTORICO));
        const container = document.getElementById('historicoList');

        if (!container) return;

        if (historico.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999;">Nenhuma jogada ainda. Jogue a moeda! 🪙</p>';
            return;
        }

        container.innerHTML = historico.map(item => `
            <div class="historico-item">
                <span class="resultado ${item.resultado}">
                    ${item.resultado === 'cara' ? '🪙 Cara' : '💰 Coroa'}
                </span>
                <span class="data">${item.data}</span>
            </div>
        `).join('');
    }

    function limparHistorico() {
        if (confirm('Tem certeza que quer limpar todo o histórico?')) {
            localStorage.setItem(STORAGE_HISTORICO, JSON.stringify([]));
            carregarHistorico();

            const toast = document.createElement('div');
            toast.textContent = '🗑️ Histórico limpo com sucesso!';
            toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:10px 20px;border-radius:50px;z-index:1000;';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
    }

    // Configurar eventos
    const jogarBtn = document.getElementById('jogarBtn');
    const limparBtn = document.getElementById('limparHistoricoBtn');

    if (jogarBtn) jogarBtn.onclick = jogarMoeda;
    if (limparBtn) limparBtn.onclick = limparHistorico;

    // Carregar histórico inicial
    carregarHistorico();

    console.log('✅ Cara ou Coroa inicializado!');
}

// ============ NAVEGAÇÃO DA TELA INICIAL ============
const isHomePage = window.location.pathname.includes('index.html') || 
                   window.location.pathname === '/' || 
                   window.location.pathname === '' ||
                   window.location.pathname === '/index.html';

if (isHomePage) {
    console.log('🏠 Tela inicial detectada');
    
    document.addEventListener('DOMContentLoaded', function() {
        // Navegação dos cards/feeds
        const feedItems = document.querySelectorAll('.feed-item');
        const verticalCardBtn = document.querySelector('.vertical-card-btn');
        
        feedItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const page = this.dataset.page;
                console.log('Clicou no feed:', page);
                if (page) {
                    window.location.href = page + '.html';
                }
            });
        });
        
        if (verticalCardBtn) {
            verticalCardBtn.addEventListener('click', function(e) {
                const page = this.dataset.page;
                console.log('Clicou no botão:', page);
                if (page) {
                    window.location.href = page + '.html';
                }
            });
        }
        
        // Menu flutuante
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuItems.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}

console.log('✅ Script completo carregado!');
console.log('URL atual:', window.location.pathname);