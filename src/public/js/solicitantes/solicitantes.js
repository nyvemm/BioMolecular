var currentOffset = 0

function ajaxSolicitante() {
    let listarPor = document.getElementById('listarpor')
    const option = listarPor.options[listarPor.selectedIndex].value;

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/solicitante?sort=${option}`, false)
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
        table.innerHTML = '<h3> Não há solicitantes cadastrados </h3>'
    } else {
        data.slice(currentOffset, currentOffset + 10).forEach((solicitante) => {
            innerHTML += `<tr class='clickable-row' data-href='/solicitantes/${solicitante.idsolicitante}'>
                        <th scope="row">${solicitante.idsolicitante}</th>
                        <td>${solicitante.nome}</td>
                        <td>${solicitante.cidade}</td>
                        <td>${solicitante.estado}</td>
                    </tr>`
        })
    }

    tableBody.innerHTML = innerHTML
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    })
}

$(document).ready(() => {
    $('#menu-link-solicitantes').addClass('active')
    data = ajaxSolicitante()
    updateTable(data, 0)
})

$('#listarpor').change(() => {
    data = ajaxSolicitante()
    updateTable(data, 0)
})