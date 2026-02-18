// src/components/Layout/Footer.tsx
import React from 'react';
import './Footer.css'

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footerContent">
                <p>© {new Date().getFullYear()} Bible Challenge Quizzes. Test your knowledge and grow in faith.</p>
                <p className="footerNote">
                    Based on the Back to the Bible Bible Challenge Quizzes
                </p>
            </div>
        </footer>
    );
};

export default Footer;