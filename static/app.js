const API = '';

// ===== Tab switching =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ===== Toast =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== Show dashboard =====
function showDashboard(user) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelector('.tabs').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
}

// ===== Show auth forms =====
function showAuth() {
    document.querySelector('.tabs').style.display = 'flex';
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById('login').classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="login"]').classList.add('active');
}

// ===== Register =====
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (!name || !email || !password) {
        return showToast('Preencha todos os campos.', 'error');
    }
    if (password !== confirm) {
        return showToast('As senhas não coincidem.', 'error');
    }
    if (password.length < 6) {
        return showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
    }

    try {
        const res = await fetch(`${API}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Erro ao cadastrar.');
        showToast('Cadastro realizado com sucesso!');
        document.getElementById('register-form').reset();
        // Switch to login tab
        document.querySelector('[data-tab="login"]').click();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ===== Login =====
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        return showToast('Preencha todos os campos.', 'error');
    }

    try {
        const res = await fetch(`${API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Erro ao entrar.');

        localStorage.setItem('token', data.access_token);

        // Fetch user info
        const meRes = await fetch(`${API}/api/me?token=${data.access_token}`);
        const meData = await meRes.json();
        if (!meRes.ok) throw new Error('Erro ao buscar dados do usuário.');

        showToast('Login realizado com sucesso!');
        showDashboard(meData);
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ===== Logout =====
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Você saiu da conta.');
    showAuth();
});

// ===== Auto-login on page load =====
(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res = await fetch(`${API}/api/me?token=${token}`);
        if (!res.ok) throw new Error();
        const user = await res.json();
        showDashboard(user);
    } catch {
        localStorage.removeItem('token');
    }
})();
