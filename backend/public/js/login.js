async function login() {

    try {

        const email =
        document.getElementById(
            "email"
        ).value.trim();

        const password =
        document.getElementById(
            "password"
        ).value.trim();

        if (!email || !password) {

            alert(
                "Please fill all fields"
            );

            return;
        }

        const response =
        await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

        if (
            response.ok &&
            data.token
        ) {

            localStorage.setItem(
                "token",
                data.token
            );

            alert(data.message || "Login Success");

            window.location.href =
            "/pages/dashboard.html";

        } else {

            alert(
                data.message ||
                data.error ||
                "Login failed"
            );
        }

    } catch (error) {

        console.log(
            "Login Error:",
            error
        );

        alert(
            "Something went wrong"
        );
    }
}
