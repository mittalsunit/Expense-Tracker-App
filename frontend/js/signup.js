document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Store token in local storage
    alert("Signup successful!");
    window.location.href = "./dashboard.html"; // Redirect to dashboard
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Signup failed.");
  }
});
