import {useMediaQuery} from "../hooks/useMediaquery.ts";
import type {GameResult, LevelConfig} from "../types/checkers.types.ts";

interface ResultScreenProps {
    result:      Exclude<GameResult, null>
    points:      number
    levelConfig: LevelConfig
    onReturn:    () => void
}

export function ResultScreen({ result, points, levelConfig, onReturn }: ResultScreenProps) {
    const isMobile = useMediaQuery('(max-width: 600px)')
    const won    = result === 'win'
    const newBal = won ? points + levelConfig.reward : points

    return (
        <div className={`checkers-container result-${won ? 'win' : 'lose'} result-center`}>
            <div className={`result-icon ${isMobile ? 'mobile' : ''}`}>{won ? '♔' : '✕'}</div>
            <div className={`result-title ${isMobile ? 'mobile' : ''} ${won ? 'win' : 'lose'}`}>
                {won ? 'VICTORY' : 'DEFEATED'}
            </div>
            <div className={`result-message ${isMobile ? 'mobile' : ''} ${won ? 'win' : 'lose'}`}>
                {won ? `+${levelConfig.reward} POINTS EARNED` : `${levelConfig.cost} POINTS LOST`}
            </div>
            <div className={`balance-result-card ${isMobile ? 'mobile' : ''}`}>
                <div className={`balance-result-label ${isMobile ? 'mobile' : ''}`}>NEW BALANCE</div>
                <div className={`balance-result-value ${isMobile ? 'mobile' : ''}`}>
                    {newBal}
                </div>
            </div>
            <button
                onClick={onReturn}
                className={`return-button ${isMobile ? 'mobile' : ''}`}
            >
                RETURN TO MENU
            </button>
        </div>
    )
}