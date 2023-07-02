// conexão com o bd criado para exibir o conteúdo tabela tb_menus
var conn = require('./../inc/db')
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')

/* GET home page. Rota de exibição da home.*///qualquer insert na home é feito aqui
router.get('/', function(req, res, next) {

    // faz uma consulta no bd e retorna uma json com a variável results
    conn.query(`
    
        SELECT * FROM tb_menus ORDER BY title
    
    `, (err, results) => {

        if (err) {
            console.log(err)
        }

        // a variável results é enviada pro render aqui, que pega o tempalte ejs e mescla os dados com o html
        res.render('index', { 
            title: 'Antenna Telemedicina e Conexões',
            menus: results
        });
    })
});

//rota da página menu
router.get('/menus', function(req, res, next){

    res.render('menus', { //'menus'é nome do arquivo físico do views
        title: 'Conexão - Antenna Telemedicina e Conexões',
        background: 'images/img_bg_2.jpg',
        h1: 'Conectividade'
    })
})


//rota da página serviços
router.get('/services', function(req, res, next){

    res.render('services', { //'services'é nome do arquivo físico do views
        title: 'Telemedicina - Antenna Telemedicina e Conexões',
        background: 'images/img_bg_6.png',
        h1: 'Telemedicina'
    })
})

//rota da página contatos
router.get('/contacts', function(req, res, next){

    res.render('contacts', { //'contacts'é nome do arquivo físico do views
        title: 'Contatos - Antenna Telemedicina e Conexões',
        background: 'images/img_bg_3.jpg',
        h1: 'Contato'
    })
})

//rota da página reservas
router.get('/reservations', function(req, res, next){

    res.render('reservations', { //'contacts'é nome do arquivo físico do views
        title: 'Reservas - Antenna Telemedicina e Conexões',
        background: 'images/img_bg_2.jpg',
        h1: 'Reserve'
    })
})

//rota da página loginPage
router.get('/loginPage', function(req, res, next){

    res.render('loginPage')
})

//rota da página loginMedico
router.get('/loginMedico', function(req, res, next){

    res.render('loginMedico')//'loginMedico'é nome do arquivo físico do views

})

const saltRounds = 10; // Número de rounds para o algoritmo de hashing

// Rota para processar o login do médico
router.post('/loginMedico', (req, res) => {

    const { email, senha } = req.body;

    // Aqui você deve realizar a consulta ao banco de dados para buscar o médico com o email fornecido
    // Você pode usar a biblioteca mysql2 para isso

    // Exemplo de consulta usando o mysql2
    const query = 'SELECT * FROM tb_medicos WHERE email = ?';

    conn.query(query, [email], (error, results) => {

        if (error) {

        console.error('Erro ao buscar médico:', error);

        return res.sendStatus(500);

        }

        // Verificar se o médico existe
        if (results.length === 0) {

        return res.status(401).send('Credenciais inválidas');

        }

        const medico = results[0];

        // Comparar a senha fornecida com a senha armazenada no banco de dados
        bcrypt.compare(senha, medico.senha, (error, result) => {

            if (error) {

                console.error('Erro ao comparar senhas:', error);

                return res.sendStatus(500);

            }

            if (!result) {

                return res.status(401).send('Credenciais inválidas');

            }

            // Exemplo de autenticação bem-sucedida
            

            // Se as credenciais estiverem corretas, redirecionar para a página tipoExames.ejs
            res.redirect('/tipoExames');

        });

    });

});



// Rota para exibir o formulário de cadastro Médico
router.get('/cadMedico', (req, res) => {

    res.render('cadMedico');

});
  
// Rota para processar o formulário de cadastro Médico
router.post('/cadMedico', (req, res) => {

    const { nome, email, cpf, especialidade, inscricao, senha, confirmarSenha } = req.body;
  
    // Verificar se o email já está cadastrado
    conn.query('SELECT * FROM tb_medicos WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
    
        if (results.length > 0) {
            // O email já está cadastrado
            res.render('cadMedico', { error: 'Este email já está cadastrado' });
        } else if (!req.body.nome) {
            res.render(req, res, "Digite o seu nome")
        } else if (senha !== confirmarSenha) {
            // As senhas não coincidem
            res.render('cadMedico', { error: 'As senhas não coincidem' });
        } else {
            // Criptografar a senha antes de salvar no banco de dados
            bcrypt.hash(senha, 10, (err, hash) => {
            if (err) throw err;
    
            // Salvar os dados do médico no banco de dados
            conn.query(
                'INSERT INTO tb_medicos (nome, email, cpf, especialidade, inscricao, senha) VALUES (?, ?, ?, ?, ?, ?)',
                [nome, email, cpf, especialidade, inscricao, hash],
                (err, results) => {
                if (err) throw err;
    
                res.render('loginMedico')

                }

            );

        });

      }

    });

});

