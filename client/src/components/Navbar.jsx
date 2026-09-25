import { Link } from "react-router-dom";

import images from "../../public/images";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 bg-black">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT — Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={images.gi}
            alt="Giventure"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        {/* RIGHT — Tagline, hidden on mobile, visible on sm+ */}
        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#76b900]">
            Innovation
          </span>

          <span className="h-4 w-px bg-white/20" />

          <span className="text-sm text-white/60">
            Technology · AI · Software
          </span>
        </div>
      </nav>
    </header>
  );
}