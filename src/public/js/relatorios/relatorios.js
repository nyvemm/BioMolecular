function gerarLaudo() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/relatorios/gerar-laudo?id=${$('#id').val()}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      const tabela = $('#tabela');
      tabela.html('<hr>');

      if ('status' in response) {
        $('#warnings').html(warningMessage('Falha ao achar amostra.', 'danger'));
        $('#btn-imprimir').remove();
        tabela.html('');
        return;
      }
      if (response.length === 0) {
        $('#warnings').html(warningMessage('Essa amostra não tem dados cadastrados.', 'warning'));
        $('#btn-imprimir').remove();
        tabela.html('');
        return;
      } if ($('#id').val() === '') {
        $('#warnings').html(warningMessage('É necessário preencher o ID da amostra.', 'warning'));
        $('#btn-imprimir').remove();
        tabela.html('');
        return;
      } if (response.status === 'error') {
        $('#warnings').html(warningMessage('Falha ao achar amostra.', 'danger'));
        $('#btn-imprimir').remove();
        tabela.html('');
        return;
      }

      response.forEach(({ tipo, valor }) => {
        const subquery = valor.map(((x) => `<tr>
                        <th>${x.nome}</th>
                        <td>${x.valor_resultado ? x.valor_resultado : 'Sem resultados'}</td>
                        <td>${x.metodo ? x.metodo : 'N/A'}</td>
                        <td>${x.valor_ref ? x.valor_ref : 'N/A'}</td>
                    </tr>`)).join('');

        const query = `<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">${tipo}</th>
                                <th scope="col">Resultado</th>
                                <th scope="col">Método</th>
                                <th scope="col">Referência</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`;

        tabela.html(tabela.html() + query);
        $('#warnings').html('');

        if ($('#btn-imprimir').length === 0) {
          $('#form-imprimir-laudo').append(`
                    <button type = "submit" class="btn btn-primary ml-1 mt-4" id="btn-imprimir"> Imprimir Laudo</button>
                `);
        }
      });
    } else {
      $('#warnings').html(warningMessage('Falha ao encontrar amostra.', 'danger'));
    }
  };
  xhr.send();
}

function gerarAmostrasSituacao() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/relatorios/gerar-amostras-situacao?situacao=${$('#status_pedido').val()}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const tabela = $('#tabela');
      tabela.html('');
      if (response.length === 0) {
        $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'));
        $('.form-group').first().remove();
        $('.close').first().remove();
        $('#warnings').append('<hr><a class="btn active" href="/relatorios">Voltar</a>');
        return;
      }

      const subquery = response.map((amostra) => `<tr onclick="javascript:window.location.href='/amostras/${amostra.idAmostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`).join('');

      tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`);
      $('#warnings').html('');
    }
  };
  xhr.send();
}

function gerarAmostrasMaterial() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/relatorios/gerar-amostras-material?material=${$('#material').val()}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const tabela = $('#tabela');
      tabela.html('');

      if (response.length === 0) {
        $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'));
        $('.form-group').first().remove();
        $('.close').first().remove();
        $('#warnings').append('<hr><a class="btn active" href="/relatorios">Voltar</a>');
        return;
      }

      const subquery = response.map((amostra) => `<tr onclick="javascript:window.location.href='/amostras/${amostra.idAmostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`).join('');

      tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`);
      $('#warnings').html('');
    }
  };
  xhr.send();
}

function gerarAmostrasTipoAnalise() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/relatorios/gerar-amostras-tipo-exame?tipo_analise=${$('#tipo_analise').val()}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const tabela = $('#tabela');
      tabela.html('');

      if (response.length === 0) {
        $('#warnings').html(warningMessage('Não há amostras cadastradas.', 'warning'));
        $('.form-group').first().remove();
        $('.close').first().remove();
        $('#warnings').append('<hr><a class="btn active" href="/relatorios">Voltar</a>');
        return;
      }

      const subquery = response.map((amostra) => `<tr onclick="javascript:window.location.href='/amostras/${amostra.idAmostra}'" class="clickable-row">
                        <td>${amostra.paciente_nome}</td>
                        <td>${amostra.solicitante_nome}</td>
                        <td>${amostra.material}</td>
                        <td>${amostra.f_dt_coleta}</td>
                    </tr>`).join('');

      tabela.html(`<table class="table table border mt-4">
                        <thead>
                            <tr class="bg-secondary text-white font-weight-bold">
                                <th scope="col">Nome do Solicitante</th>
                                <th scope="col">Nome do Paciente</th>
                                <th scope="col">Material</th>
                                <th scope="col">Data de Recebimento</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${subquery}
                        </tbody>
                    </table>`);
      $('#warnings').html('');
    }
  };
  xhr.send();
}

$(document).ready(() => {
  $('#menu-link-relatorios').addClass('active');

  if (window.location.pathname.includes('amostras-situacao')) {
    gerarAmostrasSituacao();
  }
  if (window.location.pathname.includes('amostras-material')) {
    gerarAmostrasMaterial();
  }

  if (window.location.pathname.includes('amostras-tipo-exame')) {
    gerarAmostrasTipoAnalise();
  }
});

window.gerarLaudo = gerarLaudo;
window.gerarAmostrasSituacao = gerarAmostrasSituacao;
window.gerarAmostrasMaterial = gerarAmostrasMaterial;
window.gerarAmostrasTipoAnalise = gerarAmostrasTipoAnalise;
