const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paginacionDiv = document.querySelector('#paginacion')

const registrosPorPagina = 30
let totalPaginas
let iterador
let paginaActual = 1


window.onload = () => {
    formulario.addEventListener('submit',validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault()

    const terminoBusqueda = document.querySelector('#termino').value

    if(terminoBusqueda === '') {
        mostrarAlerta('Add a search term')
        return
    }

    buscarImagenes()
}

function mostrarAlerta(mensaje) {

    const alertaClass = document.querySelector('.border-red-400')

    if(!alertaClass) {   
        const alerta = document.createElement('p')
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center')
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `
        formulario.appendChild(alerta)
        
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value

    const key = '16200441-05479aa4d92d01fd869c7bf2d'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`

    fetch(url).then(resultado => {
        return resultado.json()
    }).then(datos => {
        totalPaginas = calcularPaginas(datos.totalHits)
        mostrarImagenes(datos.hits);
    })
}



function mostrarImagenes(imagenes) {

    limpiarHTML(resultado)

    imagenes.map(imagen => {
        const {previewURL,likes,views,largeImageURL} = imagen

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
            <img class="w-full" src="${previewURL}" />
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Liked</span></p>
                    <p class="font-bold">${views} <span class="font-light">Views</span></p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">View Image</a>
                <div/>
            <div/>
        <div/>
        `
    })

    imprimirPaginador()
}

function calcularPaginas(total) {
    const paginacion = parseInt(Math.ceil(total/registrosPorPagina))
    return paginacion
}

// Generador de paginacion

function *crearPaginador(total) {
    for (i=1; i <= total; i++) {
        yield i
    }
}

function imprimirPaginador() {
    limpiarHTML(paginacionDiv)
    iterador = crearPaginador(totalPaginas)
    
    while(true) {
        const {value,done} = iterador.next()
        if(done) return

        // Caso contrario, genera un boton por cada elemento en el generador
        const boton = document.createElement('a')
        boton.href = "#"
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-5','uppercase','rounded')

        boton.onclick = function() {
            paginaActual = value
            buscarImagenes()
        }

        paginacionDiv.appendChild(boton)
        }
}

function limpiarHTML(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}