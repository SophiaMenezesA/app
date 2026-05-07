const ADMIN_PASSWORD = 'admin123'; // Mude para sua senha

function loginAdmin() {
    const senha = document.getElementById('adminPass').value;
    if (senha === ADMIN_PASSWORD) {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        carregarDadosAdmin();
    } else {
        alert('Senha incorreta!');
    }
}

function carregarDadosAdmin() {
    carregarTicketsAdmin();
    carregarFrasesAdmin();
    carregarRoletaAdmin();
    carregarEstatisticas();
}

function carregarTicketsAdmin() {
    const tickets = JSON.parse(localStorage.getItem('app_tickets'));
    const container = document.getElementById('ticketsAdminList');
    
    container.innerHTML = tickets.map(ticket => `
        <div class="admin-item">
            <div>
                <strong>${ticket.titulo}</strong><br>
                <small>${ticket.descricao}</small>
            </div>
            <button class="delete-btn" onclick="deletarTicket(${ticket.id})">🗑️</button>
        </div>
    `).join('');
}

function adicionarTicket() {
    const titulo = document.getElementById('novoTicketTitulo').value;
    const descricao = document.getElementById('novoTicketDesc').value;
    
    if (!titulo || !descricao) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const tickets = JSON.parse(localStorage.getItem('app_tickets'));
    const novoId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    
    tickets.push({ id: novoId, titulo, descricao });
    localStorage.setItem('app_tickets', JSON.stringify(tickets));
    
    document.getElementById('novoTicketTitulo').value = '';
    document.getElementById('novoTicketDesc').value = '';
    
    carregarTicketsAdmin();
    carregarEstatisticas();
}

function deletarTicket(id) {
    let tickets = JSON.parse(localStorage.getItem('app_tickets'));
    tickets = tickets.filter(t => t.id !== id);
    localStorage.setItem('app_tickets', JSON.stringify(tickets));
    
    // Remover dos resgatados também
    let resgatados = JSON.parse(localStorage.getItem('app_tickets_resgatados'));
    resgatados = resgatados.filter(rId => rId !== id);
    localStorage.setItem('app_tickets_resgatados', JSON.stringify(resgatados));
    
    carregarTicketsAdmin();
    carregarEstatisticas();
}

function carregarFrasesAdmin() {
    const frases = JSON.parse(localStorage.getItem('app_frases'));
    const container = document.getElementById('frasesAdminList');
    
    container.innerHTML = frases.map((frase, index) => `
        <div class="admin-item">
            <span>📝 ${frase}</span>
            <button class="delete-btn" onclick="deletarFrase(${index})">🗑️</button>
        </div>
    `).join('');
}

function adicionarFrase() {
    const novaFrase = document.getElementById('novaFrase').value;
    
    if (!novaFrase) {
        alert('Digite uma frase!');
        return;
    }
    
    const frases = JSON.parse(localStorage.getItem('app_frases'));
    frases.push(novaFrase);
    localStorage.setItem('app_frases', JSON.stringify(frases));
    
    document.getElementById('novaFrase').value = '';
    carregarFrasesAdmin();
}

function deletarFrase(index) {
    let frases = JSON.parse(localStorage.getItem('app_frases'));
    frases.splice(index, 1);
    localStorage.setItem('app_frases', JSON.stringify(frases));
    carregarFrasesAdmin();
}

function carregarRoletaAdmin() {
    const opcoes = JSON.parse(localStorage.getItem('app_roleta_opcoes'));
    const container = document.getElementById('roletaOpcoesList');
    
    container.innerHTML = opcoes.map((opcao, index) => `
        <div class="admin-item">
            <span>🎰 ${opcao}</span>
            <button class="delete-btn" onclick="deletarOpcaoRoleta(${index})">🗑️</button>
        </div>
    `).join('');
}

function adicionarOpcaoRoleta() {
    const novaOpcao = document.getElementById('novaOpcaoRoleta').value;
    
    if (!novaOpcao) {
        alert('Digite uma opção!');
        return;
    }
    
    const opcoes = JSON.parse(localStorage.getItem('app_roleta_opcoes'));
    opcoes.push(novaOpcao);
    localStorage.setItem('app_roleta_opcoes', JSON.stringify(opcoes));
    
    document.getElementById('novaOpcaoRoleta').value = '';
    carregarRoletaAdmin();
}

function deletarOpcaoRoleta(index) {
    let opcoes = JSON.parse(localStorage.getItem('app_roleta_opcoes'));
    opcoes.splice(index, 1);
    localStorage.setItem('app_roleta_opcoes', JSON.stringify(opcoes));
    carregarRoletaAdmin();
}

function carregarEstatisticas() {
    const tickets = JSON.parse(localStorage.getItem('app_tickets'));
    const resgatados = JSON.parse(localStorage.getItem('app_tickets_resgatados'));
    const container = document.getElementById('estatisticasTickets');
    
    const total = tickets.length;
    const resgatadosCount = resgatados.length;
    const percentual = total > 0 ? (resgatadosCount / total * 100).toFixed(1) : 0;
    
    container.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 10px;">
            <p>📊 Total de tickets: ${total}</p>
            <p>✅ Tickets resgatados: ${resgatadosCount}</p>
            <p>📈 Progresso: ${percentual}%</p>
            <div style="background: #e0e0e0; border-radius: 10px; overflow: hidden; margin-top: 10px;">
                <div style="background: #4CAF50; width: ${percentual}%; height: 20px;"></div>
            </div>
        </div>
    `;
}