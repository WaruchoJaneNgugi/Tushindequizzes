// components/ImageLoaderAlt.tsx
import { type FC, useMemo } from 'react';
import '../styles/imageLoader.css';

interface ImageLoaderAltProps {
    isLoading: boolean;
    progress?: number;
    title?: string;
    subtitle?: string;
    variant?: 'pulse' | 'orbit' | 'wave';
}

export const ImageLoader: FC<ImageLoaderAltProps> = ({
                                                         isLoading,
                                                         title = "Loading...",
                                                         subtitle = "Please wait while we prepare your content",
                                                         variant = 'pulse'
                                                     }) => {
    if (!isLoading) return null;

    // Generate particles once per component instance
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`
        }));
    }, []); // Empty dependency array means this runs once

    const getLoaderVariantClass = () => {
        switch (variant) {
            case 'orbit': return 'loader-orbit';
            case 'wave': return 'loader-wave';
            default: return 'loader-pulse';
        }
    };

    return (
        <div className={`loader-wrapper-main loader-${variant}`}>
            {/* Abstract Background Pattern */}
            <div className="loader-backdrop">
                <div className="backdrop-particles">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="particle"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                animationDelay: particle.delay
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Rest of your component remains the same */}
            <div className="loader-container">
                {/* Dynamic Loader Animation */}
                <div className={`loader-animation ${getLoaderVariantClass()}`}>
                    {variant === 'orbit' && (
                        <div className="orbit-container">
                            <div className="orbit-core"></div>
                            <div className="orbit-ring ring-1"></div>
                            <div className="orbit-ring ring-2"></div>
                            <div className="orbit-ring ring-3"></div>
                            <div className="orbit-satellite sat-1"></div>
                            <div className="orbit-satellite sat-2"></div>
                        </div>
                    )}

                    {variant === 'wave' && (
                        <div className="wave-container">
                            <div className="wave-bar bar-1"></div>
                            <div className="wave-bar bar-2"></div>
                            <div className="wave-bar bar-3"></div>
                            <div className="wave-bar bar-4"></div>
                            <div className="wave-bar bar-5"></div>
                        </div>
                    )}

                    {variant === 'pulse' && (
                        <div className="pulse-container">
                            <div className="pulse-ring ring-primary"></div>
                            <div className="pulse-ring ring-secondary"></div>
                            <div className="pulse-ring ring-tertiary"></div>
                            <div className="pulse-core"></div>
                        </div>
                    )}
                </div>

                {/* Text Section */}
                <div className="loader-message">
                    <h2 className="message-title">
                        {title.split('').map((char, index) => (
                            <span
                                key={index}
                                className="title-char"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {char}
                            </span>
                        ))}
                    </h2>
                    <p className="message-subtitle">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};