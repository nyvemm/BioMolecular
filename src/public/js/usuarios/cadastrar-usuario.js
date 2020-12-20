function cadastrar_usuario() {
    const xhr = new XMLHttpRequest()
    const formData = new FormData(document.getElementById('formulario-usuario'))
    xhr.open('POST', '/usuario', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.status == 'success') {
                $('#warnings').html(warningMessage('Usuário cadastrado com sucesso'))
            } else {
                if ('message' in response) {
                    response.message.forEach((error => $('#warnings').html($('#warnings').html() + warningMessage(error.msg, 'danger'))))
                } else {
                    $('#warnings').html(warningMessage('Usuário cadastrado com sucesso'))
                }
            }
        }
    }

    xhr.send(new URLSearchParams(formData))
}

$(document).ready(() => {
    $('#cadastrar-usuario').bind('click', (e) => {
        e.preventDefault()
        cadastrar_usuario()
    })
})