//rota da página loginAgente
router.get('/loginAgente', function(req, res, next){

    res.render('loginAgente')//'loginAgente'é nome do arquivo físico do views

})


// Rota para processar o login do Agente de Saúde
router.post('/loginAgente', (req, res) => {

  const { email, senha } = req.body;

  // Consulta ao banco de dados para buscar o Agente com o email fornecido
  const query = 'SELECT * FROM tb_agentes WHERE email = ?';

    conn.query(query, [email], (error, results) => {

        if (error) {

        console.error('Erro ao buscar email:', error);

        return res.sendStatus(500);

        }

        // Verificar se o médico existe
        if (results.length === 0) {

        return res.status(401).send('Credenciais inválidas');

        }

        const agente = results[0];

        // Comparar a senha fornecida com a senha armazenada no banco de dados
        bcrypt.compare(senha, agente.senha, (error, result) => {

            if (error) {

                console.error('Erro ao comparar senhas:', error);

                return res.sendStatus(500);

            }

            if (!result) {

                return res.status(401).send('Credenciais inválidas');

            }

            // Se as credenciais estiverem corretas, redirecionar para a página tipoExames.ejs
            res.redirect('/tipoExames');

        });

    });

});



// Rota para exibir o formulário de cadastro de Agente de Saúde
router.get('/cadAgente', (req, res) => {

    res.render('cadAgente');

});
  
// Rota para processar o formulário de cadastro do Agente de Saúde
router.post('/cadAgente', (req, res) => {

    const { nome, email, cpf, inscricao, unidade, senha, confirmarSenha } = req.body;
  
    // Verificar se o email já está cadastrado
    conn.query('SELECT * FROM tb_agentes WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
    
        if (results.length > 0) {
            // O email já está cadastrado
            res.render('cadAgente', { error: 'Este email já está cadastrado' });
        } else if (!req.body.nome) {
            res.render(req, res, "Digite o seu nome")
        } else if (senha !== confirmarSenha) {
            // As senhas não coincidem
            res.render('cadAgente', { error: 'As senhas não coincidem' });
        } else {
            // Criptografar a senha antes de salvar no banco de dados
            bcrypt.hash(senha, 10, (err, hash) => {
            if (err) throw err;
    
            // Salvar os dados do médico no banco de dados
            conn.query(
                'INSERT INTO tb_agentes (nome, email, cpf, inscricao, unidade, senha) VALUES (?, ?, ?, ?, ?, ?)',
                [nome, email, cpf, inscricao, unidade, hash],
                (err, results) => {
                if (err) throw err;
    
                res.render('loginAgente')

                }

            );

        });

      }

    });

});

// Rota para a página tipoExames.ejs
router.get('/tipoExames', (req, res) => {
    const medicoEmail = req.session.medicoEmail;
    
    if (medicoEmail) {
      // Consulta na tabela tb_medicos para obter informações adicionais do médico, se necessário
      connection.query(
        'SELECT * FROM tb_medicos WHERE email = ?',
        [medicoEmail],
        (error, results) => {
          if (error) throw error;
          
          const medico = results[0];
          res.render('tipoExames', { medico });
        }
      );
    } else {
      res.redirect('/login');
    }
});


/* Rota para a página tipoExames.ejs
router.get('/tipoExames', (req, res) => {
    // Verificar se o usuário está autenticado (pode usar algum middleware para isso)

    // Se o usuário estiver autenticado, renderizar a página tipoExames.ejs
    res.render('tipoExames');
  
});*/

  // Rota para a página clinicos.ejs
router.get('/clinicos', (req, res) => {
    // Verificar se o usuário está autenticado (pode usar algum middleware para isso)
  
    // Se o usuário estiver autenticado, renderizar a página tipoExames.ejs
    res.render('clinicos');
  
});

/*
router.get('/reservations', function(req, res, next){

    res.render('reservations', { //'contacts'é nome do arquivo físico do views
        title: 'Reservas - Antenna Telemedicina e Conexões',
        background: 'images/img_bg_2.jpg',
        h1: 'Reserve'
    })
})
*/

module.exports = router;
