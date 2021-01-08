/* Pega o valor único de um array */
function unique(value, index, self) {
    return self.indexOf(value) === index;
}

/* Pega o valor de um exame já selecionado para a amostra */
function fetchCurrentExams() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/amostra-exames?id=${$('#idamostra').val()}`, false)
    xhr.send()

    if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        return response
    }


}

function fetchExame() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/exame', true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)

            /* Cria uma lista de objetos contendo o tipo e o valor */
            let listaExames = response.map(exame => exame.tipo_analise)
            listaExames = listaExames.filter(unique)
            let exames = []
            listaExames.forEach((tipo_exame) => {
                exames.push({ tipo: tipo_exame, valor: [] })
            })

            /* Mapeia os valores atuais pra lista de objetos */
            response.forEach((exame) => {
                let tipo = exame.tipo_analise
                exames[listaExames.findIndex((elem) => elem == tipo)].valor.push(exame)
            })

            /* Pega a lista atual dos exames selecionados */
            let listaExamesSelecionados = fetchCurrentExams()
            listaExamesSelecionados = listaExamesSelecionados.map(exame => exame.idexame)

            query = ''
            exames.forEach((exame) => {
                query += `<div><h4> ${exame.tipo} </h3>`
                exame.valor.forEach((valor_exame) => {
                    if (valor_exame.idexame in listaExamesSelecionados) {
                        query += `<div class="form-check">
                        <input class="form-check-input" data-id="${valor_exame.idexame}" type="checkbox" name="exames-escolhidos" id="exame-${valor_exame.idexame}" checked>
                        <label class="form-check-label" for="exame-${valor_exame.idexame}">${valor_exame.nome}</label></div>`
                    } else {
                        query += `<div class="form-check">
                        <input class="form-check-input" data-id="${valor_exame.idexame}" type="checkbox" name="exames-escolhidos" id="exame-${valor_exame.idexame}">
                        <label class="form-check-label" for="exame-${valor_exame.idexame}">${valor_exame.nome}</label></div>`
                    }
                })
                query += '<hr></div>'
            })
            $('#lista-exames').append($(query))
        }
    }
    xhr.send()
}

function putData() {
    const xhr = new XMLHttpRequest()
    const formData = new FormData(document.getElementById('formulario'))
    xhr.open('PUT', '/amostra', true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            console.log(response)

            if (response.status == 'success') {
                $('#warnings').val(warningMessage('Amostra atualizada com sucesso', 'success'))
            } else {
                $('#warnings').val(warningMessage('Erro ao atualizar amostra', 'danger'))
            }
        }
    }
    console.log(new URLSearchParams(formData))
    xhr.send(new URLSearchParams(formData))
}

function deleteData() {
    let id = $('#idamostra').val()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/amostra?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            window.location.href = '/amostras'
        }
    }

    xhr.send()
}

/* Campos */
$(document).ready(() => {
    $('#gestante').on('change', function () {
        if (this.selectedIndex == 0) {
            $('#semanas_gestacao').prop('disabled', true)
            $('#semanas_gestacao').val('')
        } else {
            $('#semanas_gestacao').prop('disabled', false)
        }
    })

    $('#transfusao').on('change', function () {
        if (this.selectedIndex == 0) {
            $('#dt_ult_transfusao').prop('disabled', true)
            $('#dt_ult_transfusao').val('')
        } else {
            $('#dt_ult_transfusao').prop('disabled', false)
        }
    })
})

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
        putData()
    }

    document.getElementById('excluir').onclick = (e) => {
        e.preventDefault()
        deleteData()
    }

    fetchExame()
})