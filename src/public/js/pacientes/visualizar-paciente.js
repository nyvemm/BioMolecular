// eslint-disable-next-line no-unused-vars
function deleteData(id) {
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/paciente?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (response.status === 'success') {
        window.location.href = '/pacientes';
      } else {
        $('#warnings').html(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Há amostras associadas a esse paciente.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>   
                `);
      }
    }
  };

  xhr.send();
}

$(document).ready(() => {
  $('#menu-link-pacientes').addClass('active');
});

window.deleteData = deleteData;
