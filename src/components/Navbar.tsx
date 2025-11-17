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
    padding: "15px",
    color: "gold",
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "gold",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "emerald",
    textDecoration: "none",
    fontWeight: "bold",
  },
};










































