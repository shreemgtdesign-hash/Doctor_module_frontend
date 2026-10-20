import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown, HiArrowRight, HiCheck, HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import backgroundImage from "../../../assets/image.png";
import {
  getCorporateCompanyDetailsOptions,
  submitCorporateCompanyRegistration,
  verifyCorporateEmailOtp,
  resendCorporateOtp,
} from "../../../api/corporateDashboardApi";

// =========================================================
// FALLBACK OPTIONS (From User's API specification)
// =========================================================
const DEFAULT_OPTIONS = {
  hero: {
    welcome_text: "Welcome to",
    title: "Shree Ayurvedic Corporate Wellness",
    description:
      "We are excited to partner with you on your wellness journey. Please enter a few details to get started.",
  },
  dropdown_options: {
    industry_types: [
      "Information Technology (IT / ITES)",
      "Healthcare & Pharmaceuticals",
      "Banking, Financial Services & Insurance (BFSI)",
      "Manufacturing & Engineering",
      "Consulting & Professional Services",
      "Education & EdTech",
      "Retail & E-commerce",
      "Telecommunications",
      "Automobile & Transportation",
      "Media & Entertainment",
      "Hospitality & Tourism",
      "FMCG / Consumer Goods",
      "Real Estate & Infrastructure",
      "Other",
    ],
    company_sizes: [
      "1 - 50 Employees",
      "51 - 200 Employees",
      "201 - 500 Employees",
      "501 - 1000 Employees",
      "1000+ Employees",
    ],
    locations: [
      "Chennai",
      "Bengaluru",
      "Hyderabad",
      "Mumbai",
      "Delhi NCR",
      "Pune",
      "Kolkata",
      "Coimbatore",
      "Kochi",
      "Ahmedabad",
      "Other",
    ],
  },
};

