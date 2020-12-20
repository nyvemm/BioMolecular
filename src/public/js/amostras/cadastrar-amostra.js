function postData() {
    let warnings = document.getElementById('warnings')
    const formData = new FormData(document.getElementById('formulario'))

    let medicamentos = Array.from(document.getElementsByName('medicamento-selecionado')).map(med => med.innerHTML)
    let exames = Array.from(document.getElementsByName('exames-escolhidos')).filter(ex => $(ex).prop('checked')).map(ex => $(ex).data('id'))

    if(document.getElementsByName('exames-escolhidos').length == 0) {
        $('#warnings').html(warningMessage('É preciso escolher pelo menos 1 exame.', 'danger'))
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
        return;
    }

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
                    innerHTML += warningMessage('Erro interno.', 'danger')
                }

            } else if (response.status == 'success') {
                innerHTML += warningMessage('A amostra foi inserida com sucesso.', 'success')
            }

            warnings.innerHTML = innerHTML

        } else {
            warnings.innerHTML = warningMessage('Falha ao alterar amostra.', 'danger')
        }
    }
    xhr.send(new URLSearchParams(formData))
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
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
                    $('#modal-paciente-content').append(function () {
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
                    $('#modal-solicitante-content').append(function () {
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

/* Pega o valor único de um array */
function unique(value, index, self) {
    return self.indexOf(value) === index;
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

            query = ''
            exames.forEach((exame) => {
                query += `<div><h4> ${exame.tipo} </h3>`
                exame.valor.forEach((valor_exame) => {
                    query += `<div class="form-check">
                    <input class="form-check-input" data-id="${valor_exame.idexame}" type="checkbox" name="exames-escolhidos" id="exame-${valor_exame.idexame}">
                    <label class="form-check-label" for="exame-${valor_exame.idexame}">${valor_exame.nome}</label></div>`
                })
                query += '<hr></div>'
            })
            $('#lista-exames').append($(query))
        }
    }
    xhr.send()
}

function adicionaMedicamento() {
    $('#lista-medicamentos').append(function () {
        if ($('#queryMedicamento').val() != '')
            return $(`<li class="list-group-item" name="medicamento-selecionado"> ${$('#queryMedicamento').val()} </li>`).click(function () {
                this.remove()
            })
    })
    $('#queryMedicamento').val('')
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

    $('#uso_medicamentos').on('change', function () {
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
    $('#querySolicitante').keyup(() => fetchSolicitante($('#querySolicitante').val()))

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
    $(document).keypress(function (event) { if (event.which == '13') { event.preventDefault(); } });

})