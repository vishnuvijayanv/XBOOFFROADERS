import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const images = [
  { src: "https://img.freepik.com/premium-photo/offroad-bike-adventure_1198042-707.jpg", title: "Mountain Adventure" },
  { src: "https://img.freepik.com/premium-photo/offroad-bike-adventure_1198042-786.jpg", title: "Forest Trail" },
  { src: "https://img.freepik.com/premium-photo/offroad-bike-adventure_1198042-679.jpg", title: "Desert Safari" },
  { src: "https://tse2.mm.bing.net/th/id/OIP.K29KUiRCh7C4p60Dt6togAAAAA?pid=Api&P=0&h=180", title: "Rocky Path" },
  { src: "https://tse3.mm.bing.net/th/id/OIF.dcH6NHZTMXfyEVj9rzpbJg?pid=Api&P=0&h=180", title: "River Crossing" },
  { src: "https://tse1.mm.bing.net/th/id/OIP.cGCOeYlzrkvRxR9yZSYP3wHaE7?pid=Api&P=0&h=180", title: "Sunset Ride" },
  { src: "https://tse1.mm.bing.net/th/id/OIP.W6GfMsvaB0ToDWAGSIPi6gHaE7?pid=Api&P=0&h=180", title: "Night Offroad" },
  { src: "https://tse2.mm.bing.net/th/id/OIP.kfVrD0QB8z6RDhkR89W1owHaEK?pid=Api&P=0&h=180", title: "Mud Splash" },
  { src: "https://tse4.mm.bing.net/th/id/OIP.Ju0vnHiv518fZlvu9j4tFQHaE8?pid=Api&P=0&h=180", title: "Dune Ride" },
];

export default function OffroadGallery() {
  const [theme, setTheme] = useState("light");
  const [visibleCount, setVisibleCount] = useState(4);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");

    const updateVisibleCount = () => {
      if (window.innerWidth < 600) setVisibleCount(4);
      else if (window.innerWidth < 900) setVisibleCount(6);
      else setVisibleCount(8);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const imagesToShow = showAll ? images : images.slice(0, visibleCount);

  return (
    <div data-theme={theme}>
      <style>{`
        :root {
          --accent: #e50914;
          --white: #fff;
          --black: #111;
          --gray-dark: #1a1a1a;
        }
        [data-theme="light"] { --bg: #fff; --text: #111; --card: #f9f9f9; }
        [data-theme="dark"] { --bg: var(--black); --text: var(--white); --card: var(--gray-dark); }

        .gallery-wrapper { background: var(--bg); padding: 3rem 1.5rem; }
        .gallery-header { text-align: left; margin-bottom: 2rem; }
        .gallery-header h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: var(--text); position: relative; display: inline-block; }
        .gallery-header h2::after { content: ""; display: block; height: 4px; width: 60%; margin-top: 0.4rem; background: var(--accent); border-radius: 2px; }
        
        .gallery-grid { column-count: 1; column-gap: 1rem; }
        @media (min-width: 600px) { .gallery-grid { column-count: 2; } }
        @media (min-width: 900px) { .gallery-grid { column-count: 3; } }
        @media (min-width: 1200px) { .gallery-grid { column-count: 4; } }

        .gallery-item { position: relative; margin-bottom: 1rem; border-radius: 14px; overflow: hidden; cursor: pointer; display: inline-block; width: 100%; }
        .gallery-img { width: 100%; display: block; border-radius: 14px; object-fit: cover; }
        .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%); opacity: 0; transition: opacity 0.3s ease; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; }
        .gallery-item:hover .overlay { opacity: 1; }
        .overlay span { color: var(--white); font-size: 1.1rem; font-weight: 600; text-shadow: 0 2px 6px rgba(0,0,0,0.7); }

        .view-more { display: flex; justify-content: center; margin-top: 2rem; }
        .view-more button { background: var(--accent); color: var(--white); padding: 0.8rem 2rem; font-size: 1rem; font-weight: 600; border: none; border-radius: 30px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(229,9,20,0.3); }
        .view-more button:hover { background: #b20710; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(229,9,20,0.45); }
      `}</style>

      <section id="gallery" className="gallery-wrapper">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ride Gallery</h2>
        </motion.div>

        <div className="gallery-grid">
          {imagesToShow.map(({ src, title }, i) => (
            <motion.div
              key={i}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <img src={src} alt={title} className="gallery-img" loading="lazy" />
              <div className="overlay">
                <motion.span initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                  {title}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {images.length > visibleCount && (
          <div className="view-more">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "View Less" : "View More"}
            </motion.button>
          </div>
        )}
      </section>
    </div>
  );
}
