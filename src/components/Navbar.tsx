





















































































































import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>ROYAL EVENTS WORLDWIDE</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/edutainment" style={styles.link}>Edutainment</Link>
        <Link to="/wellness" style={styles.link}>Wellness</Link>
        <Link to="/bookings" style={styles.link}>Bookings</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "black",
    color: "gold",
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    alignItems: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "gold",
    textDecoration: "none",
    fontWeight: "500",
  },
};
