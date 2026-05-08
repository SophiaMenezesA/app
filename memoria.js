// ============ JOGO DA MEMÓRIA ============
if (window.location.pathname.includes('memoria.html')) {
    console.log('🍓 Iniciando Jogo da Memória...');
    
    // Configuração do jogo
    const EMOJIS = ['🍌', '🍓', '🍎', '🍍', '🍇', '🍋‍🟩'];
    const TOTAL_PAIRS = EMOJIS.length;
    const TOTAL_CARDS = TOTAL_PAIRS * 2;
    const RODADAS_PARA_TICKET = 3;
    
    // Chave do ticket especial no localStorage
    const TICKET_ESPECIAL_KEY = 'app_ticket_morde_morango';
    
    // Estado do jogo
    let cartasEmbaralhadas = [];
    let cartasViradas = [];
    let cartasAcertadas = [];
    let bloqueado = false;
    let tentativas = 0;
    let rodadaAtual = 1;
    let aguardandoReset = false;
    let jogoFinalizado = false;
    
    // Elementos DOM
    const tabuleiro = document.getElementById('tabuleiro');
    const rodadaSpan = document.getElementById('rodada');
    const paresRestantesSpan = document.getElementById('paresRestantes');
    const tentativasSpan = document.getElementById('tentativas');
    const gameMessage = document.getElementById('gameMessage');
    const toast = document.getElementById('toast');
    
    // Verificar se já ganhou o ticket especial
    function jaGanhouTicket() {
        return localStorage.getItem(TICKET_ESPECIAL_KEY) === 'true';
    }
    
    function salvarTicketGanho() {
        localStorage.setItem(TICKET_ESPECIAL_KEY, 'true');
    }
    
    // Embaralhar cartas
    function embaralhar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Inicializar ou reiniciar rodada
    function iniciarRodada() {
        const pares = [];
        EMOJIS.forEach((emoji, index) => {
            pares.push({ emoji: emoji, pairId: index });
            pares.push({ emoji: emoji, pairId: index });
        });
        
        cartasEmbaralhadas = embaralhar([...pares]);
        cartasViradas = [];
        cartasAcertadas = [];
        bloqueado = false;
        aguardandoReset = false;
        jogoFinalizado = false;
        
        atualizarStats();
        renderizarTabuleiro();
        gameMessage.textContent = 'Encontre os pares de frutinhas!';
    }
    
    function atualizarStats() {
        rodadaSpan.textContent = rodadaAtual;
        const paresRestantes = TOTAL_PAIRS - (cartasAcertadas.length / 2);
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
            
            if (!isAcertada && !bloqueado && !aguardandoReset && !jogoFinalizado) {
                cartaDiv.onclick = () => virarCarta(index);
            }
            
            tabuleiro.appendChild(cartaDiv);
        });
    }
    
    function virarCarta(index) {
        if (bloqueado) return;
        if (cartasViradas.includes(index)) return;
        if (cartasAcertadas.includes(index)) return;
        if (jogoFinalizado) return;
        
        cartasViradas.push(index);
        renderizarTabuleiro();
        
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
            cartasAcertadas.push(idx1, idx2);
            cartasViradas = [];
            bloqueado = false;
            renderizarTabuleiro();
            
            if (cartasAcertadas.length === TOTAL_CARDS) {
                completarRodada();
            } else {
                atualizarStats();
                gameMessage.textContent = 'ACERTOUUUUU!!!';
                setTimeout(() => {
                    if (!aguardandoReset && !jogoFinalizado) {
                        gameMessage.textContent = 'Encontre os pares de frutinhas!';
                    }
                }, 1000);
            }
        } else {
            gameMessage.textContent = 'eita, quase hein';
            setTimeout(() => {
                cartasViradas = [];
                bloqueado = false;
                renderizarTabuleiro();
                if (!jogoFinalizado) {
                    gameMessage.textContent = 'Encontre os pares de frutinhas!';
                }
            }, 800);
        }
    }
    
    function completarRodada() {
        if (rodadaAtual < RODADAS_PARA_TICKET) {
            gameMessage.textContent = `✨ Rodada ${rodadaAtual} completa! ✨`;
            rodadaAtual++;
            tentativas = 0;
            aguardandoReset = true;
            
            setTimeout(() => {
                iniciarRodada();
                gameMessage.textContent = `🍓 Rodada ${rodadaAtual} de ${RODADAS_PARA_TICKET}!`;
            }, 1500);
        } else {
            jogoFinalizado = true;
            gameMessage.textContent = 'VOCÊ GANHOUUUU, SABIA QUE CONSEGUIRIA!';
            
            setTimeout(() => {
                if (!jaGanhouTicket()) {
                    criarEmostrarModalTicket();
                } else {
                    gameMessage.textContent = 'Você já ganhou seu ticket especial, espertinho. Jogue de novo por diversão!';
                    setTimeout(() => {
                        reiniciarJogoCompleto();
                    }, 2000);
                }
            }, 1500);
        }
    }
    
    // Criar modal dinamicamente SÓ QUANDO GANHAR
    function criarEmostrarModalTicket() {
        // Criar modal
        const modal = document.createElement('div');
        modal.id = 'ticketModal';
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content ticket-modal">
                <span class="close">&times;</span>
                <div class="ticket-premium">
                    <div class="ticket-icon">🍓</div>
                    <h2>🎫 TICKET ESPECIAL!</h2>
                    <h3>Vale Morango Selvagem</h3>
                    <p>☆ Vale uma brincadeirinha sapeca 🐯 Uaaarr ☆</p>
                    <div class="ticket-code">✦ resgate único ✦</div>
                    <button id="resgatarTicketBtn" class="action-btn" style="margin-bottom:0;">resgatar ticket</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.remove();
            reiniciarJogoCompleto();
        };
        
        // Resgatar ticket
        const resgatarBtn = document.getElementById('resgatarTicketBtn');
        resgatarBtn.onclick = () => {
            resgatarTicket();
            modal.remove();
        };
        
        // Clicar fora
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                reiniciarJogoCompleto();
            }
        };
    }
    
    function resgatarTicket() {
        if (jaGanhouTicket()) return;
        
        salvarTicketGanho();
        
        // Adicionar ticket especial ao sistema de tickets
        const tickets = JSON.parse(localStorage.getItem('app_tickets'));
        const novoTicket = {
            id: Date.now(),
            titulo: "Vale Morango Selvagem 🍓",
            descricao: " Vale uma brincadeirinha sapeca 🐯 Uaaarr "
        };
        
        tickets.push(novoTicket);
        localStorage.setItem('app_tickets', JSON.stringify(tickets));
        
        toast.textContent = 'Ticket Especial resgatado! Vá em "seus tickets" para ver!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
        
        reiniciarJogoCompleto();
    }
    
    function reiniciarJogoCompleto() {
        rodadaAtual = 1;
        tentativas = 0;
        aguardandoReset = false;
        jogoFinalizado = false;
        iniciarRodada();
        gameMessage.textContent = 'Nova partida! divirta-se ❤️';
    }
    
    // Iniciar jogo
    iniciarRodada();
}