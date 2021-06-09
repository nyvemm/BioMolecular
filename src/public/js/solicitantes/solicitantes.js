let currentOffset = 0;

function ajaxSolicitante() {
  const listarPor = document.getElementById('listarpor');
  const option = listarPor.options[listarPor.selectedIndex].value;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/solicitante?sort=${option}`, false);
  xhr.send();

  if (xhr.status === 200 && xhr.readyState === 4) {
    const response = JSON.parse(xhr.responseText);
    return response;
  }
  return null;
}

function updateTable(data, offset) {
  if (data) {
    currentOffset = offset;
    const tableBody = document.getElementById('table-body');
    const table = document.getElementById('table');

    const tableRowsLen = data.length;
    const limit = 10;

    let innerHTML = '';
    updatePagination(data, tableRowsLen, limit, offset, updateTable);

    if (data.length === 0) {
      table.innerHTML = '<h3> Não há solicitantes cadastrados </h3>';
    } else {
      data.slice(currentOffset, currentOffset + 10).forEach((solicitante) => {
        innerHTML += `<tr class='clickable-row' data-href='/solicitantes/${solicitante.idSolicitante}'>
                        <th scope='row'>${solicitante.idSolicitante}</th>
                        <td>${solicitante.nome}</td>
                        <td>${solicitante.cidade}</td>
                        <td>${solicitante.estado}</td>
                    </tr>`;
      });
    }

    tableBody.innerHTML = innerHTML;
    $('.clickable-row').click(function clickRow() {
      window.location = $(this).data('href');
    });
  }
}

$(document).ready(() => {
  $('#menu-link-solicitantes').addClass('active');
  const data = ajaxSolicitante();
  updateTable(data, 0);
});

$('#listarpor').change(() => {
  const data = ajaxSolicitante();
  updateTable(data, 0);
});
