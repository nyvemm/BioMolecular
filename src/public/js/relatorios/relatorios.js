function gerar_laudo() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/relatorios/gerar-laudo?id=${$('#id').val()}`, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let tabela = $('#tabela')
            tabela.html('')

            if(response.length == 0) {
                $('#warnings').html(warningMessage('Essa amostra não tem dados cadastrados.', 'danger'))
                return;
            }

            let query = ''
            response.forEach(laudo => {
                let raw_query = laudo.getinfoexameslaudo
                /* Pre-processamento */
                raw_query = raw_query.replaceAll('(', '')
                raw_query = raw_query.replaceAll(')', '')
                raw_query = raw_query.replaceAll('"', '')

                let row = raw_query.split(',').map(sub=>sub.trim())

                query = `
                <tr>
                    <th>${row[0]}</th>
                    <td >${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4] ? row[4] : '-'}</td>
                </tr>
                `
                tabela.html(tabela.html() + query)
            })
        }
    }
    xhr.send()
}

$(document).ready(() => {

})