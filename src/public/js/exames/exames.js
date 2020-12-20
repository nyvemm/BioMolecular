var currentOffset = 0

function ajaxExame() {
    let listarPor = document.getElementById('listarpor')
    const option = listarPor.options[listarPor.selectedIndex].value;

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/exame?sort=${option}`, false)
    xhr.send()

    if (xhr.status == 200 && xhr.readyState === 4) {
        let response = JSON.parse(xhr.responseText)
        return response
    }
}

function updateTable(data, offset) {
    let tableBody = document.getElementById('table-body')
    let table = document.getElementById('table')

    let tableRowsLen = data.length
    let limit = 10

    let innerHTML = ''
    updatePagination(data, tableRowsLen, limit)

    if (data.length == 0) {
        table.innerHTML = '<h3> Não há exames cadastrados </h3>'
    } else {
        data.slice(currentOffset, currentOffset + 10).forEach((exame) => {
            innerHTML += `<tr class='clickable-row' data-href='/exames/${exame.idexame}'>
                        <th scope="row">${exame.idexame}</th>
                        <td>${exame.nome}</td>
                        <td>${exame.tipo_analise}</td>
                        <td>${exame.metodo ? exame.metodo : 'N/A'}</td>
                        <td>${exame.valor_ref ? exame.valor_ref : 'N/A'}</td>
                    </tr>`
        })
    }

    tableBody.innerHTML = innerHTML
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    })
}

$(document).ready(() => {
    $('#menu-link-exames').addClass('active')
    data = ajaxExame()
    updateTable(data, 0)
})

$('#listarpor').change(() => {
    data = ajaxExame()
    updateTable(data, 0)
})