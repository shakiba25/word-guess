// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom'
import './L.css'

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* پس‌زمینه متحرک */}
      <div className="background-images">
        <img src="/images/1.png" alt="Image 1" />
        <img src="/images/2.png" alt="Image 2" />
        <img src="/images/3.png" alt="Image 3" />
      </div>

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
