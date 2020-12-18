function atualizaResultados() {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', `/resultados/${$('#idamostra').val()}`, true)
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
                        <p class="m-0"> <b>Observação</b>: ${resultado.observacao_resultado == '' ? 'Sem observações.' : resultado.observacao_resultado} </p>
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
            window.location.reload()
        }
    }
    xhr.send()
}

function setWarning(text, color) {
    $('#warnings').html(`
    <div class="alert alert-${color} alert-dismissible fade show" role="alert">
       ${text}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>   
    `)
}

function putAmostra() {

    const formData = new FormData()
    formData.append('idamostra', $('#idamostra').val())
    formData.append('interpretacao_resultados', $('#interpretacao_resultados').val())

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', '/amostra', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    xhr.onload = (e) => {
        if(xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            console.log(response)
            if('success' == response.status) {
                setWarning('A amostra foi atualizada com sucesso.', 'success')
            } else {
                setWarning('Erro ao atualizar a amostra.', 'danger')
            }
        }
    }   
    xhr.send(new URLSearchParams(formData))
}

function postResultados(id) {
    const xhr = new XMLHttpRequest()
    const formData = new FormData(document.getElementById(`formulario-${id}`))

    if ($('#valor_resultado').val() == '') {
        setWarning('O campo de resultado não pode estar vazio.', 'danger')
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
        return;
    }

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
    atualizaResultados()
})