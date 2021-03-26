var currentOffset = 0

function ajaxAmostra() {
    let listarPor = document.getElementById('listarpor')
    const option = listarPor.options[listarPor.selectedIndex].value;

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/amostra?sort=${option}`, false)
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
        table.innerHTML = '<h3> Não há amostras cadastradas </h3>'
    } else {
        data.slice(currentOffset, currentOffset + 10).forEach((amostra) => {
            innerHTML += `<tr class='clickable-row' data-href='/amostras/${amostra.idamostra}'>
                        <th scope="row">${amostra.idamostra}</th>
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td class="text-status">${amostra.status_pedido}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`
        })
    }
    tableBody.innerHTML = innerHTML
    $('.text-status').each((index, value) => {
        if ($(value).text() == 'Não avaliado')
            $(value).addClass('text-danger')
        else if ($(value).text() == 'Parcialmente avaliado')
            $(value).addClass('text-warning')
        else
            $(value).addClass('text-success')
    })


    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    })
}

$(document).ready(() => {
    $('#menu-link-amostras').addClass('active')
    data = ajaxAmostra()
    updateTable(data, 0)
})

$('#listarpor').change(() => {
    data = ajaxAmostra()
    updateTable(data, 0)
})