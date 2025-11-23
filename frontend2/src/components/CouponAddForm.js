import { useState } from 'react';
import axios from 'axios';

export default function CouponAddForm({ user }) {
  const [form, setForm] = useState({
    title: '', price: '', discount: '', expiry: '', code: '', description: '', thumbnail: null, images: []
  });
  const [message, setMessage] = useState('');

  if (!user || user.role !== 'admin') return null;

  function handleChange(e) {
    const { name, type, files, value } = e.target;
    if (type === 'file') {
      if (name === "thumbnail") {
        setForm(f => ({ ...f, thumbnail: files[0] }));
      } else if (name === "images") {
        setForm(f => ({ ...f, images: Array.from(files) }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('price', form.price);
    data.append('discount', form.discount);
    data.append('expiry', form.expiry);
    data.append('code', form.code);
    data.append('description', form.description);
    if (form.thumbnail) data.append('thumbnail', form.thumbnail);
    form.images.forEach(file => data.append('images', file));

    try {
      await axios.post('http://localhost:5000/api/coupons', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Coupon added!');
      setForm({ title: '', price: '', discount: '', expiry: '', code: '', description: '', thumbnail: null, images: [] });
    } catch {
      setMessage('Error!');
    }
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: "44px auto 0",
      boxShadow: "0 2px 16px #b9b5e566",
      borderRadius: 18,
      padding: "34px 38px 38px 38px",
      background: "#faf7ff"
    }}>
      <h1 style={{
        textAlign: "center",
        fontWeight: "800",
        color: "#3d246c",
        fontSize: "2.3rem",
        marginBottom: 28
      }}>Add Coupon</h1>
      <form onSubmit={handleSubmit} autoComplete="off" encType="multipart/form-data">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={inputStyle} required /><br />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} style={inputStyle} required /><br />
        <input name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleChange} style={inputStyle} required /><br />
        <input name="expiry" type="date" placeholder="Expiry" value={form.expiry} onChange={handleChange} style={inputStyle} required /><br />
        <input name="code" placeholder="Code" value={form.code} onChange={handleChange} style={inputStyle} required /><br />
        
        {/* THUMBNAIL FILE */}
        <label style={labelStyle}>Thumbnail Image (choose file):<br/>
          <input name="thumbnail" type="file" accept="image/*" onChange={handleChange} style={inputStyle} required />
        </label><br/>

        {/* MULTIPLE PRODUCT IMAGES */}
        <label style={labelStyle}>Gallery Images (choose multiple):<br/>
          <input name="images" type="file" multiple accept="image/*" onChange={handleChange} style={inputStyle} required />
        </label><br/>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, height: 60, resize: "vertical", fontFamily: "inherit" }} /><br />
        <button style={{
          width: "100%", padding: "11px", marginTop: 10, fontSize: 18,
          fontWeight: 700, color: "#fff", background: "linear-gradient(90deg, #321863 50%, #a533d6 100%)",
          border: "none", borderRadius: 9, letterSpacing: 1, cursor: "pointer", boxShadow: "0 1.5px 8px #ded3f7a7"
        }}>
          Add Coupon
        </button>
        {message && <div style={{ color: message.includes('Error') ? "red" : "#27ab30", marginTop: 16, textAlign: "center", fontWeight: 600 }}>{message}</div>}
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", fontSize: "1rem", margin: "8px 0",
  borderRadius: "7px", border: "1px solid #c7bfe2", background: "#f5f2fa",
  boxSizing: "border-box", outline: "none"
};
const labelStyle = { fontWeight: 600, fontSize: 14, color:'#3d246c', display: 'block', margin: '9px 0 2px' };
