"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const ChattingExerciseResults = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const userID = localStorage.getItem("userID")

    useEffect(() => {
        const fetchResults = async () => {
            if (!userID) {
                setError("User ID not found. Please log in.")
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`http://103.82.132.113:8080/api/ChattingResult/user/${userID}`)
                setResults(response.data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching results:", error)
                setError("Failed to load your results. Please try again later.")
                setLoading(false)
            }
        }

        fetchResults()
    }, [userID])

    // Format date to a more readable format
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        return new Date(dateString).toLocaleDateString("en-US", options)
    }

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score >= 8) return "success"
        if (score >= 6) return "primary"
        return "danger"
    }

    // Get score label based on value
    const getScoreLabel = (score) => {
        if (score >= 8) return "Excellent"
        if (score >= 6) return "Good"
        return "Needs Improvement"
    }

    if (loading) {
        return (
            <div className="results-page">
                <Header />
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your results...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="results-page">
                <Header />
                <div className="error-container">
                    <div className="error-icon">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/ai-mode/Chatting")}>
                        Back to Conversations
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="results-page">
            <Header />

            <div className="results-container mt-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="results-header">
                                <div>
                                    <h1 className="results-title">My Conversation Results</h1>
                                    <p className="results-subtitle">
                                        Review your past conversation exercises and see your progress over time
                                    </p>
                                </div>
                                <button className="btn btn-outline-primary" onClick={() => navigate("/ai-mode/Chatting")}>
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to Conversations
                                </button>
                            </div>

                            {results.length === 0 ? (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <i className="bi bi-chat-square-text"></i>
                                    </div>
                                    <h3>No Results Yet</h3>
                                    <p>
                                        You haven't completed any conversation exercises yet. Complete a conversation and submit it to see
                                        your results here.
                                    </p>
                                    <button className="btn btn-primary" onClick={() => navigate("/ai-mode/Chatting")}>
                                        Start Practicing
                                    </button>
                                </div>
                            ) : (
                                <div className="results-list">
                                    {results.map((result) => (
                                        <div className="result-card" key={result.chattingResultID}>
                                            <div className="result-header">
                                                <div className="result-date">
                                                    <i className="bi bi-calendar-event me-2"></i>
                                                    {formatDate(result.createdAt)}
                                                </div>
                                                <div className={`result-score score-${getScoreColor(result.score)}`}>
                                                    <div className="score-value">{result.score}</div>
                                                    <div className="score-label">{getScoreLabel(result.score)}</div>
                                                </div>
                                            </div>
                                            <div className="result-body">
                                                <h3 className="result-title">Conversation Evaluation</h3>
                                                <div className="result-evaluation">{result.evaluation}</div>
                                            </div>
                                            <div className="result-footer">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => navigate(`/ai-mode/Chatting/${result.chattingExerciseID}`)}
                                                >
                                                    <i className="bi bi-chat-dots me-2"></i>
                                                    Practice Again
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        /* Page Layout */
        .results-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .results-container {
          padding-top: 80px; /* Adjust based on your header height */
          padding-bottom: 50px;
        }
        
        /* Loading and Error States */
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }
        
        .error-icon {
          font-size: 3rem;
          color: #dc3545;
          margin-bottom: 1rem;
        }
        
        /* Results Header */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .results-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333;
        }
        
        .results-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 0;
        }
        
        .btn-outline-primary {
          color: #4A90E2;
          border-color: #4A90E2;
          border-radius: 30px;
          padding: 8px 20px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .btn-outline-primary:hover {
          background-color: #4A90E2;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
        }
        
        /* No Results */
        .no-results {
          background-color: white;
          border-radius: 15px;
          padding: 60px 20px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }
        
        .no-results-icon {
          font-size: 4rem;
          color: #adb5bd;
          margin-bottom: 20px;
        }
        
        .no-results h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }
        
        .no-results p {
          color: #666;
          margin-bottom: 25px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .btn-primary {
          background-color: #4A90E2;
          border-color: #4A90E2;
          border-radius: 30px;
          padding: 10px 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background-color: #3672b9;
          border-color: #3672b9;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
        }
        
        /* Results List */
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .result-card {
          background-color: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .result-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .result-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .result-date {
          color: #666;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
        }
        
        .result-score {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 15px;
          border-radius: 30px;
          font-weight: 600;
        }
        
        .score-success {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        
        .score-primary {
          background-color: rgba(74, 144, 226, 0.1);
          color: #4A90E2;
        }
        
        .score-danger {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        .score-value {
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .score-label {
          font-size: 0.9rem;
        }
        
        .result-body {
          padding: 20px;
        }
        
        .result-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }
        
        .result-evaluation {
          color: #555;
          line-height: 1.7;
          white-space: pre-line;
        }
        
        .result-footer {
          padding: 15px 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .results-title {
            font-size: 1.8rem;
          }
          
          .result-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .result-score {
            align-self: flex-start;
          }
        }
      `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default ChattingExerciseResults

