$(document).ready(() => {
  $('.text-status').each((index, value) => {
    if ($(value).text() === 'Não avaliado') $(value).addClass('text-danger');
    else if ($(value).text() === 'Parcialmente avaliado') $(value).addClass('text-warning');
    else $(value).addClass('text-success');
  });
});

// eslint-disable-next-line no-unused-vars
function deleteData(id) {
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/amostra?id=${id}`, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      if (response.status === 'success') {
        window.location.href = '/amostras';
      } else {
        $('#warnings').html(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Erro ao remover amostra.
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
  $('#menu-link-amostras').addClass('active');
});

window.deleteData = deleteData;
