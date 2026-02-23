import type {LevelConfig} from "../types/checkers.types.ts";

import type {Difficulty} from "../types/checkers.types.ts";
import {useMediaQuery} from "../hooks/useMediaquery.ts";
import {LevelCard} from "./LevelCard.tsx";
import {LEVELS} from "../hooks/useCheckers.ts";

interface MenuScreenProps {
    points:  number
    onStart: (lvl: Difficulty) => void
}

export const  MenuScreen=({ points, onStart }: MenuScreenProps)=> {
    const isMobile = useMediaQuery('(max-width: 600px)')

    return (
        <div className="checkers-container">
            <div className="ambient-glow" />

            <h1 className={`title-main ${isMobile ? 'mobile' : ''}`}>
                CHECKERS ARENA
            </h1>

            <div className={`subtitle-checkers ${isMobile ? 'mobile' : ''}`}>
                WAGER · PLAY · CONQUER
            </div>

            {/* Balance card */}
            <div className={`balance-card ${isMobile ? 'mobile' : ''}`}>
                <div className={`balance-label ${isMobile ? 'mobile' : ''}`}>
                    YOUR BALANCE
                </div>
                <div className={`balance-value-checkers ${isMobile ? 'mobile' : ''}`}>
                    {points}
                </div>
                <div className={`balance-unit ${isMobile ? 'mobile' : ''}`}>POINTS</div>
            </div>

            {/* Level grid */}
            <div className={`level-grid`}>
                {(Object.entries(LEVELS) as [Difficulty, LevelConfig][]).map(([k, lvl]) => (
                    <LevelCard
                        key={k}
                        lvlKey={k}
                        lvl={lvl}
                        canPlay={points > lvl.cost}
                        onClick={onStart}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            <div className={`footer-note ${isMobile ? 'mobile' : ''}`}>
                YOU = <span className="red">● RED</span>
                &nbsp;·&nbsp;
                AI = <span className="black">● BLACK</span>
            </div>
        </div>
    )
}
