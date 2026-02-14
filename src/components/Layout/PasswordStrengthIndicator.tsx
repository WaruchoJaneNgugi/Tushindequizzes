import type {FC} from "react";
import "../../styles/passwordstyle.css";
export const PasswordStrengthIndicator: FC<{ strength: 'weak' | 'medium' | 'strong' | null }> = ({ strength }) => {
    if (!strength) return null;

    const getStrengthColor = () => {
        switch (strength) {
            case 'weak': return '#ff4d4f'; // Red
            case 'medium': return '#faad14'; // Orange/Yellow
            case 'strong': return '#52c41a'; // Green
            default: return '#d9d9d9';
        }
    };

    const getStrengthText = () => {
        switch (strength) {
            case 'weak': return 'Weak';
            case 'medium': return 'Medium';
            case 'strong': return 'Strong';
            default: return '';
        }
    };

    const getWidth = () => {
        switch (strength) {
            case 'weak': return '33%';
            case 'medium': return '66%';
            case 'strong': return '100%';
            default: return '0%';
        }
    };

    return (
        <div className="password-strength-indicator">
            <div className="strength-bar">
                <div
                    className="strength-fill"
                    style={{
                        width: getWidth(),
                        backgroundColor: getStrengthColor()
                    }}
                />
            </div>
            <div className="strength-text" style={{ color: getStrengthColor() }}>
                {getStrengthText()}
            </div>
        </div>
    );
};