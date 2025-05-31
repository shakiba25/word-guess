import React, { useState ,  useEffect  } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // ایمپورت هدر جدید
import './DashboardPage.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('start');

  // اضافه کردن کلاس 'dashboard-page' به body هنگام بارگذاری صفحه
  useEffect(() => {
    document.body.classList.add('dashboard-page'); // اضافه کردن کلاس

    // تمیز کردن و حذف کلاس هنگام ترک کردن صفحه داشبورد
    return () => {
      document.body.classList.remove('dashboard-page'); // حذف کلاس
    };
  }, [])

  return (
    <div className="dashboard">
      <Sidebar onTabChange={setActiveTab} />

      <div className="main-content">
        <Header /> {/* هدر جداشده */}
        <div className="content-box">
          {activeTab === 'start' && <div>شروع بازی</div>}
          {activeTab === 'inprogress' && <div>بازی‌های در جریان</div>}
          {activeTab === 'join' && <div>پیوستن به بازی‌ها</div>}
          {activeTab === 'history' && <div>تاریخچه</div>}
          {activeTab === 'leaderboard' && <div>جدول امتیازات</div>}
          {activeTab === 'logout' && <div>خروج</div>}
        </div>
      </div>
    </div>
  );
}
