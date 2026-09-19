document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("adminLoginForm");

    const message =
        document.getElementById("loginMessage");


    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("adminEmail").value.trim();

        const password =
            document.getElementById("adminPassword").value;


        message.textContent = "Signing in...";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(
                "ÉLORA login error:",
                error
            );

            message.textContent =
                error.message;

            return;
        }


        console.log(
            "ÉLORA admin login successful:",
            data.user.email
        );


        window.location.href =
            "admin.html";

    });

});