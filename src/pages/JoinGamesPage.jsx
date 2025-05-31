import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import WaitingGameCard from "../components/WaitingJoinGameCard";
import api from "../api";
import "./JoinGamesPage.css";

export default function JoinGamesPage() {
  const [waitingGames, setWaitingGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  useEffect(() => {
    document.body.classList.add("JoinGame-page");
    return () => {
      document.body.classList.remove("JoinGame-page");
    };
  }, []);

  useEffect(() => {
    fetchWaitingGames();
  }, []);

  const fetchWaitingGames = async () => {
    try {
      const response = await api.get("/games/joinable/");
      setWaitingGames(response.data); // فرض بر اینه پاسخ لیست بازی‌هاست
    } catch (error) {
      console.error("خطا در دریافت بازی‌ها:", error);
    }
  };

  const handleJoinSuccess = (joinedGameId) => {
    // ۲ حالت: حذف بازی از لیست یا رفرش کل لیست
    // اینجا رفرش کل لیست:
    fetchWaitingGames();

    // اگر میخوای فقط بازی حذف بشه:
    // setWaitingGames(prev => prev.filter(game => game.id !== joinedGameId));
  };

  const filteredGames = waitingGames.filter((game) => {
    const matchesSearch =
      game.id.toString().includes(searchTerm) ||
      game.created_by.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "" || game.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="JoinGame">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="content-box">
          <h2 style={{ color: "#333", marginBottom: "16px" }}>بازی‌های در انتظار</h2>

          <div className="search-box" style={{ gap: "12px" }}>
            <input
              type="text"
              placeholder="جستجو بر اساس شماره یا نام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">همه سطوح</option>
              <option value="easy">آسان</option>
              <option value="medium">متوسط</option>
              <option value="hard">سخت</option>
            </select>
          </div>

          <div className="games-list-box">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <WaitingGameCard
                  key={game.id}
                  game={game}
                  onJoinSuccess={handleJoinSuccess}
                />
              ))
            ) : (
              <p style={{ color: "#444" }}>بازی‌ای با این مشخصات پیدا نشد.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
