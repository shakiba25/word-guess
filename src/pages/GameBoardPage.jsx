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
];

export default function GameBoardPage() {
  const { gameId } = useParams(); // گرفتن شناسه بازی از url
  const navigate = useNavigate(); // برای هدایت صفحه

  // stateها برای مدیریت داده‌ها و وضعیت‌های مختلف صفحه
  const [wordLength, setWordLength] = useState(0); // طول کلمه بازی
  const [foundLetters, setFoundLetters] = useState(Array(12).fill("")); // حروف درست پیدا شده (نمایش داده شده)
  const [selectedIndex, setSelectedIndex] = useState(null); // اندیس جعبه انتخاب شده برای وارد کردن حرف
  const [tempLetters, setTempLetters] = useState(Array(12).fill("")); // حروف موقت وارد شده (قبل از ثبت حدس)
  const [username, setProfile] = useState(null); // نام کاربری بازیکن خودی
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0); // زمان باقی‌مانده به ثانیه
  const [game, setGame] = useState(null); // اطلاعات بازی (از سرور)
  const [hasWinner, setHasWinner] = useState(false); // آیا برنده‌ای وجود دارد یا خیر
  
  // برای مدیریت مودال راهنمای حرف
  const [showLetterHintModal, setShowLetterHintModal] = useState(false);
  const [letterHintPosition, setLetterHintPosition] = useState("");

  // useEffect(() => {
  //   const ws = new WebSocket(`ws://127.0.0.1:8000/ws/game/${gameId}/`);

  //   ws.onopen = () => {
  //     console.log("WebSocket connected");
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.type === "game_update") {
  //         // استفاده از axios (api) برای گرفتن وضعیت بازی
  //         api
  //           .get(`/games/${gameId}/status`)
  //           .then((res) => {
  //             setGame(res.data);
  //           })
  //           .catch((err) => {
  //             console.error("خطا در دریافت وضعیت بازی با api:", err);
  //           });
  //       }
  //     } catch (e) {
  //       console.error("خطا در پارس کردن پیام وب‌سوکت", e);
  //     }
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error", error);
  //   };

  //   ws.onmessage = (event) => {
  //     console.log("پیام از وب‌سوکت دریافت شد:", event.data);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [gameId]);

  // گرفتن پروفایل کاربر بعد از لود اولیه صفحه
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/");
        setProfile(data.username); // ذخیره نام کاربری
      } catch (error) {
        console.error("خطا در دریافت پروفایل:", error);
      }
    };
    fetchProfile();
  }, []);

  // گرفتن وضعیت بازی از سرور هر بار که gameId تغییر کند
  useEffect(() => {
    if (!gameId) return;

    async function fetchGame() {
      try {
        const response = await api.get(`/games/${gameId}/status`);
        setGame(response.data); // ذخیره داده‌های بازی
      } catch (error) {
        console.error("خطا در دریافت وضعیت بازی:", error);
      }
    }

    fetchGame();
  }, [gameId]);

  useEffect(() => {
    console.log("Game updated:", game);
  }, [game]);

  // به‌روزرسانی اطلاعات بازی با توجه به نام کاربری و داده‌های بازی
  useEffect(() => {
    // اگر نام کاربری موجود نبود، رد شو
    if (!username) return;

    // اگر حدسی برای این کاربر نیست، آرایه خالی در نظر بگیر (برای حالت حدس نزده)
    const guessesForUser = game?.guesses?.[username] || [];

    // ایجاد آرایه اولیه خالی به طول کلمه بازی
    const initialLetters = Array(game?.word_length || 0).fill("");

    // پر کردن آرایه با حروف صحیح حدس زده شده
    guessesForUser.forEach(({ position, letter, is_correct }) => {
      if (is_correct) {
        initialLetters[position] = letter;
      }
    });

    setFoundLetters(initialLetters); // ذخیره حروف صحیح پیدا شده
    setTempLetters(Array(game?.word_length || 0).fill("")); // پاک کردن حروف موقت
    setWordLength(game?.word_length || 0); // تنظیم طول کلمه بازی
    setTimeRemainingSeconds(Math.floor(game?.time_remaining_minutes * 60) || 0); // تنظیم تایمر
  }, [username, game]);

  // محاسبه اطلاعات بازیکن خودی با useMemo برای بهینه‌سازی رندر
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

  // محاسبه اطلاعات حریف مشابه بالا
  const opponentPlayer = useMemo(() => {
    if (!username || !game?.players) return null;

    const player = game.players.find((p) => p.username !== username);
    if (!player) return null;

    return {
      profile: player.avatar || "/images/profile-opponent.png",
      username: player.username || "حریف",
      score: player.score || 0,
      guesses: (game.guesses?.[player.username] || []).map((g) => ({
        position: g.position,
        letter: g.letter,
        is_correct: g.is_correct,
      })),
    };
  }, [username, game]);

  // آیا نوبت کاربر است؟
  const isUsersTurn = game?.current_turn === username;
  const wordDescription = game?.word_description || "توضیح کلمه اینجاست";

  // تشخیص وجود برنده و تنظیم وضعیت مربوطه
  useEffect(() => {
    if (!game?.winner) {
      setHasWinner(false);
      return;
    }
    setHasWinner(true);
  }, [game?.winner]);

  // اضافه و حذف کلاس css برای صفحه بازی
  useEffect(() => {
    document.body.classList.add("game-bp");
    return () => {
      document.body.classList.remove("game-bp");
    };
  }, []);

  // تایمر کاهشی زمان باقی‌مانده بازی
  useEffect(() => {
    if (timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemainingSeconds]);

  // تبدیل زمان ثانیه به قالب mm : ss
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")} : ${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // خروج از صفحه بازی به داشبورد
  const handleExit = () => {
    navigate("/my-games");
  };

  // متوقف کردن بازی با هشدار ساده
  const handlePause = async () => {
    try {
      const response = await api.post(`/games/${gameId}/pause/`);
      alert(response.data.message); // پیام موفق یا خطا
      navigate("/my-games");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error || "خطایی رخ داده است.");
      } else {
        alert("خطا در ارسال درخواست متوقف کردن بازی.");
      }
    }
  };

  // کلیک روی جعبه برای انتخاب جایگاه وارد کردن حرف
  const handleBoxClick = (index) => {
    // اگر قبلاً حرف درست وارد شده بود، اجازه انتخاب نمیده
    if (foundLetters[index] !== "") return;
    setSelectedIndex(index);
  };

  // کلیک روی حرف کیبورد برای وارد کردن حرف موقت
  const handleLetterClick = (letter) => {
    // اگر جایگاهی انتخاب نشده بود، کاری نکن
    if (selectedIndex === null) return;
    // اگر آن جایگاه قبلاً حرف درست داشت، اجازه تغییر نمیده
    if (foundLetters[selectedIndex] !== "") return;

    // ایجاد آرایه جدید برای حروف موقت، فقط جایگاه انتخاب شده حرف دارد
    const newTempLetters = Array(wordLength).fill("");
    newTempLetters[selectedIndex] = letter;

    setTempLetters(newTempLetters);
    setSelectedIndex(null);
  };

  // اگر داده‌های لازم هنوز نیومده، نمایش پیام بارگذاری
  if (!game || !selfPlayer || !opponentPlayer) {
    return <div>در حال بارگذاری...</div>;
  }

  // تابع ارسال حدس به سرور
  const handleSubmitGuess = async () => {
    try {
      // پیدا کردن ایندکس و حرفی که موقت انتخاب شده
      const guessIndex = tempLetters.findIndex((l) => l !== "");
      if (guessIndex === -1) {
        alert("هیچ حرفی انتخاب نشده است!");
        return;
      }
      const letter = tempLetters[guessIndex];

      // درخواست POST به سرور
      const response = await api.post(`/games/${gameId}/guess/`, {
        letter,
        position: guessIndex,
      });

      // پیام موفقیت یا خطا را نشان بده
      alert(response.data.message);

      // اگر میخوای امتیاز رو هم نمایش بدی می‌تونی اینجا استفاده کنی:
      // alert(`امتیاز شما: ${response.data.score}`);

      // رفرش صفحه (این روش ساده است)
      window.location.reload();

      // یا می‌تونی از navigate هم استفاده کنی:
      // navigate(`/game/${gameId}`, { replace: true });
    } catch (error) {
      // هندل خطاهای 400 و نمایش پیام مناسب
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
      // alert("خطا در دریافت راهنمای حرف.");
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

  return (
    <div className="game-board-page">
      {/* دکمه‌های ثابت برای توقف و خروج */}
      <div className="fixed-buttons">
        <button className="pause-button" onClick={handlePause}>
          متوقف کردن بازی
        </button>
        <button className="exit-button" onClick={handleExit}>
          خروج
        </button>
      </div>

      {/* نمایش تایمر */}
      <div className="timer-box">
        تایمر:
        {formatTime(timeRemainingSeconds)}
      </div>

      {/* هدر صفحه */}
      <div className="header">
        <Header />
      </div>

      {/* محتوای بازی */}
      <div
        className={`game-container ${
          !isUsersTurn || hasWinner ? "disabled" : ""
        }`}
      >
        {/* اگر نوبت کاربر نیست، پیام انتظار نمایش داده شود */}
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

        {/* اگر نوبت کاربر نیست، پیام انتظار نمایش داده شود */}
        {hasWinner && (
          <div className="overlay-message">
            بازی به اتمام رسید.
             کاربر {game.winner} برنده شد.
          </div>
        )}

        {/* ستون چپ: کارت بازیکن خودی و راهنما */}
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

        {/* محتوای اصلی بازی: توضیح کلمه، جعبه حروف، کیبورد و دکمه ثبت حدس */}
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

        {/* کارت بازیکن حریف */}
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
              <button onClick={() => setShowLetterHintModal(false)}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
