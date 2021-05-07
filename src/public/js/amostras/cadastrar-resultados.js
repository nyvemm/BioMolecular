// eslint-disable-next-line import/extensions
import warningMessage from '../utils/global.js';

function deleteResultado(id, atualiza, idAmostraExame) {
  const xhr = new XMLHttpRequest();

  xhr.open('DELETE', `/resultados/${id}`, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      // const response = JSON.parse(xhr.responseText);
      atualiza(idAmostraExame);
    }
  };
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function submeterResultado(id) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/submeter-resultado/${id}`, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 'success') {
        $(`#warnings-${id}`).html(warningMessage('Resultados submetidos com sucesso', 'success'));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        $(`#warnings-${id}`).html(warningMessage('Erro ao submeter resultados', 'danger'));
      }
    } else {
      $(`#warnings-${id}`).html(warningMessage('Erro ao submeter resultados', 'danger'));
    }
  };
  xhr.send();
}

function atualizaResultados(idAmostraExame) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/resultados/${$('#idAmostra').val()}`, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if ('status' in response) {
        $(`#warnings-${idAmostraExame}`).html(warningMessage('Erro ao adicionar resultado na amostra', 'danger'));
      } else {
        const resultadoExameBlock = $('.resultado-exame-block');
        for (let i = 0; i < resultadoExameBlock.length; i += 1) {
          resultadoExameBlock[i].innerHTML = '';
        }
        response.forEach((resultado) => {
          const xButton = `<div class="col-md-1">
                  <span style="cursor:pointer;" aria-hidden="true" onclick="deleteResultado(${resultado.idResultado}, atualizaResultados, ${idAmostraExame})">&times;</span>
                  </div> `;
          // xButton = !resultado.status ? xButton : ''

          $(`#amostraexame-${resultado.idAmostraExame}`).append(`
            <div class="row mb-4">
              <div class="col-md-11">
                <p class="m-0"> <b>Resultado</b>: ${resultado.valor_resultado} </p>
                <p class="m-0"> <b>Observação</b>: ${resultado.observacao_resultado === '' || !resultado.observacao_resultado ? 'Sem observações.' : resultado.observacao_resultado} </p>
              </div>
              <div col-md-1>
                ${xButton}
              </div>
            </div>
            <hr>`);
        });
      }
    } else {
      $(`#warnings-${idAmostraExame}`).html(warningMessage('Erro ao atualizar a amostra', 'danger'));
    }
  };
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function putAmostra() {
  const formData = new FormData();
  formData.append('idAmostra', $('#idAmostra').val());
  formData.append('interpretacao_resultados', $('#interpretacao_resultados').val());
  formData.append('resultado', $('#resultado').val());

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/amostra-resultados', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 'success') {
        $('#warnings').html(warningMessage('A amostra foi atualizada com sucesso.', 'success'));
      } else {
        $('#warnings').html(warningMessage('Erro ao atualizar a amostra.', 'danger'));
      }
    }
  };
  xhr.send(new URLSearchParams(formData));
}

// eslint-disable-next-line no-unused-vars
function postResultados(id) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData(document.getElementById(`formulario-${id}`));

  if ($(`#valor_resultado_${id}`).val() === '') {
    $(`#warnings-${id}`).html(warningMessage('O campo de resultado não pode estar vazio.', 'danger'));
    return;
  }

  xhr.open('POST', '/resultados', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 'success') {
        atualizaResultados(id);
        $('#valor_resultado').val('');
        $('#observacao_resultado').val('');
      }
    }
  };

  xhr.send(new URLSearchParams(formData));
}

$(document).ready(() => {
  $('.text-status').each((index, value) => {
    if ($(value).text() === 'Não avaliado') $(value).addClass('text-danger');
    else if ($(value).text() === 'Parcialmente avaliado') $(value).addClass('text-warning');
    else $(value).addClass('text-success');
  });

  $('#menu-link-amostras').addClass('active');
  atualizaResultados();
});

window.putAmostra = putAmostra;
window.postResultados = postResultados;
window.submeterResultado = submeterResultado;
window.atualizaResultados = atualizaResultados;
window.deleteResultado = deleteResultado;
