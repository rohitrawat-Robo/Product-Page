import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const formData = location.state?.formData || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------------------------
      // Step 1: Verify the OTP
      // ---------------------------------------------------------
      const verifyResponse = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || "Invalid OTP.");
      }

      // ---------------------------------------------------------
      // Step 2: Register the user now that OTP is confirmed
      // ---------------------------------------------------------
      const registerResponse = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            organizationName: formData.OrganizationName,
            loginUrl: formData.loginUrl,
            email: formData.emailId || email,
            password: formData.password,
          }),
        },
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Registration failed.");
      }

      setSuccess("OTP verified. Account created.");

      // ---------------------------------------------------------
      // Step 3: Send the new user to the Product Portal
      // ---------------------------------------------------------
      setTimeout(() => {
        navigate("/product-portal", {
          replace: true,
          state: {
            userId: registerData.data.userId,
            email: registerData.data.email,
          },
        });
      }, 700);
    } catch (error) {
      setError(error.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend OTP.");
      }

      setSuccess("A new OTP has been sent to your email.");
      setOtp("");
    } catch (error) {
      setError(error.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header — surface-dark */}

      {/* Main — canvas surface */}
      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white">
        <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
          <div className="relative w-full max-w-110 rounded-xs border border-[#cccccc] bg-white p-6 sm:p-8">
            {/* Signature decorative corner square */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 hidden h-3 w-3 bg-[#76b900] sm:block"
            />

            {/* Heading */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
                Email Verification
              </p>

              <h1 className="text-[24px] font-bold leading-tight text-black">
                Verify your email
              </h1>

              <p className="mt-3 text-sm leading-[1.67] text-[#757575]">
                We've sent a 6-digit verification code to
              </p>

              <p className="mt-1 text-sm font-bold text-black">{email}</p>
            </div>

            <form onSubmit={handleVerify} className="mt-7">
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-bold text-black"
              >
                Enter OTP <span className="text-[#e52020]">*</span>
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                  setError("");
                }}
                placeholder="Enter 6-digit OTP"
                className="h-14 w-full rounded-xs border border-[#cccccc] bg-white text-center text-2xl font-bold tracking-[0.5em] text-black outline-none transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-[#a7a7a7] focus:border-2 focus:border-[#76b900]"
              />

              {error && (
                <div className="mt-4 rounded-xs border-l-2 border-[#e52020] bg-[#f7f7f7] px-3 py-2">
                  <p className="text-xs font-bold text-[#e52020]">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-xs border-l-2 border-[#3f8500] bg-[#f7f7f7] px-3 py-2">
                  <p className="text-xs font-bold text-[#3f8500]">{success}</p>
                </div>
              )}

              {/* Submit — button-primary */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="mt-6 h-11 w-full rounded-xs bg-[#76b900] text-base font-bold text-black transition hover:bg-[#5a8d00] disabled:cursor-not-allowed disabled:bg-[#f7f7f7] disabled:text-[#a7a7a7] disabled:hover:bg-[#f7f7f7]"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div className="mt-6 border-t border-[#cccccc] pt-5 text-center">
              <p className="text-sm text-[#757575]">Didn't receive the OTP?</p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#76b900] transition hover:text-[#5a8d00] disabled:cursor-not-allowed disabled:text-[#a7a7a7]"
              >
                <RefreshCw
                  size={14}
                  className={resending ? "animate-spin" : ""}
                />
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/trial-details", {
                  state: { email },
                })
              }
              className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-bold text-[#76b900] transition hover:text-[#5a8d00]"
            >
              <ArrowLeft size={14} />
              Back to details
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}