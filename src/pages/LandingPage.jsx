// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">حدس کلمات</h1>

      <img
        src="/images/landing.png"
        alt="بازی حدس کلمات"
        className="landing-image"
      />

      <p className="landing-subtitle">
        !بازی رو شروع کن، امتیاز بگیر، و به جدول برترین‌ها صعود کن
      </p>

      <div className="auth-buttons">
        <Link to="/signup" className="btn register">ثبت نام</Link>
        <Link to="/login" className="btn login">ورود </Link>
      </div>
    </div>
  )
}
