function validateIdade(text) {
    /* Operador principal */
    operator = text.charAt(0) == '>' || text.charAt(0) == '<'

    if (operator) {
        try {
            let number = parseInt(text.substring(1))
            return true && Number.isInteger(number)
        } catch {
            return false
        }
    } else {
        try {
            if (text.indexOf('-') != -1) {
                let number1 = parseInt(text.substring(0, text.indexOf('-')))
                let number2 = parseInt(text.substring(text.indexOf('-') + 1))
                return Number.isInteger(number1) && Number.isInteger(number2) && number1 < number2
            } else {
                let number3 = parseInt(text)
                return Number.isInteger(number3)
            }
        } catch {
            return false
        }
    }
}

function removeRow(event) {
    $(event).parent().parent().remove()
}

function addRow() {
    $('#table-body').append(`
        <tr>
            <th>
                <input type="text" class="form-control is-invalid" placeholder="Ex: 1-3"  onkeyup="eventValidate(this)">
            </th>
            <th>
                <input type="text" class="form-control" placeholder="Ex: 58-84%">
            </th>
            <th>
                <button type="button" class="btn btn-danger w-100" onclick="removeRow(this)">Remover</button>
            </th>
        </tr>
    `)
}

function mapTabletoJSON() {
    let table = $('#table-body')

    json_table = []
    table.children().each((i, tr) => {
        let idade = $(tr).children().eq(0).find('input').val()
        let valor = $(tr).children().eq(1).find('input').val()

        json_table.push({ idade: idade, valor: valor })
    })

    return json_table

}

function validateAll() {
    let validFields = Array.from($('th > input')).every(i => i.value != '')
    return $('.is-invalid').length == 0 && $('.is-valid').length >= 1 && validFields || $('.tab-ref-idade').css('display') == 'none'
}

function eventValidate(event) {
    if (validateIdade(event.value)) {
        event.className = 'form-control is-valid'
    } else {
        event.className = 'form-control is-invalid'
    }
}

function postData() {
    let warnings = document.getElementById('warnings')
    const formData = new FormData(document.getElementById('formulario'))

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', '/exame', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    if (!validateAll()) {
        $(warnings).html(warningMessage('É necessário preencher todas as células da tabela de referências.', 'warning'))
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
        return;
    }

    /* Verifica se a tabela está oculta. */
    if ($('.tab-ref-idade').css('display') != 'none') {
        formData.append('tabela_intervalo', JSON.stringify(mapTabletoJSON()))
    } else {
        formData.append('tabela_intervalo', null)
    }

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let innerHTML = ''

            if (response.status == 'error') {
                if ('message' in response) {
                    for (let i = 0; i < response.message.length; i++) {
                        innerHTML += warningMessage(response.message[i].msg, 'danger')
                    }
                } else {
                    innerHTML += warningMessage('Erro interno.', 'danger')
                }

            } else if (response.status == 'success') {
                innerHTML += warningMessage('O exame foi editado com sucesso.', 'success')
            }

            warnings.innerHTML = innerHTML

        } else {
            warnings.innerHTML = warningMessage('Falha ao editar usuário.', 'danger')
        }
    }
    xhr.send(new URLSearchParams(formData))
}

function deleteData() {
    let id = $('#idexame').val()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/exame?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            window.location.href = '/exames'
        }
    }

    xhr.send()
}

$(document).ready(() => {
    $('#menu-link-exames').addClass('active')
    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    document.getElementById('excluir').onclick = (e) => {
        e.preventDefault()
        deleteData()
    }

    $('#tipo_valor_ref').change(event => {
        if (event.target.value == 'Idade') {
            $('.tab-ref-idade').css('display', 'block')
        } else {
            $('.tab-ref-idade').css('display', 'none')
        }
    })

    if ($('#preset-table').length != 0) {
        let btn = $('.btn.btn-danger.w-100')
        btn.first().attr('class', 'btn btn-primary w-100')
        btn.first().attr('onclick', 'addRow(this)')
        btn.first().text('Adicionar')
    }
})