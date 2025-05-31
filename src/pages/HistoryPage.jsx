import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FinishedGameCard from '../components/FinishedGameCard';
import api from '../api'; // فرض بر این که api.js در مسیر ../api هست
import './HistoryPage.css';

export default function HistoryPage() {
  const [finishedGames, setFinishedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('history-page');
    return () => {
      document.body.classList.remove('history-page');
    };
  }, []);

  useEffect(() => {
    async function fetchFinishedGames() {
      try {
        setLoading(true);
        const response = await api.get('/games/finished/');
        // فرض می‌کنیم داده‌ها داخل فیلد finished_games هستند
        setFinishedGames(response.data.finished_games);
      } catch (error) {
        console.error('خطا در دریافت بازی‌های تمام‌شده:', error);
        // می‌توان اینجا toast هم گذاشت برای اطلاع‌رسانی
      } finally {
        setLoading(false);
      }
    }

    fetchFinishedGames();
  }, []);

  return (
    <div className="history-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-box">
          <div className="history-title">تاریخچه بازی ها</div>
          <div className="content-box finished-games-box">
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : (
              finishedGames.length > 0 ? (
                finishedGames.map(game => (
                  <FinishedGameCard key={game.game_id} game={game} />
                ))
              ) : (
                <p>هیچ بازی تمام‌شده‌ای وجود ندارد.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
