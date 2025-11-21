import React, { useEffect, useState } from 'react';

const particles = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 17) % 100}%`,
  delay: `${(i * 0.4).toFixed(1)}s`,
}));

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* HERO */}
      <section className="hero">
        {/* background image with parallax */}
        <div
          class
