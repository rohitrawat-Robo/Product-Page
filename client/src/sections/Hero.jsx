import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 pt-32">
      {/* Decorative corner accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-28 h-3 w-3 bg-[#76b900] sm:left-10 sm:top-32"
      />

      <div className="relative w-full max-w-5xl text-center">
        {/* Eyebrow */}
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
          Global Infoventures Pvt. Ltd.
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[56px]">
          Engineering the Future.
          <br />
          <span className="text-[#76b900]">
            Powered by Innovation.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-7 max-w-3xl text-lg font-normal leading-[1.75] text-white/70 sm:text-[21px]">
          We build intelligent software solutions that combine
          Artificial Intelligence, Machine Learning, cloud technologies,
          and modern engineering to solve real-world business challenges.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          {/* Explore Solutions — same behavior as the old Get Started button */}
          <Link
            to="/trial"
            className="rounded-[2px] bg-[#76b900] px-7 py-3 text-base font-bold text-black transition hover:bg-[#5a8d00]"
          >
            Explore Solutions
          </Link>

          {/* About GI Venture — external link */}
          <a
            href="https://www.giindia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-white px-7 py-3 text-base font-bold text-white transition hover:bg-white hover:text-black"
          >
            About GI Venture
          </a>
        </div>

        {/* Technology highlights */}
        <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
          <span>Artificial Intelligence</span>
          <span>Machine Learning</span>
          <span>Cloud</span>
          <span>Enterprise Solutions</span>
          <span>Software Engineering</span>
        </div>
      </div>
    </section>
  );
}