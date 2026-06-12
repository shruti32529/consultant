async function register() {

    try {

        const name =
        document.getElementById(
            "name"
        ).value.trim();

        const email =
        document.getElementById(
            "email"
        ).value.trim();

        const password =
        document.getElementById(
            "password"
        ).value.trim();

        if (
            !name ||
            !email ||
            !password
        ) {

            alert(
                "Please fill all fields"
            );

            return;
        }

        const response =
        await fetch(
            "/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

        alert(
            data.message ||
            data.error ||
            "Registration failed"
        );

        if (
            response.ok
        ) {

            window.location.href =
            "/pages/login.html";
        }

    } catch (error) {

        console.log(
            "Registration Error:",
            error
        );

        alert(
            "Something went wrong"
        );
    }
}
