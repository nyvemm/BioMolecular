function postData() {
  const warnings = document.getElementById('warnings');
  const formData = new FormData(document.getElementById('formulario'));

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/solicitante', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

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
        innerHTML += warningMessage('O solicitante foi editado com sucesso.', 'success');
      }

      warnings.innerHTML = innerHTML;
    } else {
      warnings.innerHTML = warningMessage('Falha ao editar usuário.', 'danger');
    }
  };
  xhr.send(new URLSearchParams(formData));
}

function deleteData() {
  const id = $('#idSolicitante').val();

  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/solicitante?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      window.location.href = '/solicitantes';
    }
  };

  xhr.send();
}

$(document).ready(() => {
  $('#menu-link-solicitantes').addClass('active');
  document.getElementById('submeter').onclick = (e) => {
    e.preventDefault();
    postData();
  };

  document.getElementById('excluir').onclick = (e) => {
    e.preventDefault();
    deleteData();
  };
});
