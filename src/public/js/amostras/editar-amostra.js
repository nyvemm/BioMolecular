// eslint-disable-next-line import/extensions
import warningMessage from '../utils/global.js';

/* Pega o valor único de um array */
function unique(value, index, self) {
  return self.indexOf(value) === index;
}

/* Pega o valor de um exame já selecionado para a amostra */
function fetchCurrentExame() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/amostra-exames?id=${$('#idAmostra').val()}`, false);
  xhr.send();

  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    return response;
  }
  return null;
}

function fetchExame() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/exame', true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      /* Cria uma lista de objetos contendo o tipo e o valor */
      let listaExames = response.map((exame) => exame.tipo_analise);
      listaExames = listaExames.filter(unique);
      const exames = [];
      listaExames.forEach((tipoExame) => {
        exames.push({ tipo: tipoExame, valor: [] });
      });

      /* Mapeia os valores atuais pra lista de objetos */
      response.forEach((exame) => {
        const tipo = exame.tipo_analise;
        exames[listaExames.findIndex((elem) => elem === tipo)].valor.push(exame);
      });

      /* Pega a lista atual dos exames selecionados */
      let listaExamesSelecionados = fetchCurrentExame();
      if (listaExamesSelecionados) {
        listaExamesSelecionados = listaExamesSelecionados.map((exame) => exame.idExame);
        let query = '';
        exames.forEach((exame) => {
          query += `<div><h4> ${exame.tipo} </h3>`;
          exame.valor.forEach((valorExame) => {
            if (listaExamesSelecionados.includes(valorExame.idExame)) {
              query += `<div class="form-check">
                        <input class="form-check-input" data-id="${valorExame.idExame}" type="checkbox" name="exames-escolhidos" id="exame-${valorExame.idExame}" checked>
                        <label class="form-check-label" for="exame-${valorExame.idExame}">${valorExame.nome} - ${valorExame.metodo}</label></div>`;
            } else {
              query += `<div class="form-check">
                        <input class="form-check-input" data-id="${valorExame.idExame}" type="checkbox" name="exames-escolhidos" id="exame-${valorExame.idExame}">
                        <label class="form-check-label" for="exame-${valorExame.idExame}">${valorExame.nome} - ${valorExame.metodo}</label></div>`;
            }
          });
          query += '<hr></div>';
        });
        $('#lista-exames').append($(query));
      }
    }
  };
  xhr.send();
}

function putData() {
  const xhr = new XMLHttpRequest();
  const formData = new FormData(document.getElementById('formulario'));
  xhr.open('PUT', '/amostra', true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      if (response.status === 'success') {
        $('#warnings').html(warningMessage('Amostra atualizada com sucesso', 'success'));
      } else {
        $('#warnings').html(warningMessage('Erro ao atualizar amostra', 'danger'));
      }
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  };
  xhr.send(new URLSearchParams(formData));
}

function deleteData() {
  const id = $('#idAmostra').val();

  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/amostra?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      window.location.href = '/amostras';
    }
  };

  xhr.send();
}

/* Campos */
$(document).ready(() => {
  if ($('#gestante').prop('selectedIndex') !== 0) $('#semanas_gestacao').prop('readonly', false);

  if ($('#transfusao').prop('selectedIndex') !== 0) $('#dt_ult_transfusao').prop('readonly', false);

  $('#gestante').on('change', function changeGestante() {
    if (this.selectedIndex === 0) {
      $('#semanas_gestacao').prop('readonly', true);
      $('#semanas_gestacao').val('');
    } else {
      $('#semanas_gestacao').prop('readonly', false);
    }
  });

  $('#transfusao').on('change', function changeTransfusao() {
    if (this.selectedIndex === 0) {
      $('#dt_ult_transfusao').prop('readonly', true);
      $('#dt_ult_transfusao').val('');
      $('#dt_ult_transfusao')[0].type = 'text';
    } else {
      $('#dt_ult_transfusao').prop('readonly', false);
    }
  });
});

$(document).ready(() => {
  $('.text-status').each((index, value) => {
    if ($(value).text() === 'Não avaliado') $(value).addClass('text-danger');
    else if ($(value).text() === 'Parcialmente avaliado') $(value).addClass('text-warning');
    else $(value).addClass('text-success');
  });

  $('#menu-link-amostras').addClass('active');
  document.getElementById('submeter').onclick = (e) => {
    e.preventDefault();
    putData();
  };

  document.getElementById('excluir').onclick = (e) => {
    e.preventDefault();
    deleteData();
  };

  fetchExame();
});
