function postData() {
    let warnings = document.getElementById('warnings')
    const formData = new FormData(document.getElementById('formulario'))

    let medicamentos = Array.from(document.getElementsByName('medicamento-selecionado')).map(med => med.innerHTML)
    let exames = Array.from(document.getElementsByName('exames-escolhidos')).filter(ex => $(ex).prop('checked')).map(ex => $(ex).data('id'))
    formData.append('medicamentos', medicamentos)
    formData.append('exames', exames)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/amostra', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

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
                    console.log(response)
                    innerHTML += warningMessage('Erro interno.', 'danger')
                }

            } else if (response.status == 'success') {
                innerHTML += warningMessage('O amostra foi inserida com sucesso.', 'success')
            }

            warnings.innerHTML = innerHTML

        } else {
            warnings.innerHTML = warningMessage('Falha ao alterar amostra.', 'danger')
        }
    }
    xhr.send(new URLSearchParams(formData))
}


function fetchPaciente(query = '') {
    $('#modal-paciente-content').html('')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/paciente', true)
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            response.forEach((paciente) => {
                if (paciente.nome.toLowerCase().includes(query.toLowerCase())) {
                    $('#modal-paciente-content').append(function() {
                        return $(`<li class="list-group-item paciente-item">${paciente.nome}</li>`).click(() => {
                            $('#idpaciente').val(paciente.idpaciente)
                            $('#nomepaciente').val(paciente.nome)
                            $('#idade').val(paciente.idade)
                            $('#modalPaciente').modal('hide');
                        })
                    })
                }
            })
        }
    }
    xhr.send()
}

function fetchSolicitante(query = '') {
    $('#modal-solicitante-content').html('')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/solicitante', true)
    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            response.forEach((solicitante) => {
                if (solicitante.nome.toLowerCase().includes(query.toLowerCase())) {
                    $('#modal-solicitante-content').append(function() {
                        return $(`<li class="list-group-item solicitante-item">${solicitante.nome}</li>`).click(() => {
                            $('#idsolicitante').val(solicitante.idsolicitante)
                            $('#nomesolicitante').val(solicitante.nome)
                            $('#cidadeestado').val(`${solicitante.cidade}-${solicitante.estado}`)
                            $('#modalSolicitante').modal('hide');
                        })
                    })
                }
            })
        }
    }
    xhr.send()
}

function fetchExame() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/exame', true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            response.forEach((exame) => {
                $('#lista-exames').append($(`<div class="form-check">
                <input class="form-check-input" data-id="${exame.idexame}" type="checkbox" name="exames-escolhidos" id="exame-${exame.idexame}">
                <label class="form-check-label" for="exame-${exame.idexame}">${exame.nome}</label></div>`))
            })
        }
    }
    xhr.send()
}

function adicionaMedicamento() {
    $('#lista-medicamentos').append(function() {
        if ($('#queryMedicamento').val() != '')
            return $(`<li class="list-group-item" name="medicamento-selecionado">${$('#queryMedicamento').val()}</li>`).click(function() {
                this.remove()
            })
    })
    $('#queryMedicamento').val('')
}

/* Campos */
$(document).ready(() => {
    $('#gestante').on('change', function() {
        if (this.selectedIndex == 0) {
            $('#semanas_gestacao').prop('disabled', true)
            $('#semanas_gestacao').val('')
        } else {
            $('#semanas_gestacao').prop('disabled', false)
        }
    })

    $('#transfusao').on('change', function() {
        if (this.selectedIndex == 0) {
            $('#dt_ult_transfusao').prop('disabled', true)
            $('#dt_ult_transfusao').val('')
        } else {
            $('#dt_ult_transfusao').prop('disabled', false)
        }
    })

    $('#uso_medicamentos').on('change', function() {
        if (this.selectedIndex == 0) {
            $('#medicamentos').css('display', 'none')
        } else {
            $('#medicamentos').css('display', 'block')
        }
    })


})

$(document).ready(() => {
    $('#menu-link-amostras').addClass('active')
    $('#buscar-paciente').bind("click", () => fetchPaciente(''))
    $('#queryPaciente').keyup(() => fetchPaciente($('#queryPaciente').val()))
    $('#buscar-solicitante').bind("click", () => fetchSolicitante(''))
    $('#querySolicitante').keyup(() => fetchPaciente($('#querySolicitante').val()))

    //Adiciona medicamento
    $('#adicionar-medicamento').bind("click", adicionaMedicamento)
    $('#queryMedicamento').on('keyup', (e) => { if (e.keyCode == '13') { adicionaMedicamento() } })

    //Adiciona os exames
    fetchExame()

    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    //Impede a submissão do formulário com enter.
    $(document).keypress(function(event) { if (event.which == '13') { event.preventDefault(); } });

})