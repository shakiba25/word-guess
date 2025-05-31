import React from 'react';
import './PlayerCardGame.css';

export default function PlayerCard({ profileUrl, username, guesses,score, playerId }) {
  const correctGuesses = guesses.filter(g => g.is_correct);
  const wrongGuesses = guesses.filter(g => !g.is_correct);

  return (
    <div className="player-card" role="region" aria-label={`کارت بازیکن ${username}`}>
      <img
        className="player-card__profile"
        src={profileUrl}
        alt={`${username} profile`}
      />
      <p className="player-card__username">{username}</p>
      <p className="player-card__score">امتیاز: {score}</p>

      <input type="hidden" value={playerId} />

      <div className="player-card__guesses">
        
        <h4 className="guess-title correct-title">حدس‌های درست:</h4>
        <div className="player-card__guesses-section">
          {correctGuesses.length > 0 ? (
            correctGuesses.map(({ position, letter }, i) => (
              <p key={position ?? i}>حرف {position} - {letter}</p>
            ))
          ) : (
            <p>هیچ حدسی زده نشده</p>
          )}
        </div>

        <h4 className="guess-title wrong-title">حدس‌های نادرست:</h4>
        <div className="player-card__guesses-section player-card__guesses-section--wrong">
          {wrongGuesses.length > 0 ? (
            wrongGuesses.map(({ position, letter }, i) => (
              <p key={position ?? i}>حرف {position} - {letter}</p>
            ))
          ) : (
            <p>هیچ حدسی زده نشده</p>
          )}
        </div>
      </div>
    </div>
  );
}
