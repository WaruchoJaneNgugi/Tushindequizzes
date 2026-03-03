import { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/carousel.css';
import bibleQuizBanner from '../../assests/banners/BibleQuiz-banner.png';
import chemshabongo from '../../assests/banners/ChemshaBongo-banner.png';
import checkers from '../../assests/banners/checkers-banner.png';
import chessbanner from '../../assests/banners/chess-banner.png';
import { useGameClick } from "../../hooks/useGameClick.ts";

interface Tag {
    label: string;
    type: 'trending' | 'hot' | 'new' | 'trivia' | 'featured' | 'strategy' | 'classic' | 'multiplayer';
}

interface Slide {
    id: number;
    gameId: string;
    title: string;
    subtitle?: string;
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

    const { handleGameClick } = useGameClick();
    const minSwipeDistance = 50;

    const slides: Slide[] = [
        {
            id: 1,
            gameId: "bible-quiz",
            title: "Bible Quiz",
            subtitle: "Test Your Scripture Knowledge",
            image: bibleQuizBanner,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                { label: "NEW", type: "new" },
                { label: "TRIVIA", type: "trivia" }
            ],
            ctaText: "Play Now"
        },
        {
            id: 2,
            gameId: "chemsha-bongo",
            title: "Chemsha Bongo",
            subtitle: "Brain Teaser Challenge",
            image: chemshabongo,
            points: "EARN UP TO 1000 POINTS!",
            tags: [
                { label: "TRENDING", type: "trending" },
                { label: "HOT", type: "hot" }
            ],
            ctaText: "Play Now"
        },
        {
            id: 3,
            gameId: "chess",
            title: "Chess Master",
            subtitle: "Classic Strategy Game",
            image: chessbanner,
            points: "EARN UP TO 1500 POINTS!",
            tags: [
                { label: "STRATEGY", type: "strategy" },
                { label: "FEATURED", type: "featured" },
            ],
            ctaText: "Play Chess"
        },
        {
            id: 4,
            gameId: "checkers",
            title: "Checkers",
            subtitle: "Jump & Capture",
            image: checkers,
            points: "EARN UP TO 800 POINTS!",
            tags: [
                { label: "CLASSIC", type: "classic" },
                { label: "STRATEGY", type: "strategy" },
            ],
            ctaText: "Play Checkers"
        }
    ];

    const handleGameButtonClick = (gameId: string) => {
        const gameData = slides.find(s => s.gameId === gameId);
        handleGameClick(gameId, gameData as any);
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

    const handleImageLoad = (imageUrl: string) => {
        setLoadedImages(prev => ({ ...prev, [imageUrl]: true }));
    };

    const getTagClassName = (type: string) => {
        switch (type) {
            case 'trending': return 'tag-trending';
            case 'hot': return 'tag-hot';
            case 'new': return 'tag-new';
            case 'trivia': return 'tag-trivia';
            case 'featured': return 'tag-featured';
            case 'strategy': return 'tag-strategy';
            case 'classic': return 'tag-classic';
            default: return '';
        }
    };

    return (
        <div className="hero-slider">
            <div className="hero-slider-container">
                <div className="slider-main-wrapper">
                    {/* Slides */}
                    <div
                        ref={sliderRef}
                        className="slider-track"
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {slides.map((slide, index) => (
                            <div key={slide.id} className="slide">
                                {/* Image Side */}
                                <div className="slide-image-wrapper">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className={`slide-image ${loadedImages[slide.image] ? 'loaded' : 'loading'}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        onLoad={() => handleImageLoad(slide.image)}
                                    />
                                    <div className="slide-image-overlay" />
                                </div>

                                {/* Content Side */}
                                <div className="slide-content">
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
                                    {/*    <p className="slide-subtitle">{slide.subtitle}</p>*/}
                                    {/*)}*/}

                                    <div className="slide-points">
                                        {/*<span className="points-icon">🏆</span>*/}
                                        {/*<span className="points-text">{slide.points}</span>*/}
                                    </div>

                                    <button
                                        className="slide-cta"
                                        onClick={() => handleGameButtonClick(slide.gameId)}
                                    >
                                        <span>{slide.ctaText}</span>
                                        <span className="cta-arrow"> </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        className="slider-nav nav-prev"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        className="slider-nav nav-next"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="slider-indicators">
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