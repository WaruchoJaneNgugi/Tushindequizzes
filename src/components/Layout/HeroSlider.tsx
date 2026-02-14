// HeroSlider.tsx
import {useState, useEffect, useRef} from 'react';
import '../../styles/hero.css';

// Import your images
import bibleQuizBanner from '../../assests/banners/BibleQuiz-banner.png';
import wordQuest from '../../assests/banners/WordQuest-banner.png';
import mathquiz from '../../assests/banners/MathQuiz-banner.png';
import chemshabongo from '../../assests/banners/ChemshaBongo-banner.png';
import {useGameClick} from "../../hooks/useGameClick.ts";

// Define Slide type with tags
interface Tag {
    label: string;
    type: 'trending' | 'hot' | 'new' | 'trivia' | 'featured';
}

interface Slide {
    id: number;
    gameId: string;
    title: string;
    subtitle?: string;
    image: string;
    tags: Tag[];
    gradientOverlay: string;
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

    // Minimum swipe distance
    const minSwipeDistance = 50;

    const slides: Slide[] = [
        {
            id: 1,
            gameId: "chemsha-bongo",
            title: "Chemsha Bongo",
            subtitle: "Brain Teaser Challenge",
            image: chemshabongo,
            tags: [
                {label: "TRENDING", type: "trending"},
                {label: "HOT", type: "hot"}
            ],
            gradientOverlay: "transaprent"
        },
        {
            id: 2,
            gameId: "bible-quiz",
            title: "Bible Quiz",
            subtitle: "Test Your Scripture Knowledge",
            image: bibleQuizBanner,
            tags: [
                {label: "NEW", type: "new"},
                {label: "TRIVIA", type: "trivia"}
            ],
            gradientOverlay: "transaprent"
        },
        {
            id: 3,
            gameId: "word-quest",
            title: "Word Quest",
            subtitle: "Vocabulary Adventure",
            image: wordQuest,
            tags: [
                {label: "FEATURED", type: "featured"},
                {label: "TRIVIA", type: "trivia"}
            ],
            gradientOverlay: "transaprent"
        },
        {
            id: 4,
            gameId: "math-quiz",
            title: "Math Quiz",
            subtitle: "Numbers & Logic",
            image: mathquiz,
            tags: [
                {label: "HOT", type: "hot"},
                {label: "TRIVIA", type: "trivia"}
            ],
            gradientOverlay: "transaprent"
        },
    ];

    const handleGameButtonClick = (gameId: string): void => {
        handleGameClick(gameId);
    };

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Touch handlers for mobile swipe
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
        if (isHovering) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 4000);

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
        <div className="hero-slider-div">
            <div className="hero-slider-container">
                {/* Progress Bar */}
                {/*<div className="slider-progress">*/}
                {/*    {slides.map((_, index) => (*/}
                {/*        <div*/}
                {/*            key={index}*/}
                {/*            className={`progress-bar ${index === currentSlide ? 'active' : ''}`}*/}
                {/*            style={{*/}
                {/*                width: `${100 / slides.length}%`,*/}
                {/*                transition: 'all 0.3s ease'*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}

                {/* Main Slider */}
                <div className="slider-wrapper">
                    <div
                        ref={sliderRef}
                        className="slider-track"
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                            transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="slide-item"
                            >
                                <div className="slide-background">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className={`slide-image ${loadedImages[slide.image] ? 'loaded' : 'loading'}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        onLoad={() => handleImageLoad(slide.image)}
                                    />
                                    <div
                                        className="slide-overlay"
                                        style={{background: slide.gradientOverlay}}
                                        onClick={() => handleGameButtonClick(slide.gameId)}

                                    />
                                </div>

                                <div className="slide-content">
                                    {/* Tags */}
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

                                     {/*Title and Subtitle*/}
                                    <h2 className="slide-title">{slide.title}</h2>
                                    {slide.subtitle && (
                                        <p className="slide-subtitle">{slide.subtitle}</p>
                                    )}

                                    {/* Play Button */}

                                </div>

                                {/* Decorative Elements */}
                                <div className="slide-decoration">
                                    <div className="decoration-circle"></div>
                                    <div className="decoration-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {/*<button*/}
                    {/*    className="slider-nav nav-prev"*/}
                    {/*    onClick={prevSlide}*/}
                    {/*    aria-label="Previous slide"*/}
                    {/*>*/}
                    {/*    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">*/}
                    {/*        <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}

                    {/*<button*/}
                    {/*    className="slider-nav nav-next"*/}
                    {/*    onClick={nextSlide}*/}
                    {/*    aria-label="Next slide"*/}
                    {/*>*/}
                    {/*    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">*/}
                    {/*        <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}

                    {/* Slide Indicators */}
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