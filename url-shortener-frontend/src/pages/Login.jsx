import React, {useState} from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email:"",
        password:"",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle change
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            //call backend login API
            const data = await authLogin(credentials);
            toast.success("Login successful! Welcome back!");
            navigate("/dashboard",{ replace: true });
        } catch (err) {
            const errorMsg = err.message || "Login failed";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return(
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in to your account</h2>
                    <p className="text-gray-500">Welcome back! Please enter your details.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            value={credentials.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            placeholder="••••••••"
                            onChange={handleChange}
                            value={credentials.password}
                        />
                    </div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="text-indigo-600 hover:underline font-medium">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login; 