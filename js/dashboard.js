
// USUÁRIO LOGADO

let usuarioLogado = localStorage.getItem("usuarioLogado")

if (usuarioLogado === null) {
    window.location.href = "index.html"
}

let usuario = JSON.parse(usuarioLogado)

let nomeUsuario = document.getElementById("nomeUsuario")

nomeUsuario.textContent = usuario.nome


// BOTÃO SAIR

let btnSair = document.getElementById("btnSair")

if (btnSair) {

    btnSair.addEventListener("click", function () {

        localStorage.removeItem("usuarioLogado")
        window.location.href = "index.html"
    })
}


// MODAL DE ADICIONAR FILME

let btnAdicionar = document.getElementById("btnAdicionar")
let modalFilme = document.getElementById("modalFilme")

btnAdicionar.addEventListener("click", function () {
    modalFilme.style.display = "flex"
})


let btnFecharModal = document.getElementById("btnFecharModal")

btnFecharModal.addEventListener("click", function () {
    modalFilme.style.display = "none"
})


// FILMES

let filmes = JSON.parse(localStorage.getItem("filmes")) || []

for (let i = 0; i < filmes.length; i++) {

    if (typeof filmes[i] === "string") {

        filmes[i] = {
            titulo: filmes[i],
            assistido: false,
            favorito: false
        }
    }
}


// ELEMENTOS DOS FILMES

let listaFilmes = document.getElementById("listaFilmes")
let totalFilmes = document.getElementById("totalFilmes")
let filmesAssistidos = document.getElementById("filmesAssistidos")
let totalFavoritos = document.getElementById("totalFavoritos")

// MOSTRAR FILMES

function mostrarFilmes() {

    listaFilmes.innerHTML = ""

    totalFilmes.textContent = filmes.length

    let quantidadeAssistidos = 0
    let quantidadeFavoritos = 0

    for (let i = 0; i < filmes.length; i++) {

        if (filmes[i].assistido) {
            quantidadeAssistidos++
        }

        if (filmes[i].favorito) {
            quantidadeFavoritos++
        }

        listaFilmes.innerHTML += `
            <div class="filme-card">

                <div class="filme-poster">
                    <img 
                        src="${filmes[i].poster}" 
                        alt="Poster do filme">
                </div>

                <div class="filme-info">

                    <h3>${filmes[i].titulo}</h3>

                    <p>
                        ${filmes[i].ano} • ${filmes[i].genero}
                    </p>

                    <p class="filme-nota">
                        ⭐ ${filmes[i].nota}
                    </p>

                </div>

                <div class="filme-acoes">

                    <button 
                        class="btn-principal" 
                        onclick="marcarAssistido(${i})">

                        ${filmes[i].assistido
                            ? "Assistido ✓"
                            : "Marcar como assistido"}

                    </button>

                    <button 
                        class="btn-principal" 
                        onclick="marcarFavorito(${i})">

                        ${filmes[i].favorito
                            ? "Favorito ✓"
                            : "Favoritar"}

                    </button>

                    <button 
                        class="btn-secundario" 
                        onclick="excluirFilme(${i})">

                        Excluir

                    </button>

                    <button 
                        class="btn-secundario" 
                        onclick="editarFilme(${i})">

                        Editar

                    </button>

                </div>

            </div>
        `
    }

    filmesAssistidos.textContent = quantidadeAssistidos
    totalFavoritos.textContent = quantidadeFavoritos
}

mostrarFilmes()

// MARCAR COMO ASSISTIDO

function marcarAssistido(indice) {

    filmes[indice].assistido = !filmes[indice].assistido

    localStorage.setItem(
        "filmes",
        JSON.stringify(filmes)
    )

    mostrarFilmes()
}

// MARCAR COMO FAVORITO

function marcarFavorito(indice) {

    filmes[indice].favorito = !filmes[indice].favorito

    localStorage.setItem(
        "filmes",
        JSON.stringify(filmes)
    )

    mostrarFilmes()
}


// EXCLUIR FILME

function excluirFilme(indice) {

    filmes.splice(indice, 1)

    localStorage.setItem(
        "filmes",
        JSON.stringify(filmes)
    )

    mostrarFilmes()
}


// API TVMAZE

let filmeForm = document.getElementById("filmeForm")

function buscarFilme(titulo) {

    return fetch(
        "https://api.tvmaze.com/search/shows?q=" +
        encodeURIComponent(titulo)
    )
    .then(function(resposta) {

        return resposta.json()
    })
}


filmeForm.addEventListener("submit", function(event) {

    event.preventDefault()

    let titulo = document.getElementById("tituloFilme").value

    buscarFilme(titulo)
        .then(function(dados) {

            if (dados.length === 0) {
                alert("Filme não encontrado!")
                return
            }

            let resultado = dados[0].show

            filmes.push({

                titulo: resultado.name,

                ano: resultado.premiered
                    ? resultado.premiered.substring(0, 4)
                    : "Não informado",

                genero: resultado.genres.length > 0
                    ? resultado.genres.join(" • ")
                    : "Não informado",

                poster: resultado.image
                    ? resultado.image.medium
                    : "",

                nota: resultado.rating.average
                    ? resultado.rating.average
                    : "Sem nota",

                assistido: false,

                favorito: false
            })

            localStorage.setItem(
                "filmes",
                JSON.stringify(filmes)
            )

            mostrarFilmes()

            modalFilme.style.display = "none"

            document.getElementById("tituloFilme").value = ""
        })
        .catch(function(erro) {

            console.log("Erro ao buscar o filme:", erro)

            alert("Não foi possível buscar o filme.")
        })
})


