﻿"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Header from "./Header"

const ChattingExercise = () => {
    const [exercises, setExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        fetch("http://103.82.132.113:8080/api/ChattingExercise")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((data) => {
                setExercises(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setError("Failed to load exercises. Please try again later.")
                setLoading(false)
            })
    }, [])

    const handleViewResult = () => {
        navigate("/ai-mode/Chatting/Results")
    }

    // Get unique categories for filter
    const getCategories = () => {
        const categories = exercises.map((exercise) => {
            // Extract category from AI role or use default
            const role = exercise.aiRole || ""
            if (role.includes("Interview")) return "Interview"
            if (role.includes("Customer")) return "Customer Service"
            if (role.includes("Travel")) return "Travel"
            if (role.includes("Medical")) return "Medical"
            return "General Conversation"
        })
        return ["all", ...new Set(categories)]
    }

    // Filter exercises based on search term and category
    const filteredExercises = exercises.filter((exercise) => {
        const matchesSearch = exercise.chattingExerciseName.toLowerCase().includes(searchTerm.toLowerCase())

        if (selectedCategory === "all") return matchesSearch

        const role = exercise.aiRole || ""
        const category = role.includes("Interview")
            ? "Interview"
            : role.includes("Customer")
                ? "Customer Service"
                : role.includes("Travel")
                    ? "Travel"
                    : role.includes("Medical")
                        ? "Medical"
                        : "General Conversation"

        return matchesSearch && category === selectedCategory
    })

    // Get exercise difficulty level (for demonstration)
    const getDifficultyLevel = (index) => {
        const levels = ["Beginner", "Intermediate", "Advanced"]
        return levels[index % 3]
    }

    // Get exercise estimated time (for demonstration)
    const getEstimatedTime = (index) => {
        const times = ["10 min", "15 min", "20 min", "30 min"]
        return times[index % 4]
    }

    return (
        <div className="chatting-exercise-page">
            <Header />

            {/* Hero Section */}
            <div className="chatting-hero">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">Practice English Conversation</h1>
                            <p className="hero-subtitle">
                                Improve your speaking skills with our AI-powered conversation partner. Practice real-life scenarios and
                                receive instant feedback to enhance your fluency.
                            </p>
                            <div className="hero-buttons">
                                <button
                                    className="btn btn-primary btn-lg me-3"
                                    onClick={() => document.getElementById("exercises-section").scrollIntoView({ behavior: "smooth" })}
                                >
                                    Start Chatting
                                </button>
                                <button className="btn btn-outline-light btn-lg" onClick={handleViewResult}>
                                    <i className="bi bi-bar-chart-line me-2"></i>
                                    View My Results
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>

            {/* Exercises Section */}
            <div id="exercises-section" className="exercises-section py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="section-header">
                                <div>
                                    <h2 className="section-title">Conversation Scenarios</h2>
                                    <p className="section-subtitle">Select a scenario to start practicing your conversation skills</p>
                                </div>
                                <button className="btn btn-results" onClick={handleViewResult}>
                                    <i className="bi bi-bar-chart-line me-2"></i>
                                    View My Results
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <div className="search-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search scenarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="bi bi-search"></i>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="filter-tabs">
                                {getCategories().map((category, index) => (
                                    <button
                                        key={index}
                                        className={`filter-tab ${selectedCategory === category ? "active" : ""}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category === "all" ? "All Scenarios" : category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Exercises Grid */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading conversation scenarios...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    ) : filteredExercises.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="no-results-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3>No scenarios found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredExercises.map((exercise, index) => {
                                const difficulty = getDifficultyLevel(index)
                                const estimatedTime = getEstimatedTime(index)
                                const difficultyColor =
                                    difficulty === "Beginner" ? "success" : difficulty === "Intermediate" ? "primary" : "danger"

                                return (
                                    <div key={exercise.chattingExerciseID} className="col">
                                        <div className="exercise-card">
                                            <div className="exercise-card-header">
                                                <span className={`difficulty-badge bg-${difficultyColor}`}>{difficulty}</span>
                                                <div className="exercise-icon">
                                                    <i className="bi bi-chat-dots"></i>
                                                </div>
                                            </div>
                                            <div className="exercise-card-body">
                                                <h3 className="exercise-title">{exercise.chattingExerciseName}</h3>
                                                <p className="exercise-description">
                                                    Practice your conversation skills with our AI playing the role of:{" "}
                                                    <strong>{exercise.aiRole || "Conversation Partner"}</strong>
                                                </p>
                                                <div className="exercise-meta">
                                                    <div className="exercise-meta-item">
                                                        <i className="bi bi-clock"></i>
                                                        <span>{estimatedTime}</span>
                                                    </div>
                                                    <div className="exercise-meta-item">
                                                        <i className="bi bi-person-circle"></i>
                                                        <span>{exercise.aiRole ? exercise.aiRole.split(" ")[0] : "General"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="exercise-card-footer">
                                                <button
                                                    className="btn btn-exercise"
                                                    onClick={() => window.open(`/AIMode/Chatting/${exercise.chattingExerciseID}`, "_blank")}
                                                >
                                                    <span>Start Conversation</span>
                                                    <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section py-5 bg-light">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="section-title">Benefits of AI Conversation Practice</h2>
                            <div className="section-divider mx-auto"></div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            {
                                icon: "bi-chat-dots",
                                title: "Real Conversation Practice",
                                description:
                                    "Practice natural conversations in a safe environment without the fear of making mistakes.",
                            },
                            {
                                icon: "bi-clock-history",
                                title: "Available 24/7",
                                description: "Practice anytime, anywhere with our AI conversation partner that's always ready to chat.",
                            },
                            {
                                icon: "bi-translate",
                                title: "Improve Fluency",
                                description: "Enhance your speaking skills and build confidence through regular conversation practice.",
                            },
                            {
                                icon: "bi-person-check",
                                title: "Personalized Experience",
                                description: "Practice specific scenarios relevant to your learning goals and interests.",
                            },
                        ].map((benefit, index) => (
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className={`bi ${benefit.icon}`}></i>
                                    </div>
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section py-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="section-title">How Conversation Practice Works</h2>
                            <div className="section-divider mx-auto"></div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="steps-container">
                                {[
                                    {
                                        number: "01",
                                        title: "Choose a Scenario",
                                        description:
                                            "Select from various conversation scenarios based on your interests or learning goals.",
                                    },
                                    {
                                        number: "02",
                                        title: "Start the Conversation",
                                        description: "Begin chatting with our AI partner who will respond naturally to your messages.",
                                    },
                                    {
                                        number: "03",
                                        title: "Practice Speaking",
                                        description: "Type your responses as if you were speaking in a real conversation.",
                                    },
                                    {
                                        number: "04",
                                        title: "Get Feedback",
                                        description: "Receive helpful suggestions and corrections to improve your conversation skills.",
                                    },
                                ].map((step, index) => (
                                    <div className="step-item" key={index}>
                                        <div className="step-number">{step.number}</div>
                                        <div className="step-content">
                                            <h3 className="step-title">{step.title}</h3>
                                            <p className="step-description">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="image-container">
                                <img
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="How conversation practice works"
                                    className="img-fluid rounded-4 shadow-lg"
                                />
                                <div className="image-badge">
                                    <div className="badge-content">
                                        <div className="badge-number">1000+</div>
                                        <div className="badge-text">Conversations</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                /* Page Layout */
                .chatting-exercise-page {
                    background-color: #f8f9fa;
                }
                
                /* Hero Section */
                .chatting-hero {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    position: relative;
                    padding: 100px 0 120px;
                    margin-top: 80px; /* Adjust based on your header height */
                }
                
                .hero-title {
                    font-size: 2.8rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                }
                
                .hero-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-bottom: 30px;
                    line-height: 1.7;
                }
                
                .hero-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .btn-primary {
                    background-color: #FFD700;
                    border-color: #FFD700;
                    color: #333;
                    font-weight: 600;
                    border-radius: 30px;
                    padding: 12px 25px;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    background-color: #e6c200;
                    border-color: #e6c200;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                }
                
                .btn-outline-light {
                    border-radius: 30px;
                    padding: 12px 25px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-light:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
                }
                
                .hero-image-container {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }
                
                .hero-image {
                    border-radius: 20px;
                    transition: transform 0.5s ease;
                }
                
                .hero-image-container:hover .hero-image {
                    transform: scale(1.05);
                }
                
                .floating-badge {
                    position: absolute;
                    background-color: white;
                    border-radius: 30px;
                    padding: 10px 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    animation: float 3s ease-in-out infinite;
                }
                
                .badge-ai {
                    top: 20px;
                    right: -15px;
                    color: #4A90E2;
                    animation-delay: 0s;
                }
                
                .badge-feedback {
                    bottom: 30px;
                    left: -15px;
                    color: #FFD700;
                    animation-delay: 1.5s;
                }
                
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
                
                .wave-bottom {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                /* Exercises Section */
                .exercises-section {
                    padding: 50px 0;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                
                .section-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .section-subtitle {
                    color: #666;
                    font-size: 1.1rem;
                }
                
                .section-divider {
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, #4A90E2, #FFD700);
                    margin: 20px auto 30px;
                    border-radius: 2px;
                }
                
                .btn-results {
                    background-color: #4A90E2;
                    color: white;
                    border-radius: 30px;
                    padding: 10px 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    border: none;
                }
                
                .btn-results:hover {
                    background-color: #3672b9;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                    color: white;
                }
                
                /* Search and Filter */
                .search-box {
                    position: relative;
                }
                
                .search-box input {
                    padding: 12px 20px;
                    border-radius: 30px;
                    border: 1px solid #dee2e6;
                    padding-right: 40px;
                    transition: all 0.3s ease;
                }
                
                .search-box input:focus {
                    box-shadow: 0 0 0 0.25rem rgba(74, 144, 226, 0.25);
                    border-color: #4A90E2;
                }
                
                .search-box i {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                }
                
                .filter-tabs {
                    display: flex;
                    overflow-x: auto;
                    gap: 10px;
                    padding-bottom: 5px;
                }
                
                .filter-tab {
                    background-color: #f8f9fa;
                    border: none;
                    border-radius: 30px;
                    padding: 8px 15px;
                    font-size: 0.9rem;
                    color: #555;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }
                
                .filter-tab:hover {
                    background-color: #e9ecef;
                }
                
                .filter-tab.active {
                    background-color: #4A90E2;
                    color: white;
                }
                
                /* Exercise Cards */
                .exercise-card {
                    background-color: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .exercise-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                
                .exercise-card-header {
                    position: relative;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .difficulty-badge {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: white;
                }
                
                .exercise-icon {
                    width: 60px;
                    height: 60px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .exercise-icon i {
                    font-size: 1.8rem;
                    color: #4A90E2;
                }
                
                .exercise-card-body {
                    padding: 20px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .exercise-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .exercise-description {
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 15px;
                    flex-grow: 1;
                }
                
                .exercise-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-top: auto;
                }
                
                .exercise-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 0.9rem;
                }
                
                .exercise-meta-item i {
                    color: #4A90E2;
                }
                
                .exercise-card-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #f0f0f0;
                }
                
                .btn-exercise {
                    background-color: #FFD700;
                    color: #333;
                    font-weight: 600;
                    border-radius: 30px;
                    padding: 8px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    border: 2px solid #FFD700;
                    width: 100%;
                }
                
                .btn-exercise:hover {
                    background-color: transparent;
                    color: #FFD700;
                }
                
                .btn-exercise i {
                    transition: transform 0.3s ease;
                }
                
                .btn-exercise:hover i {
                    transform: translateX(5px);
                }
                
                /* No Results */
                .no-results-icon {
                    font-size: 3rem;
                    color: #6c757d;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }
                
                /* Benefits Section */
                .benefits-section {
                    background-color: #f8f9fa;
                }
                
                .benefit-card {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    height: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    text-align: center;
                }
                
                .benefit-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                
                .benefit-icon {
                    width: 70px;
                    height: 70px;
                    background-color: rgba(74, 144, 226, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                
                .benefit-icon i {
                    font-size: 2rem;
                    color: #4A90E2;
                }
                
                .benefit-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .benefit-description {
                    color: #666;
                    line-height: 1.6;
                }
                
                /* How It Works Section */
                .how-it-works-section {
                    padding: 80px 0;
                    background-color: white;
                }
                
                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
                
                .step-item {
                    display: flex;
                    gap: 20px;
                }
                
                .step-number {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    flex-shrink: 0;
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .step-content {
                    padding-top: 5px;
                }
                
                .step-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .step-description {
                    color: #666;
                    line-height: 1.6;
                }
                
                .image-container {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                }
                
                .image-badge {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    border-radius: 15px;
                    padding: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                
                .badge-content {
                    text-align: center;
                }
                
                .badge-number {
                    font-size: 1.8rem;
                    font-weight: 700;
                    line-height: 1;
                }
                
                .badge-text {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .chatting-hero {
                        padding: 80px 0 100px;
                    }
                    
                    .hero-title {
                        font-size: 2.3rem;
                    }
                    
                    .section-title {
                        font-size: 1.8rem;
                    }
                    
                    .step-item {
                        align-items: flex-start;
                    }
                }
                
                @media (max-width: 768px) {
                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .btn-results {
                        align-self: flex-start;
                    }
                    
                    .filter-tabs {
                        padding-bottom: 10px;
                    }
                    
                    .step-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                    
                    .step-number {
                        width: 50px;
                        height: 50px;
                        font-size: 1.2rem;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default ChattingExercise

