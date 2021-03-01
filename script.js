const express = require('express')
const app = express()
const port = 3000
const fs = require("fs")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
// var jsdom = require("jsdom");
// const $ = require("jquery")(new jsdom.JSDOM().window)

//Configuração HandleBars
    app.engine('handlebars', handlebars({defaultLayout:"main"}))
    app.set('view engine', 'handlebars')

//Configuração BodyParser
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

function lerRegistros(){
    const registro = fs.readFileSync("./data/registro.json", "utf-8")
    return JSON.parse(registro)
}

function editarRegistros(obj){
    const dados = JSON.stringify(obj)
    fs.writeFileSync("./data/registro.json", dados, "utf-8")
}


//Rotas
    //Listagem
    app.get('/', function(req, res){
        const todosRegistros = lerRegistros();
        res.render('index', {registro: todosRegistros})
    })

    //Formulario Cadastro
    app.get('/cadastro', function(req, res){
        res.render('formulario')
    })

    app.post('/create', function(req, res){
        const todosRegistros = lerRegistros()
        const id = todosRegistros.length + 1
        var novoRegistro = {}

        novoRegistro.id = id
        novoRegistro.nome = req.body.nome
        novoRegistro.email = req.body.email
        novoRegistro.telefone = req.body.telefone

        todosRegistros.push(novoRegistro)
        editarRegistros(todosRegistros)

        req.method = 'GET'
        res.redirect('/')

    })

    //Formulario Edição
    app.get('/editar/:id', function(req, res){
        const {id} = req.params
        const todosRegistros = lerRegistros()
        const filtroRegistros = todosRegistros.findIndex((item) => item.id == id)
        
        res.render('edit', {registro: todosRegistros[filtroRegistros]})
    })

    app.post('/:id', function(req, res){
        const {id} = req.params
        const todosRegistros = lerRegistros()
        const filtroRegistros = todosRegistros.findIndex((item) => item.id == id)

        //seleciona os valores antigos
        const {id: cId, nome: cNome, email: cEmail, telefone: cTelefone} = todosRegistros[filtroRegistros]

        //seleciona os novos valores inseridos
        const { nome, email, telefone } = req.body

        var atualizar = {
            id: cId,
            nome: nome ? nome : cNome,
            email: email ? email : cEmail,
            telefone: telefone ? telefone : cTelefone
        }

        todosRegistros[filtroRegistros] = atualizar
        editarRegistros(todosRegistros)

        req.method = 'GET'
        res.redirect('/')

    })

    app.get('/deletar/:id', function(req, res){
        const {id} = req.params
        const todosRegistros = lerRegistros()
        const filtroRegistros = todosRegistros.findIndex((item) => item.id == id)
        
        todosRegistros.splice(filtroRegistros,1)
        editarRegistros(todosRegistros)

        req.method = "GET"
        res.redirect('/')
    })



app.listen(port, () => console.log(`Example app listening on port port!`))