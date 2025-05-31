// src/pages/LeaderBoardPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './LeaderBoardPage.css';
import api from '../api';

function PlayerCard({ rankNumber, username, profileImage, score, rankText }) {
  return (
    <div className="player-card">
      <img src={profileImage} alt={username} />
      <h4 className='user-h4'>{username}</h4>
      <div className="player-info">
        <p>امتیاز: {score}</p>
        <p className="player-rank-text">رتبه: {rankText}</p>
      </div>
      <div className="player-rank">{rankNumber}</div>
    </div>
  );
}

export default function LeaderBoardPage() {
  const podiumRef = useRef(null);
  const playerRefs = [useRef(null), useRef(null), useRef(null)];
  const [playerPositions, setPlayerPositions] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get('/leaderboard/');
        setPlayers(response.data);
      } catch (err) {
        console.error('خطا در گرفتن جدول رتبه‌بندی:', err);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (podiumRef.current && playerRefs.every(ref => ref.current)) {
      const positions = playerRefs.map(ref => {
        const rect = ref.current.getBoundingClientRect();
        const podiumRect = podiumRef.current.getBoundingClientRect();
        return {
          x: rect.left - podiumRect.left + rect.width / 2,
          y: rect.top - podiumRect.top,
        };
      });
      setPlayerPositions(positions);
    }
  }, [players]);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const rankedPlayers = sortedPlayers.map((player, index) => ({
    ...player,
    rankNumber: index + 1,
  }));

  const topThree = rankedPlayers.slice(0, 3);
  const others = rankedPlayers.slice(3);

  return (
    <div className="dashboard leaderboard-page">
      <Sidebar />

      <div className="main-content-leader">
        <Header />
        <div className="content-box">
          <div className="leaderboard-container">
            {/* Podium Section */}
            {topThree.length === 3 && (
              <div className="podium" ref={podiumRef}>
                {/* نفر دوم سمت راست پایین */}
                <div className="player-box player-second" ref={playerRefs[1]}>
                  <img src={topThree[1].avatar_url} alt={topThree[1].username} />
                  <h3>{topThree[1].username}</h3>
                  <p>امتیاز: {topThree[1].score}</p>
                  <p className="player-rank-text">رتبه: {topThree[1].rank}</p>
                  <div className="podium-step">{topThree[1].rankNumber}</div>
                </div>

                {/* نفر اول وسط بالا */}
                <div className="player-box player-first" ref={playerRefs[0]}>
                  <img src={topThree[0].avatar_url} alt={topThree[0].username} />
                  <h3>{topThree[0].username}</h3>
                  <p>امتیاز: {topThree[0].score}</p>
                  <p className="player-rank-text">رتبه: {topThree[0].rank}</p>
                  <div className="podium-step">{topThree[0].rankNumber}</div>
                </div>

                {/* نفر سوم سمت چپ پایین */}
                <div className="player-box player-third" ref={playerRefs[2]}>
                  <img src={topThree[2].avatar_url} alt={topThree[2].username} />
                  <h3>{topThree[2].username}</h3>
                  <p>امتیاز: {topThree[2].score}</p>
                  <p className="player-rank-text">رتبه: {topThree[2].rank}</p>
                  <div className="podium-step">{topThree[2].rankNumber}</div>
                </div>
              </div>
            )}

            {/* لیست بازیکنان 4 تا 10 */}
            <div className="other-players-list">
              {others.map((player) => (
                <PlayerCard
                  key={player.username}
                  rankNumber={player.rankNumber}
                  username={player.username}
                  profileImage={player.avatar_url}
                  score={player.score}
                  rankText={player.rank}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
