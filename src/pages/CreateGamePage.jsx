import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; 
import "./CreateGamePage.css";
import api from "../api";
import { toast } from "react-toastify";

export default function CreateGamePage() {
  // state برای ذخیره‌سازی سطح بازی و انتخاب هوش مصنوعی
  const [selectedLevel, setSelectedLevel] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    document.body.classList.add("cg-page"); // اضافه کردن کلاس

    return () => {
      document.body.classList.remove("cg-page"); // حذف کلاس
    };
  }, []);

  // ارسال درخواست ایجاد بازی
  const handleCreateGame = async () => {
    if (!selectedLevel) {
      toast.warn("لطفاً یک سطح سختی انتخاب کنید.");
      return;
    }

    const endpoint = aiEnabled
      ? "/games/create/single-player"
      : "/games/create/multi-player";

    try {
      const response = await api.post(endpoint, {
        difficulty: selectedLevel,
      });

      if (response.status === 201) {
        const gameData = response.data;
        console.log("بازی ایجاد شد:", gameData);

        toast.success("بازی با موفقیت ایجاد شد!");

        // انتقال به صفحه جزئیات بازی (اختیاری)
        // navigate(`/games/${gameData.id}`);
      }
    } catch (error) {
      console.error("خطا در ایجاد بازی:", error);

      if (error.response) {
        toast.error(error.response.data.error || "خطایی رخ داده است");
      } else {
        toast.error("عدم ارتباط با سرور");
      }
    }
  };

  return (
    <div className="create-game">

      <Sidebar />

      <div className="main-content">
        <Header /> {/* هدر جداشده */}
        <div className="content-box">
          <h2>ساخت بازی جدید :</h2>

          {/* Box for selecting game level */}
          <div className="level-box">
            <h3>سطح دلخواه خود را انتخاب کنید :</h3>
            <div className="level-options">
              <label>
                <input
                  type="radio"
                  value="easy"
                  checked={selectedLevel === "easy"}
                  onChange={() => setSelectedLevel("easy")}
                />
                ساده (کلمات 4 - 5 حرفی) - زمان 10 دقیقه
              </label>
              <label>
                <input
                  type="radio"
                  value="medium"
                  checked={selectedLevel === "medium"}
                  onChange={() => setSelectedLevel("medium")}
                />
                متوسط (کلمات 6 - 7 حرفی) - زمان 7 دقیقه
              </label>
              <label>
                <input
                  type="radio"
                  value="hard"
                  checked={selectedLevel === "hard"}
                  onChange={() => setSelectedLevel("hard")}
                />
                سخت (کلمات 8+ حرفی) - زمان 5 دقیقه
              </label>
            </div>
          </div>

          <div className="ai-box">
            <label>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={() => setAiEnabled(!aiEnabled)}
              />
              بازی با هوش مصنوعی
              <img src="/images/bot.png" alt="AI Icon" className="ai-icon" />
            </label>
          </div>

          <button onClick={handleCreateGame} className="create-game-btn">
            ایجاد بازی
          </button>
        </div>
      </div>
    </div>
  );
}
