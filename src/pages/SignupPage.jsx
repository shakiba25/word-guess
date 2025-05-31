import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";
import { BASE_URL } from "../config";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }

    try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (profileImage) {
      formData.append("avatar", profileImage);
    }

    const response = await axios.post(`${BASE_URL}register/`, formData);

    toast.success(response.data.message || "ثبت‌نام با موفقیت انجام شد!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      onClose: () => navigate("/login"),
    });

  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "خطایی رخ داده است.";

    const data = error.response?.data;
    if (data?.error) errorMessage = data.error;
    else if (data?.message) errorMessage = data.message;
    else if (data?.detail) errorMessage = data.detail;
    else if (typeof data === "object") {
      const key = Object.keys(data)[0];
      if (key && Array.isArray(data[key])) errorMessage = data[key][0];
    }

    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  }
  };

  return (
    <div className="signup-page">
      <ToastContainer/>
      <h1 className="signup-title">ثبت نام</h1>
      <form className="signup-container" onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="email">ایمیل:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label htmlFor="username">نام کاربری:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label htmlFor="profile-image">عکس پروفایل:</label>
          <input
            type="file"
            id="profile-image"
            name="profile-image"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>

        <div className="input-box">
          <label htmlFor="password">رمز عبور:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="رمز عبور خود را وارد کنید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">
          ثبت نام
        </button>

        <div className="login-link">
          <p>
            در صورت داشتن اکانت، <Link to="/login">وارد </Link>شوید.
          </p>
        </div>
      </form>
    </div>
  );
}
