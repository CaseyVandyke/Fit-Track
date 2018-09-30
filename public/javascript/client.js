function test() {
    $(".login-form").on('click', function(event) {
        event.preventDefault();
        $(".login-results").html(`<section id="login-wrapper">
        <form action="#" id="auth-login">
            <input type="text" value="Username" class="username-auth">
            <input type="text" value="Password" class="password-auth">
            <br/>
            <button class="profile-login">Login</button>
            <p class="btn-space">Or</p>
            <button class="profile-signup">Sign up</button>
        </form>
    </section>`)
    })
};




