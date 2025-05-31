import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { BASE_URL } from "../config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("نام کاربری و پسورد الزامی هستند.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // اضافه کردن این خط مهم است
        },

        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("access", data.access);

        toast.success("با موفقیت وارد شدید!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("نام کاربری یا پسورد اشتباه است.");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور.");
    }
  };

  return (
    <div className="login-page">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
      />
      <h1 className="login-title">ورود به بازی</h1>
      <div className="login-container">
        <div className="input-box">
          <label htmlFor="username">نام کاربری:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label htmlFor="password">پسورد:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="پسورد خود را وارد کنید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p style={{ color: "red", minHeight: "1.2em", height: "10px" }}>
          {error}
        </p>

        <button className="login-button" onClick={handleLogin}>
          ورود به بازی
        </button>

        <div className="register-link">
          <p>
            در صورت عدم داشتن اکانت، <Link to="/signup">ثبت نام</Link> کنید.
          </p>
        </div>
      </div>
    </div>
  );
}
