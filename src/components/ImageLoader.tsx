// components/ImageLoader.tsx
import { type FC } from 'react';
import '../styles/imageLoader.css';

interface ImageLoaderProps {
    isLoading: boolean;
    progress?: number;
    title?: string;
    subtitle?: string;
}

export const ImageLoader: FC<ImageLoaderProps> = ({
                                                      isLoading,
                                                      progress = 0,
                                                      title = "Loading...",
                                                      subtitle = "Please wait while we prepare your content"                                                  }) => {
    // const [elapsedTime, setElapsedTime] = useState(0);
    //
    // useEffect(() => {
    //     if (!isLoading) return;
    //
    //     const interval = setInterval(() => {
    //         setElapsedTime(prev => prev + 1);
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, [isLoading]);

    if (!isLoading) return null;

    // const formatTime = (seconds: number) => {
    //     if (seconds < 60) return `${seconds}s`;
    //     return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    // };

    return (
        <div className={`loader-modern loader-dark`}>
            <div className="loader-grid">
                {/* Animated Grid Background */}
                <div className="grid-background">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="grid-line horizontal" style={{ top: `${i * 5}%` }}></div>
                    ))}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="grid-line vertical" style={{ left: `${i * 5}%` }}></div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="loader-card">
                    {/* Progress Ring */}
                    <div className="progress-ring-container">
                        <svg className="progress-ring" width="140" height="140">
                            <circle
                                className="progress-ring-bg"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="3"
                                fill="transparent"
                                r="62"
                                cx="70"
                                cy="70"
                            />
                            <circle
                                className="progress-ring-fill"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                fill="transparent"
                                r="62"
                                cx="70"
                                cy="70"
                                style={{
                                    strokeDasharray: `${2 * Math.PI * 62}`,
                                    strokeDashoffset: `${2 * Math.PI * 62 * (1 - progress / 100)}`
                                }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4776E6" />
                                    <stop offset="100%" stopColor="#8E54E9" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="progress-ring-content">
                            {/*{showPercentage ? (*/}
                            {/*    <>*/}
                                    <span className="progress-value">{Math.round(progress)}</span>
                                    <span className="progress-unit">%</span>
                                {/*</>*/}
                            {/*) : (*/}
                            {/*    <div className="progress-dots">*/}
                            {/*        <span></span><span></span><span></span>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="loader-text">
                        <h3 className="loader-title">{title}</h3>
                        <p className="loader-subtitle">{subtitle}</p>
                    </div>

                    {/* Progress Stats */}
                    {/*<div className="loader-stats">*/}
                    {/*    <div className="stat">*/}
                    {/*        <span className="stat-label">Elapsed</span>*/}
                    {/*        <span className="stat-value">{formatTime(elapsedTime)}</span>*/}
                    {/*    </div>*/}
                    {/*    <div className="stat-divider"></div>*/}
                    {/*    <div className="stat">*/}
                    {/*        <span className="stat-label">Estimated</span>*/}
                    {/*        <span className="stat-value">{estimatedTime}</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Progress Bar */}
                    {/*<div className="progress-bar-container">*/}
                    {/*    <div className="progress-bar-track">*/}
                    {/*        <div*/}
                    {/*            className="progress-bar-fill"*/}
                    {/*            style={{ width: `${progress}%` }}*/}
                    {/*        >*/}
                    {/*            <div className="progress-bar-glow"></div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Loading Details */}
                    <div className="loading-details">
                        <span className="detail-item">Initializing</span>
                        <span className="detail-dot">•</span>
                        <span className="detail-item">Loading assets</span>
                        <span className="detail-dot">•</span>
                        <span className="detail-item">Processing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};