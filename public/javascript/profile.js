const token = sessionStorage.Bearer;

$.ajax({
    type: 'GET',
    url: '/api/protected',
    dataType: 'json',
    headers: {Authorization : `Bearer ${token}`},
    success: function(data) {
       $('.float-name').html('Hello ' + data.username);
    },
    error: function(request, error) {
        console.log("Request: " + JSON.stringify(request));
    }   
});

//GET ALL ROUTINES
function getRoutines() {

  const targetMuscle = $('.target-muscle').val();
  const workout = $('.workout').val();
  const reps = $('.reps').val();
  const sets = $('.sets').val();
  const author = $('.author').val();

  $.ajax({
    type: 'GET',
    url: '/api/routines',
    data: {
      targetMuscle,
      workout,
      reps,
      sets,
      author
    },
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      for(let i = 0; i < data.length; i++) {
        $('.routine-results').append(`<div data-routine-id="${data[i]._id}" class="routine-click">
                                        <a   href="${data[i].targetMuscle}">${data[i].targetMuscle}</a>
                                        <a href="${data[i].workout}">${data[i].workout}</a>
                                        <a href="${data[i].reps}">${data[i].reps}</a>
                                        <a href="${data[i].sets}">${data[i].sets}</a>
                                        <a href="${data[i].author}">${data[i].author}</a>
                                    </div>`);
      }
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
};
//GET A ROUTINE
function getRoutine() {

  $(".container").on("click", ".routines-click", function(event){
    let routineId = $(this).data("routine-id");

  const targetMuscle = $('.target-muscle').val();
  const workout = $('.workout').val();
  const reps = $('.reps').val();
  const sets = $('.sets').val();
  const author = $('.author').val();

  $.ajax({
    type: 'GET',
    url: '/api/routines/${routineId}',
    data: {
      targetMuscle,
      workout,
      reps,
      sets,
      author
    },
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      console.log(data);
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
})
};

//POST A ROUTINE
function routinePost() {

  $('routine-submit').on('submit', (e) => {
    e.preventDefault();

    const targetMuscle = $('.target-muscle').val();
    const workout = $('.workout').val();
    const reps = $('.reps').val();
    const sets = $('.sets').val();
    const author = $('.author').val();
    $.ajax({
      type: 'POST',
      url: '/api/routines',
      data: {
        targetMuscle,
        workout,
        reps,
        sets,
        author
      },
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: (response) => {
        if (response) {
          $('.routine-submit').append('<p>You just created a workout routine!</p>');
          $('.target-muscle').val('');
          $('.workout').val('');
          $('.reps').val('');
          $('.sets').val('');
          $('.author').val('');
        }
      },
      error: (err) => {
        console.log("Post: " + JSON.stringify(err));

      }
    });
  });
}

//AJAX FOR DIETS


// GET ALL DIETS
function getDiets() {

  const title = $('.diet-title').val();
    const calories = $('.calories').val();
    const recipe = $('.recipe').val();
    const notes = $('.notes').val();
    const author = $('.author').val();

    $.ajax({
      type: 'GET',
      url: '/api/diets',
      data: {
        title,
        calories,
        recipe,
        notes,
        author
      },
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {

      for (let i = 0; i < data.length; i++) {
        $('.diet-results').append(`<div data-diet-id="${data[i]._id}" class="diet-click"> 
                                      <a href="${data[i].title}">${data[i].title}</a>
                                      <a href="${data[i].calories}">${data[i].calories}</a>
                                      <a href="${data[i].recipe}">${data[i].recipe}</a>
                                      <a href="${data[i].notes}">${data[i].notes}</a>
                                      <a href="${data[i].author}">${data[i].author}</a>`)
      }
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
};

//GET A DIET
function getDiet() {

  const title = $('.diet-title').val();
    const calories = $('.calories').val();
    const recipe = $('.recipe').val();
    const notes = $('.notes').val();
    const author = $('.author').val();

    $.ajax({
      type: 'GET',
      url: '/api/diets/',
      data: {
        title,
        calories,
        recipe,
        notes,
        author
      },
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      console.log(data);
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
};

//POST A DIET
function dietsPost() {

  $('diet-submit').on('submit', (e) => {
    e.preventDefault();

    const title = $('.diet-title').val();
    const calories = $('.calories').val();
    const recipe = $('.recipe').val();
    const notes = $('.notes').val();
    const author = $('.author').val();
    $.ajax({
      type: 'POST',
      url: '/api/diets',
      data: {
        title,
        calories,
        recipe,
        notes,
        author
      },
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: (response) => {
        if (response) {
          $('.diet-submit').append('<p>You just created a workout routine!</p>');
          $('.title').val('');
          $('.calories').val('');
          $('.recipe').val('');
          $('.notes').val('');
          $('.author').val('');
        }
      },
      error: (err) => {
        console.log("Post: " + JSON.stringify(err));

      }
    });
  });
}


$(function () {
  getRoutines();
  getRoutine();
  routinePost();
  getDiets();
  getDiet();
  dietsPost();
})