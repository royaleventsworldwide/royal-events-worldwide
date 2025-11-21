import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "2rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Parallax Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), #000)",
          }}
        />

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px" }}>
          {/* LOGO */}
          <div style={{ marginBottom: "2rem" }}>
            <img
              src="/luxe-bg-1 brand & speakers:DJ Pay Jay.png"
              onError={(e) => (e.target.style.display = "none")}
              alt="Royal Events Logo"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "contain",
                filter: "drop-shadow(0 0 25px rgba(212,175,55,0.4))",
              }}
            />
          </div>

          {/* HEADLINE */}
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            From <span style={{ color: "#D4AF37" }}>Struggle</span> to{" "}
            <span style={{ color: "#D4AF37" }}>Sophistication</span>
          </h1>

          {/* SUBHEAD */}
          <p
            style={{
              fontSize: "1.2rem",
              maxWidth: "700px",
              margin: "0 auto",
              opacity: 0.9,
            }}
          >
            At Royal Events Worldwide, we turn sound, style, and strategy into
            unforgettable luxury experiences.
          </p>

          {/* BUTTONS */}
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/bookings">
              <button
                style={{
                  background:
                    "linear-gradient(to right, #D4AF37, #F4E4B7)",
                  color: "#000",
                  padding: "1rem 2rem",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                Book Your Event
              </button>
            </Link>

            <Link href="/store">
              <button
                style={{
                  border: "2px solid #D4AF37",
                  color: "#D4AF37",
                  padding: "1rem 2rem",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                View Services
              </button>
            </Link>
          </div>

          {/* STATS */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Events Completed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <h2
                  style={{
                    color: "#D4AF37",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {stat.value}
                </h2>
                <p style={{ opacity: 0.7 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "1.5rem",
          textAlign: "center",
          opacity: 0.5,
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} Royal Events Worldwide. All rights
        reserved.
      </footer>
    </div>
  );
}
