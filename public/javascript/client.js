$("#signup-btn").on('click', function (e) {
    e.preventDefault();
    $(".login-results").html(`<section id="login-wrapper">
        <form action="#" id="auth-login">
            <input type="text" placeholder="Username" class="js-username-auth">
            <input type="text" placeholder="Password" class="js-password-auth">
            <br/>
            <button class="profile-login">Login</button>
            <p class="btn-space">Or</p>
            <button class="profile-signup">Sign up</button>
        </form>
    </section>`)
    $('#login-wrapper').show();
    $('#landing-content').hide();
    $('#login-btn').hide();
    $('#signup-btn').hide();
})


function createUser() {
    $('#signup-btn').submit((e) => {
        e.preventDefault();
        
        const email = $('.js-username-auth').val();
        const password = $('.js-password-auth').val();

        $.ajax({
            type: 'post',
            url: '/api/users',
            data: {
                email: email,
                password: password
            },
             success: (data) => {
                if (data) {
                    $('.js-username-auth').val('');
                    $('.js-password-auth').val('');
                }
            },

            error: function (req, error) {
                console.log("Request: " + JSON.stringify(req));
            }
        });


    });
};