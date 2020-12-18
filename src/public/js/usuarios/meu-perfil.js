function liberar_senha() {
    if ($('#senha').prop('readonly')) {
        $('#senha').attr('readonly', false)
    } else {
        $('#senha').attr('readonly', true)
    }

}

function liberar_email() {
    if ($('#email').prop('readonly')) {
        $('#email').attr('readonly', false)
    } else {
        $('#email').attr('readonly', true)
    }
}

function atualizarUsuario() {
    const xhr = new XMLHttpRequest()

    xhr.open('PUT', '/usuario', true)
    const formData = new FormData(document.getElementById('formulario-usuario'))

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)

            if(response.status == 'success') {
                $('#warnings').html(warningMessage('O usuário foi alterado com sucesso', 'success'))
            } else {
                if('message' in response) {
                    response.message.forEach((text) => {
                        $('#warnings').html($('#warnings').html() + warningMessage(text.msg, 'danger'))
                    })
                } else {
                    $('#warnings').html(warningMessage('Houve uma falha ao alterar usuário', 'danger'))
                }
            }
        }
    }
    xhr.send(formData)
}

$(document).ready(() => {
    $('#foto').css('visibility', 'hidden')

    $("#foto-logo").click(function (e) {
        e.preventDefault();
        $("#foto").trigger('click');
    })

    $('#alterar-usuario').click(function (e) {
        e.preventDefault()
        atualizarUsuario()
    })
})

function previewFile() {
    var preview = document.querySelector('#foto-logo');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "/img/sem-foto.png";
    }
}

