"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const WritingExerciseResults = () => {
    const [results, setResults] = useState([])
    const [expandedResults, setExpandedResults] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const userID = localStorage.getItem("userID")

    // Add a new state to track active tabs for each result
    const [activeTabs, setActiveTabs] = useState({})

    const toggleExpand = (resultId) => {
        setExpandedResults((prev) => ({
            ...prev,
            [resultId]: !prev[resultId],
        }))
    }

    const getScoreColor = (score) => {
        if (score >= 9) return "success"
        if (score >= 7) return "primary"
        if (score >= 5) return "warning"
        return "danger"
    }

    const getScoreLabel = (score) => {
        if (score >= 9) return "Excellent"
        if (score >= 7) return "Good"
        if (score >= 5) return "Fair"
        return "Needs Improvement"
    }

    useEffect(() => {
        const fetchResults = async () => {
            if (!userID) {
                setError("User ID not found. Please log in.")
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`http://103.82.132.113:8080/api/WritingResult/user/${userID}`)
                setResults(response.data)
                setLoading(false)
                console.log(results)
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

    // Add a function to handle tab switching
    const handleTabChange = (resultId, tabName) => {
        setActiveTabs((prev) => ({
            ...prev,
            [resultId]: tabName,
        }))
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
                    <button className="btn btn-primary" onClick={() => navigate("/ai-mode/Writing")}>
                        Back to Writing Exercises
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
                    <div className="results-header">
                        <div>
                            <h1 className="results-title">My Writing Results</h1>
                            <p className="results-subtitle">Review your past writing exercises and see your progress over time</p>
                        </div>
                        <button className="btn btn-outline-primary" onClick={() => navigate("/ai-mode/Writing")}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Writing Exercises
                        </button>
                    </div>

                    {results.length === 0 ? (
                        <div className="no-results">
                            <div className="no-results-icon">
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <h3>No Results Yet</h3>
                            <p>
                                You haven't completed any writing exercises yet. Complete a writing exercise and submit it to see your
                                results here.
                            </p>
                            <button className="btn btn-primary" onClick={() => navigate("/ai-mode/Writing")}>
                                Start Practicing
                            </button>
                        </div>
                    ) : (
                        <div className="results-list">
                            {results.map((result) => (
                                <div className="result-card" key={result.resultID}>
                                    <div className="result-header">
                                        <div className="result-info">
                                            <h3 className="result-exercise-name">{result.writingExerciseName}</h3>
                                            <div className="result-date">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {result.createdAt ? formatDate(result.createdAt) : "No date available"}
                                            </div>
                                        </div>
                                        <div className={`result-score score-${getScoreColor(result.score)}`}>
                                            <div className="score-value">{result.score}</div>
                                            <div className="score-label">{getScoreLabel(result.score)}</div>
                                        </div>
                                    </div>

                                    <div className="result-actions">
                                        <button
                                            className="btn-toggle"
                                            onClick={() => toggleExpand(result.resultID)}
                                            aria-expanded={expandedResults[result.resultID] ? "true" : "false"}
                                        >
                                            {expandedResults[result.resultID] ? "Hide Details" : "Show Details"}
                                            <i className={`bi bi-chevron-${expandedResults[result.resultID] ? "up" : "down"} ms-2`}></i>
                                        </button>
                                    </div>

                                    {expandedResults[result.resultID] && (
                                        <div className="result-details">
                                            <div className="result-tabs">
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${!activeTabs[result.resultID] || activeTabs[result.resultID] === "comparison" ? "active" : ""}`}
                                                            onClick={() => handleTabChange(result.resultID, "comparison")}
                                                        >
                                                            <i className="bi bi-layout-split me-2"></i>
                                                            Comparison
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${activeTabs[result.resultID] === "feedback" ? "active" : ""}`}
                                                            onClick={() => handleTabChange(result.resultID, "feedback")}
                                                        >
                                                            <i className="bi bi-chat-square-text me-2"></i>
                                                            Feedback
                                                        </button>
                                                    </li>
                                                </ul>

                                                <div className="tab-content">
                                                    <div
                                                        className={`tab-pane ${!activeTabs[result.resultID] || activeTabs[result.resultID] === "comparison" ? "show active" : "fade"}`}
                                                    >
                                                        <div className="comparison-container">
                                                            <div className="comparison-column">
                                                                <h4 className="column-title">
                                                                    <i className="bi bi-pencil me-2"></i>
                                                                    Your Submission
                                                                </h4>
                                                                <div className="text-content">
                                                                    <pre
                                                                        style={{
                                                                            whiteSpace: "pre-wrap",
                                                                            fontFamily: "inherit",
                                                                            margin: 0,
                                                                            color: "#333",
                                                                        }}
                                                                    >
                                                                        {result.submittedText}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                            <div className="comparison-column">
                                                                <h4 className="column-title">
                                                                    <i className="bi bi-check-circle me-2"></i>
                                                                    Corrected Version
                                                                </h4>
                                                                <div className="text-content">
                                                                    <pre
                                                                        style={{
                                                                            whiteSpace: "pre-wrap",
                                                                            fontFamily: "inherit",
                                                                            margin: 0,
                                                                            color: "#333",
                                                                        }}
                                                                    >
                                                                        {result.correctedText}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`tab-pane ${activeTabs[result.resultID] === "feedback" ? "show active" : "fade"}`}
                                                    >
                                                        <div className="feedback-container">
                                                            <h4 className="feedback-title">
                                                                <i className="bi bi-chat-quote me-2"></i>
                                                                Instructor Feedback
                                                            </h4>
                                                            <div className="feedback-content">
                                                                <pre
                                                                    style={{
                                                                        whiteSpace: "pre-wrap",
                                                                        fontFamily: "inherit",
                                                                        margin: 0,
                                                                        color: "#333",
                                                                        fontSize: "1rem",
                                                                        lineHeight: "1.6",
                                                                    }}
                                                                >
                                                                    {result.feedback}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="result-footer">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => navigate(`/ai-mode/Writing/${result.writingExerciseID}`)}
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Practice Again
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
          gap: 25px;
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
        
        .result-info {
          flex-grow: 1;
        }
        
        .result-exercise-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
        }
        
        .result-date {
          color: #666;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }
        
        .result-score {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
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
        
        .score-warning {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
        
        .score-danger {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        .score-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .score-label {
          font-size: 0.9rem;
        }
        
        .result-actions {
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .btn-toggle {
          background: none;
          border: none;
          color: #4A90E2;
          font-weight: 600;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .btn-toggle:hover {
          color: #3672b9;
        }
        
        /* Result Details */
        .result-details {
          padding: 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .result-tabs {
          display: flex;
          flex-direction: column;
        }
        
        .nav-tabs {
          border-bottom: 1px solid #e9ecef;
          padding: 0 20px;
        }
        
        .nav-tabs .nav-link {
          border: none;
          color: #495057;
          padding: 15px 20px;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }
        
        .nav-tabs .nav-link.active {
          color: #4A90E2;
          background-color: transparent;
          border-bottom-color: #4A90E2;
        }
        
        .nav-tabs .nav-link:hover:not(.active) {
          border-bottom-color: #e9ecef;
        }
        
        .tab-content {
          padding: 20px;
        }
        
        /* Comparison Tab */
        .comparison-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .comparison-column {
          flex: 1;
          min-width: 300px;
        }
        
        .column-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .text-content {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          white-space: pre-line;
          line-height: 1.6;
          color: #333;
          max-height: 300px;
          overflow-y: auto;
        }
        
        /* Feedback Tab */
        .feedback-container {
          padding: 0;
        }
        
        .feedback-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
        }
        
        .feedback-content {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          white-space: pre-line;
          line-height: 1.6;
          color: #333;
          max-height: 300px;
          overflow-y: auto;
        }
        
        /* Corrected Tab */
        .corrected-container {
          padding: 0;
        }
        
        .corrected-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
        }
        
        .corrected-content {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          white-space: pre-line;
          line-height: 1.6;
          color: #333;
          max-height: 300px;
          overflow-y: auto;
        }
        
        /* Result Footer */
        .result-footer {
          padding: 15px 20px;
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
            margin-top: 10px;
          }
          
          .comparison-container {
            flex-direction: column;
          }
          
          .comparison-column {
            min-width: 100%;
          }
          
          .nav-tabs {
            padding: 0 10px;
          }
          
          .nav-tabs .nav-link {
            padding: 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default WritingExerciseResults

