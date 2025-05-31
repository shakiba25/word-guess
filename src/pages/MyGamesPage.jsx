import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ActiveGameCard from "../components/ActiveGameCard";
import WaitingGameCard from "../components/WaitingGameCard";
import PausedGameCard from "../components/PausedGameCard"; // کارت بازی متوقف شده
import "./MyGamesPage.css";
import api from "../api";

export default function MyGamesPage() {
 

  const [activeTab, setActiveTab] = useState("active");
  const [currentUser, setCurrentUser] = useState(null);

  const [activeGames, setActiveGames] = useState([]);
  const [waitingGames, setWaitingGames] = useState([]);
  const [pausedGames, setPausedGames] = useState([]); // اضافه شد

  useEffect(() => {
    // گرفتن اطلاعات پروفایل (current user)
    api
      .get("/profile/")
      .then((res) => {
        setCurrentUser(res.data.username); // فرض کردم پاسخ این شکلیه: { username: "کاربر5", ... }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // بازی های فعال
    api
      .get("/games/active/")
      .then((res) => {
        setActiveGames(res.data.active_games || []);
      })
      .catch(() => setActiveGames([]));

    // بازی های در انتظار
    api
      .get("/games/waiting/")
      .then((res) => {
        const waitingGamesFormatted = (res.data.waiting_games || []).map(
          (game) => ({
            ...game,
            created_by: {
              username: game.created_by,
              avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
            },
          })
        );
        setWaitingGames(waitingGamesFormatted);
      })
      .catch(() => setWaitingGames([]));

    // بازی های متوقف شده (اصلاح شده برای گرفتن از API)
    api
      .get("/games/paused/")
      .then((res) => {
        // فرض کردم جواب API به شکل { paused_games: [...] }
        setPausedGames(res.data.paused_games || []);
      })
      .catch(() => setPausedGames([]));
  }, [currentUser]);

  const tabClassName = (tabName) => {
    return activeTab === tabName ? `tab active active-${tabName}` : "tab";
  };


  const fetchPausedGames = async () => {
  try {
    const res = await api.get("/games/paused/");
    setPausedGames(res.data.paused_games || []);
  } catch {
    setPausedGames([]);
  }
};


    // تابع شروع مجدد بازی
  const handleRestartGame = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/resume/`);
      alert(response.data.message);
      await fetchPausedGames(); // رفرش لیست بعد از شروع مجدد
    } catch (error) {
      // if (error.response && error.response.data) {
        
      //   alert(error.response.data.error || "خطایی رخ داده است.");
      // } else {
      //   alert("خطا در ارسال درخواست شروع مجدد بازی.");
      // }
    }
  };
  // 10 بازی فعال نمونه
  // const activeGames = Array.from({ length: 10 }, (_, i) => ({
  //   id: 1000 + i,
  //   difficulty: ["easy", "medium", "hard"][i % 3],
  //   started_at: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
  //   is_turn: `بازیکن${i * 2 + 1}`,
  //   players: [
  //     {
  //       username: `بازیکن${i * 2 + 1}`,
  //       avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       score: Math.floor(Math.random() * 100),
  //       // is_turn: i % 2 == 0,
  //     },
  //     {
  //       username: `بازیکن${i * 2 + 2}`,
  //       avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       score: Math.floor(Math.random() * 100),
  //       // is_turn: i % 2 !== 0,
  //     },
  //   ],
  // }));

  // 10 بازی در انتظار نمونه
  // const waitingGames = Array.from({ length: 10 }, (_, i) => ({
  //   id: 2000 + i,
  //   difficulty: ["easy", "medium", "hard"][i % 3],
  //   created_at: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
  //   created_by: {
  //     username: `کاربر${i + 1}`,
  //     avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //   },
  //   status: "waiting",
  // }));

  // 10 بازی متوقف شده نمونه
  // const pausedGames = Array.from({ length: 10 }, (_, i) => ({
  //   game_id: 3000 + i,
  //   difficulty: ["easy", "medium", "hard"][i % 3],
  //   started_at: new Date(Date.now() - (i + 5) * 1000 * 60 * 60).toISOString(),
  //   paused_at: new Date(Date.now() - (i + 1) * 1000 * 60 * 30).toISOString(),
  //   paused_by: {
  //     username: `کاربر${i + 1}`,
  //     avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //   },
  //   status: "paused",
  //   players: [
  //     {
  //       username: currentUser,
  //       score: Math.floor(Math.random() * 100),
  //       guesses: [],
  //     },
  //     {
  //       username: `کاربر${i}`,
  //       score: Math.floor(Math.random() * 100),
  //       guesses: [],
  //     },
  //   ],
  // }));


  // const pausedGames = [
  //   {
  //     game_id: 26,
  //     paused_by: "player1",
  //     difficulty: "easy",
  //     started_at: null,
  //     paused_at: "2025-05-27T14:57:51Z",
  //     status: "paused",
  //     players: [
  //       {
  //         username: "shakiba",
  //         score: 0,
  //         guesses: [],
  //         avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       },
  //       {
  //         username: "player1",
  //         score: 0,
  //         guesses: [],
  //         avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       },
  //     ],
  //   },
  //   {
  //     game_id: 27,
  //     paused_by: "shakiba",
  //     difficulty: "hard",
  //     started_at: null,
  //     paused_at: "2025-05-27T14:45:24Z",
  //     status: "paused",
  //     players: [
  //       {
  //         username: "shakiba",
  //         score: 0,
  //         guesses: [],
  //         avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       },
  //       {
  //         username: "admin",
  //         score: 0,
  //         guesses: [],
  //         avatar: "http://127.0.0.1:8000/media/avatars/default_avatar.png",
  //       },
  //     ],
  //   },
  // ];

  const handleRestart = (gameId) => {
    alert(`شروع مجدد بازی با شناسه: ${gameId}`);
    // اینجا منطق شروع مجدد بازی رو می‌تونی اضافه کنی
  };

  useEffect(() => {
    document.body.classList.add("mygames-page");
    return () => {
      document.body.classList.remove("mygames-page");
    };
  }, []);

  return (
    <div className="my-games">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-box">
          <div className="tabs">
            <button
              className={tabClassName("active")}
              onClick={() => setActiveTab("active")}
            >
              بازی‌های فعال
            </button>
            <button
              className={tabClassName("waiting")}
              onClick={() => setActiveTab("waiting")}
            >
              بازی‌های در انتظار
            </button>
            <button
              className={tabClassName("stopped")}
              onClick={() => setActiveTab("stopped")}
            >
              بازی‌های متوقف شده
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "active" && (
              <div>
                {activeGames.map((game) => (
                  <ActiveGameCard
                    key={game.id}
                    game={game}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}

            {activeTab === "waiting" && (
              <div>
                {waitingGames.map((game) => (
                  <WaitingGameCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {activeTab === "stopped" && (
              <div>
                {pausedGames.map((game) => (
                  <PausedGameCard
                    key={game.game_id}
                    game={game}
                    currentUsername={currentUser}
                    onRestart={handleRestartGame}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
