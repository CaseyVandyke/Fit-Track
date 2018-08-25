$('.profile').on('click', function (event) {
    clearResults();
    event.preventDefault();
    for (let i = 0; i < profiles.length; i++) {
        $('.results').append(`<div><p>Username: ${profiles[i].username}</p>
     <p>status: ${profiles[i].status}</p></div>`)

    }
});

$('.routines').on('click', function (event) {
    clearResults();
    event.preventDefault();
    for (let i = 0; i < routines.length; i++) {
        $('.results').append(`<div><p>${routines[i].cycle}</p></div>`)
    }
});

$('.diets').on('click', function (event) {
    clearResults();
    event.preventDefault();
    for (let i = 0; i < dietPlans.length; i++) {
        $('.results').append(`<div><p>${dietPlans[i].name}</p><p>${dietPlans[i].recipe}</p><p>${dietPlans[i].directions}</p></div>`)
    }
});

function clearResults() {
    const empty = $('.results').html('');
    return empty;
};