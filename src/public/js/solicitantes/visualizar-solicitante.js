function alterAuth(id) {
  const xhr = new XMLHttpRequest();

  const formData = new FormData();
  formData.append('idSolicitante', id);

  xhr.open('PUT', '/mudar-login-solicitante', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 'success') {
        $('#warnings').html(warningMessage('Amostras atualizadas com sucesso', 'success'));
        $('#loginVisitante').text(response.login);
        $('#senhaVisitante').text(response.senha);
      } else {
        $('#warnings').html(warningMessage('Erro ao gerar novos dados.', 'danger'));
      }
    } else {
      $('#warnings').html(warningMessage('Erro ao gerar novos dados.', 'danger'));
    }
  };
  xhr.send(new URLSearchParams(formData));
}

function deleteData(id) {
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/solicitante?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (response.status === 'success') {
        window.location.href = '/solicitantes';
      } else {
        $('#warnings').html(warningMessage('Há amostras associadas a esse solicitante.', 'danger'));
      }
    }
  };

  xhr.send();
}

$(document).ready(() => {
  $('#menu-link-solicitantes').addClass('active');
});

window.deleteData = deleteData;
window.alterAuth = alterAuth;
