function gerar_laudo() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/relatorios/gerar-laudo?id=${$('#id').val()}`, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let tabela = $('#tabela')
            tabela.html('')

            if (response.length == 0) {
                $('#warnings').html(warningMessage('Essa amostra não tem dados cadastrados.', 'warning'))
                return;
            }

            response.forEach(({ tipo, valor }) => {
                let subquery = valor.map((x => {
                    return `<tr>
                        <th>${x.nome}</th>
                        <td>${x.valor_resultado ? x.valor_resultado : 'Sem resultados'}</td>
                        <td>${x.metodo ? x.metodo : 'N/A'}</td>
                        <td>${x.valor_ref ? x.valor_ref : 'N/A'}</td>
                    </tr>`
                })).join('')

                let query = `<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">${tipo}</th>
                                <th scope="col">Resultado</th>
                                <th scope="col">Método</th>
                                <th scope="col">Referência</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`
                tabela.html(tabela.html() + query)
                $('#warnings').html('')
            })
        }
    }
    xhr.send()
}

function gerar_amostras_situacao() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/relatorios/gerar-amostras-situacao?situacao=${$('#status_pedido').val()}`, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let tabela = $('#tabela')
            tabela.html('')
            if (response.length == 0) {
                $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'))
                return;
            }

            let subquery = response.map(amostra => {
                return `<tr onclick="javascript:window.location.href='/amostras/${amostra.idamostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`
            }).join('')

            tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`)
            $('#warnings').html('')
        }
    }
    xhr.send()
}

function gerar_amostras_material() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/relatorios/gerar-amostras-material?material=${$('#material').val()}`, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let tabela = $('#tabela')
            tabela.html('')

            if (response.length == 0) {
                $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'))
                return;
            }

            let subquery = response.map(amostra => {
                return `<tr onclick="javascript:window.location.href='/amostras/${amostra.idamostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`
            }).join('')

            tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`)
            $('#warnings').html('')
        }
    }
    xhr.send()
}

function gerar_amostras_tipo_analise() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/relatorios/gerar-amostras-tipo-exame?tipo_analise=${$('#tipo_analise').val()}`, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let tabela = $('#tabela')
            tabela.html('')

            if (response.length == 0) {
                $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'))
                return;
            }

            let subquery = response.map(amostra => {
                return `<tr onclick="javascript:window.location.href='/amostras/${amostra.idamostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`
            }).join('')

            tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`)
            $('#warnings').html('')
        }
    }
    xhr.send()
}

$(document).ready(() => {
    $('#menu-link-relatorios').addClass('active')

    if (window.location.pathname.includes('amostras-situacao')) {
        gerar_amostras_situacao()
    }
    if (window.location.pathname.includes('amostras-material')) {
        gerar_amostras_material()
    }

    if (window.location.pathname.includes('amostras-tipo-exame')) {
        gerar_amostras_tipo_analise()
    }
})