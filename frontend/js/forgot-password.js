document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("http://localhost:5000/auth/forgot-password",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
      alert("Failed to send reset link");
    }
  });
