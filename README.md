# CPD Jadar — Cadastro e Login de Usuário

API e interface web para cadastro e login de usuários.

## Tecnologias

- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Autenticação:** JWT (python-jose) + bcrypt (passlib)
- **Frontend:** HTML / CSS / JavaScript (vanilla)

## Como rodar

```bash
# Instalar dependências
pip install -e .

# Iniciar o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Abra [http://localhost:8000](http://localhost:8000) no navegador.

## Endpoints da API

| Método | Rota            | Descrição                  |
|--------|-----------------|----------------------------|
| POST   | `/api/register` | Cadastrar novo usuário     |
| POST   | `/api/login`    | Autenticar e obter token   |
| GET    | `/api/me`       | Dados do usuário logado    |

## Desenvolvimento

```bash
# Instalar dependências de dev
pip install -e ".[dev]"

# Lint
ruff check .

# Testes
pytest
```