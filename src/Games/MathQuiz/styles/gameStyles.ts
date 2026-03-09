export const GameStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');

  /* Use a wrapper class instead of body for React/Vite stability */
  .game-wrapper { 
    font-family: 'Poppins', sans-serif; 
    background: white; 
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
    position: fixed; /* Ensures it covers the blank Vite background */
    top: 0;
    left: 0;
  }

  .game-card { 
    background: rgba(255, 255, 255, 0.95); 
    backdrop-filter: blur(10px);
    padding: 40px; 
    border-radius: 30px; 
    box-shadow: 0 20px 50px rgba(0,0,0,0.3); 
    width: 100%;
    max-width: 500px; 
    animation: slideUp 0.5s ease-out;
  }

  .level-tag {
    background: #ffbb00;
    color: #000;
    padding: 5px 15px;
    border-radius: 50px;
    font-weight: 800;
    font-size: 0.8em;
    display: inline-block;
    margin-bottom: 10px;
  }

  .option-row { 
    display: block; 
    padding: 20px; 
    margin: 15px 0; 
    background: white;
    border: 2px solid #e2e8f0; 
    border-radius: 20px; 
    cursor: pointer; 
    transition: all 0.1s ease;
    font-weight: 600;
    box-shadow: 0 6px 0 #e2e8f0;
    position: relative;
    top: 0;
    color: #2d3748;
  }

  .option-row:active {
    top: 4px;
    box-shadow: 0 2px 0 #e2e8f0;
  }

  .choice-correct { 
    background: #c6f6d5 !important; 
    border-color: #48bb78 !important; 
    box-shadow: 0 6px 0 #38a169 !important;
    color: #22543d !important;
  }

  .choice-wrong { 
    background: #fed7d7 !important; 
    border-color: #f56565 !important; 
    box-shadow: 0 6px 0 #e53e3e !important;
    color: #742a2a !important;
  }

  .progress-bar {
    height: 12px;
    background: #edf2f7;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    transition: width 0.5s ease;
  }

  .btn-submit {
    background: #4facfe;
    color: white;
    padding: 20px;
    border: none;
    border-radius: 20px;
    width: 100%;
    font-size: 1.2em;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 6px 0 #0076ad;
    margin-top: 10px;
  }

  .btn-submit:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 #0076ad;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;