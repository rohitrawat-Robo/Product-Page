import { useState } from "react";
import { ArrowRight, Cpu, Cloud, Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Trial() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email being passed to TrialDetails:", email);

    navigate("/trial-details", {
      state: {
        email: email.trim().toLowerCase(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Main */}
      <main className="relative overflow-hidden bg-white">
        {/* Background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full bg-[#76b900]/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-150px] left-[-120px] h-[350px] w-[350px] rounded-full bg-slate-100 blur-3xl"
        />

        <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 pb-12 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pt-40">
          {/* Main Card */}
          <div className="relative w-full max-w-[1050px] rounded-[2px] border border-[#cccccc] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10 lg:p-12 ">
            {/* Decorative corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 hidden h-3 w-3 bg-[#76b900] sm:block"
            />

            <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-center">
              {/* LEFT CONTENT */}
              <div className="px-1 lg:px-0">
                {/* Eyebrow */}
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
                  Global Infoventures Pvt. Ltd.
                </p>

                {/* Heading */}
                <h1 className="max-w-xl text-4xl font-bold leading-[1.15] tracking-tight text-black sm:text-[42px]">
                  Explore the future of
                  <br />
                  <span className="text-[#76b900]">
                    intelligent technology.
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-7 max-w-xl text-base leading-[1.8] text-[#555555]">
                  Discover our suite of software products and technology
                  solutions built by Global Infoventures to help businesses
                  build, automate, and scale with modern technology.
                </p>

                {/* Technology highlights */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-[#76b900]/10 text-[#76b900]">
                      <Cpu size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-black">
                        Artificial Intelligence
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-[#757575]">
                        Intelligent solutions powered by modern AI and machine
                        learning technologies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-[#76b900]/10 text-[#76b900]">
                      <Cloud size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-black">
                        Enterprise Technology
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-[#757575]">
                        Scalable platforms designed for enterprise environments
                        and modern workloads.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-[#76b900]/10 text-[#76b900]">
                      <Code2 size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-black">
                        Software Solutions
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-[#757575]">
                        Purpose-built software products engineered to solve
                        real-world business challenges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className="rounded-[2px] border border-[#cccccc] bg-white p-7 sm:p-8">
                {/* Form heading */}
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[2px] bg-[#76b900] text-black">
                    <span className="text-sm font-black">GI</span>
                  </div>

                  <h2 className="text-[25px] font-bold leading-[1.25] text-black">
                    Get Started
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#757575]">
                    Enter your email to continue to the Global Infoventures
                    platform.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-black"
                  >
                    Business Email <span className="text-[#e52020]">*</span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    required
                    className="mt-2 h-12 w-full rounded-[2px] border border-[#cccccc] bg-white px-4 text-base text-black outline-none transition placeholder:text-[#a7a7a7] focus:border-2 focus:border-[#76b900]"
                  />

                  {/* Consent */}
                  <label className="mt-6 flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 shrink-0 accent-[#76b900]"
                    />

                    <span className="text-xs leading-5 text-[#757575]">
                      I agree to receive relevant information about Global
                      Infoventures products, services, and technology solutions.
                    </span>
                  </label>

                  {/* Continue */}
                  <button
                    type="submit"
                    className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-[#76b900] px-6 text-base font-bold text-black transition hover:bg-[#5a8d00]"
                  >
                    Continue
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </form>

                {/* Existing account */}
                <p className="mt-7 text-center text-sm text-[#757575]">
                  Already have access?{" "}
                  <Link
                    to="/products"
                    className="font-bold text-[#0046a4] underline"
                  >
                    Access Platform
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}