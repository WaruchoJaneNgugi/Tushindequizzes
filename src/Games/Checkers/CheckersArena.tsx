
import { useCheckers } from './hooks/useCheckers'
import {  type GameResult } from './types/checkers.types'
import "./assets/checkers.css"
import {MenuScreen} from "./components/MenuScreen.tsx";
import {ResultScreen} from "./components/ResultScreen.tsx";
import {GameScreen} from "./components/GameScreen.tsx";

export default function CheckersArena() {
    const {
        screen, points, board, turn, selected,
        chainPiece, thinking, result,
        redCount, blackCount, lvlConfig, destSet,
        handleCellClick, startGame, returnToMenu,
    } = useCheckers()

    if (screen === 'menu')
        return <MenuScreen points={points} onStart={startGame} />

    if (screen === 'result' && result && lvlConfig)
        return (
            <ResultScreen
                result={result as Exclude<GameResult, null>}
                points={points}
                levelConfig={lvlConfig}
                onReturn={returnToMenu}
            />
        )

    if (!lvlConfig) return null

    return (
        <GameScreen
            board={board}
            selected={selected}
            destSet={destSet}
            turn={turn}
            thinking={thinking}
            chainPiece={chainPiece}
            points={points}
            redCount={redCount}
            blackCount={blackCount}
            levelConfig={lvlConfig}
            onCellClick={handleCellClick}
            onReturnToMenu={returnToMenu}
        />
    )
}