import { Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Toaster } from '../components/ui/sonner';
import { Button } from '../components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // 로그인 확인
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else if (location.pathname !== '/login') {
      // 로그인되지 않았으면 로그인 페이지로
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('로그아웃되었습니다');
    navigate('/login');
  };
  
  // Don't show navigation on site detail pages (they have back button) or login page
  const showNavigation = !location.pathname.startsWith('/site/') && location.pathname !== '/login';
  const showUserInfo = location.pathname !== '/login' && user;

  return (
    <div className="max-w-md mx-auto relative">
      {/* User Info Bar */}
      {showUserInfo && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
          <div className="max-w-md mx-auto flex items-center justify-between px-4 py-2">
    <button
  type="button"
  onClick={() => navigate('/profile')}
  className="flex items-center gap-2 text-left"
>
  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white overflow-hidden">
    {user?.profileImage ? (
      <img
        src={user.profileImage}
        alt="프로필"
        className="w-full h-full object-cover"
      />
    ) : (
      <User className="w-4 h-4" />
    )}
  </div>
  <div>
    <div className="text-sm font-medium">{user?.name}</div>
    <div className="text-xs text-gray-500">{user?.email}</div>
  </div>
      </button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      )}
      
      <div className={showUserInfo ? 'pt-14' : ''}>
        <Outlet />
      </div>
      {showNavigation && <Navigation />}
      <Toaster />
    </div>
  );
}
