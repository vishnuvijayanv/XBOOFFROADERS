import { useState } from "react";
import { Trash2, Upload } from "lucide-react";

const ImageManager = ({ images = [], setImages, storageKey }) => {
  const [newImage, setNewImage] = useState("");

  const handleAdd = () => {
    if (!newImage.trim()) return;
    const updated = [...images, newImage.trim()];
    setImages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewImage("");
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div>
      {/* Add new image */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Paste image URL"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #666",
            background: "#1e1e1e",
            color: "#fff",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "linear-gradient(90deg,#e50914,#ff1e2d)",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Upload size={18} /> Add
        </button>
      </div>

      {/* List images */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={img}
              alt={`carousel-${idx}`}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
            <button
              onClick={() => handleRemove(idx)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                padding: "6px",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;
