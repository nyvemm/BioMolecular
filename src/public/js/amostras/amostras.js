// eslint-disable-next-line import/extensions
import updatePagination from '../utils/pagination.js';

let currentOffset = 0;

function ajaxAmostra() {
  const listarPor = document.getElementById('listarpor');
  const option = listarPor.options[listarPor.selectedIndex].value;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/amostra?sort=${option}`, false);
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
    // eslint-disable-next-line no-undef
    updatePagination(data, tableRowsLen, limit, offset, updateTable);

    if (data.length === 0) {
      table.innerHTML = '<h3> Não há amostras cadastradas </h3>';
    } else {
      data.slice(currentOffset, currentOffset + 10).forEach((amostra) => {
        innerHTML += `<tr class='clickable-row' data-href='/amostras/${amostra.idAmostra}'>
                        <th scope='row'>${amostra.idAmostra}</th>
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td class='text-status'>${amostra.status_pedido}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`;
      });
    }
    tableBody.innerHTML = innerHTML;
    $('.text-status').each((index, value) => {
      if ($(value).text() === 'Não avaliado') $(value).addClass('text-danger');
      else if ($(value).text() === 'Parcialmente avaliado') $(value).addClass('text-warning');
      else $(value).addClass('text-success');
    });

    $('.clickable-row').click(function clickRow() {
      window.location = $(this).data('href');
    });
  }
}

$(document).ready(() => {
  $('#menu-link-amostras').addClass('active');
  const data = ajaxAmostra();
  updateTable(data, 0, 0, null);
});

$('#listarpor').change(() => {
  const data = ajaxAmostra();
  updateTable(data, 0, 0, null);
});
