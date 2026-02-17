// HeroSlider.tsx
import {useState, useEffect, useRef, useCallback} from 'react';
// import '../../styles/hero.css';
import '../../styles/carousel.css'
// Import the new carousel styles
import '../../styles/carousel.css';
import bibleQuizBanner from '../../assests/banners/BibleQuiz-banner.png';
import wordQuest from '../../assests/banners/WordQuest-banner.png';
import mathquiz from '../../assests/banners/MathQuiz-banner.png';
import chemshabongo from '../../assests/banners/ChemshaBongo-banner.png';
import {useGameClick} from "../../hooks/useGameClick.ts";

interface Tag {
    label: string;
    type: 'trending' | 'hot' | 'new' | 'trivia' | 'featured';
}

interface Slide {
    id: number;
    gameId: string;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    tags: Tag[];
    points: string;
    ctaText?: string;
}

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {handleGameClick} = useGameClick();

    const minSwipeDistance = 50;

    const slides: Slide[] = [
        {
            id: 1,
            gameId: "chemsha-bongo",
            title: "Chemsha Bongo",
            subtitle: "Brain Teaser Challenge",
            description: "Test your wits with our most popular brain teasers",
            image: chemshabongo,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                {label: "TRENDING", type: "trending"},
                {label: "HOT", type: "hot"}
            ],
            ctaText: "Play Now"
        },
        {
            id: 2,
            gameId: "bible-quiz",
            title: "Bible Quiz",
            subtitle: "Test Your Scripture Knowledge",
            description: "Challenge yourself with questions from the Bible",
            image: bibleQuizBanner,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                {label: "NEW", type: "new"},
                {label: "TRIVIA", type: "trivia"}
            ],
            ctaText: "Play Now"
        },
        {
            id: 3,
            gameId: "word-quest",
            title: "Word Quest",
            subtitle: "Vocabulary Adventure",
            description: "Expand your vocabulary while having fun",
            image: wordQuest,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                {label: "FEATURED", type: "featured"},
                {label: "TRIVIA", type: "trivia"}
            ],
            ctaText: "Play Now"
        },
        {
            id: 4,
            gameId: "math-quiz",
            title: "Math Quiz",
            subtitle: "Numbers & Logic",
            description: "Sharpen your math skills with exciting challenges",
            image: mathquiz,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                {label: "HOT", type: "hot"},
                {label: "TRIVIA", type: "trivia"}
            ],
            ctaText: "Play Now"
        },
    ];

    const handleGameButtonClick = (gameId: string): void => {
        handleGameClick(gameId);
    };

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning, slides.length]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning, slides.length]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!isHovering) {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovering, nextSlide]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!isHovering) {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentSlide, isHovering, nextSlide]);

    const handleImageLoad = (imageUrl: string) => {
        setLoadedImages(prev => ({...prev, [imageUrl]: true}));
    };

    const getTagClassName = (type: string) => {
        switch (type) {
            case 'trending':
                return 'tag-trending';
            case 'hot':
                return 'tag-hot';
            case 'new':
                return 'tag-new';
            case 'trivia':
                return 'tag-trivia';
            case 'featured':
                return 'tag-featured';
            default:
                return '';
        }
    };

    return (
        // Add the parallax-layout class here
        <div className="hero-slider-section parallax-layout">
            <div className="hero-slider-container">
                <div className="slider-wrapper">
                    <div
                        ref={sliderRef}
                        className="slider-track"
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {slides.map((slide, index) => (
                            <div key={slide.id} className="slide-item">
                                <div className="slide-image-side"
                                     onClick={() => handleGameButtonClick(slide.gameId)}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className={`slide-image ${loadedImages[slide.image] ? 'loaded' : 'loading'}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        onLoad={() => handleImageLoad(slide.image)}
                                    />
                                </div>

                                <div className="slide-content-side">
                                    <div className="slide-tags">
                                        {slide.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className={`slide-tag ${getTagClassName(tag.type)}`}
                                            >
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="slide-title">{slide.title}</h2>
                                    {/*{slide.subtitle && (*/}
                                    {/*    <h3 className="slide-subtitle">{slide.subtitle}</h3>*/}
                                    {/*)}*/}

                                    {/*/!* Add description for the parallax layout *!/*/}
                                    {/*{slide.description && (*/}
                                    {/*    <p className="slide-description">{slide.description}</p>*/}
                                    {/*)}*/}

                                    {/* Points badge - optional for parallax layout */}
                                    <div className="slide-points-badge">
                                        {/*<span className="points-icon">🏆</span>*/}
                                        <span className="points-text">{slide.points}</span>
                                    </div>

                                    <div className="playbtn-container">
                                        <div
                                            className="slide-cta-button"
                                            onClick={() => handleGameButtonClick(slide.gameId)}
                                        >
                                            <span>{slide.ctaText || "Play Now"}</span>
                                            <span className="button-arrow">→</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="slide-decoration">
                                    <div className="decoration-circle"></div>
                                    <div className="decoration-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="slider-nav nav-prev"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <button
                        className="slider-nav nav-next"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="slide-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => {
                                    if (!isTransitioning) {
                                        setIsTransitioning(true);
                                        setCurrentSlide(index);
                                        setTimeout(() => setIsTransitioning(false), 500);
                                    }
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;