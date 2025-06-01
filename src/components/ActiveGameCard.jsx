import React from 'react';
import './ActiveGameCard.css';
import { useNavigate } from "react-router-dom";

function formatDate(isoDate) {
  // فرمت تاریخ به صورت فارسی
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

const diffText = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

const ActiveGameCard = ({ game, currentUser }) => {
  const navigate = useNavigate();

  // تابع برای ورود به صفحه بازی با gameId
  const handleEnterGame = () => {
    navigate(`/game-board/${game.id}`);
  };

  const player1 = game.players[0];
  const player2 = game.players[1];

  const player1Turn = game.is_turn === player1.username;
  const player2Turn = game.is_turn === player2.username;

  return (
    <div className="active-game-card">
      <div className="players-row">
        {/* بازیکن اول */}
        <div className={`player-col ${player1Turn ? 'active-turn' : ''}`}>
          <img
            className="player-avatar"
            src={player1.avatar}
            alt={player1.username}
          />
          <div className="player-info">
            <div className="player-main-info">
              <span className="player-name">{player1.username}</span>
              <span className="player-score">امتیاز: {player1.score}</span>
            </div>
            {player1Turn && player1.username === currentUser && (
              <span className="turn-indicator">نوبت شماست</span>
            )}
            {player1Turn && player1.username !== currentUser && (
              <span className="turn-indicator">نوبت حریف</span>
            )}
          </div>
        </div>

        <div className="vs">
          <img src="../images/vs2.png" alt="VS" className="vs-icon" />
        </div>

        {/* بازیکن دوم */}
        <div className={`player-col ${player2Turn ? 'active-turn' : ''}`}>
          <img
            className="player-avatar"
            src={player2.avatar}
            alt={player2.username}
          />
          <div className="player-info">
            <div className="player-main-info">
              <span className="player-name">{player2.username}</span>
              <span className="player-score">امتیاز: {player2.score}</span>
            </div>
            {player2Turn && player2.username === currentUser && (
              <span className="turn-indicator">نوبت شماست</span>
            )}
            {player2Turn && player2.username !== currentUser && (
              <span className="turn-indicator">نوبت حریف</span>
            )}
          </div>
        </div>
      </div>

      <div className="game-info-row">
        <div className="game-id">#{game.id}</div>
        <div className={`difficulty ${game.difficulty}`}>
          {difficultyIcon[game.difficulty]} {diffText[game.difficulty]}
        </div>
        <div className="started-at">شروع شده: {formatDate(game.started_at)}</div>
        <button className="enter-game-btn" onClick={handleEnterGame}>ورود به بازی</button>
      </div>
    </div>
  );
};

export default ActiveGameCard;
