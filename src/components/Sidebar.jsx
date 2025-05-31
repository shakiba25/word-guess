import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sidebar.css";
import api from "../api"; // استفاده از api.js به جای axios خام

export default function Sidebar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/");
        setProfile(data);
      } catch (error) {
        console.error("خطا در دریافت پروفایل:", error);
        toast.error("دریافت اطلاعات کاربر با مشکل مواجه شد");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      await api.post("/logout/", { refresh });
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");

      toast.success("با موفقیت خارج شدید!", {
        position: "top-center",
        autoClose: 1500,
        onClose: () => navigate("/"),
      });
    } catch (error) {
      toast.error("خطا در خروج از حساب");
    }
  };

  return (
    <div className="sidebar">
      <ToastContainer />
      <div className="profile">
        <img
          src={profile?.avatar_url || "../images/profile.png"}
          alt="Profile"
          className="profile-img"
        />
        <h3 className="username">{profile?.username || "نام بازیکن"}</h3>
        <h4 className="info">
          امتیاز: {profile?.score ?? "-"} | رتبه: {profile?.rank ?? "-"}
        </h4>
      </div>

      <Link to="/create-game" className="sidebar-btn yellow">
        شروع بازی
      </Link>
      <Link to="/my-games" className="sidebar-btn colorful">
        <img src="/images/inprogress.png" className="icon" alt="" /> بازی‌های در جریان
      </Link>
      <Link to="/join-game" className="sidebar-btn colorful">
        <img src="/images/join.png" className="icon" alt="" /> پیوستن به بازی‌ها
      </Link>
      <Link to="/history" className="sidebar-btn colorful">
        <img src="/images/history.png" className="icon" alt="" /> تاریخچه
      </Link>
      <Link to="/leader-board" className="sidebar-btn colorful">
        <img src="/images/leaderboard.png" className="icon" alt="" /> جدول امتیازات
      </Link>

      <button onClick={handleLogout} className="sidebar-btn white-gray">
        <img src="/images/logout.png" className="icon" alt="" /> خروج
      </button>
    </div>
  );
}
