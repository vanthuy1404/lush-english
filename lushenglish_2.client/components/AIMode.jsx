"use client"
import { useNavigate } from "react-router-dom"
import Header from "./Header"

function AIMode() {
    const navigate = useNavigate()

    return (
        <div className="ai-mode-page">
            <Header />

            {/* Hero Section */}
            <div className="ai-hero-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h1 className="hero-title">Learn English with AI</h1>
                            <p className="hero-subtitle">
                                Enhance your English skills with our advanced AI-powered learning tools. Practice in a safe, interactive
                                environment and receive instant feedback.
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* AI Learning Modes Section */}
            <div className="ai-modes-section">
                <div className="container">
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8 text-center">
                            <span className="section-subtitle">AI LEARNING MODES</span>
                            <h2 className="section-title">Choose Your Learning Experience</h2>
                            <div className="section-divider"></div>
                            <p className="section-description">
                                Our AI-powered learning modes are designed to help you practice English in different contexts. Select
                                the mode that best fits your learning goals.
                            </p>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        {/* Writing Mode Card */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="ai-card writing-card">
                                <div className="ai-card-icon-wrapper">
                                    <div className="ai-card-icon">
                                        <i className="bi bi-pencil-square"></i>
                                    </div>
                                </div>
                                <h3 className="ai-card-title">Practice Writing with AI</h3>
                                <p className="ai-card-description">
                                    Improve your English writing skills with our AI-powered letter writing practice. Get instant feedback
                                    and suggestions to enhance your communication.
                                </p>
                                <ul className="ai-card-features">
                                    <li>
                                        <i className="bi bi-check-circle"></i> Instant grammar corrections
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Vocabulary enhancement
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Style and tone suggestions
                                    </li>
                                </ul>
                                <div className="ai-card-footer">
                                    <button className="btn btn-ai-primary" onClick={() => window.open("/ai-mode/Writing")}>
                                        <span>Start Writing</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                                <div className="ai-card-decoration">
                                    <i className="bi bi-pencil"></i>
                                    <i className="bi bi-envelope"></i>
                                    <i className="bi bi-file-text"></i>
                                </div>
                            </div>
                        </div>

                        {/* Chatting Mode Card */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="ai-card chatting-card">
                                <div className="ai-card-icon-wrapper">
                                    <div className="ai-card-icon">
                                        <i className="bi bi-chat-dots"></i>
                                    </div>
                                </div>
                                <h3 className="ai-card-title">Practice Chatting with AI</h3>
                                <p className="ai-card-description">
                                    Practice real-world conversations with our AI chat partner. Perfect your speaking and typing skills in
                                    a natural environment.
                                </p>
                                <ul className="ai-card-features">
                                    <li>
                                        <i className="bi bi-check-circle"></i> Natural conversation flow
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Contextual responses
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Pronunciation guidance
                                    </li>
                                </ul>
                                <div className="ai-card-footer">
                                    <button className="btn btn-ai-primary" onClick={() => navigate("/ai-mode/Chatting")}>
                                        <span>Start Chatting</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                                <div className="ai-card-decoration">
                                    <i className="bi bi-chat"></i>
                                    <i className="bi bi-person"></i>
                                    <i className="bi bi-translate"></i>
                                </div>
                            </div>
                        </div>

                        {/* Pronunciation Mode Card */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="ai-card pronunciation-card">
                                <div className="ai-card-badge">Coming Soon</div>
                                <div className="ai-card-icon-wrapper">
                                    <div className="ai-card-icon">
                                        <i className="bi bi-mic"></i>
                                    </div>
                                </div>
                                <h3 className="ai-card-title">Practice Pronunciation</h3>
                                <p className="ai-card-description">
                                    Perfect your English pronunciation with our AI speech recognition technology. Get real-time feedback
                                    on your speaking skills.
                                </p>
                                <ul className="ai-card-features">
                                    <li>
                                        <i className="bi bi-check-circle"></i> Accent analysis
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Word stress guidance
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle"></i> Intonation feedback
                                    </li>
                                </ul>
                                <div className="ai-card-footer">
                                    <button className="btn btn-ai-secondary" disabled>
                                        <span>Coming Soon</span>
                                    </button>
                                </div>
                                <div className="ai-card-decoration">
                                    <i className="bi bi-soundwave"></i>
                                    <i className="bi bi-mic"></i>
                                    <i className="bi bi-volume-up"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section">
                <div className="container">
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8 text-center">
                            <span className="section-subtitle">HOW IT WORKS</span>
                            <h2 className="section-title">Learning with AI is Simple</h2>
                            <div className="section-divider"></div>
                        </div>
                    </div>

                    <div className="row">
                        {[
                            {
                                icon: "bi-1-circle-fill",
                                title: "Choose a Mode",
                                description: "Select the AI learning mode that matches your learning goals and interests.",
                            },
                            {
                                icon: "bi-2-circle-fill",
                                title: "Practice Actively",
                                description: "Engage with our AI system through writing or conversation exercises.",
                            },
                            {
                                icon: "bi-3-circle-fill",
                                title: "Get Instant Feedback",
                                description: "Receive real-time corrections, suggestions, and improvements from our AI.",
                            },
                            {
                                icon: "bi-4-circle-fill",
                                title: "Track Your Progress",
                                description: "Monitor your improvement over time with detailed performance analytics.",
                            },
                        ].map((step, index) => (
                            <div className="col-md-6 col-lg-3 mb-4" key={index}>
                                <div className="step-card">
                                    <div className="step-icon">
                                        <i className={`bi ${step.icon}`}></i>
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="ai-cta-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="cta-card">
                                <div className="row align-items-center">
                                    <div className="col-lg-8">
                                        <h2 className="cta-title">Ready to enhance your English skills?</h2>
                                        <p className="cta-text">
                                            Start practicing with our AI-powered tools today and see the difference in your English
                                            proficiency.
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                                        <button className="btn btn-cta" onClick={() => navigate("/ai-mode/Writing")}>
                                            Get Started Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                /* General Styles */
                .ai-mode-page {
                    background-color: #f8f9fa;
                }
                
                .section-subtitle {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #4A90E2;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 10px;
                }
                
                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .section-divider {
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, #4A90E2, #FFD700);
                    margin: 0 auto 30px;
                    border-radius: 2px;
                }
                
                .section-description {
                    font-size: 1.1rem;
                    color: #666;
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.7;
                }
                
                /* Hero Section */
                .ai-hero-section {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    padding: 120px 0 100px;
                    position: relative;
                    margin-top: 80px; /* Adjust based on your header height */
                }
                
                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .hero-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.7;
                }
                
                .wave-bottom {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                /* AI Modes Section */
                .ai-modes-section {
                    padding: 80px 0;
                    position: relative;
                    z-index: 1;
                }
                
                .ai-card {
                    background-color: white;
                    border-radius: 20px;
                    padding: 30px;
                    height: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .ai-card:hover {
                    transform: translateY(-15px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
                
                .ai-card-icon-wrapper {
                    margin-bottom: 25px;
                    position: relative;
                    z-index: 2;
                }
                
                .ai-card-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    margin-bottom: 5px;
                }
                
                .writing-card .ai-card-icon {
                    background-color: rgba(74, 144, 226, 0.1);
                    color: #4A90E2;
                }
                
                .chatting-card .ai-card-icon {
                    background-color: rgba(255, 215, 0, 0.1);
                    color: #FFD700;
                }
                
                .pronunciation-card .ai-card-icon {
                    background-color: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                }
                
                .ai-card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                    position: relative;
                    z-index: 2;
                }
                
                .ai-card-description {
                    color: #666;
                    margin-bottom: 20px;
                    line-height: 1.7;
                    position: relative;
                    z-index: 2;
                }
                
                .ai-card-features {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 25px;
                    position: relative;
                    z-index: 2;
                }
                
                .ai-card-features li {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }
                
                .ai-card-features li i {
                    margin-right: 10px;
                    color: #4A90E2;
                }
                
                .chatting-card .ai-card-features li i {
                    color: #FFD700;
                }
                
                .pronunciation-card .ai-card-features li i {
                    color: #28a745;
                }
                
                .ai-card-footer {
                    position: relative;
                    z-index: 2;
                }
                
                .btn-ai-primary {
                    background-color: #FFD700;
                    color: #333;
                    border: none;
                    border-radius: 30px;
                    padding: 12px 25px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }
                
                .btn-ai-primary:hover {
                    background-color: #4A90E2;
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(74, 144, 226, 0.2);
                }
                
                .btn-ai-primary i {
                    transition: transform 0.3s ease;
                }
                
                .btn-ai-primary:hover i {
                    transform: translateX(5px);
                }
                
                .btn-ai-secondary {
                    background-color: #e9ecef;
                    color: #6c757d;
                    border: none;
                    border-radius: 30px;
                    padding: 12px 25px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: not-allowed;
                }
                
                .ai-card-decoration {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 1;
                }
                
                .ai-card-decoration i {
                    position: absolute;
                    font-size: 8rem;
                    opacity: 0.03;
                    transition: all 0.5s ease;
                }
                
                .ai-card-decoration i:nth-child(1) {
                    top: -20px;
                    right: -20px;
                    transform: rotate(15deg);
                }
                
                .ai-card-decoration i:nth-child(2) {
                    bottom: -30px;
                    left: -30px;
                    transform: rotate(-15deg);
                }
                
                .ai-card-decoration i:nth-child(3) {
                    top: 50%;
                    right: -40px;
                    transform: translateY(-50%) rotate(30deg);
                }
                
                .ai-card:hover .ai-card-decoration i:nth-child(1) {
                    transform: rotate(25deg) scale(1.1);
                }
                
                .ai-card:hover .ai-card-decoration i:nth-child(2) {
                    transform: rotate(-25deg) scale(1.1);
                }
                
                .ai-card:hover .ai-card-decoration i:nth-child(3) {
                    transform: translateY(-50%) rotate(40deg) scale(1.1);
                }
                
                .ai-card-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background-color: #dc3545;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 3;
                }
                
                /* How It Works Section */
                .how-it-works-section {
                    padding: 80px 0;
                    background-color: #f0f4f8;
                }
                
                .step-card {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    height: 100%;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    text-align: center;
                }
                
                .step-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                
                .step-icon {
                    font-size: 3rem;
                    color: #4A90E2;
                    margin-bottom: 20px;
                }
                
                .step-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .step-description {
                    color: #666;
                    line-height: 1.6;
                }
                
                /* CTA Section */
                .ai-cta-section {
                    padding: 80px 0;
                }
                
                .cta-card {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    border-radius: 20px;
                    padding: 50px;
                    box-shadow: 0 15px 30px rgba(74, 144, 226, 0.2);
                    color: white;
                }
                
                .cta-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                
                .cta-text {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-bottom: 0;
                }
                
                .btn-cta {
                    background-color: #FFD700;
                    color: #333;
                    border: none;
                    border-radius: 30px;
                    padding: 15px 30px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                }
                
                .btn-cta:hover {
                    background-color: white;
                    color: #4A90E2;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .ai-hero-section {
                        padding: 100px 0 80px;
                    }
                    
                    .hero-title {
                        font-size: 2.8rem;
                    }
                    
                    .section-title {
                        font-size: 2.2rem;
                    }
                    
                    .cta-card {
                        padding: 30px;
                    }
                    
                    .cta-title {
                        font-size: 1.8rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .ai-hero-section {
                        padding: 80px 0 60px;
                    }
                    
                    .hero-title {
                        font-size: 2.3rem;
                    }
                    
                    .ai-card {
                        margin-bottom: 30px;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default AIMode

