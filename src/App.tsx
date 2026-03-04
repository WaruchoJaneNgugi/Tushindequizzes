import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {TopBar} from "./components/Layout/TopBar";
import {GameGrid} from "./components/Layout/GameGrid";
import {SettingsPage} from "./pages/SettingsPage";
import {BuyPoints} from "./pages/BuyPoints";
import {Footer} from "./components/Layout/Footer";
import "./App.css";
import "../src/Admin/style.css"
import {type FC, useEffect, useState} from "react";
import {ImageLoader} from "./components/ImageLoader.tsx";
import {
    type AdminUser,
} from "./Admin/types.ts";
import Login from "./Admin/views/Login.tsx";
import {GameOverlay} from "./components/Layout/GameOverlay.tsx";
import {apiService} from "./Admin/services/api.ts";
import Dashboard from "./Admin/views/Dashboard.tsx";

const App: FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);

        // Check for stored token and user
        const token = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                apiService.setToken(token);
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('admin_user');
                localStorage.removeItem('admin_token');
            }
        }

        return () => clearInterval(timer);
    }, []);

    const handleLogin = (userData: AdminUser) => {
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
    };

    if (isLoading) {
        return <ImageLoader
            isLoading={isLoading}
            progress={loadingProgress}
            title="Tushinde Quiz"
            subtitle="Preparing your gaming experience"
            loadingMessage="Loading games, assets, and leaderboards..."
            // onCancel={() => setIsLoading(false)}
        />;
    }

    return (
        <Router>
            <Routes>
                {/* Default route - redirect to admin login if not logged in,
                    or to admin dashboard if logged in */}
                <Route path="/admin" element={
                    user ? <Navigate to="/admin/" replace /> : <Navigate to="/admin/login" replace />
                }/>

                {/* Admin Login Route */}
                <Route path="/admin/login" element={
                    !user ? <Login onLogin={handleLogin}/> : <Navigate to="/admin/" replace/>
                }/>

                {/* Admin Dashboard Route */}
                {user && (
                    <Route path="/admin/" element={
                        <Dashboard user={user} />
                    }/>
                )}

                {/* Main game route - accessible only if user is not logged in OR
                    you can make it always accessible at a different path */}
                <Route path="/" element={
                    <div className="Main-Container">
                        <TopBar/>
                        <SettingsPage/>
                        <BuyPoints/>
                        <GameOverlay/>
                        <GameGrid/>
                        <Footer/>
                    </div>
                }/>

                {/* Redirect to dashboard if logged in, otherwise to login */}
                <Route path="/admin" element={
                    user ? <Navigate to="/admin/" replace/> : <Navigate to="/admin/login" replace/>
                }/>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </Router>
    );
};

export default App;