"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Header from "./Header"

const Practice = () => {
    const [practices, setPractices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        setLoading(true)
        axios
            .get("https://localhost:7007/api/Practices")
            .then((response) => {
                setPractices(response.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching practice data:", error)
                setError("Failed to load practice exercises. Please try again later.")
                setLoading(false)
            })
    }, [])

    // Filter practices based on selected filter and search term
    const filteredPractices = practices.filter((practice) => {
        const matchesSearch = practice.practiceName.toLowerCase().includes(searchTerm.toLowerCase())
        if (filter === "all") return matchesSearch
        // You can add more filter conditions here based on practice properties
        return matchesSearch
    })

    // Group practices by difficulty level (for demonstration)
    const getDifficultyLevel = (index) => {
        const levels = ["Beginner", "Intermediate", "Advanced"]
        return levels[index % 3]
    }

    return (
        <div className="practice-page">
            <Header />

            {/* Hero Section */}
            <div className="practice-hero mt-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-4">Practice Your English</h1>
                            <p className="lead mb-4">
                                Reinforce your learning with our interactive practice exercises. Test your knowledge, track your
                                progress, and improve your English skills.
                            </p>
                            <div className="search-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search practice exercises..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="bi bi-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Practice Content */}
            <div className="practice-content py-5">
                <div className="container">
                    {/* Filter Tabs */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="filter-tabs">
                                <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                                    All Exercises
                                </button>
                                
                            </div>
                        </div>
                    </div>

                    {/* Practice Cards */}
                    <div className="row">
                        <div className="col-12">
                            {loading ? (
                                <div className="loading-container">
                                    <div className="spinner">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                    <p>Loading practice exercises...</p>
                                </div>
                            ) : error ? (
                                <div className="error-container">
                                    <div className="error-icon">
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                    </div>
                                    <h3>Oops! Something went wrong</h3>
                                    <p>{error}</p>
                                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                                        Try Again
                                    </button>
                                </div>
                            ) : filteredPractices.length === 0 ? (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <i className="bi bi-search"></i>
                                    </div>
                                    <h3>No practice exercises found</h3>
                                    <p>Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="practice-grid">
                                    {filteredPractices.map((practice, index) => {
                                        const difficulty = getDifficultyLevel(index)
                                        const difficultyColor =
                                            difficulty === "Beginner" ? "success" : difficulty === "Intermediate" ? "primary" : "danger"

                                        return (
                                            <div className="practice-card" key={practice.practiceID}>
                                                <div className="practice-card-header">
                                                    <span className={`difficulty-badge bg-${difficultyColor}`}>{difficulty}</span>
                                                    <div className="practice-icon">
                                                        <i className="bi bi-journal-check"></i>
                                                    </div>
                                                </div>
                                                <div className="practice-card-body">
                                                    <h3 className="practice-title">{practice.practiceName}</h3>
                                                    <div className="practice-details">
                                                        <div className="practice-detail">
                                                            <i className="bi bi-question-circle"></i>
                                                            <span>10 Questions</span>
                                                        </div>
                                                        <div className="practice-detail">
                                                            <i className="bi bi-clock"></i>
                                                            <span>10 Minutes</span>
                                                        </div>
                                                    </div>
                                                    <div className="completion-bar">
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar bg-success"
                                                                role="progressbar"
                                                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                                                                aria-valuenow="25"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <span className="completion-text">Progress</span>
                                                    </div>
                                                </div>
                                                <div className="practice-card-footer">
                                                    <Link to={`/practices/${practice.practiceID}`} className="btn btn-practice">
                                                        <span>Start Practice</span>
                                                        <i className="bi bi-arrow-right"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="practice-cta py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="cta-card">
                                <div className="row align-items-center">
                                    <div className="col-lg-8">
                                        <h2 className="cta-title">Ready to test your knowledge?</h2>
                                        <p className="cta-text">
                                            Challenge yourself with our daily practice exercises and track your progress over time.
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                                        <a href="#top" className="btn btn-light btn-lg">
                                            <i className="bi bi-trophy me-2"></i>
                                            View Leaderboard
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                /* Hero Section */
                .practice-hero {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    position: relative;
                    padding: 80px 0 100px;
                }
                
                .wave-bottom {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                .search-box {
                    position: relative;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .search-box input {
                    padding: 15px 20px;
                    border-radius: 30px;
                    border: none;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    font-size: 1rem;
                    padding-right: 50px;
                }
                
                .search-box i {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4A90E2;
                    font-size: 1.2rem;
                }
                
                /* Filter Tabs */
                .filter-tabs {
                    display: flex;
                    overflow-x: auto;
                    gap: 10px;
                    padding: 5px 0;
                    margin-bottom: 20px;
                }
                
                .filter-tab {
                    background-color: #f8f9fa;
                    border: none;
                    border-radius: 30px;
                    padding: 10px 20px;
                    font-weight: 500;
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
                    box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
                }
                
                /* Practice Grid */
                .practice-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 25px;
                }
                
                /* Practice Card */
                .practice-card {
                    background-color: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .practice-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                
                .practice-card-header {
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
                
                .practice-icon {
                    width: 70px;
                    height: 70px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .practice-icon i {
                    font-size: 2rem;
                    color: #4A90E2;
                }
                
                .practice-card-body {
                    padding: 20px;
                    flex-grow: 1;
                }
                
                .practice-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .practice-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                
                .practice-detail {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 0.9rem;
                }
                
                .practice-detail i {
                    color: #4A90E2;
                }
                
                .completion-bar {
                    margin-top: auto;
                }
                
                .progress {
                    height: 8px;
                    border-radius: 4px;
                    background-color: #f0f0f0;
                    margin-bottom: 5px;
                }
                
                .completion-text {
                    font-size: 0.8rem;
                    color: #777;
                }
                
                .practice-card-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #f0f0f0;
                }
                
                .btn-practice {
                    background-color: #FFD700;
                    color: #333;
                    font-weight: 600;
                    border-radius: 30px;
                    padding: 10px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    border: 2px solid #FFD700;
                    width: 100%;
                }
                
                .btn-practice:hover {
                    background-color: transparent;
                    color: #FFD700;
                }
                
                .btn-practice i {
                    transition: transform 0.3s ease;
                }
                
                .btn-practice:hover i {
                    transform: translateX(5px);
                }
                
                /* Loading Container */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 0;
                    text-align: center;
                }
                
                .spinner {
                    margin: 20px auto;
                    width: 70px;
                    text-align: center;
                }
                
                .spinner > div {
                    width: 18px;
                    height: 18px;
                    background-color: #4A90E2;
                    border-radius: 100%;
                    display: inline-block;
                    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                    margin: 0 3px;
                }
                
                .spinner .bounce1 {
                    animation-delay: -0.32s;
                }
                
                .spinner .bounce2 {
                    animation-delay: -0.16s;
                }
                
                @keyframes sk-bouncedelay {
                    0%, 80%, 100% { 
                        transform: scale(0);
                    } 40% { 
                        transform: scale(1.0);
                    }
                }
                
                /* Error Container */
                .error-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 0;
                    text-align: center;
                }
                
                .error-icon {
                    font-size: 3rem;
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                
                /* No Results */
                .no-results {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 0;
                    text-align: center;
                }
                
                .no-results-icon {
                    font-size: 3rem;
                    color: #6c757d;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }
                
                /* CTA Section */
                .practice-cta {
                    background-color: #f8f9fa;
                }
                
                .cta-card {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 15px 30px rgba(74, 144, 226, 0.2);
                    color: white;
                }
                
                .cta-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                
                .cta-text {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-bottom: 0;
                }
                
                .cta-card .btn-light {
                    background-color: #FFD700;
                    border-color: #FFD700;
                    color: #333;
                    font-weight: 600;
                    padding: 12px 25px;
                    border-radius: 30px;
                    transition: all 0.3s ease;
                }
                
                .cta-card .btn-light:hover {
                    background-color: white;
                    border-color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .practice-hero {
                        padding: 60px 0 80px;
                    }
                    
                    .cta-card {
                        padding: 30px;
                    }
                    
                    .cta-title {
                        font-size: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .practice-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .filter-tabs {
                        padding-bottom: 10px;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default Practice

