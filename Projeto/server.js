const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dados_usuarios',
    password: '12345',
    port: 5432,
});


app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});


app.post('/cadastro', async (req, res) => {
    const { usuario, email, senha, confirmarSenha } = req.body;

    if (senha !== confirmarSenha) {
        res.status(400).send('As senhas não coincidem');
        return;
    }

    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [usuario, email, senha]);
        client.release();
        console.log('Usuário cadastrado com sucesso!');
        res.redirect('/cadastro');
    } catch (err) {
        console.error('Erro ao cadastrar usuário', err);
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});