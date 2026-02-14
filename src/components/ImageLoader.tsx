// components/ImageLoader.tsx
import { type FC } from 'react';
import '../styles/imageLoader.css';

// interface LoadingStep {
//     id: number;
//     label: string;
//     description: string;
//     status: 'pending' | 'active' | 'completed';
// }

interface ImageLoaderProps {
    isLoading: boolean;
    progress?: number;
    title?: string;
    subtitle?: string;
    loadingMessage?: string;
    onCancel?: () => void;
    showSteps?: boolean;
}

export const ImageLoader: FC<ImageLoaderProps> = ({
                                                      isLoading,
                                                      progress = 0,
                                                      title = "Loading Content",
                                                      subtitle = "Please wait while we prepare your experience",
                                                      // loadingMessage = "Optimizing assets for the best performance...",
                                                      // onCancel,
                                                      // showSteps = true
                                                  }) => {
    // const [steps, setSteps] = useState<LoadingStep[]>([
    //     { id: 1, label: "Initializing", description: "Setting up environment", status: 'active' },
    //     { id: 2, label: "Loading Assets", description: "Fetching images and media", status: 'pending' },
    //     { id: 3, label: "Processing", description: "Optimizing content", status: 'pending' },
    //     { id: 4, label: "Finalizing", description: "Completing setup", status: 'pending' },
    // ]);

    // useEffect(() => {
    //     if (!isLoading) return;
    //
    //     // const updateSteps = () => {
    //     //     setSteps(prev => {
    //     //         const newSteps = [...prev];
    //     //
    //     //         // Update steps based on progress
    //     //         if (progress >= 25) {
    //     //             newSteps[0].status = 'completed';
    //     //             newSteps[1].status = 'active';
    //     //         }
    //     //         if (progress >= 50) {
    //     //             newSteps[1].status = 'completed';
    //     //             newSteps[2].status = 'active';
    //     //         }
    //     //         if (progress >= 75) {
    //     //             newSteps[2].status = 'completed';
    //     //             newSteps[3].status = 'active';
    //     //         }
    //     //         if (progress >= 100) {
    //     //             newSteps[3].status = 'completed';
    //     //         }
    //     //
    //     //         return newSteps;
    //     //     });
    //     // };
    //
    //     updateSteps();
    // }, [progress, isLoading]);

    if (!isLoading) return null;

    return (
        <div className="image-loader-overlay">
            <div className="image-loader-content">
                <div className="loader-header">
                    <div className="loader-icon">⏳</div>
                    <h2 className="loader-title">{title}</h2>
                    <p className="loader-subtitle">{subtitle}</p>
                </div>

                <div className="loader-animation">
                    <div className="spinner-container-loader">
                        <div className="neo-spinner">
                            <div className="neo-spinner-inner"></div>
                        </div>
                    </div>

                    <div className="progress-container-loader">
                        <div className="progress-bar-loader">
                            <div
                                className="progress-fill-loader"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="progress-text-loader">
                            <span>Loading</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                </div>

                {/*{showSteps && (*/}
                {/*    <div className="loading-steps">*/}
                {/*        {steps.map((step) => (*/}
                {/*            <div*/}
                {/*                key={step.id}*/}
                {/*                className={`step ${step.status}`}*/}
                {/*            >*/}
                {/*                <div className="step-icon">*/}
                {/*                    {step.status === 'completed' ? '✓' : step.id}*/}
                {/*                </div>*/}
                {/*                <div className="step-text">*/}
                {/*                    <div className="step-label">{step.label}</div>*/}
                {/*                    <div className="step-description">{step.description}</div>*/}
                {/*                </div>*/}
                {/*                <div className="step-status">*/}
                {/*                    {step.status === 'active' && '⌛'}*/}
                {/*                    {step.status === 'completed' && '✓'}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*)}*/}

                {/*<div className="loader-footer">*/}
                {/*    <p className="loader-message">{loadingMessage}</p>*/}
                {/*    {onCancel && progress < 100 && (*/}
                {/*        <button*/}
                {/*            className="btn-cancel"*/}
                {/*            onClick={onCancel}*/}
                {/*            style={{*/}
                {/*                marginTop: '15px',*/}
                {/*                background: 'rgba(255, 107, 107, 0.1)',*/}
                {/*                border: '1px solid rgba(255, 107, 107, 0.3)',*/}
                {/*                color: '#ff6b6b',*/}
                {/*                padding: '8px 20px',*/}
                {/*                borderRadius: '8px',*/}
                {/*                cursor: 'pointer',*/}
                {/*                fontWeight: '500',*/}
                {/*                fontSize: '0.9rem',*/}
                {/*                transition: 'all 0.3s ease'*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            Cancel Loading*/}
                {/*        </button>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </div>
    );
};