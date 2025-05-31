import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import LandingPage from './pages/LandingPage'
import App from './App'
import './index.css'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage.jsx'; // 👈 اضافه‌شده
import CreateGamePage from './pages/CreateGamePage.jsx'; // 👈 اضافه‌شده
import LandingPage from './pages/L.jsx'; // 👈 اضافه‌شده
import GameBoardPage from './pages/GameBoardPage.jsx';
import LeaderBoardPage from './pages/LeaderBoardPage.jsx';
import JoinGamesPage from './pages/JoinGamesPage.jsx'
import MyGamesPage from './pages/MyGamesPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage /> // صفحه لندینگ
  },
  {
    path: "/app",
    element: <App /> // صفحه اصلی اپلیکیشن
  },
  {
    path: "/login", 
    element: <LoginPage /> // صفحه ورود
  },
  {
    path: "/signup", 
    element: <SignupPage /> // صفحه ثبت نام
  },
  {
    path: '/dashboard',
    element: <DashboardPage /> // 👈 مسیر داشبورد
  },
  {
    path: '/create-game',
    element: <CreateGamePage /> // 👈 مسیر داشبورد
  },
  {
    path: '/leader-board',
    element: <LeaderBoardPage /> // 👈 مسیر داشبورد
  }
  ,
  {
    path: '/game-board/:gameId',
    element: <GameBoardPage /> // 👈 مسیر داشبورد
  },
  {
    path: '/join-game',
    element: <JoinGamesPage /> // 👈 مسیر داشبورد
  },
  {
    path: '/my-games',
    element: <MyGamesPage /> // 👈 مسیر داشبورد
  },
  {
    path: '/history',
    element: <HistoryPage /> // 👈 مسیر داشبورد
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)