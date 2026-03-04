// components/ImageLoader.tsx
import { type FC, useEffect, useState } from 'react';
import '../styles/imageLoader.css';

interface ImageLoaderProps {
    isLoading: boolean;
    progress?: number;
    title?: string;
    subtitle?: string;
    loadingMessage?: string;
    // onCancel?: () => void;
    // showSteps?: boolean;
    variant?: 'default' | 'minimal' | 'cyber';
}

export const ImageLoader: FC<ImageLoaderProps> = ({
                                                      isLoading,
                                                      progress = 0,
                                                      title = "Loading Experience",
                                                      subtitle = "Preparing something amazing for you",
                                                      loadingMessage = "Crafting pixels with precision...",
                                                      // onCancel,
                                                      // showSteps = true,
                                                      variant = 'default'
                                                  }) => {
    const [dots, setDots] = useState('');

    // Animated loading dots
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    const getVariantClass = () => {
        switch(variant) {
            case 'minimal': return 'loader-minimal';
            case 'cyber': return 'loader-cyber';
            default: return 'loader-default';
        }
    };

    return (
        <div className={`image-loader-overlay ${getVariantClass()}`}>
            <div className="image-loader-content">
                {/* Animated Background Elements */}
                <div className="loader-bg-elements">
                    <div className="bg-circle circle-1"></div>
                    <div className="bg-circle circle-2"></div>
                    <div className="bg-grid"></div>
                </div>

                <div className="loader-content-inner">
                    {/* Header Section */}
                    <div className="loader-header">
                        <div className="loader-icon-wrapper">
                            <div className="loader-icon-glow"></div>
                            {/*<div className="loader-icon">✨</div>*/}
                        </div>
                        <h2 className="loader-title">
                            {title}
                            <span className="title-dots">{dots}</span>
                        </h2>
                        <p className="loader-subtitle">{subtitle}</p>
                    </div>

                    {/* Main Animation Section */}
                    <div className="loader-animation">
                        <div className="spinner-container-loader">
                            <div className="neo-spinner">
                                <div className="spinner-ring ring-outer"></div>
                                <div className="spinner-ring ring-middle"></div>
                                <div className="spinner-ring ring-inner"></div>
                                <div className="spinner-core">
                                    <div className="core-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="progress-container-loader">
                            <div className="progress-bar-loader">
                                <div
                                    className="progress-fill-loader"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="progress-glow"></div>
                                </div>
                            </div>
                            <div className="progress-stats">
                                <div className="progress-info">
                                    <span className="progress-label">Loading</span>
                                    <span className="progress-percentage">{progress}%</span>
                                </div>
                                <div className="progress-speed">
                                    <span className="speed-value">{(progress * 0.85).toFixed(1)}</span>
                                    <span className="speed-unit">MB/s</span>
                                </div>
                            </div>
                        </div>

                        {/* Loading Message */}
                        <div className="loading-message">
                            <span className="message-icon">|</span>
                            <p className="message-text">{loadingMessage}</p>
                        </div>
                    </div>

                    {/* Steps Section */}
                    {/*{showSteps && (*/}
                    {/*    <div className="loading-steps">*/}
                    {/*        <div className="steps-container">*/}
                    {/*            <div className="step-item active">*/}
                    {/*                <div className="step-marker">*/}
                    {/*                    <span className="step-number">1</span>*/}
                    {/*                    <div className="step-progress"></div>*/}
                    {/*                </div>*/}
                    {/*                <div className="step-content">*/}
                    {/*                    <h4>Initializing</h4>*/}
                    {/*                    <p>Setting up environment</p>*/}
                    {/*                </div>*/}
                    {/*                <div className="step-status">*/}
                    {/*                    <span className="status-badge">In Progress</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="step-item">*/}
                    {/*                <div className="step-marker">*/}
                    {/*                    <span className="step-number">2</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="step-content">*/}
                    {/*                    <h4>Loading Assets</h4>*/}
                    {/*                    <p>Fetching images and media</p>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="step-item">*/}
                    {/*                <div className="step-marker">*/}
                    {/*                    <span className="step-number">3</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="step-content">*/}
                    {/*                    <h4>Processing</h4>*/}
                    {/*                    <p>Optimizing content</p>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="step-item">*/}
                    {/*                <div className="step-marker">*/}
                    {/*                    <span className="step-number">4</span>*/}
                    {/*                </div>*/}
                    {/*                <div className="step-content">*/}
                    {/*                    <h4>Finalizing</h4>*/}
                    {/*                    <p>Completing setup</p>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* Footer Section */}
                    {/*<div className="loader-footer">*/}
                    {/*    {onCancel && progress < 100 && (*/}
                    {/*        <button*/}
                    {/*            className="btn-cancel"*/}
                    {/*            onClick={onCancel}*/}
                    {/*        >*/}
                    {/*            <span className="btn-icon">✕</span>*/}
                    {/*            <span className="btn-text">Cancel Loading</span>*/}
                    {/*        </button>*/}
                    {/*    )}*/}

                    {/*    <div className="footer-note">*/}
                    {/*        <span className="note-icon">🔒</span>*/}
                    {/*        <span className="note-text">Secure connection</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};