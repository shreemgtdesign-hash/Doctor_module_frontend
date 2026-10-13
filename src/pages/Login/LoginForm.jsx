
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authThunk";
import backgroundImage from "../../assets/image.png";

const hospitalLogo =
    "https://res.cloudinary.com/hj1d367n/image/upload/v1787122082/sadop/logo/eupc9h2ibkpwzozw77tu.jpg";

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
            const result = await dispatch(login(form)).unwrap();

            console.log("LOGIN RESPONSE:", result);

            switch (result.role?.toLowerCase()) {
                case "doctor":
                    navigate("/doctordashboard", { replace: true });
                    break;

                case "pharmacist":
                    navigate("/pharmacist/dashboard", { replace: true });
                    break;

                case "corporate":
                    navigate("/corporate/dashboard", { replace: true });
                    break;

                case "duty_doctor":
                    navigate("/duty-doctor/dashboard", { replace: true });
                    break;

                case "therapist":
                    navigate("/therapist/dashboard", { replace: true });
                    break;

                case "front_office":
                    navigate("/frontoffice/dashboard", { replace: true });
                    break;

                case "patient":
                    navigate("/patient/dashboard", { replace: true });
                    break;

                case "junior_doctor":
                    navigate("/junior-doctor/dashboard", { replace: true });
                    break;

                default:
                    console.error("Unknown user role:", result.role);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <main
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-5 sm:px-6 sm:py-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#211711]/70 via-[#38251B]/40 to-[#6A3F2D]/60" />

            {/* Decorative ambient light */}
            <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#D6B779]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#9C6A46]/25 blur-3xl" />

            {/* Large hospital logo - top left */}
            <div className="absolute left-4 top-4 z-20 sm:left-7 sm:top-6">
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-white/95 via-[#FFF8EE]/90 to-[#E8D5B8]/80 p-2 shadow-[0_8px_30px_rgba(90,60,35,0.15)] backdrop-blur-md sm:h-32 sm:w-32 lg:h-36 lg:w-36">
        <img
            src={hospitalLogo}
            alt="Shree Ayurveda Hospital logo"
            className="h-full w-full rounded-full object-contain"
        />
    </div>
</div>

            {/* Login content */}
            <section className="relative z-10 my-auto w-full max-w-[420px] pt-20 sm:pt-16">
                {/* Login card */}
                <div className="rounded-[24px] border border-white/60 bg-[#FFFCF8]/95 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-6">
                    <div className="mb-4">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-[3px] w-8 rounded-full bg-gradient-to-r from-[#9B6A42] to-[#D6B779]" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#96714F]">
                                Secure Access
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-[#39251C]">
                            Sign in to your account
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-[#8D7B70]">
                            Enter your credentials to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Login ID */}
                        <div>
                            <label
                                htmlFor="login_id"
                                className="mb-1.5 block text-sm font-semibold text-[#594237]"
                            >
                                Login ID
                            </label>

                            <div className="flex h-[46px] items-center gap-3 rounded-xl border border-[#E7DCD2] bg-white px-4 transition-all focus-within:border-[#A57852] focus-within:ring-4 focus-within:ring-[#A57852]/10">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5 shrink-0 text-[#A58A77]"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                                </svg>

                                <input
                                    id="login_id"
                                    name="login_id"
                                    type="text"
                                    placeholder="Enter your login ID"
                                    autoComplete="username"
                                    value={form.login_id}
                                    onChange={handleChange}
                                    required
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#39251C] outline-none placeholder:text-[#B4A69C]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-semibold text-[#594237]"
                            >
                                Password
                            </label>

                            <div className="flex h-[46px] items-center gap-3 rounded-xl border border-[#E7DCD2] bg-white px-4 transition-all focus-within:border-[#A57852] focus-within:ring-4 focus-within:ring-[#A57852]/10">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5 shrink-0 text-[#A58A77]"
                                >
                                    <rect
                                        x="4"
                                        y="10"
                                        width="16"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    <path d="M12 14v3" />
                                </svg>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#39251C] outline-none placeholder:text-[#B4A69C]"
                                />
                            </div>
                        </div>

                        {/* Login error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm leading-5 text-red-700"
                            >
                                {typeof error === "string"
                                    ? error
                                    : error?.message ||
                                      "Unable to sign in. Please check your credentials."}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative mt-1 flex h-[50px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#4B2D21] via-[#795039] to-[#A77A4E] px-5 text-sm font-bold tracking-wide text-white shadow-[0_10px_25px_rgba(93,57,38,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(93,57,38,0.35)] focus:outline-none focus:ring-4 focus:ring-[#A57852]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                            <span className="relative">
                                {loading ? "Signing you in..." : "Sign In Securely"}
                            </span>

                            {!loading && (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            )}
                        </button>
                    </form>

                    {/* Security footer */}
                    <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#EDE3DA] pt-3 text-center">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-4 w-4 shrink-0 text-[#96714F]"
                        >
                            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>

                        <span className="text-xs text-[#8D7B70]">
                            Secure hospital portal access
                        </span>
                    </div>
                </div>

                {/* Copyright */}
                <p className="mt-4 pb-1 text-center text-xs tracking-wide text-white/80">
                    © {new Date().getFullYear()} Shree Ayurveda Hospital
                </p>
            </section>
        </main>
    );
};

export default LoginForm;
