document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Store token in local storage
    window.location.href = "./dashboard.html"; // Redirect to dashboard
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Login failed.");
  }
});
