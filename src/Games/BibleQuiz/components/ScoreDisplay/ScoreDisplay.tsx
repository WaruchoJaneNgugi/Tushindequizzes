import React from 'react';
import './ScoreDisplay.css';

interface ScoreDisplayProps {
    score: number;
    startingPoints?: number; // Add starting points
    total: number;
    totalPossibleScore: number;
    correct: number;
    wrong: number;
    percentage: number;
    timeSpent?: number;
    scoring?: {
        correctPoints: number;
        wrongPenalty: number;
    };
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
                                                       score,
                                                       startingPoints = 100,
                                                       total,
                                                       // totalPossibleScore,
                                                       correct,
                                                       wrong,
                                                       // percentage,
                                                       timeSpent
                                                   }) => {
    // const getGrade = (percent: number): string => {
    //     if (percent >= 90) return 'A+';
    //     if (percent >= 80) return 'A';
    //     if (percent >= 70) return 'B';
    //     if (percent >= 60) return 'C';
    //     if (percent >= 50) return 'D';
    //     return 'F';
    // };

    // const getMessage = (percent: number): string => {
    //     if (percent >= 90) return 'Excellent! Bible Scholar!';
    //     if (percent >= 80) return 'Great job! Well done!';
    //     if (percent >= 70) return 'Good effort! Keep studying!';
    //     if (percent >= 60) return 'Not bad! Try again!';
    //     if (percent >= 50) return 'Keep learning!';
    //     return 'Time to study more!';
    // };

    const pointsEarned = score - startingPoints;
    const pointsEarnedDisplay = pointsEarned >= 0 ? `+${pointsEarned}` : `${pointsEarned}`;

    return (
        <div className="scoreDisplay">
            {/*{scoring && (*/}
            {/*    <div className="scoreHeader">*/}
            {/*        <div className="scoringRules">*/}
            {/*<span className="ruleItem">*/}
            {/*  <span className="ruleCorrect">+{scoring.correctPoints}</span> correct*/}
            {/*</span>*/}
            {/*            <span className="ruleItem">*/}
            {/*  <span className="ruleWrong">-{scoring.wrongPenalty}</span> wrong*/}
            {/*</span>*/}
            {/*        </div>*/}
            {/*        /!*<div className="startingPointsInfo">*!/*/}
            {/*        /!*    Started with: <strong>{startingPoints}</strong> points*!/*/}
            {/*        /!*</div>*!/*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*<div className="scoreCircle">*/}
            {/*    <div className="scoreNumber">{score}</div>*/}
            {/*    <div className="scoreTotal">/ {totalPossibleScore}</div>*/}
            {/*    <div className="scorePercentage">{percentage}%</div>*/}
            {/*    <div className="scoreGrade">{getGrade(percentage)}</div>*/}
            {/*</div>*/}

            <div className="scoreChange" style={{
                color: pointsEarned >= 0 ? '#2ecc71' : '#e74c3c',
                fontSize: '1.2rem',
                marginBottom: '15px',
                fontWeight: '600'
            }}>
                {pointsEarnedDisplay} from starting points
            </div>

            <div className="scoreMessage">
                {/*<h3>{getMessage(percentage)}</h3>*/}
                <p>You answered {correct} out of {total} questions correctly.</p>
                {/*<p className="scorePoints">*/}
                {/*    You earned {score} out of {totalPossibleScore} possible points.*/}
                {/*</p>*/}
            </div>

            <div className="scoreDetails">
                <div className="detailItem">
                    <div className="detailLabel">Correct</div>
                    <div className="detailValue" style={{ color: '#2ecc71' }}>
                        {correct}
                    </div>
                </div>

                <div className="detailItem">
                    <div className="detailLabel">Wrong</div>
                    <div className="detailValue" style={{ color: '#e74c3c' }}>
                        {wrong}
                    </div>
                </div>

                <div className="detailItem">
                    <div className="detailLabel">Score</div>
                    <div className="detailValue" style={{ color: '#3498db' }}>
                        {score}
                    </div>
                </div>

                {timeSpent !== undefined && (
                    <div className="detailItem">
                        <div className="detailLabel">Time</div>
                        <div className="detailValue">
                            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreDisplay;