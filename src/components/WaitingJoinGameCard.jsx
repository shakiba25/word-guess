import React from "react";
import api from "../api";
import "./WaitingJoinGameCard.css";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.toLocaleDateString("fa-IR", { year: "numeric" });
  const month = date.toLocaleDateString("fa-IR", { month: "2-digit" });
  const day = date.toLocaleDateString("fa-IR", { day: "2-digit" });
  const time = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${year}/${month}/${day} | ${time}`.replace(/،/g, "");
}

const difficultyIcon = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
};

const diff = {
  easy: "آسان",
  medium: "متوسط",
  hard: "سخت",
};

const WaitingGameCard = ({ game, onJoinSuccess }) => {
  const handleJoinGame = async () => {
    try {
      const response = await api.post(`/games/${game.id}/join/`);
      alert(response.data.message);
      if (onJoinSuccess) onJoinSuccess(game.id);
    } catch (error) {
      console.error("خطا در پیوستن به بازی:", error);
      alert("خطا در پیوستن به بازی");
    }
  };

  return (
    <div className="waiting-join-game-card list-style">
      <div className="waiting-game-row">
        <div className="col id">#{game.id}</div>

        <div className="col avatar">
          <img
            className="player-avatar"
            src={game.created_by.avatar}
            alt={game.created_by.username}
          />
          <span className="player-name">{game.created_by.username}</span>
        </div>

        <div className="col status">🕓 در انتظار حریف...</div>

        <div className={`col difficulty ${game.difficulty}`}>
          {difficultyIcon[game.difficulty]} {diff[game.difficulty]}
        </div>

        <div className="col created-date">{formatDate(game.created_at)}</div>

        <div className="col join-btn-col">
          <button className="join-btn" onClick={handleJoinGame}>
            پیوستن به بازی
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingGameCard;
