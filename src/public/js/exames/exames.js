// eslint-disable-next-line import/extensions
import updatePagination from '../utils/pagination.js';

let currentOffset = 0;

function ajaxExame() {
  const listarPor = document.getElementById('listarpor');
  const option = listarPor.options[listarPor.selectedIndex].value;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/exame?sort=${option}`, false);
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
      table.innerHTML = '<h3> Não há exames cadastrados </h3>';
    } else {
      data.slice(currentOffset, currentOffset + 10).forEach((exame) => {
        innerHTML += `<tr class='clickable-row' data-href='/exames/${exame.idExame}'>
                        <th scope='row'>${exame.idExame}</th>
                        <td>${exame.nome}</td>
                        <td>${exame.tipo_analise}</td>
                        <td>${exame.metodo ? exame.metodo : 'N/A'}</td>
                        <td>${exame.valor_ref ? exame.valor_ref : 'N/A'}</td>
                    </tr>`;
      });
    }

    tableBody.innerHTML = innerHTML;
    $('.clickable-row').click(function clickRowF() {
      window.location = $(this).data('href');
    });
  }
}

$(document).ready(() => {
  $('#menu-link-exames').addClass('active');
  const data = ajaxExame();
  updateTable(data, 0);
});

$('#listarpor').change(() => {
  const data = ajaxExame();
  updateTable(data, 0);
});
