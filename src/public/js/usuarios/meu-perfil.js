// eslint-disable-next-line import/extensions
import warningMessage from '../utils/global.js';

// eslint-disable-next-line no-unused-vars
function liberarSenha() {
  if ($('#senha').prop('readonly')) {
    $('#senha').attr('readonly', false);
  } else {
    $('#senha').attr('readonly', true);
  }
}

// eslint-disable-next-line no-unused-vars
function liberarEmail() {
  if ($('#email').prop('readonly')) {
    $('#email').attr('readonly', false);
  } else {
    $('#email').attr('readonly', true);
  }
}

function atualizarUsuario() {
  const xhr = new XMLHttpRequest();

  xhr.open('PUT', '/usuario', true);
  const formData = new FormData(document.getElementById('formulario-usuario'));

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      if (response.status === 'success') {
        $('#warnings').html(warningMessage('O usuário foi alterado com sucesso', 'success'));
      } else if ('message' in response) {
        response.message.forEach((text) => {
          $('#warnings').html($('#warnings').html() + warningMessage(text.msg, 'danger'));
        });
      } else {
        $('#warnings').html(warningMessage('Houve uma falha ao alterar usuário', 'danger'));
      }
    }
  };
  xhr.send(formData);
}

$(document).ready(() => {
  $('#foto').css('visibility', 'hidden');

  $('#foto-logo').click((e) => {
    e.preventDefault();
    $('#foto').trigger('click');
  });

  $('#alterar-usuario').click((e) => {
    e.preventDefault();
    atualizarUsuario();
  });
});

// eslint-disable-next-line no-unused-vars
function previewFile() {
  const preview = document.querySelector('#foto-logo');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.onloadend = function loadResult() {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = '/img/sem-foto.png';
  }
}

window.liberarSenha = liberarSenha;
window.liberarEmail = liberarEmail;
window.previewFile = previewFile;