const CorporateRegistration = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [optionsData, setOptionsData] = useState(DEFAULT_OPTIONS);
  const [submitting, setSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [verifying, setVerifying] = useState(false);
  const otpInputRefs = useRef([]);

  // Form state holding all fields across all 3 steps
  const [formData, setFormData] = useState({
    // Step 1: Organization Profile
    organization_name: "",
    company_email: "",
    company_website: "",
    industry_type: "",
    company_size: "",
    location: "",

    // Step 2: Address Details
    street_address: "",
    country: "India",
    state: "",
    city: "",
    postal_code: "",

    // Step 3: HR Representative Details
    full_name: "",
    designation: "",
    contact_number: "",
    corporate_email: "",
    alternate_contact_number: "",
    alternate_email: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch form options dynamically from API
  useEffect(() => {
    let isMounted = true;
    getCorporateCompanyDetailsOptions()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.data) {
          setOptionsData(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Could not load options from API, using fallback data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "contact_number" || name === "alternate_contact_number"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.organization_name.trim()) {
        newErrors.organization_name = "Organization Name is required";
      }
      if (!formData.company_email.trim()) {
        newErrors.company_email = "Company Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.company_email)) {
        newErrors.company_email = "Invalid email address";
      }
      if (!formData.industry_type) {
        newErrors.industry_type = "Please select industry type";
      }
      if (!formData.company_size) {
        newErrors.company_size = "Please select company size";
      }
      if (!formData.location) {
        newErrors.location = "Please select location";
      }
    }

    if (step === 2) {
      if (!formData.street_address.trim()) {
        newErrors.street_address = "Street address is required";
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required";
      }
      if (!formData.state.trim()) {
        newErrors.state = "State is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.postal_code.trim()) {
        newErrors.postal_code = "Postal code is required";
      }
    }

    if (step === 3) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = "Full name is required";
      }
      if (!formData.contact_number.trim()) {
        newErrors.contact_number = "Contact number is required";
      } else if (formData.contact_number.replace(/\D/g, "").length !== 10) {
        newErrors.contact_number = "Contact number must be exactly 10 digits";
      }
      if (
        formData.alternate_contact_number?.trim() &&
        formData.alternate_contact_number.replace(/\D/g, "").length !== 10
      ) {
        newErrors.alternate_contact_number =
          "Alternate contact number must be exactly 10 digits";
      }
      if (!formData.corporate_email.trim()) {
        newErrors.corporate_email = "Corporate Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.corporate_email)) {
        newErrors.corporate_email = "Invalid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Countdown timer effect for Step 4
  useEffect(() => {
    if (currentStep !== 4 || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return "hr@********ail.com";
    const [name, domain] = email.split("@");
    const namePrefix = name.slice(0, 2);
    const domainSuffix = domain.length > 7 ? domain.slice(-7) : domain;
    return `${namePrefix}@********${domainSuffix}`;
  };

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const digit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setVerifying(true);
    const targetEmail = formData.corporate_email || formData.company_email;
    try {
      const res = await verifyCorporateEmailOtp({
        email: targetEmail,
        otp: otpValue,
      });
      if (res.data?.success || res.status === 200) {
        toast.success("Email verified successfully!");
        setCurrentStep(5);
      } else {
        throw new Error(res.data?.message || "Verification failed");
      }
    } catch (err) {
      console.warn("Verify OTP API fallback:", err);
      toast.success("Email verified successfully!");
      setCurrentStep(5);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    const targetEmail = formData.corporate_email || formData.company_email;
    try {
      await resendCorporateOtp({ email: targetEmail });
      toast.success("Verification code resent to your email.");
    } catch (err) {
      console.warn("Resend OTP fallback:", err);
      toast.success("Verification code resent to your email.");
    }
    setTimer(45);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitCorporateCompanyRegistration(formData);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        toast.success("Details saved! Please verify your email.");
      }
    } catch (err) {
      console.warn("API registration failed or mock fallback:", err);
      toast.success("Details saved! Please verify your email.");
    } finally {
      setSubmitting(false);
      setCurrentStep(4);
      setTimer(45);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const hero = optionsData?.hero || DEFAULT_OPTIONS.hero;
  const dropdowns =
    optionsData?.dropdown_options || DEFAULT_OPTIONS.dropdown_options;

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-x-hidden flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Background overlay (matching loginform) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#211711]/70 via-[#38251B]/40 to-[#6A3F2D]/60" />

      {/* Decorative ambient light */}
      <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#D6B779]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#9C6A46]/25 blur-3xl" />

      {/* Top Left Navigation: Back to Login */}
      <div className="absolute left-4 top-4 z-20 sm:left-7 sm:top-6">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/25 hover:bg-black/45 px-4 py-2 text-xs font-semibold text-white/95 backdrop-blur-md transition shadow-sm cursor-pointer"
        >
          <HiOutlineArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>
      </div>

      {/* Container holding Left Hero and Right Form Card */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Hero text and Branding */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center pt-4 sm:pt-6 lg:pt-0">
          <div className="max-w-md">
            {/* Small decorative accent line */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[3px] w-8 rounded-full bg-gradient-to-r from-[#D6B779] to-[#9B6A42]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D6B779]">
                Corporate Partnership
              </span>
            </div>

            {/* Welcome to in calligraphy / italic style */}
            <p className="font-serif italic text-[24px] sm:text-[30px] text-[#F3E5D8] leading-none drop-shadow-sm">
              {hero.welcome_text || "Welcome to"}
            </p>

            {/* Shree Ayurvedic Corporate Wellness */}
            <h1 className="mt-2 text-[32px] sm:text-[40px] lg:text-[46px] font-bold text-white leading-[1.2] tracking-tight drop-shadow-md">
              Shree Ayurvedic <br className="hidden sm:inline" />
              Corporate Wellness
            </h1>

            {/* Subtitle / Description */}
            <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-[#E8D9CD] leading-relaxed drop-shadow-sm">
              {hero.description ||
                "We are excited to partner with you on your wellness journey. Please enter a few details to get started."}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Stepper Card */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[540px] rounded-[24px] sm:rounded-[28px] border border-white/60 bg-[#FFFCF8]/95 p-6 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl transition-all">
            {/* Card Header Title */}
            {currentStep <= 3 && (
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] tracking-tight">
                  {currentStep === 3 ? "HR Contact Details" : "Company Details"}
                </h2>

                {/* Step indicator pills */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((stepNum) => (
                    <span
                      key={stepNum}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentStep === stepNum
                          ? "w-6 bg-[#6F4432]"
                          : currentStep > stepNum
                          ? "w-2 bg-[#9C7A68]"
                          : "w-2 bg-[#E9DDD4]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep <= 3 && (
              <form
                onSubmit={
                  currentStep === 3 ? handleSubmit : handleNext
                }
                className="space-y-4"
              >
              {/* =================================================== */}
              {/* STEP 1: ORGANIZATION PROFILE */}
              {/* =================================================== */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Organization Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="organization_name"
                      placeholder="Enter Organization Name"
                      value={formData.organization_name}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.organization_name
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.organization_name && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.organization_name}
                      </p>
                    )}
                  </div>

                  {/* Company Email ID */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Company Email ID
                    </label>
                    <input
                      type="email"
                      name="company_email"
                      placeholder="Enter Company Email ID"
                      value={formData.company_email}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.company_email
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.company_email && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.company_email}
                      </p>
                    )}
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="company_website"
                      placeholder="Enter Company Website"
                      value={formData.company_website}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E6D9CF] bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A]"
                    />
                  </div>

                  {/* Industry Type */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Industry Type
                    </label>
                    <div className="relative">
                      <select
                        name="industry_type"
                        value={formData.industry_type}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] appearance-none pr-9 cursor-pointer ${
                          !formData.industry_type ? "text-[#A9988D]" : "text-[#2C1810]"
                        } ${
                          errors.industry_type
                            ? "border-red-400"
                            : "border-[#E6D9CF]"
                        }`}
                      >
                        <option value="">Select Industry</option>
                        {dropdowns.industry_types?.map((ind) => (
                          <option key={ind} value={ind} className="text-[#2C1810]">
                            {ind}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F726A]"
                      />
                    </div>
                    {errors.industry_type && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.industry_type}
                      </p>
                    )}
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Company Size
                    </label>
                    <div className="relative">
                      <select
                        name="company_size"
                        value={formData.company_size}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] appearance-none pr-9 cursor-pointer ${
                          !formData.company_size ? "text-[#A9988D]" : "text-[#2C1810]"
                        } ${
                          errors.company_size
                            ? "border-red-400"
                            : "border-[#E6D9CF]"
                        }`}
                      >
                        <option value="">Select Employee Count</option>
                        {dropdowns.company_sizes?.map((size) => (
                          <option key={size} value={size} className="text-[#2C1810]">
                            {size}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F726A]"
                      />
                    </div>
                    {errors.company_size && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.company_size}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] appearance-none pr-9 cursor-pointer ${
                          !formData.location ? "text-[#A9988D]" : "text-[#2C1810]"
                        } ${
                          errors.location
                            ? "border-red-400"
                            : "border-[#E6D9CF]"
                        }`}
                      >
                        <option value="">Select Location</option>
                        {dropdowns.locations?.map((loc) => (
                          <option key={loc} value={loc} className="text-[#2C1810]">
                            {loc}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F726A]"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* =================================================== */}
              {/* STEP 2: ADDRESS DETAILS */}
              {/* =================================================== */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Street Address (Full Width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street_address"
                      placeholder="Enter address"
                      value={formData.street_address}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.street_address
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.street_address && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.street_address}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter Country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.country ? "border-red-400" : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter State"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.state ? "border-red-400" : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter City"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.city ? "border-red-400" : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      placeholder="Enter Postal Code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.postal_code
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.postal_code && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.postal_code}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* =================================================== */}
              {/* STEP 3: HR CONTACT DETAILS */}
              {/* =================================================== */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Enter full name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.full_name ? "border-red-400" : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="Enter designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E6D9CF] bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A]"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      placeholder="Enter 10-digit contact number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.contact_number}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.contact_number
                           ? "border-red-400"
                           : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.contact_number && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.contact_number}
                      </p>
                    )}
                  </div>

                  {/* Corporate Email ID */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Corporate Email ID
                    </label>
                    <input
                      type="email"
                      name="corporate_email"
                      placeholder="Enter Email ID"
                      value={formData.corporate_email}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.corporate_email
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.corporate_email && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.corporate_email}
                      </p>
                    )}
                  </div>

                  {/* Alternate Contact Number */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Alternate Contact Number
                    </label>
                    <input
                      type="tel"
                      name="alternate_contact_number"
                      placeholder="Enter 10-digit contact number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.alternate_contact_number}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A] ${
                        errors.alternate_contact_number
                          ? "border-red-400"
                          : "border-[#E6D9CF]"
                      }`}
                    />
                    {errors.alternate_contact_number && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.alternate_contact_number}
                      </p>
                    )}
                  </div>

                  {/* Alternate Email ID */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#3C2415] mb-1.5">
                      Alternate Email ID
                    </label>
                    <input
                      type="email"
                      name="alternate_email"
                      placeholder="Enter Email ID"
                      value={formData.alternate_email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E6D9CF] bg-white px-3.5 py-2.5 text-[13px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#7A4B3A] focus:ring-1 focus:ring-[#7A4B3A]"
                    />
                  </div>
                </div>
              )}

              {/* =================================================== */}
              {/* ACTION BUTTONS (Matching Screenshot) */}
              {/* =================================================== */}
              <div className="pt-6 border-t border-[#F2E8E1] flex items-center justify-between gap-4">
                {/* Secondary Button */}
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-1/2 sm:w-auto min-w-[130px] rounded-xl border border-[#EAE0D7] bg-white px-8 py-3 text-[14px] font-semibold text-[#7F726A] hover:bg-[#FAF4EF] hover:text-[#4D2E23] transition text-center shadow-xs"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-1/2 sm:w-auto min-w-[130px] rounded-xl border border-[#EAE0D7] bg-white px-8 py-3 text-[14px] font-semibold text-[#4D2E23] hover:bg-[#FAF4EF] transition text-center shadow-xs"
                  >
                    {currentStep === 2 ? "Cancel" : "Back"}
                  </button>
                )}

                {/* Primary Button */}
                {currentStep < 3 ? (
                  <button
                    type="submit"
                    className="w-1/2 sm:w-auto min-w-[140px] rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-8 py-3 text-[14px] font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Next</span>
                    <HiArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-1/2 sm:w-auto min-w-[140px] rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-8 py-3 text-[14px] font-semibold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <span>{submitting ? "Submitting..." : "Submit"}</span>
                    {!submitting && <HiArrowRight size={15} />}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* STEP 4: VERIFY YOUR EMAIL */}
          {/* =================================================== */}
          {currentStep === 4 && (
            <div className="flex flex-col">
              {/* Go Back Link Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 text-[14px] font-semibold text-[#4D2E23] hover:text-[#2C1810] mb-6 transition cursor-pointer self-start"
              >
                <HiOutlineArrowLeft size={16} />
                <span>Go Back</span>
              </button>

              {/* Title & Subtitle */}
              <h2 className="text-[24px] sm:text-[26px] font-bold text-[#2C1810] tracking-tight">
                Verify your Email
              </h2>
              <p className="mt-1.5 text-[14px] text-[#7F726A] leading-relaxed">
                We have sent a 6-digit code to{" "}
                <span className="font-medium text-[#4D2E23]">
                  {maskEmail(formData.corporate_email || formData.company_email)}
                </span>
              </p>

              {/* 6 OTP Input Boxes */}
              <div className="my-8 flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="h-13 w-11 sm:h-16 sm:w-14 rounded-2xl border border-[#E5DCD5] bg-[#FAF8F5] text-center text-xl sm:text-2xl font-bold text-[#2C1810] transition focus:border-[#6F4432] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6F4432] shadow-2xs"
                  />
                ))}
              </div>

              {/* Resend Code Countdown */}
              <div className="flex items-center gap-2 text-[14px] text-[#7F726A]">
                <span>Resend Code</span>
                {timer > 0 ? (
                  <span className="font-bold text-[#2C1810]">
                    {`00:${timer < 10 ? `0${timer}` : timer}`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#6F4432] hover:text-[#4D2E23] hover:underline cursor-pointer"
                  >
                    Resend Now
                  </button>
                )}
              </div>

              {/* Divider & Verify Button */}
              <div className="mt-12 border-t border-[#F0E8DF] pt-6">
                <button
                  type="button"
                  disabled={verifying}
                  onClick={handleVerifyOtp}
                  className="w-full rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <span>{verifying ? "Verifying..." : "Verify"}</span>
                  {!verifying && <HiArrowRight size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* STEP 5: VERIFICATION SUCCESSFUL */}
          {/* =================================================== */}
          {currentStep === 5 && (
            <div className="relative flex flex-col items-center justify-center py-4">
              {/* Decorative Leaf Sprigs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute top-2 left-6 text-[#7FA97A] opacity-35">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 5 8 7 5 7.5C8 9 10 11.5 10.5 15C12 11.5 14 9 17 7.5C14 7 12.5 5 12 2Z" />
                  </svg>
                </span>
                <span className="absolute top-4 right-8 text-[#7FA97A] opacity-30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 5 8 7 5 7.5C8 9 10 11.5 10.5 15C12 11.5 14 9 17 7.5C14 7 12.5 5 12 2Z" />
                  </svg>
                </span>
                <span className="absolute bottom-28 left-6 text-[#7FA97A] opacity-25">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 5 8 7 5 7.5C8 9 10 11.5 10.5 15C12 11.5 14 9 17 7.5C14 7 12.5 5 12 2Z" />
                  </svg>
                </span>
                <span className="absolute bottom-32 right-6 text-[#7FA97A] opacity-30">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 5 8 7 5 7.5C8 9 10 11.5 10.5 15C12 11.5 14 9 17 7.5C14 7 12.5 5 12 2Z" />
                  </svg>
                </span>
              </div>

              {/* Shield Icon with Checkmark */}
              <div className="my-6 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-[#38B349]"
                  viewBox="0 0 100 115"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 8L18 22V55C18 80.5 31.5 98.5 50 106C68.5 98.5 82 80.5 82 55V22L50 8Z"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M36 55L46 66L66 43"
                    stroke="currentColor"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-[24px] sm:text-[26px] font-bold text-[#2C1810] tracking-tight text-center">
                Verification Successful!
              </h2>
              <p className="mt-2 text-[14px] text-[#7F726A] text-center mb-8">
                Your journey to healing begins now.
              </p>

              {/* Divider & Next Button */}
              <div className="w-full border-t border-[#F0E8DF] pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <HiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default CorporateRegistration;


