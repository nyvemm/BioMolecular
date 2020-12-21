$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams = urlParams.get('query');

    $('#query').val(queryParams)
})