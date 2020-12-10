function addOffset(data, limit) {
    currentOffset += limit
    updateTable(data, currentOffset)
}

function removeOffset(data, limit) {
    currentOffset -= limit
    updateTable(data, currentOffset)
}

function setOffset(data, n, limit) {
    currentOffset = ((n - 1) * limit)
    updateTable(data, currentOffset)
}


function updatePagination(data, tableRowsLen, limit) {
    let pagination = document.getElementById('pagination')

    let totalPagination = Math.floor(tableRowsLen / limit)
    let currentPagination = Math.floor(currentOffset / limit)
    let innerHTML = ''

    /* Anterior */
    if (currentOffset == 0) {
        innerHTML += `<li class="page-item disabled"><a class="page-link" href="javascript:removeOffset(data, ${limit})">Anterior</a></li>`
    } else {
        innerHTML += `<li class="page-item"><a class="page-link" href="javascript:removeOffset(data, ${limit})">Anterior</a></li>`
    }

    for (let i = 0; i < totalPagination; i++) {
        if (i == currentPagination) {
            innerHTML += `<li class="page-item active"><a class="page-link" href="javascript:setOffset(data, ${i + 1}, ${limit})">${i + 1}</a></li>`
        } else {
            innerHTML += `<li class="page-item"><a class="page-link" href="javascript:setOffset(data, ${i + 1}, ${limit})">${i + 1}</a></li>`
        }
    }

    /* Próximo */
    if (currentPagination == totalPagination - 1 < 0 ? 0 : totalPagination - 1) {
        innerHTML += `<li class="page-item disabled"><a class="page-link" href="javascript:addOffset(data, ${limit})">Próximo</a></li>`
    } else {
        innerHTML += `<li class="page-item"><a class="page-link" href="javascript:addOffset(data, ${limit})">Próximo</a></li>`
    }

    pagination.innerHTML = innerHTML

}