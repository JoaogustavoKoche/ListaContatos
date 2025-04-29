const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Substitua pelo seu usuário do MySQL
  password: "admin", // Substitua pela sua senha do MySQL
  database: "listaRamais"
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL");
});

app.use(cors());
app.use(express.json());

// Listar secretarias
app.get("/secretarias", (req, res) => {
  db.query("SELECT * FROM secretarias", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Criar secretaria
app.post("/secretarias", (req, res) => {
  const { nome } = req.body;
  db.query("INSERT INTO secretarias (nome) VALUES (?)", [nome], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nome });
  });
});

// Editar secretaria
app.put("/secretarias/:id", (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  db.query("UPDATE secretarias SET nome = ? WHERE id = ?", [nome, id], (err, result) => {
    if(err) return res.status(500).json({ error: err.message });
    res.status(200).json({id, nome});
  });
});

// Deletar secretaria
app.delete("/secretarias/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE from secretarias WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});





// Listar contatos com secretaria
app.get("/contatos", (req, res) => {
  const sql = `SELECT contatos.*, secretarias.nome AS secretaria_nome FROM contatos 
               LEFT JOIN secretarias ON contatos.secretaria_id = secretarias.id`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Criar contato vinculado a uma secretaria
app.post("/contatos", (req, res) => {
  const { nome, cargo, ramal, telefone, whatsapp, email, secretaria_id } = req.body;
  db.query(
    "INSERT INTO contatos (nome, cargo, ramal, telefone, whatsapp, email, secretaria_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nome, cargo, ramal, telefone, whatsapp, email, secretaria_id || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nome, cargo, ramal, telefone, whatsapp, email, secretaria_id });
    }
  );
});

// Excluir contato
app.delete("/contatos/:id", (req, res) => {
  db.query("DELETE FROM contatos WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
