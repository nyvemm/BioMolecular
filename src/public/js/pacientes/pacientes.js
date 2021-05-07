// eslint-disable-next-line import/extensions
import updatePagination from '../utils/pagination.js';

let currentOffset = 0;

function ajaxPaciente() {
  const listarPor = document.getElementById('listarpor');
  const option = listarPor.options[listarPor.selectedIndex].value;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/paciente?sort=${option}`, false);
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
      table.innerHTML = '<h3> Não há pacientes cadastrados </h3>';
    } else {
      data.slice(currentOffset, currentOffset + 10).forEach((paciente) => {
        innerHTML += `<tr class='clickable-row' data-href='/pacientes/${paciente.idPaciente}'>
                        <th scope='row'>${paciente.idPaciente}</th>
                        <td>${paciente.nome}</td>
                        <td>${paciente.naturalidade_cidade}-${paciente.naturalidade_estado}</td>
                        <td>${paciente.idade}a ${paciente.idade_meses}m</td>
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
  $('#menu-link-pacientes').addClass('active');
  const data = ajaxPaciente();
  updateTable(data, 0);
});

$('#listarpor').change(() => {
  const data = ajaxPaciente();
  updateTable(data, 0);
});
