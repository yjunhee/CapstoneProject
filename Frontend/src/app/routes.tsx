import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { StampCollection } from './pages/StampCollection';
import { SiteDetail } from './pages/SiteDetail';
import { GiftExchange } from './pages/GiftExchange';

import { KakaoCallback } from './pages/KakaoCallback';
import { NaverCallback } from './pages/NaverCallback';
import { GoogleCallback } from './pages/GoogleCallback';

import { Quiz } from './pages/Quiz';
import CameraPage from './pages/CameraPage';
import { ProfileSettings } from './pages/ProfileSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      
      { path: 'login', element: <Login /> },
      { path: 'stamps', element: <StampCollection /> },
      { index: true, element: <Home /> },
      { path: 'site/:id', element: <SiteDetail /> },
      { path: 'gifts', element: <GiftExchange /> },
      
      { path: 'kakaologin', element: <KakaoCallback /> }, // (수정부분) 카카오 로그인 추가
      { path: 'naverlogin', element: <NaverCallback /> }, // (수정부분) 네이버 로그인 추가
      { path: 'googlelogin', element: <GoogleCallback /> }, // (수정부분) 구글 로그인 추가
      
      { path: 'camera', element: <CameraPage /> },
      { path: 'quiz', element: <Quiz /> },
      { path: 'profile', element: <ProfileSettings /> },
    ],
  },
]);
