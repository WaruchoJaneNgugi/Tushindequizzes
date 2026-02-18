// src/components/Layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SoundControl from '../SoundControl/SoundControl';
import logoImg from '../../assets/logo.png';
import './Header.css';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
    useImageHeader?: boolean;
    onBackClick?: () => void;
    soundEnabled?: boolean;
    onSoundToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
                                           title = "Bible Challenge Quizzes",
                                           subtitle = "How well do you know the Bible? Find out with the Bible Challenge!",
                                           showBackButton = false,
                                           useImageHeader = false,
                                           onBackClick,
                                           soundEnabled = true,
                                           onSoundToggle
                                       }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className={`header-bible ${useImageHeader ? 'imageHeader' : 'simpleHeader'}`}>
            <div className="headerContent">
                <div className="headerLeft">
                    {showBackButton && (
                        <div
                            className="backButton"
                            onClick={handleBackClick}
                        >
                            ←
                        </div>
                    )}
                </div>

                {useImageHeader ? (
                    <div className="logoContainer">
                        <img
                            src={logoImg}
                            alt="Bible Challenge Quizzes"
                            className="logo-bible"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement;
                                if (fallback) {
                                    fallback.innerHTML = '<h1 class="title">Bible Challenge Quizzes</h1>';
                                }
                            }}
                        />
                        <p className="subtitle-bible">{subtitle}</p>
                    </div>
                ) : (
                    // Simple header now shows title and subtitle
                    <div className="simpleHeaderContent">
                        <div className="simpleHeaderInfo">
                            <h2 className="simpleTitle">{title}</h2>
                            <p className="simpleSubtitle">{subtitle}</p>
                        </div>
                    </div>
                )}

                <div className="headerRight">
                    {onSoundToggle && (
                        <SoundControl
                            soundEnabled={soundEnabled}
                            onSoundToggle={onSoundToggle}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;