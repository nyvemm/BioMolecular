function atualizaResultados() {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', `/resultados/${$(idamostra).val()}`, true)
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            $('.resultado-exame-block').each((index, val) => val.innerHTML = '')
            response.forEach((resultado) => {
                let xButton = ` <div class="col-md-1">
                <span style="cursor:pointer;" aria-hidden="true" onclick='deleteResultado(${resultado.idresultado})'>&times;</span>
                </div>`
                xButton = !resultado.status ? xButton : ''

                $(`#amostraexame-${resultado.idamostraexame}`).append(`
                    <div class="row">
                        <div class="col-md-11">
                        <p class="m-0"> <b>ID</b>: ${resultado.idresultado} </p>
                        <p class="m-0"> <b>Resultado</b>: ${resultado.valor_resultado} </p>
                        <p class="m-0"> <b>Observação</b>: ${resultado.observacao_resultado} </p>
                        </div>
                       ${xButton}
                    </div>
                    <hr>
                `)
            })
        }
    }
    xhr.send()
}

function deleteResultado(id) {
    const xhr = new XMLHttpRequest()

    xhr.open('DELETE', `/resultados/${id}`, true)
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            console.log(response)
            atualizaResultados()
        }
    }
    xhr.send()
}

function submeterResultado(id) {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', `/submeter-resultado/${id}`, true)
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
        }
    }
    xhr.send()
}


function postResultados(id) {
    const xhr = new XMLHttpRequest()
    const formData = new FormData(document.getElementById(`formulario-${id}`))

    xhr.open('POST', '/resultados', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.status == 'success') {
                atualizaResultados()
                $('#valor_resultado').val('')
                $('#observacao_resultado').val('')
            }
        }
    }

    xhr.send(new URLSearchParams(formData))
}


$(document).ready(() => {
    $('.text-status').each((index, value) => {
        if ($(value).text() == 'Não avaliado')
            $(value).addClass('text-danger')
        else if ($(value).text() == 'Parcialmente avaliado')
            $(value).addClass('text-warning')
        else
            $(value).addClass('text-success')
    })


    $('#menu-link-amostras').addClass('active')
    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    atualizaResultados()
})