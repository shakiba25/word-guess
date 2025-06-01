import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import LandingPage from './pages/LandingPage'
import App from './App'
import './index.css'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage.jsx'; 
import CreateGamePage from './pages/CreateGamePage.jsx'; 
import LandingPage from './pages/L.jsx'; 
import GameBoardPage from './pages/GameBoardPage.jsx';
import LeaderBoardPage from './pages/LeaderBoardPage.jsx';
import JoinGamesPage from './pages/JoinGamesPage.jsx'
import MyGamesPage from './pages/MyGamesPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage /> 
  },
  {
    path: "/app",
    element: <App /> 
  },
  {
    path: "/login", 
    element: <LoginPage />
  },
  {
    path: "/signup", 
    element: <SignupPage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage /> 
  },
  {
    path: '/create-game',
    element: <CreateGamePage /> 
  },
  {
    path: '/leader-board',
    element: <LeaderBoardPage /> 
  }
  ,
  {
    path: '/game-board/:gameId',
    element: <GameBoardPage /> 
  },
  {
    path: '/join-game',
    element: <JoinGamesPage />
  },
  {
    path: '/my-games',
    element: <MyGamesPage /> 
  },
  {
    path: '/history',
    element: <HistoryPage /> 
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)