function addOffset(data, limit, currentOffset, updateTable) {
  updateTable(data, currentOffset + limit);
}

function removeOffset(data, limit, currentOffset, updateTable) {
  updateTable(data, currentOffset - limit);
}

function setOffset(data, n, limit, updateTable) {
  updateTable(data, ((n - 1) * limit));
}

function updatePagination(data, tableRowsLen, limit, currentOffset, updateTable) {
  const pagination = document.getElementById('pagination');

  const totalPagination = Math.ceil(tableRowsLen / limit);
  const currentPagination = Math.floor(currentOffset / limit);
  $(pagination).html('');

  /* Anterior */
  const previewElement = $("<li class='page-item'></li>").append("<p class='page-link'>Anterior</p>");
  if (currentOffset === 0) {
    previewElement.addClass('disabled');
  } else {
    previewElement.on('click', () => removeOffset(data, limit, currentOffset, updateTable));
  }
  $(pagination).append(previewElement);

  for (let i = 0; i < totalPagination; i += 1) {
    const currentElement = $("<li class='page-item'></li>").append(`<p class='page-link'>${i + 1}</p>`);
    currentElement.on('click', () => setOffset(data, i + 1, limit, updateTable));
    if (i === currentPagination) {
      currentElement.addClass('active');
    }
    $(pagination).append(currentElement);
  }

  /* Próximo */
  const nextElement = $("<li class='page-item'></li>").append("<p class='page-link'>Próximo</p>");
  if (totalPagination - 1 < 0 || currentPagination === totalPagination - 1) {
    nextElement.addClass('disabled');
  } else {
    nextElement.on('click', () => addOffset(data, limit, currentOffset, updateTable));
  }
  $(pagination).append(nextElement);
}