// EDITAR FILME

let indiceEdicao = null

function editarFilme(indice) {

    indiceEdicao = indice

    document.getElementById("editarTitulo").value =
        filmes[indice].titulo

    document.getElementById("editarAno").value =
        filmes[indice].ano

    document.getElementById("editarGenero").value =
        filmes[indice].genero

    document.getElementById("modalEditar").style.display = "flex"
}


let editarForm = document.getElementById("editarForm")

editarForm.addEventListener("submit", function(event) {

    event.preventDefault()

    filmes[indiceEdicao].titulo =
        document.getElementById("editarTitulo").value

    filmes[indiceEdicao].ano =
        document.getElementById("editarAno").value

    filmes[indiceEdicao].genero =
        document.getElementById("editarGenero").value

    localStorage.setItem(
        "filmes",
        JSON.stringify(filmes)
    )

    mostrarFilmes()
    document.getElementById("modalEditar").style.display = "none"
    indiceEdicao = null
})


let btnFecharEditar = document.getElementById("btnFecharEditar")

btnFecharEditar.addEventListener("click", function() {

    document.getElementById("modalEditar").style.display = "none"
    indiceEdicao = null
})


// SEÇÕES


let secaoFilmes = document.querySelector(".filmes")
let secaoEstatisticas = document.getElementById("secaoEstatisticas")

secaoEstatisticas.style.display = "none"


// FAVORITOS

function mostrarFavoritos() {

    listaFilmes.innerHTML = ""

    for (let i = 0; i < filmes.length; i++) {

        if (filmes[i].favorito) {

            listaFilmes.innerHTML += `
                <div class="filme-card">

                    <div class="filme-poster">
                        <img 
                            src="${filmes[i].poster}" 
                            alt="Poster do filme">
                    </div>

                    <div class="filme-info">

                        <h3>${filmes[i].titulo}</h3>

                        <p>
                            ${filmes[i].ano} • ${filmes[i].genero}
                        </p>

                        <p class="filme-nota">
                            ⭐ ${filmes[i].nota}
                        </p>

                    </div>

                </div>
            `
        }
    }
}


// NAVEGAÇÃO

let linkDashboard = document.getElementById("linkDashboard")
let linkFilmes = document.getElementById("linkFilmes")
let linkFavoritos = document.getElementById("linkFavoritos")
let linkEstatisticas = document.getElementById("linkEstatisticas")


linkFilmes.addEventListener("click", function(event) {

    event.preventDefault()
    secaoFilmes.style.display = "block"
    secaoEstatisticas.style.display = "none"
    mostrarFilmes()
    mudarMenuAtivo(linkFilmes)
})


linkFavoritos.addEventListener("click", function(event) {

    event.preventDefault()
    secaoFilmes.style.display = "block"
    secaoEstatisticas.style.display = "none"
    mostrarFavoritos()
    mudarMenuAtivo(linkFavoritos)
})


linkEstatisticas.addEventListener("click", function(event) {

    event.preventDefault()
    secaoFilmes.style.display = "none"
    secaoEstatisticas.style.display = "block"
    mostrarEstatisticas()
    mudarMenuAtivo(linkEstatisticas)
})


linkDashboard.addEventListener("click", function(event) {

    event.preventDefault()
    secaoFilmes.style.display = "block"
    secaoEstatisticas.style.display = "none"
    mostrarFilmes()
    mudarMenuAtivo(linkDashboard)
})


// MENU ATIVO

function mudarMenuAtivo(menuClicado) {

    let menus = document.querySelectorAll(".sidebar nav a")

    for (let i = 0; i < menus.length; i++) {
        menus[i].classList.remove("ativo")
    }

    menuClicado.classList.add("ativo")
}


// ESTATÍSTICAS

function mostrarEstatisticas() {

    let quantidadeAssistidos = 0
    let quantidadeFavoritos = 0

    for (let i = 0; i < filmes.length; i++) {

        if (filmes[i].assistido) {
            quantidadeAssistidos++
        }

        if (filmes[i].favorito) {
            quantidadeFavoritos++
        }
    }

    let quantidadeNaoAssistidos =
        filmes.length - quantidadeAssistidos

    document.getElementById("estatisticaTotal").textContent =
        filmes.length

    document.getElementById("estatisticaAssistidos").textContent =
        quantidadeAssistidos

    document.getElementById("estatisticaFavoritos").textContent =
        quantidadeFavoritos

    document.getElementById("estatisticaNaoAssistidos").textContent =
        quantidadeNaoAssistidos
}