import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HiOutlineArrowLeft, HiArrowRight } from "react-icons/hi";
import toast from "react-hot-toast";
import backgroundImage from "../../../assets/image.png";
import { corporateForgotPassword } from "../../../api/corporateDashboardApi";

const CorporateForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill username from location state or query if passed
  const initialUsername =
    location.state?.username ||
    location.state?.login_id ||
    new URLSearchParams(location.search).get("username") ||
    new URLSearchParams(location.search).get("login_id") ||
    "";

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter your username or login ID");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        login_id: username.trim(),
        password: password,
        confirm_password: confirmPassword,
      };

      const res = await corporateForgotPassword(payload);

      if (res.data?.success) {
        toast.success(
          res.data?.message || "Password updated successfully"
        );
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        toast.success(res.data?.message || "Password updated successfully");
        navigate("/login");
      }
    } catch (err) {
      console.error("Failed to update password:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password. Please check your username and try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-x-hidden flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Soft warm watercolor ambient tint */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Top Left Navigation: Back to Login */}
      <div className="absolute left-4 top-4 z-20 sm:left-7 sm:top-6">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-full border border-[#D5C2B4]/60 bg-white/80 hover:bg-white px-4 py-2 text-xs font-semibold text-[#4D2E23] backdrop-blur-md transition shadow-xs cursor-pointer"
        >
          <HiOutlineArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Hero text and Branding */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center pt-6 sm:pt-8 lg:pt-0">
          <div className="max-w-md">
            {/* "Welcome to" cursive italic script */}
            <p className="font-serif italic text-[28px] sm:text-[34px] text-[#4A2E20] leading-none">
              Welcome to
            </p>

            {/* Shree Ayurvedic Corporate Wellness */}
            <h1 className="mt-3 text-[32px] sm:text-[42px] font-bold text-[#2C1810] leading-[1.2] tracking-tight">
              Shree Ayurvedic <br className="hidden sm:inline" />
              Corporate Wellness
            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] text-[#5A453B] leading-relaxed">
              We are excited to partner with you on your wellness journey. Please
              enter a few details to get started.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Password Card */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[500px] rounded-[24px] sm:rounded-[28px] bg-white p-6 sm:p-9 shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-[#F0E6DE] transition-all">
            {/* Card Header Title */}
            <div>
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#2C1810] tracking-tight">
                Forgot Password
              </h2>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#7F726A]">
                Forgot your password? No worries! Enter your username or login ID to reset it.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-[13px] sm:text-[14px] font-medium text-[#2C1810]"
                >
                  Login Id
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="IBM.hr@1234"
                  required
                  className="w-full h-[46px] sm:h-[48px] rounded-xl border border-[#E7DCD2] bg-white px-4 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none transition"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[13px] sm:text-[14px] font-medium text-[#2C1810]"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full h-[46px] sm:h-[48px] rounded-xl border border-[#E7DCD2] bg-white pl-4 pr-11 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 p-1 text-[#A58A77] hover:text-[#5A3728] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirm_password"
                  className="mb-1.5 block text-[13px] sm:text-[14px] font-medium text-[#2C1810]"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full h-[46px] sm:h-[48px] rounded-xl border border-[#E7DCD2] bg-white pl-4 pr-11 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 p-1 text-[#A58A77] hover:text-[#5A3728] transition-colors focus:outline-none cursor-pointer"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 h-[46px] sm:h-[48px] rounded-xl border border-[#E8DCD2] bg-[#FFFBF8] hover:bg-[#F5ECE5] text-sm font-semibold text-[#4D2E23] transition flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-[46px] sm:h-[48px] rounded-xl bg-[#5A3728] hover:bg-[#482b1f] text-sm font-semibold text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  <span>{loading ? "Updating..." : "Create Account"}</span>
                  {!loading && <HiArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateForgotPassword;
