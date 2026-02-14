import "../../styles/Footer.css"

export const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                {/*Description Section */}
                <div className="footer-description">
                    <strong>Fun Quiz Games</strong>
                    <br/>
                    If you're looking for a bit of trivia, check out the trivia games section.
                    You can play fun new quiz games like a game based on the famous Family Feud,
                    Google Feud - a top-rated Google guessing game! Test your knowledge and
                    challenge friends in our interactive quiz community.
                </div>

                {/*Quick Links Section */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>Support</h3>
                        <ul className="footer-links-list">
                            <li><a href="/help" className="footer-link">Help Center</a></li>
                            <li><a href="/contact" className="footer-link">Contact Us</a></li>
                            <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                            <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className="footer-copyright">
                © 2026 <strong>TushindeQuizes</strong>.
                All games are for entertainment and educational purposes.
                <br/>
                All rights reserved. Made with ❤️ for quiz lovers worldwide.
            </div>
        </footer>
    );
};