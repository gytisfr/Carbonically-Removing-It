import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    // Build URL with query params
    const url = `http://127.0.0.1:5089/users?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    console.log("Signup URL:", url);

    try {
      const res = await fetch(url, {
        method: "POST",
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        // Redirect to login page after successful signup
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 w-[350px]"
        >
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>

          <input
            className="border p-2 rounded"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-carbonOrange hover:opacity-90 text-white p-2 rounded font-semibold transition cursor-pointer"
          >
            Create Account
          </button>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-carbonOrange font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
