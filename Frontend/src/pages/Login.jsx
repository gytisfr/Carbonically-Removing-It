import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Build URL with query params
    const url = `http://127.0.0.1:5089/auth/login?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    console.log("Login URL:", url);

    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      console.log("Login response:", data);

      if (res.ok && data.token) {
        // Store the JWT token
        localStorage.setItem("token", data.token);

        // Redirect to home page
        navigate("/");
      } else {
        alert(data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 w-[350px]"
        >
          <h1 className="text-2xl font-bold text-center">Login</h1>

          <input
            className="border p-2 rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-carbonOrange hover:opacity-90 text-white p-2 rounded font-semibold transition"
          >
            Log In
          </button>

          <p className="text-sm text-center mt-2">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-carbonOrange font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
