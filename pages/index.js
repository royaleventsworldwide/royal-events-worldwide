import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { title: "Premium Quality", description: "State-of-the-art equipment and professional DJs" },
    { title: "Trusted Service", description: "Over 500+ successful events worldwide" },
    { title: "24/7 Support", description: "Always available for your event needs" },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />

        {/* Black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />

        {/* Floating gold particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-6xl px-6 text-center">

          {/* Logo Glow */}
          <div className="mb-12 mx-auto w-40 h-40 relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse" />
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69113bfde5205f3bc7f28926/48aebb85b_RoyalEventsLogoChatGPTImageNov9202509_11_36PM.png"
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            From <span className="text-yellow-400">Struggle</span> to{" "}
            <span className="text-yellow-400">Sophistication</span>
          </h1>

          <p className="text-xl md:text-2xl mt-6 text-gray-300 max-w-3xl mx-auto">
            Born from the grind — built by vision.  
            We turned survival into strategy and sound into success.
          </p>

          <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
            At Royal Events Worldwide, every event is elevated with precision, elegance, and energy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link href="/bookings">
              <button className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full hover:opacity-90 transition">
                Book Your Event
              </button>
            </Link>
            <Link href="/store">
              <button className="px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-bold rounded-full hover:bg-yellow-400/10 transition">
                View Services
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto text-yellow-400">
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-gray-300 text-sm">Events Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-gray-300 text-sm">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-gray-300 text-sm">Support Available</div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-yellow-400 rounded-full" />
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-yellow-400">Royal Events</span>
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Experience unparalleled luxury and professionalism
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="p-8 bg-[#1A1A1A] rounded-xl border border-yellow-400/20 hover:border-yellow-400 transition">
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-black">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Create Your{" "}
          <span className="text-yellow-400">Unforgettable Event?</span>
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Let’s turn your vision into reality.
        </p>
        <Link href="/bookings">
          <button className="px-12 py-5 bg-yellow-400 text-black rounded-full text-xl font-bold hover:opacity-90 transition">
            Book Your Event Now
          </button>
        </Link>
      </section>

    </div>
  );
}
