// components/ImageLoaderAlt.tsx
import { type FC } from 'react';
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
                                                            // progress = 0,
                                                            title = "Loading...",
                                                            subtitle = "Please wait while we prepare your content",
                                                            variant = 'pulse'
                                                        }) => {
    if (!isLoading) return null;

    const getLoaderVariantClass = () => {
        switch (variant) {
            case 'orbit': return 'loader-orbit';
            case 'wave': return 'loader-wave';
            default: return 'loader-pulse';
        }
    };

    return (
        <div className={`loader-wrapper loader-${variant}`}>
            {/* Abstract Background Pattern */}
            <div className="loader-backdrop">
                <div className="backdrop-particles">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Container */}
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

                {/* Progress Circle */}
                {/*<div className="progress-circle">*/}
                {/*    <svg className="progress-svg" width="180" height="180">*/}
                {/*        <defs>*/}
                {/*            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">*/}
                {/*                <stop offset="0%" stopColor="#00c6fb">*/}
                {/*                    <animate attributeName="stop-color" values="#00c6fb;#005bea;#00c6fb" dur="4s" repeatCount="indefinite" />*/}
                {/*                </stop>*/}
                {/*                <stop offset="100%" stopColor="#005bea">*/}
                {/*                    <animate attributeName="stop-color" values="#005bea;#00c6fb;#005bea" dur="4s" repeatCount="indefinite" />*/}
                {/*                </stop>*/}
                {/*            </linearGradient>*/}
                {/*            <filter id="glow">*/}
                {/*                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>*/}
                {/*                <feMerge>*/}
                {/*                    <feMergeNode in="coloredBlur"/>*/}
                {/*                    <feMergeNode in="SourceGraphic"/>*/}
                {/*                </feMerge>*/}
                {/*            </filter>*/}
                {/*        </defs>*/}

                {/*        /!* Background Circle *!/*/}
                {/*        <circle*/}
                {/*            className="progress-bg"*/}
                {/*            cx="90"*/}
                {/*            cy="90"*/}
                {/*            r="82"*/}
                {/*            fill="none"*/}
                {/*            stroke="rgba(255,255,255,0.08)"*/}
                {/*            strokeWidth="4"*/}
                {/*        />*/}

                {/*        /!* Progress Circle *!/*/}
                {/*        <circle*/}
                {/*            className="progress-fill"*/}
                {/*            cx="90"*/}
                {/*            cy="90"*/}
                {/*            r="82"*/}
                {/*            fill="none"*/}
                {/*            stroke="url(#progressGradient)"*/}
                {/*            strokeWidth="6"*/}
                {/*            strokeLinecap="round"*/}
                {/*            strokeDasharray={`${2 * Math.PI * 82}`}*/}
                {/*            strokeDashoffset={`${2 * Math.PI * 82 * (1 - progress / 100)}`}*/}
                {/*            filter="url(#glow)"*/}
                {/*            style={{ transition: 'stroke-dashoffset 0.5s ease' }}*/}
                {/*        />*/}
                {/*    </svg>*/}

                {/*    /!* Progress Text *!/*/}
                {/*    <div className="progress-display">*/}
                {/*        <span className="progress-number">{Math.round(progress)}</span>*/}
                {/*        <span className="progress-symbol">%</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

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

                {/* Progress Segments */}
                {/*<div className="progress-segments">*/}
                {/*    {[...Array(5)].map((_, i) => (*/}
                {/*        <div key={i} className="segment-container">*/}
                {/*            <div className="segment-track">*/}
                {/*                <div*/}
                {/*                    className="segment-fill"*/}
                {/*                    style={{*/}
                {/*                        width: `${Math.min(100, Math.max(0, progress - i * 20))}%`*/}
                {/*                    }}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <span className="segment-label">Phase {i + 1}</span>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}

                {/* Status Indicator */}
                {/*<div className="status-indicator">*/}
                {/*    <div className="status-dot"></div>*/}
                {/*    <span className="status-text">*/}
                {/*        {progress < 30 && 'Initializing...'}*/}
                {/*        {progress >= 30 && progress < 60 && 'Processing...'}*/}
                {/*        {progress >= 60 && progress < 90 && 'Finalizing...'}*/}
                {/*        {progress >= 90 && 'Almost there...'}*/}
                {/*    </span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};