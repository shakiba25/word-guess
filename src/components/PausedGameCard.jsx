import React from "react";
import "./PausedGameCard.css";

function formatDate(isoDate) {
  if (!isoDate) return "-";
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

const diffText = {
  easy: "آسان",
  medium: "متوسط",
  hard: "سخت",
};

const PausedGameCard = ({ game, currentUsername, onRestart }) => {
  const players = game.players || [];

  if (!players[0]) {
    console.log("PausedGameCard skipped due to missing player1", game);
    return null; 
  }

  if (!players[1]) {
    console.log("PausedGameCard has only one player", game);
  }
  const player1 = game.players[0];
  const player2 = game.players[1];
  const pausedByUsername = game.paused_by; 

  const pausedByCurrentUser = pausedByUsername === currentUsername;

  return (
    <div className="paused-game-card">
      <div className="players-row">
        <div
          className={`player-col ${
            player1.username === pausedByUsername ? "paused-by" : ""
          }`}
        >
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
            {player1.username === pausedByUsername && (
              <div
                className="paused-indicator"
                style={{ whiteSpace: "normal", marginLeft: "10px" }}
              >
                <div>
                  {pausedByCurrentUser ? "توقف توسط شما" : "توقف توسط حریف"}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#777",
                    marginTop: "2px",
                  }}
                >
                  {formatDate(game.paused_at)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="vs">
          <img src="../images/vs2.png" alt="VS" className="vs-icon" />
        </div>

        <div
          className={`player-col ${
            player2.username === pausedByUsername ? "paused-by" : ""
          }`}
        >
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
            {player2.username === pausedByUsername && (
              <div
                className="paused-indicator"
                style={{ whiteSpace: "normal", marginLeft: "10px" }}
              >
                <div>
                  {pausedByCurrentUser ? "توقف توسط شما" : "توقف توسط حریف"}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#777",
                    marginTop: "2px",
                  }}
                >
                  {formatDate(game.paused_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-info-row">
        <div className="game-id">#{game.game_id}</div>
        <div className={`difficulty ${game.difficulty}`}>
          {difficultyIcon[game.difficulty]} {diffText[game.difficulty]}
        </div>
        <div className="paused-at">
          شروع شده : {formatDate(game.started_at)}
        </div>

        <button
          className="restart-game-btn"
          onClick={() => pausedByCurrentUser && onRestart(game.game_id)}
          disabled={!pausedByCurrentUser}
          title={
            pausedByCurrentUser
              ? "شروع مجدد بازی"
              : "فقط بازی‌های پاز شده توسط شما قابل شروع مجدد است"
          }
        >
          شروع مجدد
        </button>
      </div>
    </div>
  );
};

export default PausedGameCard;
