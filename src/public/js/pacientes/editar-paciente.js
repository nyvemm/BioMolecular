function postData() {
    let warnings = document.getElementById('warnings')
    const formData = new FormData(document.getElementById('formulario'))

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', '/paciente', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let innerHTML = ''

            if (response.status == 'error') {
                if ('message' in response) {
                    for (let i = 0; i < response.message.length; i++) {
                        innerHTML += warningMessage(response.message[i].msg, 'danger')
                    }
                } else {
                    innerHTML += warningMessage('Erro interno.', 'danger')
                }

            } else if (response.status == 'success') {
                innerHTML += warningMessage('O paciente foi editado com sucesso.', 'success')
            }

            warnings.innerHTML = innerHTML

        } else {
            warnings.innerHTML = warningMessage('Falha ao editar paciente.', 'danger')
        }
    }
    xhr.send(new URLSearchParams(formData))
}

function deleteData() {
    let id = $('#idPaciente').val()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/paciente?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            window.location.href = '/pacientes'
        }
    }

    xhr.send()
}

$(document).ready(() => {
    $('#menu-link-pacientes').addClass('active')
    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    document.getElementById('excluir').onclick = (e) => {
        e.preventDefault()
        deleteData()
    }
})