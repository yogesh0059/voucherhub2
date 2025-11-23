import React, { useState } from "react";
import axios from "axios";

export default function AddCoupon({ user }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    discount: "",
    expiry: "",
    code: "",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("price", form.price);
      data.append("discount", form.discount);
      data.append("expiry", form.expiry);
      data.append("code", form.code);
      data.append("description", form.description);
      data.append("addedBy", user?.email || "");

      if (thumbnail) data.append("thumbnail", thumbnail);
      images.forEach((file) => data.append("images", file));

      const res = await axios.post("http://localhost:5000/api/coupons", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(res.data.success ? "✅ Coupon added successfully!" : "❌ Error occurred!");
      setLoading(false);
      setForm({
        title: "",
        price: "",
        discount: "",
        expiry: "",
        code: "",
        description: "",
      });
      setThumbnail(null);
      setImages([]);
      document.getElementById("add-thumbnail").value = "";
      document.getElementById("add-images").value = "";
    } catch (err) {
      setLoading(false);
      setMsg("❌ " + (err?.response?.data?.error || "Something went wrong!"));
    }
  };

  return (
    <div style={{
      padding: 36, maxWidth: 540, margin: "48px auto",
      background: "#f7f6fb", borderRadius: 18,
      boxShadow: "0 2px 22px #ebe5fc",
    }}>
      <h2 style={{
        textAlign: "center", margin: 0,
        color: "#5522ae", letterSpacing: "0.5px", fontWeight: 800
      }}>Add Coupon</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"
            style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        <input
          type="text" name="title" placeholder="Title" autoFocus value={form.title}
          onChange={handleChange} required
          style={inputStyle}
        />
        <input
          type="number" name="price" placeholder="Price" value={form.price}
          onChange={handleChange} required
          style={inputStyle}
        />
        <input
          type="number" name="discount" placeholder="Discount (%)" value={form.discount}
          onChange={handleChange} required
          style={inputStyle}
        />
        <input
          type="date" name="expiry" placeholder="Expiry date" value={form.expiry}
          onChange={handleChange} required
          style={inputStyle}
        />
        <input
          type="text" name="code" placeholder="Coupon Code" value={form.code}
          onChange={handleChange}
          style={inputStyle}
        />
        <textarea
          name="description" placeholder="Description" value={form.description}
          onChange={handleChange} rows={3}
          style={{ ...inputStyle, minHeight: 54, resize: "vertical" }}
        />
        <label style={{ fontSize: 14 }}>
          Thumbnail Image:
          <input id="add-thumbnail" type="file" name="thumbnail" accept="image/*" onChange={handleThumbnail}
            style={{ display: "block", marginTop: 4, fontSize: 14, border: "none" }} />
        </label>
        <label style={{ fontSize: 14 }}>
          Other Images:
          <input id="add-images" type="file" name="images" multiple accept="image/*" onChange={handleImages}
            style={{ display: "block", marginTop: 4, fontSize: 14, border: "none" }} />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#6b35d6",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "12px 0", fontWeight: 700, fontSize: 16,
            marginTop: 15, boxShadow: "0 0.5px 7px #dec2f7", cursor: "pointer"
          }}
        >
          {loading ? "Adding..." : "+ Add Coupon"}
        </button>
        {msg && (
          <div style={{
            marginTop: 10, color: msg.startsWith("❌") ? "#cb147c" : "#1dac4f",
            fontWeight: 700, fontSize: 16, textAlign: "center" }}>{msg}
          </div>
        )}
      </form>
    </div>
  );
}

// Fancy input style (inline, because you asked for UI look!)
const inputStyle = {
  padding: "11px 14px",
  background: "#fff",
  border: "1.5px solid #c9b7eb",
  borderRadius: 9,
  fontSize: 15,
  outline: "none",
  boxShadow: "0 1.5px 8px #ece3fb",
};

