// components/PlayerCard.jsx
import React from 'react';
import './PlayerCardLeader.css';

export default function PlayerCard({ rank, username, profileImage, score }) {
  return (
    <div className="player-card">
      <img src={profileImage} alt={username} />
      <div className="player-info">
        <h4>{username}</h4>
        <p>امتیاز: {score}</p>
        <div className="player-rank">{rank}</div>
      </div>
      
    </div>
  );
}
