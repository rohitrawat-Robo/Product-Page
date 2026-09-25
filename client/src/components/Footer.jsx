import {
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import images from "../../public/images";

/* ------------------------------------------------------------------
   NVIDIA DESIGN SYSTEM TOKENS — Footer
   ------------------------------------------------------------------
   surface-dark       #000000
   surface-elevated   #1a1a1a
   on-dark            #ffffff
   on-dark-mute       rgba(255,255,255,0.7)
   mute               #757575
   hairline-strong    #5e5e5e
   primary            #76b900
   primary-dark       #5a8d00
   rounded.sm         2px
   spacing.section    64px
   typography.body-strong  16px / 700 / 1.5
   typography.body-sm      15px / 400 / 1.67
   typography.caption-md   14px / 700 / 1.43 uppercase
   typography.utility-xs   10px / 700 / 1.5 uppercase
   ------------------------------------------------------------------ */

/* ---------- Signature NVIDIA decorative square ---------- */
function CornerSquare({ position = "tl" }) {
  const pos = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];
  return (
    <span
      aria-hidden="true"
      className={`absolute ${pos} block h-3 w-3 bg-[#76b900]`}
    />
  );
}

export default function Footer() {
  const socials = [
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/global-infoventure/", label: "LinkedIn" },
    { Icon: FaYoutube, href: "https://www.youtube.com/@globalinfoventurepvtltd", label: "YouTube" },
    { Icon: FaInstagram, href: "https://www.instagram.com/global_infoventures?igsh=MW5hZHEwdWF3bnJyaw==", label: "Instagram" },
    { Icon: FaFacebookF, href: "https://www.facebook.com/GlobalInfoventures/", label: "Facebook" },
  ];

  return (
    <footer
      className="relative isolate overflow-hidden bg-black text-white"
      style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
      role="contentinfo"
    >
      {/* Subtle static hairline grid — no motion, spec-compliant texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* ---------------- TOP: Brand column ---------------- */}
        <div
          className="py-16 lg:py-20"
          style={{ borderBottom: "1px solid #5e5e5e" }}
        >
          <div className="relative max-w-xl">
            <CornerSquare position="tl" />
            <div className="pl-5 pt-1">
              <img
                src={images.gi}
                alt="Global Infoventures"
                className="mb-5 h-10 w-auto"
              />
              <p className="max-w-[36ch] text-[15px] leading-[1.67] text-white/70">
                NVIDIA Elite Partner delivering enterprise AI infrastructure,
                HPC systems, and hands-on training across India.
              </p>

              {/* Social row — neutral icons, white on hover (green reserved) */}
              <div className="mt-7 flex gap-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center border border-[#5e5e5e] text-white/60 transition-colors duration-200 hover:border-white hover:text-white focus:outline-none focus-visible:border-[#76b900] focus-visible:text-white"
                    style={{ borderRadius: 2 }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>

              {/* CTA — button-ghost-link treatment */}
              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-[#76b900] transition-colors duration-200 hover:text-[#5a8d00] focus:outline-none"
              >
                Talk to our team
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- MIDDLE: Contact strip ---------------- */}
        <div
          className="grid grid-cols-1 gap-8 py-10 md:grid-cols-3 lg:py-12"
          style={{ borderBottom: "1px solid #5e5e5e" }}
        >
          <div>
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#76b900]">
              Headquarters
            </span>
            <p className="mt-3 text-[15px] leading-[1.67] text-white/70">
              Global Infoventures Pvt. Ltd.
              <br />
              H-65, Sector 63
              <br />
              Noida, Uttar Pradesh, India
            </p>
          </div>

          <div>
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#76b900]">
              Email
            </span>
            <p className="mt-3">
              <a
                href="mailto:info@globalinfoventures.com"
                className="group inline-flex items-center gap-1.5 text-[15px] text-white/70 transition-colors hover:text-white"
              >
                <span className="relative">
                  info@globalinfoventures.com
                  <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-[#76b900] transition-all duration-200 group-hover:w-full" />
                </span>
              </a>
            </p>
          </div>

          <div>
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#76b900]">
              Phone
            </span>
            <p className="mt-3">
              <a
                href="tel:+911234567890"
                className="group inline-flex items-center gap-1.5 text-[15px] text-white/70 transition-colors hover:text-white"
              >
                <span className="relative">
                  +91 12345 67890
                  <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-[#76b900] transition-all duration-200 group-hover:w-full" />
                </span>
              </a>
            </p>
          </div>
        </div>

        {/* ---------------- BOTTOM: legal fine-print ---------------- */}
        <div className="flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center">
          <p
            className="text-[#757575]"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: 1.5,
            }}
          >
            © 2026 Global Infoventures Pvt. Ltd. — All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[#757575] transition-colors duration-200 hover:text-white"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  lineHeight: 1.5,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}