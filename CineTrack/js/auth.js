// CADASTRO

let cadastroForm = document.getElementById("cadastroForm")

if (cadastroForm) {
    cadastroForm.addEventListener("submit", function(event) {

        event.preventDefault()

        let nome = document.getElementById("nome").value
        let email = document.getElementById("email").value
        let senha = document.getElementById("senha").value

        let usuario = {
            nome: nome,
            email: email,
            senha: senha
        }
        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        )
        alert("Conta criada com sucesso!")
        window.location.href = "index.html"
    })
}


// LOGIN

let loginForm = document.getElementById("loginForm")

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault()

        let email = document.getElementById("email").value
        let senha = document.getElementById("senha").value
        let usuarioSalvo = localStorage.getItem("usuario")

        if (usuarioSalvo === null) {
            document.getElementById("mensagem").textContent =
                "Nenhuma conta cadastrada."
            return
        }

        let usuario = JSON.parse(usuarioSalvo)

        if (email === usuario.email && senha === usuario.senha) {
            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuario)
            )
            window.location.href = "dashboard.html"
        } else {
            document.getElementById("mensagem").textContent =
                "E-mail ou senha incorretos."
        }
    })
}