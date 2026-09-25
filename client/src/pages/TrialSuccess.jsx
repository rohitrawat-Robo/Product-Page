import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function TrialSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const formData = location.state?.formData || {};

  // Bounce direct visits back to /trial
  useEffect(() => {
    if (!email) {
      navigate("/trial", { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;

  const companyName = formData.companyName || "yourcompany";

  const loginSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const loginUrl = `${loginSlug}.simG6.com`;

  return (
    <div className="min-h-screen bg-white">
      {/* Main — canvas surface */}
      <main className="relative min-h-screen overflow-hidden bg-white">
        <section className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-32 sm:pt-36 lg:pt-40">
          <div className="relative w-full max-w-[560px] rounded-[2px] border border-[#cccccc] bg-white p-6 sm:p-10">
            {/* Signature decorative corner square */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 hidden h-3 w-3 bg-[#76b900] sm:block"
            />

            {/* Eyebrow */}
            <p className="mb-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
              Account Created
            </p>

            {/* Heading */}
            <h1 className="text-center text-[24px] font-bold leading-[1.25] text-black sm:text-[28px]">
              Your Giventure trial account has been{" "}
              <br className="hidden sm:block" />
              successfully created.
            </h1>

            {/* Success checkmark — success-deep, not brand green */}
            <div className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-[2px] bg-[#3f8500]">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </div>

            {/* Login details — callout-stat block */}
            <div className="mt-8 rounded-[2px] border border-[#cccccc] bg-[#f7f7f7] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#757575]">
                Login Credentials
              </p>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#cccccc] pb-2">
                  <dt className="font-bold text-black">Login URL</dt>
                  <dd className="truncate text-[#1a1a1a]">
                    https://{loginUrl}/
                  </dd>
                </div>

                <div className="flex justify-between gap-4 border-b border-[#cccccc] pb-2">
                  <dt className="font-bold text-black">Login ID</dt>
                  <dd className="truncate text-[#1a1a1a]">{email}</dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-black">Password</dt>
                  <dd className="text-[#1a1a1a]">••••••••••••</dd>
                </div>
              </dl>
            </div>

            {/* Login button — button-primary */}
            <Link
              to="/product-portal"
              state={{
                email,
                formData,
              }}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-[2px] bg-[#76b900] text-base font-bold text-black transition hover:bg-[#5a8d00]"
            >
              Product Portal
            </Link>

            {/* Email confirmation */}
            <p className="mt-6 text-center text-sm leading-[1.67] text-[#757575]">
              These details have been mailed to
              <br />
              <span className="font-bold text-black">{email}</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}