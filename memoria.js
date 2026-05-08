// ============ JOGO DA MEMÓRIA ============
if (window.location.pathname.includes('memoria.html')) {
    console.log('Iniciando Jogo da Memória...');
    
    // Configuração do jogo
    const EMOJIS = ['🍉', '🍓', '🍎', '🍅', '🍒', '🥝'];
    const TOTAL_PAIRS = EMOJIS.length;
    const TOTAL_CARDS = TOTAL_PAIRS * 2;
    const RODADAS_PARA_TICKET = 3;
    
    // Chave do ticket especial no localStorage
    const TICKET_ESPECIAL_KEY = 'app_ticket_morde_morango';
    
    // Estado do jogo
    let cartas = [];
    let cartasEmbaralhadas = [];
    let cartasViradas = [];
    let cartasAcertadas = [];
    let bloqueado = false;
    let tentativas = 0;
    let rodadaAtual = 1;
    let aguardandoReset = false;
    
    // Elementos DOM
    const tabuleiro = document.getElementById('tabuleiro');
    const rodadaSpan = document.getElementById('rodada');
    const paresRestantesSpan = document.getElementById('paresRestantes');
    const tentativasSpan = document.getElementById('tentativas');
    const gameMessage = document.getElementById('gameMessage');
    const ticketModal = document.getElementById('ticketModal');
    const closeModal = document.querySelector('.close');
    const resgatarBtn = document.getElementById('resgatarTicketBtn');
    
    // Verificar se já ganhou o ticket especial
    function jaGanhouTicket() {
        return localStorage.getItem(TICKET_ESPECIAL_KEY) === 'true';
    }
    
    function salvarTicketGanho() {
        localStorage.setItem(TICKET_ESPECIAL_KEY, 'true');
    }
    
    // Embaralhar cartas (Fisher-Yates)
    function embaralhar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Inicializar ou reiniciar rodada
    function iniciarRodada() {
        // Criar pares de cartas
        const pares = [];
        EMOJIS.forEach((emoji, index) => {
            pares.push({ id: index, emoji: emoji, pairId: index });
            pares.push({ id: index, emoji: emoji, pairId: index });
        });
        
        // Embaralhar
        cartasEmbaralhadas = embaralhar([...pares]);
        cartasViradas = [];
        cartasAcertadas = [];
        bloqueado = false;
        aguardandoReset = false;
        
        // Atualizar UI
        atualizarStats();
        renderizarTabuleiro();
        gameMessage.textContent = 'Encontre os pares!';
    }
    
    function atualizarStats() {
        rodadaSpan.textContent = rodadaAtual;
        const paresRestantes = TOTAL_PAIRS - cartasAcertadas.length;
        paresRestantesSpan.textContent = paresRestantes;
        tentativasSpan.textContent = tentativas;
    }
    
    function renderizarTabuleiro() {
        tabuleiro.innerHTML = '';
        
        cartasEmbaralhadas.forEach((carta, index) => {
            const isVirada = cartasViradas.includes(index);
            const isAcertada = cartasAcertadas.includes(index);
            
            const cartaDiv = document.createElement('div');
            cartaDiv.className = 'carta';
            if (isVirada) cartaDiv.classList.add('virada');
            if (isAcertada) cartaDiv.classList.add('acertada');
            
            cartaDiv.innerHTML = `<div class="carta-conteudo">${isVirada || isAcertada ? carta.emoji : '?'}</div>`;
            
            if (!isAcertada && !bloqueado && !aguardandoReset) {
                cartaDiv.onclick = () => virarCarta(index);
            }
            
            tabuleiro.appendChild(cartaDiv);
        });
    }
    
    function virarCarta(index) {
        if (bloqueado) return;
        if (cartasViradas.includes(index)) return;
        if (cartasAcertadas.includes(index)) return;
        
        // Adicionar à lista de viradas
        cartasViradas.push(index);
        renderizarTabuleiro();
        
        // Verificar se temos 2 cartas viradas
        if (cartasViradas.length === 2) {
            bloqueado = true;
            tentativas++;
            atualizarStats();
            verificarPar();
        }
    }
    
    function verificarPar() {
        const [idx1, idx2] = cartasViradas;
        const carta1 = cartasEmbaralhadas[idx1];
        const carta2 = cartasEmbaralhadas[idx2];
        
        if (carta1.pairId === carta2.pairId) {
            // Acertou!
            cartasAcertadas.push(idx1, idx2);
            cartasViradas = [];
            bloqueado = false;
            renderizarTabuleiro();
            
            // Verificar se completou a rodada
            if (cartasAcertadas.length === TOTAL_CARDS) {
                completarRodada();
            } else {
                atualizarStats();
                gameMessage.textContent = 'AEEE, acertou!!!';
                setTimeout(() => {
                    if (!aguardandoReset) {
                        gameMessage.textContent = 'Encontre os pares de frutinhas!';
                    }
                }, 1000);
            }
        } else {
            // Errou! virar de volta depois de 1 segundo
            gameMessage.textContent = 'Eita, quase';
            setTimeout(() => {
                cartasViradas = [];
                bloqueado = false;
                renderizarTabuleiro();
                gameMessage.textContent = 'Encontre os pares!! Você consegue <3';
            }, 800);
        }
    }
    
    function completarRodada() {
        gameMessage.textContent = `rodada ${rodadaAtual} completa! 🍓`;
        
        if (rodadaAtual < RODADAS_PARA_TICKET) {
            // Próxima rodada
            rodadaAtual++;
            tentativas = 0;
            aguardandoReset = true;
            
            setTimeout(() => {
                iniciarRodada();
                gameMessage.textContent = `rodada ${rodadaAtual} de ${RODADAS_PARA_TICKET}! mais difícil? nem tanto!`;
            }, 1500);
        } else {
            // Completou todas as rodadas!
            gameMessage.textContent = 'SABIA QUE CONSEGUIRIA! ❤️';
            
            setTimeout(() => {
                if (!jaGanhouTicket()) {
                    mostrarTicketEspecial();
                } else {
                    gameMessage.textContent = 'você já ganhou seu ticket especial, espertinho! jogue de novo por diversão!';
                    setTimeout(() => {
                        reiniciarJogoCompleto();
                    }, 2000);
                }
            }, 1500);
        }
    }
    
    function mostrarTicketEspecial() {
        ticketModal.style.display = 'block';
    }
    
    function resgatarTicket() {
        salvarTicketGanho();
        
        // Salvar ticket no sistema de tickets
        const tickets = JSON.parse(localStorage.getItem('app_tickets'));
        const resgatados = JSON.parse(localStorage.getItem('app_tickets_resgatados'));
        
        const novoTicket = {
            id: Date.now(),
            titulo: "Vale Morango Selvagem 🍓",
            descricao: "Um beijo especial, um chamego, um negócio caliente"
        };
        
        tickets.push(novoTicket);
        localStorage.setItem('app_tickets', JSON.stringify(tickets));
        
        // Mostrar toast
        toast.textContent = 'Ticket Especial resgatado! Vá em "seus tickets" para ver!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
        
        // Fechar modal
        ticketModal.style.display = 'none';
        
        // Reiniciar jogo
        reiniciarJogoCompleto();
    }
    
    function reiniciarJogoCompleto() {
        rodadaAtual = 1;
        tentativas = 0;
        aguardandoReset = false;
        iniciarRodada();
        gameMessage.textContent = 'nova partidaaaaa! divirta-se! ❤️';
    }
    
    // Fechar modal
    if (closeModal) {
        closeModal.onclick = () => {
            ticketModal.style.display = 'none';
            reiniciarJogoCompleto();
        };
    }
    
    window.onclick = (e) => {
        if (e.target === ticketModal) {
            ticketModal.style.display = 'none';
            reiniciarJogoCompleto();
        }
    };
    
    if (resgatarBtn) {
        resgatarBtn.onclick = resgatarTicket;
    }
    
    // Iniciar jogo
    iniciarRodada();
    
    // Toast element
    const toast = document.getElementById('toast');
}