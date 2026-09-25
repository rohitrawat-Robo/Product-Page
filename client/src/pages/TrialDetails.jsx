import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TrialDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    OrganizationName: "",
    loginUrl: "",
    emailId: email,
    password: "",
  });

  // Bounce direct visitors back to /trial if no email was passed
  useEffect(() => {
    if (!email) {
      navigate("/trial", { replace: true });
    }
  }, [email, navigate]);

  // ---------- Validation ----------
  const validateField = (name, value) => {
    const v = (value ?? "").toString().trim();

    switch (name) {
      case "firstName":
        if (!v) return "First name is required.";
        if (v.length < 2) return "First name must be at least 2 characters.";
        if (!/^[A-Za-z\s'-]+$/.test(v))
          return "First name can only contain letters, spaces, ' and -.";
        return "";

      case "lastName":
        if (!v) return "Last name is required.";
        if (v.length < 2) return "Last name must be at least 2 characters.";
        if (!/^[A-Za-z\s'-]+$/.test(v))
          return "Last name can only contain letters, spaces, ' and -.";
        return "";

      case "phone":
        if (!v) return "Phone number is required.";
        if (!/^\d{10}$/.test(v))
          return "Phone number must be exactly 10 digits.";
        return "";

      case "OrganizationName":
        if (!v) return "Organization name is required.";
        if (v.length < 2)
          return "Organization name must be at least 2 characters.";
        return "";

      case "loginUrl":
        if (!v) return "URL is required.";
        if (v.length < 3) return "URL must be at least 3 characters.";
        if (!/^[a-zA-Z0-9-]+$/.test(v))
          return "URL can only contain letters, numbers and hyphens.";
        return "";

      case "emailId":
        if (!v) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return "Please enter a valid email address.";
        return "";

      case "password":
        if (!v) return "Password is required.";
        if (v.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(v))
          return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(v))
          return "Password must contain at least one lowercase letter.";
        if (!/\d/.test(v)) return "Password must contain at least one number.";
        if (!/[!@#$%^&*(),.?":{}|<>_-]/.test(v))
          return "Password must contain at least one special character.";
        return "";

      default:
        return "";
    }
  };

  const errors = {
    firstName: validateField("firstName", formData.firstName),
    lastName: validateField("lastName", formData.lastName),
    phone: validateField("phone", formData.phone),
    OrganizationName: validateField(
      "OrganizationName",
      formData.OrganizationName
    ),
    loginUrl: validateField("loginUrl", formData.loginUrl),
    emailId: validateField("emailId", formData.emailId),
    password: validateField("password", formData.password),
  };

  const isFormValid = Object.values(errors).every((e) => !e);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone to digits only, max 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }

    // Restrict URL slug to safe characters
    if (name === "loginUrl") {
      const slug = value.replace(/[^a-zA-Z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, loginUrl: slug }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleGetOTP = async (e) => {
    e.preventDefault();

    // Mark all fields touched so errors show
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      OrganizationName: true,
      loginUrl: true,
      emailId: true,
      password: true,
    });

    setError("");

    if (!isFormValid) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setOtpLoading(true);

    try {
      const recipientEmail = formData.emailId.trim().toLowerCase();

      console.log("OTP recipient:", recipientEmail);

      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: recipientEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      // OTP successfully sent — carry formData into the verify step
      navigate("/verify-otp", {
        state: {
          email: recipientEmail,
          formData: {
            ...formData,
            emailId: recipientEmail,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to send OTP.");
      setOtpLoading(false); // only reset on failure — success unmounts this page
    }
  };

  // Don't render the form if we're about to redirect
  if (!email) return null;

  // Small helper to render field errors (plain function, not a component)
  const renderFieldError = (name) =>
    touched[name] && errors[name] ? (
      <p className="mt-1 text-xs text-[#e52020]">{errors[name]}</p>
    ) : null;

  const inputBase =
    "mt-1.5 h-11 w-full rounded-xs border bg-white px-3 text-base text-black outline-none transition placeholder:text-[#a7a7a7] focus:border-2 focus:border-[#76b900]";
  const inputOk = "border-[#cccccc]";
  const inputErr = "border-[#e52020]";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Main — canvas surface, fills remaining height, no page scroll */}
      <main className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
        <section className="relative flex h-full w-full items-start justify-center overflow-y-auto px-4 pb-6 pt-32 sm:pt-36 lg:pt-40">
          {/* Wide rectangular form card */}
          <div className="relative w-full max-w-225 rounded-xs border border-[#cccccc] bg-white p-7 sm:p-9 lg:p-10">
            {/* Signature decorative corner square */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 hidden h-3 w-3 bg-[#76b900] sm:block"
            />

            {/* Heading row */}
            <div className="flex flex-col gap-1 border-b border-[#eaeaea] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
                  Your Information
                </p>
                <h1 className="text-[24px] font-bold leading-tight text-black">
                  Tell us about yourself
                </h1>
                <p className="mt-1 text-sm text-[#757575]">
                  All fields marked with{" "}
                  <span className="text-[#e52020]">*</span> are required.
                </p>
              </div>
            </div>

            {/* Form — two column grid */}
            <form
              onSubmit={handleGetOTP}
              autoComplete="off"
              noValidate
              className="mt-7"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="text-sm font-bold text-black">
                    First Name <span className="text-[#e52020]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here..."
                    autoComplete="off"
                    aria-invalid={!!(touched.firstName && errors.firstName)}
                    className={`${inputBase} ${
                      touched.firstName && errors.firstName ? inputErr : inputOk
                    }`}
                  />
                  {renderFieldError("firstName")}
                </div>

                {/* Last Name */}
                <div>
                  <label className="text-sm font-bold text-black">
                    Last Name <span className="text-[#e52020]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here..."
                    autoComplete="off"
                    aria-invalid={!!(touched.lastName && errors.lastName)}
                    className={`${inputBase} ${
                      touched.lastName && errors.lastName ? inputErr : inputOk
                    }`}
                  />
                  {renderFieldError("lastName")}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-bold text-black">
                    Phone Number <span className="text-[#e52020]">*</span>
                  </label>
                  <div
                    className={`mt-1.5 flex h-11 overflow-hidden rounded-xs border ${
                      touched.phone && errors.phone ? inputErr : inputOk
                    }`}
                  >
                    <div className="flex w-20 items-center gap-1.5 border-r border-[#cccccc] px-2 text-sm text-black">
                      🇮🇳
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="off"
                      aria-invalid={!!(touched.phone && errors.phone)}
                      className="min-w-0 flex-1 bg-white px-3 text-base text-black outline-none focus:border-2 focus:border-[#76b900]"
                    />
                  </div>
                  {renderFieldError("phone")}
                </div>

                {/* Organization Name */}
                <div>
                  <label className="text-sm font-bold text-black">
                    Organization Name <span className="text-[#e52020]">*</span>
                  </label>
                  <input
                    type="text"
                    name="OrganizationName"
                    value={formData.OrganizationName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here..."
                    autoComplete="off"
                    aria-invalid={
                      !!(
                        touched.OrganizationName && errors.OrganizationName
                      )
                    }
                    className={`${inputBase} ${
                      touched.OrganizationName && errors.OrganizationName
                        ? inputErr
                        : inputOk
                    }`}
                  />
                  {renderFieldError("OrganizationName")}
                </div>

                {/* Login URL — spans full width */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-black">
                    URL <span className="text-[#e52020]">*</span>
                  </label>
                  <div
                    className={`mt-1.5 flex h-11 overflow-hidden rounded-xs border ${
                      touched.loginUrl && errors.loginUrl ? inputErr : inputOk
                    }`}
                  >
                    <input
                      type="text"
                      name="loginUrl"
                      value={formData.loginUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Organization name"
                      autoComplete="off"
                      aria-invalid={!!(touched.loginUrl && errors.loginUrl)}
                      className="min-w-0 flex-1 bg-white px-3 text-base text-black outline-none placeholder:text-[#a7a7a7] focus:border-2 focus:border-[#76b900]"
                    />
                    <span className="flex items-center bg-[#f7f7f7] px-3 text-sm text-[#1a1a1a]">
                      .simG6.com
                    </span>
                  </div>
                  {renderFieldError("loginUrl")}
                </div>

                {/* Email ID — read only, comes from location state */}
                <div>
                  <label className="text-sm font-bold text-black">
                    Email ID <span className="text-[#e52020]">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    readOnly
                    className="mt-1.5 h-11 w-full rounded-xs border border-[#cccccc] bg-[#f7f7f7] px-3 text-base text-[#1a1a1a] outline-none"
                  />
                  {renderFieldError("emailId")}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-bold text-black">
                    Password <span className="text-[#e52020]">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Type here..."
                      autoComplete="new-password"
                      aria-invalid={!!(touched.password && errors.password)}
                      className={`h-11 w-full rounded-xs border bg-white px-3 pr-10 text-base text-black outline-none placeholder:text-[#a7a7a7] focus:border-2 focus:border-[#76b900] ${
                        touched.password && errors.password
                          ? inputErr
                          : inputOk
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] transition hover:text-black"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {renderFieldError("password")}
                </div>
              </div>

              {/* Footer row — Back + Get OTP */}
              <div className="mt-8 flex flex-col gap-4 border-t border-[#eaeaea] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/trial")}
                  className="order-2 text-sm font-bold text-[#76b900] transition hover:text-[#5a8d00] sm:order-1"
                >
                  ← Back
                </button>

                <div className="order-1 flex flex-col items-stretch gap-2 sm:order-2 sm:items-end">
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="h-11 rounded-xs bg-[#76b900] px-8 text-base font-bold text-black transition hover:bg-[#5a8d00] disabled:cursor-not-allowed disabled:bg-[#f7f7f7] disabled:text-[#a7a7a7] disabled:hover:bg-[#f7f7f7]"
                  >
                    {otpLoading ? "Sending OTP..." : "Get OTP"}
                  </button>

                  {error && (
                    <p className="text-xs text-[#e52020] sm:text-right">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}