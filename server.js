const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ── PostgreSQL ──────────────────────────────────────────────────────────────
// No Render, a variável DATABASE_URL é injetada automaticamente ao vincular
// o banco Postgres ao serviço.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Cria a tabela se não existir ao iniciar o servidor
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_responses (
      id        SERIAL PRIMARY KEY,
      ts        BIGINT NOT NULL,
      answers   JSONB  NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('DB pronto ✓');
}

// ── ROTAS DE API ────────────────────────────────────────────────────────────

// POST /api/responses  — salvar uma resposta nova
app.post('/api/responses', async (req, res) => {
  try {
    const { ts, answers } = req.body;
    if (!ts || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    await pool.query(
      'INSERT INTO quiz_responses (ts, answers) VALUES ($1, $2)',
      [ts, JSON.stringify(answers)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/responses:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// GET /api/responses  — buscar todas as respostas (painel ao vivo)
app.get('/api/responses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT ts, answers FROM quiz_responses ORDER BY ts ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/responses:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ── PÁGINAS ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
initDB()
  .then(() => app.listen(PORT, () => console.log(`InKlua rodando na porta ${PORT}`)))
  .catch(err => { console.error('Falha ao iniciar DB:', err); process.exit(1); });
