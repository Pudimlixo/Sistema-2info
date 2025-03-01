import { acess } from './bd.js' //Importação do vetor que guarda os objetos que são os usuários

//Botão onde será confirmada se as credenciais são válidas ou não
let btn = document.querySelector('button#confirm')
function acessar(){
    //Acesso aos inputs que contém login e senha
    let username = document.querySelector('input#username')
    let passW = document.querySelector('input#password')
    let login = username.value
    let senha = passW.value

    //Parte de controle
    let control = false


    //Será feito um percurso no vetor com os objetos e será analisado se o nome e senha tem no banco de dados
    acess.find(function(user){
        if (login == user.login & senha == user.senha){
            control = true
        }
    })

    //Controle de acesso da página de login de acordo com o valor das credenciais
    if (control){
         location.href = "../pages/galery.html"
         localStorage.token = senha
    } else{
        window.alert(`Acesso negado, senha ou nome errados`)
    }
}
btn.addEventListener('click', acessar)