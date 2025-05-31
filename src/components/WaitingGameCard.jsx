import React from 'react';
import './WaitingGameCard.css';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.toLocaleDateString('fa-IR', { year: 'numeric' });
  const month = date.toLocaleDateString('fa-IR', { month: '2-digit' });
  const day = date.toLocaleDateString('fa-IR', { day: '2-digit' });
  const time = date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return `${year}/${month}/${day} | ${time}`.replace(/،/g, '');
}

const difficultyIcon = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
};

const diff = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

const WaitingGameCard = ({ game }) => {
  return (
    <div className="waiting-game-card list-style">
      <div className="waiting-game-row">
        {/* کد بازی */}
        <div className="col id">#{game.id}</div>

        {/* بازیکن اول */}
        <div className="col avatar">
          <img
            className="player-avatar"
            src={game.created_by.avatar}
            alt={game.created_by.username}
          />
          <span className="player-name">{game.created_by.username}</span>
        </div>

        {/* در انتظار */}
        <div className="col status">🕓 در انتظار حریف...</div>

        {/* سطح بازی */}
        <div className={`col difficulty ${game.difficulty}`}>
          {difficultyIcon[game.difficulty]} {diff[game.difficulty]}
        </div>

        {/* تاریخ ساخت */}
        <div className="col created-date">{formatDate(game.created_at)}</div>

        {/* دکمه پیوستن */}
        <div className="col delete-btn-col">
          <button className="delete-btn">حذف بازی</button>
        </div>
      </div>
    </div>
  );
};

export default WaitingGameCard;
