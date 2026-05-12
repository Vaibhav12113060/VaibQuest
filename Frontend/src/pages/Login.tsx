import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/auth.service";

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/dashboard");
    } else {
      // Clear stale data just in case
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [navigate]);

  /*
  =====================================
  HANDLE CHANGE
  =====================================
  */
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (value.trim() === "") return "Email address is required.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid email address.";
      case "password":
        return value.trim() === "" ? "Password is required." : "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  /*
  =====================================
  HANDLE SUBMIT
  =====================================
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Record<string, string> = {};
    let hasErrors = false;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      validationErrors[key] = error;
      if (error) hasErrors = true;
    });
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (hasErrors) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(formData);

      localStorage.setItem("token", response.token);

      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(response.message);

      navigate("/dashboard");
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => Object.values(err)[0])
          .join(" • ");
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Logo.png"
            alt="VaibQuest Logo"
            className="w-16 h-16 mb-2 object-contain"
          />
          <h1 className="text-3xl font-bold text-center">Login to VaibQuest</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-4 py-2 outline-none transition ${errors.email && touched.email ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-4 py-2 outline-none transition ${errors.password && touched.password ? "border-red-500 ring-1 ring-red-500" : "focus:ring-2 focus:ring-black"}`}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
