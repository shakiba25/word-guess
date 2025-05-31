import React from 'react';
import './FinishedGameCard.css';

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

const diffText = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

const FinishedGameCard = ({ game }) => {
  const [player1, player2] = game.player_scores;

  const isWinner = (username) => username === game.winner;

  return (
    <div className="finished-game-card">
      <div className="players-box">
        {/* بازیکن اول */}
        <div className={`player-box ${isWinner(player1.username) ? 'winner' : 'loser'}`}>
          {isWinner(player1.username) && (
            <div className="badge">
              <img
                src="../images/crown.png"
                alt="Winner"
              />
            </div>
          )}
          <img
            className="player-avatar"
            src={player1.avatar}
            alt={player1.username}
          />
          <div className="username">{player1.username}</div>
          <div className="score">امتیاز: {player1.score}</div>
        </div>

        {/* VS آیکون وسط */}
        <div className="vs">
          <img src="/images/vs2.png" alt="VS" className="vs-icon" />
        </div>

        {/* بازیکن دوم */}
        <div className={`player-box ${isWinner(player2.username) ? 'winner' : 'loser'}`}>
          {isWinner(player2.username) && (
            <div className="badge">
              <img
                src="../images/crown.png"
                alt="Winner"
              />
            </div>
          )}
          <img
            className="player-avatar"
            src={player1.avatar}
            alt={player1.username}
          />
          <div className="username">{player2.username}</div>
          <div className="score">امتیاز: {player2.score}</div>
        </div>
      </div>

      {/* اطلاعات کلی بازی */}
      <div className="game-details">
        <div>شناسه بازی: #{game.game_id}</div>
        <div>سطح: {difficultyIcon[game.difficulty]} {diffText[game.difficulty]}</div>
        <div>شروع: {formatDate(game.started_at)}</div>
        <div>پایان: {formatDate(game.finished_at)}</div>


      </div>
    </div>
  );
};

export default FinishedGameCard;
