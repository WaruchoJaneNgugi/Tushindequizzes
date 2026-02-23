import type {Difficulty, LevelConfig} from "../types/checkers.types.ts";
import  {useState} from "react";


export function LevelCard({
                       lvlKey, lvl, canPlay, onClick, isMobile,
                   }: {
    lvlKey:  Difficulty
    lvl:     LevelConfig
    canPlay: boolean
    onClick: (k: Difficulty) => void
    isMobile: boolean
}) {
    const [hov, setHov] = useState(false)

    const borderClass = `border-${lvlKey} ${canPlay ? 'playable' : 'not-playable'}`
    const nameClass = `level-name ${lvlKey} ${isMobile ? 'mobile' : ''}`
    const dividerClass = `level-divider ${lvlKey}`

    return (
        <div
            onClick={() => canPlay && onClick(lvlKey)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onTouchStart={() => isMobile && setHov(true)}
            onTouchEnd={() => isMobile && setHov(false)}
            className={`level-card ${borderClass} ${isMobile ? 'mobile' : ''} ${!canPlay ? 'not-playable' : ''}`}
            style={{
                borderColor: canPlay && hov ? `${lvl.color}aa` : undefined,
                transform: hov && canPlay && !isMobile ? 'translateY(-3px)' : 'none',
                boxShadow: hov && canPlay && !isMobile ? `0 8px 30px ${lvl.color}22` : 'none',
            }}
        >
            <div className={nameClass} style={{ color: lvl.color }}>
                {lvl.label}
            </div>
            <div className={dividerClass} style={{ background: `linear-gradient(90deg,transparent,${lvl.color}44,transparent)` }} />
            <div className={`level-wager ${isMobile ? 'mobile' : ''}`}>
                Wager: <span>{lvl.cost} pt{lvl.cost > 1 ? 's' : ''}</span>
            </div>
            <div className={`level-reward ${isMobile ? 'mobile' : ''}`}>
                Win: <span>+{lvl.reward} pts</span>
            </div>
            {!canPlay && (
                <div className={`level-requirement ${isMobile ? 'mobile' : ''}`}>
                    Need &gt;{lvl.cost} pts
                </div>
            )}
        </div>
    )
}
