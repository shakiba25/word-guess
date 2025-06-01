import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PlayerCard from "../components/PlayerCardGame";
import "./GameBoardPage.css";
import api from "../api";

// آرایه حروف فارسی برای کیبورد
const FarsiLetters = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع"],
  ["ه", "خ", "ح", "ج", "چ", "ش", "س"],
  ["ی", "ب", "ل", "ا", "ت", "ن", "م"],
  ["ک", "گ", "ظ", "ط", "ز", "ر", "ذ"],
  ["د", "پ", "و", "ژ", "ئ", "آ"]
];

export default function GameBoardPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [wordLength, setWordLength] = useState(0);
  const [foundLetters, setFoundLetters] = useState(Array(12).fill(""));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [tempLetters, setTempLetters] = useState(Array(12).fill(""));
  const [username, setProfile] = useState(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [game, setGame] = useState(null);
  const [hasWinner, setHasWinner] = useState(false);
  const [showLetterHintModal, setShowLetterHintModal] = useState(false);
  const [letterHintPosition, setLetterHintPosition] = useState("");

  // گرفتن پروفایل کاربر
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/");
        setProfile(data.username);
      } catch (error) {
        console.error("خطا در دریافت پروفایل:", error);
      }
    };
    fetchProfile();
  }, []);

  // گرفتن وضعیت بازی اولیه
  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${gameId}/status`);
        setGame(response.data);
      } catch (error) {
        console.error("خطا در دریافت وضعیت بازی:", error);
      }
    };

    fetchGame();
  }, [gameId]);

  // polling هر 3 ثانیه برای آپدیت وضعیت بازی
  useEffect(() => {
    if (!gameId) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/games/${gameId}/status`);
        setGame(response.data);
      } catch (error) {
        console.error("خطا در دریافت وضعیت بازی:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameId]);

  // به‌روزرسانی داده‌ها بر اساس بازی و کاربر
  useEffect(() => {
    if (!username || !game) return;

    const guessesForUser = game?.guesses?.[username] || [];
    const initialLetters = Array(game?.word_length || 0).fill("");

    guessesForUser.forEach(({ position, letter, is_correct }) => {
      if (is_correct) {
        initialLetters[position] = letter;
      }
    });

    setFoundLetters(initialLetters);
    setTempLetters(Array(game?.word_length || 0).fill(""));
    setWordLength(game?.word_length || 0);
    setTimeRemainingSeconds(Math.floor(game?.time_remaining_minutes * 60) || 0);
  }, [username, game]);

  // محاسبه اطلاعات بازیکن خودی
  const selfPlayer = useMemo(() => {
    if (!username || !game?.players) return null;

    const player = game.players.find((p) => p.username === username);
    if (!player) return null;

    return {
      profile: player.avatar || "/images/profile-self.png",
      username: player.username || "کاربر خودی",
      score: player.score || 0,
      guesses: (game.guesses?.[player.username] || []).map((g) => ({
        position: g.position,
        letter: g.letter,
        is_correct: g.is_correct,
      })),
    };
  }, [username, game]);

  // محاسبه اطلاعات حریف
  const opponentPlayer = useMemo(() => {
    if (!username || !game?.players) return null;
  
    const player = game.players.find((p) => p.username !== username);
    if (!player) return null;
  
    return {
      profile: player.avatar || "/images/profile-opponent.png",
      username: player.username || "حریف",
      score: player.score || 0,
      guesses: [], // 
    };
  }, [username, game]);

  // تشخیص برنده
  useEffect(() => {
    setHasWinner(!!game?.winner);
  }, [game?.winner]);

  // کلاس css برای صفحه
  useEffect(() => {
    document.body.classList.add("game-bp");
    return () => {
      document.body.classList.remove("game-bp");
    };
  }, []);

  // تایمر کاهشی
  useEffect(() => {
    if (timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemainingSeconds]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `: ${sec
      .toString()
      .padStart(2, "0")} : ${min.toString().padStart(2, "0")} `;
  };

  const handleExit = () => {
    navigate("/my-games");
  };

  const handlePause = async () => {
    try {
      const response = await api.post(`/games/${gameId}/pause/`);
      alert(response.data.message);
      navigate("/my-games");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error || "خطایی رخ داده است.");
      } else {
        alert("خطا در ارسال درخواست متوقف کردن بازی.");
      }
    }
  };

  const handleBoxClick = (index) => {
    if (foundLetters[index] !== "") return;
    setSelectedIndex(index);
  };

  const handleLetterClick = (letter) => {
    if (selectedIndex === null) return;
    if (foundLetters[selectedIndex] !== "") return;

    const newTempLetters = Array(wordLength).fill("");
    newTempLetters[selectedIndex] = letter;

    setTempLetters(newTempLetters);
    setSelectedIndex(null);
  };

  if (!game || !selfPlayer || !opponentPlayer) {
    return <div>در حال بارگذاری...</div>;
  }

  //ارسال حدس و آپدیت بدون رفرش صفحه
  const handleSubmitGuess = async () => {
    try {
      const guessIndex = tempLetters.findIndex((l) => l !== "");
      if (guessIndex === -1) {
        alert("هیچ حرفی انتخاب نشده است!");
        return;
      }
      const letter = tempLetters[guessIndex];

      const response = await api.post(`/games/${gameId}/guess/`, {
        letter,
        position: guessIndex,
      });

      alert(response.data.message);

      // آپدیت بازی بدون رفرش صفحه
      const updatedGame = await api.get(`/games/${gameId}/status`);
      setGame(updatedGame.data);

      setTempLetters(Array(wordLength).fill(""));
    } catch (error) {
      if (error.response) {
        alert(`خطا: ${error.response.data.error || "خطایی رخ داده است."}`);
      } else {
        alert("خطا در ارسال حدس به سرور.");
      }
    }
  };

  const handleLetterHint = async () => {
    try {
      const response = await api.post(`/games/${gameId}/hint/`, {
        hint_type: "letter",
        position: parseInt(letterHintPosition),
      });
      alert(`حرف در موقعیت ${letterHintPosition}: ${response.data.letter}`);
      setShowLetterHintModal(false);
      setLetterHintPosition("");
    } catch (error) {
      alert(`خطا: ${JSON.stringify(error.response.data.error)}`);
      console.error(error);
    }
  };

  const handleGeneralHint = async () => {
    try {
      const response = await api.post(`/games/${gameId}/hint/`, {
        hint_type: "hint",
      });
      alert(`راهنما: ${response.data.hint}`);
    } catch (error) {
      alert(`خطا: ${JSON.stringify(error.response.data.error)}`);
      console.error(error);
    }
  };

  const isUsersTurn = game?.current_turn === username;
  const wordDescription = game?.word_description || "توضیح کلمه اینجاست";

  return (
    <div className="game-board-page">
      <div className="fixed-buttons">
        <button className="pause-button" onClick={handlePause}>
          متوقف کردن بازی
        </button>
        <button className="exit-button" onClick={handleExit}>
          خروج
        </button>
      </div>

      <div className="timer-box">تایمر: {formatTime(timeRemainingSeconds)}</div>

      <div className="header">
        <Header />
      </div>

      <div
        className={`game-container ${
          !isUsersTurn || hasWinner ? "disabled" : ""
        }`}
      >
        {!isUsersTurn && (
          <div className="overlay-message">
            <img
              src="/images/waiting.png"
              alt="waiting"
              className="waiting-icon"
            />
            نوبت کاربر {game.current_turn} است.
          </div>
        )}

        <div className="left-column">
          <PlayerCard
            profileUrl={selfPlayer.profile}
            username={selfPlayer.username}
            guesses={selfPlayer.guesses}
            score={selfPlayer.score}
          />

          <div className="hint-box">
            <p>گروه امداد 🚑</p>
            <div className="hint-buttons">
              <button onClick={() => setShowLetterHintModal(true)}>
                کدوم حرف؟
              </button>
              <button onClick={handleGeneralHint}>یه نشونه بگیر!</button>
            </div>
          </div>
        </div>

        <div className="game-content">
          <h2 className="word-description">{wordDescription}</h2>
          <div className="letter-boxes">
            {Array(wordLength)
              .fill(0)
              .map((_, i) => {
                const isCorrect = foundLetters[i] !== "";
                const isTemp = tempLetters[i] !== "";

                let className = "letter-box";
                if (isCorrect) className += " correct-letter";
                else if (isTemp) className += " temp-letter";

                return (
                  <div
                    key={i}
                    className={`${className} ${
                      selectedIndex === i ? "selected" : ""
                    }`}
                    onClick={() => handleBoxClick(i)}
                  >
                    {isCorrect ? foundLetters[i] : isTemp ? tempLetters[i] : ""}
                  </div>
                );
              })}
          </div>

          <div className="keyboard">
            {FarsiLetters.map((row, rowIndex) => (
              <div className="keyboard-row" key={rowIndex}>
                {row.map((char, i) => (
                  <div
                    key={i}
                    className="key"
                    onClick={() => handleLetterClick(char)}
                  >
                    {char}
                  </div>
                ))}
              </div>
            ))}

            <button className="submit-guess-button" onClick={handleSubmitGuess}>
              ثبت حدس
            </button>
          </div>
        </div>

        <PlayerCard
          profileUrl={opponentPlayer.profile}
          username={opponentPlayer.username}
          guesses={opponentPlayer.guesses}
          score={opponentPlayer.score}
        />
      </div>

      {showLetterHintModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>حرفی که می‌خوای بفهمی رو بگو!</h3>
            <input
              type="number"
              min="0"
              max={wordLength - 1}
              value={letterHintPosition}
              onChange={(e) => setLetterHintPosition(e.target.value)}
              placeholder="شماره جایگاه (مثلاً 0)"
            />
            <div className="modal-buttons">
              <button onClick={handleLetterHint}>تأیید</button>
              <button onClick={() => setShowLetterHintModal(false)}>لغو</button>
            </div>
          </div>
        </div>
      )}

      {hasWinner && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f0f0f0",
            padding: "20px 30px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            fontSize: "1.5rem",
            zIndex: 1000,
            textAlign: "center"
          }}
        >
          بازی تمام شده است. برنده: {game.winner}
        </div>
      )}
    </div>
  );
}
