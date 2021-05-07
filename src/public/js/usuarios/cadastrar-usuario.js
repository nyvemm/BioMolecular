// eslint-disable-next-line import/extensions
import warningMessage from '../utils/global.js';

function cadastrarUsuario() {
  const xhr = new XMLHttpRequest();
  const formData = new FormData(document.getElementById('formulario-usuario'));
  xhr.open('POST', '/usuario', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 'success') {
        $('#warnings').html(warningMessage('Usuário cadastrado com sucesso.', 'success'));
      } else if ('message' in response) {
        if (Array.isArray(response.message)) response.message.forEach(((error) => $('#warnings').html($('#warnings').html() + warningMessage(error.msg, 'danger'))));
        else $('#warnings').html(warningMessage(`${response.message}`, 'danger'));
      } else {
        $('#warnings').html(warningMessage('Erro ao cadastrar usuário.', 'danger'));
      }
    }
  };

  xhr.send(new URLSearchParams(formData));
}

$(document).ready(() => {
  $('#cadastrar-usuario').bind('click', (e) => {
    e.preventDefault();
    cadastrarUsuario();
  });
});
