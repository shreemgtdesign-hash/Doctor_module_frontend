import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authThunk";

const LoginForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        loading,
        error,
    } = useSelector(
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

            const result =
                await dispatch(
                    login(form)
                ).unwrap();

            console.log(
                "LOGIN RESPONSE:",
                result
            );

            console.log(
                "USER ROLE:",
                result.role
            );


            // =================================
            // ROLE BASED REDIRECTION
            // =================================

            switch (
                result.role?.toLowerCase()
            ) {

                case "doctor":

                    navigate(
                        "/doctordashboard",
                        { replace: true }
                    );

                    break;


                case "pharmacist":

                    navigate(
                        "/pharmacist/dashboard",
                        { replace: true }
                    );

                    break;


                case "therapist":

                    // Keep this ready for later
                    navigate(
                        "/therapist/dashboard",
                        { replace: true }
                    );

                    break;


                case "staff":

                    // Change this later according
                    // to your actual staff route
                    navigate(
                        "/frontdesk/dashboard",
                        { replace: true }
                    );

                    break;


                case "patient":

                    // Change this when patient
                    // module is implemented
                    navigate(
                        "/patient/dashboard",
                        { replace: true }
                    );

                    break;


                default:

                    console.error(
                        "Unknown user role:",
                        result.role
                    );

                    break;

            }

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

        }

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="w-full"
        >

            <h2 className="mb-8 text-3xl font-bold text-[#4D2E23]">
                Login
            </h2>


            <input
                name="login_id"
                placeholder="Login ID"
                value={form.login_id}
                onChange={handleChange}
                className="mb-5 h-14 w-full rounded-xl border px-4 outline-none focus:border-[#8B573D]"
            />


            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-3 h-14 w-full rounded-xl border px-4 outline-none focus:border-[#8B573D]"
            />


            {error && (

                <p className="mb-4 text-sm text-red-500">
                    {error}
                </p>

            )}


            <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-[#6A3F2D] text-white transition hover:bg-[#543023] disabled:cursor-not-allowed disabled:opacity-50"
            >

                {loading
                    ? "Logging in..."
                    : "Login"}

            </button>

        </form>

    );

};

export default LoginForm;