interface ChartData {
    day: string;
    attempts: number;
}

interface ChartBarsProps {
    data: ChartData[];
}

export const ChartBars = ({ data }: ChartBarsProps) => {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">Quiz Attempts (Last 7 Days)</h3>
                    <p className="chart-subtitle">Daily quiz completions</p>
                </div>
            </div>
            <div className="chart-bars">
                {data.map((item, index) => (
                    <div key={index} className="bar-container">
                        <div className="bar-wrapper">
                            <div className="bar" style={{height: `${Math.max(item.attempts, 2)}%`}}>
                                <div className="bar-tooltip">{item.attempts} attempts</div>
                            </div>
                        </div>
                        <span className="bar-label">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};