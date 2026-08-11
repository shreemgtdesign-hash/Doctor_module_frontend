import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authThunk";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [form, setForm] = useState({
        login_id: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(
                login(form)
            ).unwrap();

            console.log("LOGIN RESPONSE:", result);

            switch (result.role?.toLowerCase()) {
                case "doctor":
                    navigate("/doctordashboard", {
                        replace: true,
                    });
                    break;

                case "pharmacist":
                    navigate("/pharmacist/dashboard", {
                        replace: true,
                    });
                    break;

                case "therapist":
                    navigate("/therapist/dashboard", {
                        replace: true,
                    });
                    break;

                case "staff":
                    navigate("/frontdesk/dashboard", {
                        replace: true,
                    });
                    break;

                case "patient":
                    navigate("/patient/dashboard", {
                        replace: true,
                    });
                    break;

                default:
                    console.error(
                        "Unknown user role:",
                        result.role
                    );
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[420px]"
        >
            {/* Title */}
            <h2 className="mb-7 text-3xl font-bold text-[#4D2E23]">
                Login
            </h2>

            {/* Login ID */}
            <input
                name="login_id"
                placeholder="Login ID"
                value={form.login_id}
                onChange={handleChange}
                className="
                    mb-4
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-[#DDD0C8]
                    bg-white
                    px-4
                    text-[#4D2E23]
                    outline-none
                    transition
                    placeholder:text-[#9B8B82]
                    focus:border-[#8B573D]
                    focus:ring-2
                    focus:ring-[#8B573D]/10
                "
            />

            {/* Password */}
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="
                    mb-3
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-[#DDD0C8]
                    bg-white
                    px-4
                    text-[#4D2E23]
                    outline-none
                    transition
                    placeholder:text-[#9B8B82]
                    focus:border-[#8B573D]
                    focus:ring-2
                    focus:ring-[#8B573D]/10
                "
            />

            {/* Error */}
            {error && (
                <p className="mb-4 text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* Login Button */}
            <button
                type="submit"
                disabled={loading}
                className="
                    mt-2
                    h-14
                    w-full
                    rounded-xl
                    bg-[#6A3F2D]
                    text-base
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#543023]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;