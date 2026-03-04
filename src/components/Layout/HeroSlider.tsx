import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
    description?: string;
    image: string;
    tags: Tag[];
    points: string;
    ctaText?: string;
    accentColor: string;
    glowColor: string;
    gradientFrom: string;
    gradientTo: string;
}

// Generate deterministic particle positions
const generateParticlePositions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        // Use index to create deterministic but varied values
        left: `${(i * 17) % 100}%`, // 17 is prime to create variation
        top: `${(i * 23) % 100}%`, // 23 is prime for different pattern
        animationDelay: `${(i * 0.25) % 5}s`,
        animationDuration: `${3 + ((i * 0.35) % 7)}s`
    }));
};

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [glitchActive, setGlitchActive] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sliderRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { handleGameClick } = useGameClick();
    const minSwipeDistance = 50;

    // Memoize particle positions to prevent recalculation on re-renders
    const particlePositions = useMemo(() => generateParticlePositions(20), []);

    const slides: Slide[] = [
        {
            id: 1,
            gameId: "bible-quiz",
            title: "Bible Quiz",
            subtitle: "Test Your Scripture Knowledge",
            description: "Challenge yourself with hundreds of biblical questions",
            image: bibleQuizBanner,
            points: "WIN UP TO 1000 POINTS!",
            accentColor: "#00f5d4",
            glowColor: "rgba(0,245,212,0.5)",
            gradientFrom: "#00f5d4",
            gradientTo: "#00d4ff",
            tags: [{ label: "NEW", type: "new" }, { label: "TRIVIA", type: "trivia" }],
            ctaText: "Play Now"
        },
        {
            id: 2,
            gameId: "chemsha-bongo",
            title: "Chemsha Bongo",
            subtitle: "Brain Teaser Challenge",
            description: "Solve puzzles and boost your IQ",
            image: chemshabongo,
            points: "WIN UP TO 1000 POINTS!",
            accentColor: "#ff3cac",
            glowColor: "rgba(255,60,172,0.5)",
            gradientFrom: "#ff3cac",
            gradientTo: "#ff6b8b",
            tags: [{ label: "TRENDING", type: "trending" }, { label: "HOT", type: "hot" }],
            ctaText: "Play Now"
        },
        {
            id: 3,
            gameId: "chess",
            title: "Chess Master",
            subtitle: "Classic Strategy Game",
            description: "Outsmart opponents in ultimate strategy",
            image: chessbanner,
            points: "WIN UP TO 1500 POINTS!",
            accentColor: "#f5a623",
            glowColor: "rgba(245,166,35,0.5)",
            gradientFrom: "#f5a623",
            gradientTo: "#f7b731",
            tags: [{ label: "STRATEGY", type: "strategy" }, { label: "FEATURED", type: "featured" }],
            ctaText: "Play Chess"
        },
        {
            id: 4,
            gameId: "checkers",
            title: "Checkers",
            subtitle: "Jump & Capture",
            description: "Classic board game for all ages",
            image: checkers,
            points: "WIN UP TO 800 POINTS!",
            accentColor: "#7b2fff",
            glowColor: "rgba(123,47,255,0.5)",
            gradientFrom: "#7b2fff",
            gradientTo: "#9f7aff",
            tags: [{ label: "CLASSIC", type: "classic" }, { label: "MULTIPLAYER", type: "multiplayer" }],
            ctaText: "Play Checkers"
        }
    ];

    const triggerGlitch = useCallback(() => {
        // Clear any existing glitch timeout
        if (glitchTimeoutRef.current) {
            clearTimeout(glitchTimeoutRef.current);
        }

        setGlitchActive(true);

        glitchTimeoutRef.current = setTimeout(() => {
            setGlitchActive(false);
            glitchTimeoutRef.current = null;
        }, 380);
    }, []);

    // Clean up glitch timeout on unmount
    useEffect(() => {
        return () => {
            if (glitchTimeoutRef.current) {
                clearTimeout(glitchTimeoutRef.current);
            }
        };
    }, []);

    const handleGameButtonClick = (gameId: string) => {
        const gameData = slides.find(s => s.gameId === gameId);
        handleGameClick(gameId, gameData as any);
    };

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || index === currentSlide) return;
        triggerGlitch();
        setIsTransitioning(true);
        setCurrentSlide(index);

        // Reset progress animation
        if (progressRef.current) {
            progressRef.current.style.animation = 'none';
            // Force reflow
            void progressRef.current.offsetHeight;
            progressRef.current.style.animation = 'hs-progress 5s linear forwards';
        }

        setTimeout(() => setIsTransitioning(false), 700);
    }, [currentSlide, isTransitioning, triggerGlitch]);

    const nextSlide = useCallback(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, [currentSlide, slides.length, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }, [currentSlide, slides.length, goToSlide]);

    // Touch handlers
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
        if (distance > minSwipeDistance) nextSlide();
        else if (distance < -minSwipeDistance) prevSlide();
    };

    // Mouse move effect for parallax
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setMousePosition({ x, y });
    };

    // Auto-advance slides
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!isHovering) intervalRef.current = setInterval(nextSlide, 5000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovering, nextSlide]);

    const handleImageLoad = (url: string) =>
        setLoadedImages(prev => ({ ...prev, [url]: true }));

    const getTagClass = (type: string) => {
        const classes = {
            trending: 'tag-trending',
            hot: 'tag-hot',
            new: 'tag-new',
            trivia: 'tag-trivia',
            featured: 'tag-featured',
            strategy: 'tag-strategy',
            classic: 'tag-classic',
            multiplayer: 'tag-multiplayer'
        };
        return classes[type as keyof typeof classes] ?? '';
    };

    const active = slides[currentSlide];

    return (
        <div
            className="hs-root"
            style={{
                '--accent': active.accentColor,
                '--glow': active.glowColor,
                '--gradient-from': active.gradientFrom,
                '--gradient-to': active.gradientTo
            } as React.CSSProperties}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Animated background particles - using deterministic positions */}
            <div className="hs-particles">
                {particlePositions.map((pos, i) => (
                    <div
                        key={i}
                        className="hs-particle"
                        style={{
                            left: pos.left,
                            top: pos.top,
                            animationDelay: pos.animationDelay,
                            animationDuration: pos.animationDuration
                        }}
                    />
                ))}
            </div>

            {/* Main slider container */}
            <div
                className={`hs-stage ${glitchActive ? 'hs-glitch' : ''}`}
                ref={sliderRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseMove={handleMouseMove}
            >
                {/* Background layers with parallax effect */}
                {slides.map((slide, i) => (
                    <div
                        key={slide.id}
                        className={`hs-bg-layer ${i === currentSlide ? 'hs-bg-active' : ''}`}
                        style={{
                            transform: i === currentSlide
                                ? `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
                                : 'none'
                        }}
                    >
                        <img
                            src={slide.image}
                            alt=""
                            aria-hidden="true"
                            className={`hs-bg-img ${loadedImages[slide.image] ? 'loaded' : ''}`}
                            onLoad={() => handleImageLoad(slide.image)}
                            // loading={i === 0 ? 'eager' : 'lazy'}
                        />
                        <div className="hs-bg-overlay" />
                        <div className="hs-bg-blend" />
                        <div className="hs-bg-soft-edge" />
                        <div className="hs-bg-gradient" />
                    </div>
                ))}

                {/* Dynamic scanlines */}
                <div className="hs-scanlines" />
                <div className="hs-grid" />

                {/* Corner accents */}
                <div className="hs-corner hs-corner-tl" />
                <div className="hs-corner hs-corner-tr" />
                <div className="hs-corner hs-corner-bl" />
                <div className="hs-corner hs-corner-br" />

                {/* Slide counter with animation */}
                <div className="hs-counter">
                    <span className="hs-counter-current">
                        {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <span className="hs-counter-sep">/</span>
                    <span className="hs-counter-total">
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>

                {/* Content section */}
                <div className={`hs-content ${isTransitioning ? 'hs-content-exit' : 'hs-content-enter'}`}>
                    <div className="hs-tags">
                        {active.tags.map((tag, i) => (
                            <span
                                key={i}
                                className={`hs-tag ${getTagClass(tag.type)}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    <h2 className="hs-title">
                        {active.title}
                        <span className="hs-title-glow">{active.title}</span>
                    </h2>

                    {active.subtitle && (
                        <p className="hs-subtitle">{active.subtitle}</p>
                    )}

                    <p className="hs-description">{active.description}</p>

                    <div className="hs-points-badge">
                        <span className="hs-points-icon">⚡</span>
                        {active.points}
                    </div>

                    <button
                        className="hs-cta"
                        onClick={() => handleGameButtonClick(active.gameId)}
                    >
                        <span className="hs-cta-bg" />
                        <span className="hs-cta-label">{active.ctaText}</span>
                        <svg className="hs-cta-arrow" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Thumbnail navigation */}
                <div className="hs-thumbs">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.id}
                            className={`hs-thumb ${i === currentSlide ? 'hs-thumb-active' : ''}`}
                            onClick={() => goToSlide(i)}
                            aria-label={`Go to ${slide.title}`}
                        >
                            <img src={slide.image} alt={slide.title} className="hs-thumb-img" loading="lazy" />
                            <div className="hs-thumb-overlay" />
                            <div className="hs-thumb-border" />
                            <div className="hs-thumb-progress" />
                        </button>
                    ))}
                </div>

                {/* Progress bar */}
                <div
                    ref={progressRef}
                    className={`hs-progress ${isHovering ? 'hs-progress-paused' : ''}`}
                />

                {/* Navigation arrows */}
                <button
                    className="hs-nav hs-nav-prev"
                    onClick={prevSlide}
                    aria-label="Previous"
                >
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <button
                    className="hs-nav hs-nav-next"
                    onClick={nextSlide}
                    aria-label="Next"
                >
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Slide indicators (dots) */}
                <div className="hs-indicators">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`hs-indicator ${i === currentSlide ? 'hs-indicator-active' : ''}`}
                            onClick={() => goToSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <span className="hs-indicator-inner" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;