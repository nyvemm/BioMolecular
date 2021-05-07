// eslint-disable-next-line import/extensions
import warningMessage from '../utils/global.js';

function validateIdade(text) {
  /* Operador principal */
  const operator = text.charAt(0) === '>' || text.charAt(0) === '<';

  if (operator) {
    try {
      const number = parseInt(text.substring(1), 10);
      return true && Number.isInteger(number);
    } catch {
      return false;
    }
  } else {
    try {
      if (text.indexOf('-') !== -1) {
        const number1 = parseInt(text.substring(0, text.indexOf('-')), 10);
        const number2 = parseInt(text.substring(text.indexOf('-') + 1), 10);
        return Number.isInteger(number1) && Number.isInteger(number2) && number1 < number2;
      }
      const number3 = parseInt(text, 10);
      return Number.isInteger(number3);
    } catch {
      return false;
    }
  }
}

function removeRow(event) {
  $(event).parent().parent().remove();
}

function mapTabletoJSON() {
  const table = $('#table-body');

  const jsonTable = [];
  table.children().each((i, tr) => {
    const idade = $(tr).children().eq(0).find('input')
      .val();
    const valor = $(tr).children().eq(1).find('input')
      .val();

    jsonTable.push({ idade, valor });
  });

  return jsonTable;
}

function validateAll() {
  const validFields = Array.from($('th > input')).every((i) => i.value !== '');
  return ($('.is-invalid').length === 0 && $('.is-valid').length >= 1 && validFields) || $('.tab-ref-idade').css('display') === 'none';
}

function eventValidate(event) {
  const HTMLEvent = event;
  if (validateIdade(HTMLEvent.value)) {
    HTMLEvent.className = 'form-control is-valid';
  } else {
    HTMLEvent.className = 'form-control is-invalid';
  }
}

function addRow() {
  $('#table-body').append(`
        <tr>
            <th>
                <input type="text" class="form-control is-invalid" placeholder="Ex: 1-3"  onkeyup="eventValidate(this)">
            </th>
            <th>
                <input type="text" class="form-control" placeholder="Ex: 58-84%">
            </th>
            <th>
                <button type="button" class="btn btn-danger w-100" onclick="removeRow(this)">Remover</button>
            </th>
        </tr>
    `);
}

function postData() {
  const warnings = document.getElementById('warnings');
  const formData = new FormData(document.getElementById('formulario'));

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/exame', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  if (!validateAll()) {
    $(warnings).html(warningMessage('É necessário preencher todas as células da tabela de referências.', 'warning'));
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    return;
  }

  /* Verifica se a tabela está oculta. */
  if ($('.tab-ref-idade').css('display') !== 'none') {
    formData.append('tabela_intervalo', JSON.stringify(mapTabletoJSON()));
  } else {
    formData.append('tabela_intervalo', null);
  }

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      let innerHTML = '';

      if (response.status === 'error') {
        if ('message' in response) {
          for (let i = 0; i < response.message.length; i += 1) {
            innerHTML += warningMessage(response.message[i].msg, 'danger');
          }
        } else {
          innerHTML += warningMessage('Erro interno.', 'danger');
        }
      } else if (response.status === 'success') {
        innerHTML += warningMessage('O exame foi editado com sucesso.', 'success');
      }

      warnings.innerHTML = innerHTML;
    } else {
      warnings.innerHTML = warningMessage('Falha ao editar usuário.', 'danger');
    }
  };
  xhr.send(new URLSearchParams(formData));
}

function deleteData() {
  const id = $('#idExame').val();

  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/exame?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      window.location.href = '/exames';
    }
  };

  xhr.send();
}

$(document).ready(() => {
  $('#menu-link-exames').addClass('active');
  document.getElementById('submeter').onclick = (e) => {
    e.preventDefault();
    postData();
  };

  document.getElementById('excluir').onclick = (e) => {
    e.preventDefault();
    deleteData();
  };

  $('#tipo_valor_ref').change((event) => {
    if (event.target.value === 'Idade') {
      $('.tab-ref-idade').css('display', 'block');
    } else {
      $('.tab-ref-idade').css('display', 'none');
    }
  });

  if ($('#preset-table').length !== 0) {
    const btn = $('.btn.btn-danger.w-100');
    btn.first().attr('class', 'btn btn-primary w-100');
    btn.first().attr('onclick', 'addRow()');
    btn.first().text('Adicionar');
  }
});

window.eventValidate = eventValidate;
window.addRow = addRow;
window.removeRow = removeRow;
window.eventValidate = eventValidate;
window.validateIdade = validateIdade;
window.validateIdade = validateIdade;
window.mapTabletoJSON = mapTabletoJSON;
window.validateAll = validateAll;
window.postData = postData;
