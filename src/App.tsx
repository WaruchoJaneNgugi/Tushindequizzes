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
    type Category,
    type Player,
    type Question,
    type Quiz,
    type QuizAttempt,
} from "./Admin/types.ts";
import Dashboard from "./Admin/views/Dashboard.tsx";
import Quizzes from "./Admin/views/Quizzes.tsx";
import Categories from "./Admin/views/Categories.tsx";
import Players from "./Admin/views/Players.tsx";
import Results from "./Admin/views/Results.tsx";
import Login from "./Admin/views/Login.tsx";
import Layout from "./Admin/components/Layout.tsx";
import {GameOverlay} from "./components/Layout/GameOverlay.tsx";
import {apiService} from "./Admin/services/api.ts";

const AdminLayoutWrapper: FC<{
    user: AdminUser;
    onLogout: () => void;
    children: React.ReactNode;
}> = ({user, onLogout, children}) => {
    return (
        <Layout user={user} onLogout={onLogout}>
            {children}
        </Layout>
    );
};

const App: FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [user, setUser] = useState<AdminUser | null>(null);

    // Initialize empty states - each component will fetch its own data
    const [categories, setCategories] = useState<Category[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

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

    const handleLogout = () => {
        apiService.clearToken();
        localStorage.removeItem('admin_user');
        setUser(null);
        // Clear all data on logout
        setCategories([]);
        setQuizzes([]);
        setPlayers([]);
        setQuestions([]);
        setAttempts([]);
    };

    const handleLogin = (userData: AdminUser) => {
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        // Note: We're NOT loading data here. Each admin component will load its own data
    };

    if (isLoading) {
        return <ImageLoader
            isLoading={isLoading}
            progress={loadingProgress}
            title="Tushinde Quiz"
            subtitle="Preparing your gaming experience"
            loadingMessage="Loading games, assets, and leaderboards..."
            onCancel={() => setIsLoading(false)}
        />;
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
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

                {/* Admin Login Route */}
                <Route path="/admin/login" element={
                    !user ? <Login onLogin={handleLogin}/> : <Navigate to="/admin/dashboard" replace/>
                }/>

                {/* Admin Routes */}
                {user && (
                    <>
                        <Route path="/admin/dashboard" element={
                            <AdminLayoutWrapper user={user} onLogout={handleLogout}>
                                <Dashboard quizzes={quizzes} players={players}/>
                            </AdminLayoutWrapper>
                        }/>

                        <Route path="/admin/quizzes" element={
                            <AdminLayoutWrapper user={user} onLogout={handleLogout}>
                                <Quizzes
                                    quizzes={quizzes}
                                    setQuizzes={setQuizzes}
                                    categories={categories}
                                    questions={questions}
                                    setQuestions={setQuestions}
                                />
                            </AdminLayoutWrapper>
                        }/>

                        <Route path="/admin/categories" element={
                            <AdminLayoutWrapper user={user} onLogout={handleLogout}>
                                <Categories
                                    categories={categories}
                                    setCategories={setCategories}
                                    quizzes={quizzes}
                                    setQuizzes={setQuizzes}
                                />
                            </AdminLayoutWrapper>
                        }/>

                        <Route path="/admin/players" element={
                            <AdminLayoutWrapper user={user} onLogout={handleLogout}>
                                <Players
                                    players={players}
                                    setPlayers={setPlayers}
                                    attempts={attempts}
                                    quizzes={quizzes}
                                />
                            </AdminLayoutWrapper>
                        }/>

                        <Route path="/admin/results" element={
                            <AdminLayoutWrapper user={user} onLogout={handleLogout}>
                                <Results attempts={attempts}/>
                            </AdminLayoutWrapper>
                        }/>
                    </>
                )}

                {/* Redirect to dashboard if logged in, otherwise to login */}
                <Route path="/admin" element={
                    user ? <Navigate to="/admin/dashboard" replace/> : <Navigate to="/admin/login" replace/>
                }/>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </Router>
    );
};

export default App;