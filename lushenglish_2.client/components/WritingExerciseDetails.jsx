"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "./Header"

const WritingExerciseDetails = () => {
    const [content, setContent] = useState("")
    const [feedback, setFeedback] = useState("")
    const [correctedText, setCorrectedText] = useState("")
    const [score, setScore] = useState(null)
    const [exerciseData, setExerciseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSaveButton, setShowSaveButton] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [wordCount, setWordCount] = useState(0)
    const [activeTab, setActiveTab] = useState("write")
    const { WritingExerciseID } = useParams()
    const navigate = useNavigate()
    const userID = localStorage.getItem("userID")

    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const response = await fetch(`https://localhost:7007/api/WritingExercise/${WritingExerciseID}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch exercise data")
                }
                const data = await response.json()
                data.requirement = JSON.parse(data.requirement)
                setExerciseData(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchExerciseData()
    }, [WritingExerciseID])

    useEffect(() => {
        // Update word count when content changes
        const words = content.trim() ? content.trim().split(/\s+/) : []
        setWordCount(words.length)
    }, [content])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) {
            alert("Please write something before submitting.")
            return
        }

        setIsSubmitting(true)
        setFeedback("Processing your writing... Please wait.")
        setCorrectedText("")
        setScore(null)
        setActiveTab("feedback")

        const requestBody = {
            submit: content,
            exercise: {
                exerciseName: exerciseData.exerciseName,
                requirement: exerciseData.requirement.join(" "),
            },
        }

        try {
            const response = await fetch("https://localhost:7007/api/WritingResponse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                throw new Error("Failed to get AI feedback")
            }

            const result = await response.json()

            setFeedback(result.feedback)
            setCorrectedText(result.correctLetter)
            setScore(result.score)
            setShowSaveButton(true)
        } catch (error) {
            setFeedback("Error: Unable to process your request. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveResult = async () => {
        if (!content.trim()) {
            alert("Please write something before saving.")
            return
        }

        setIsSaving(true)
        const exerciseName = exerciseData.exerciseName

        try {
            // Check if record already exists
            const checkResponse = await fetch(
                `https://localhost:7007/api/WritingResult/exercise/${exerciseName}/user/${userID}`,
            )

            const requestBody = {
                resultID: crypto.randomUUID(),
                writingExerciseName: exerciseName,
                userID: userID,
                submittedText: content,
                correctedText: correctedText,
                score: score,
                feedback: feedback,
            }

            if (checkResponse.ok) {
                // Record exists -> Update with PUT
                const existingResult = await checkResponse.json()
                const resultID = existingResult[0].resultID

                const updateResponse = await fetch(`https://localhost:7007/api/WritingResult/${resultID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...requestBody, resultID }),
                })

                if (updateResponse.ok) {
                    showSavedNotification("Result updated successfully!")
                } else {
                    alert("Failed to update result.")
                }
            } else {
                // Record doesn't exist -> Create with POST
                const createResponse = await fetch("https://localhost:7007/api/WritingResult", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                })

                if (createResponse.ok) {
                    showSavedNotification("Result saved successfully!")
                } else {
                    alert("Failed to save result.")
                }
            }
        } catch (error) {
            console.error("Error saving result:", error)
            alert("An error occurred while saving.")
        } finally {
            setIsSaving(false)
        }
    }

    const showSavedNotification = (message) => {
        const notification = document.createElement("div")
        notification.className = "save-notification"
        notification.innerHTML = `
            <div class="save-notification-content">
                <i class="bi bi-check-circle-fill"></i>
                <span>${message}</span>
            </div>
        `
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.classList.add("show")
        }, 100)

        setTimeout(() => {
            notification.classList.remove("show")
            setTimeout(() => {
                document.body.removeChild(notification)
            }, 500)
        }, 3000)
    }

    if (loading) {
        return (
            <div className="writing-exercise-page">
                <Header />
                <div className="loading-container">
                    <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                    <p>Loading exercise...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="writing-exercise-page">
                <Header />
                <div className="error-container">
                    <div className="error-icon">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/ai-mode/Writing")}>
                        Back to Exercises
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="writing-exercise-page">
            <Header />

            <div className="exercise-container mt-5">
                <div className="container py-4">
                    {/* Exercise Header */}
                    <div className="exercise-header">
                        <h1 className="exercise-title">{exerciseData.exerciseName}</h1>
                        <div className="exercise-actions">
                            <button className="btn btn-outline-primary" onClick={() => navigate("/ai-mode/Writing")}>
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Exercises
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="exercise-content">
                        <div className="row">
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                {/* Requirements Card */}
                                <div className="requirements-card">
                                    <div className="card-header">
                                        <h2 className="card-title">
                                            <i className="bi bi-list-check me-2"></i>
                                            Requirements
                                        </h2>
                                    </div>
                                    <div className="card-body">
                                        <ul className="requirements-list">
                                            {exerciseData.requirement.map((req, index) => (
                                                <li key={index} className="requirement-item">
                                                    <i className="bi bi-check-circle"></i>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="tips-section">
                                            <h3 className="tips-title">
                                                <i className="bi bi-lightbulb me-2"></i>
                                                Writing Tips
                                            </h3>
                                            <ul className="tips-list">
                                                <li>Start with a clear introduction</li>
                                                <li>Address all requirements in your letter</li>
                                                <li>Use appropriate tone and language</li>
                                                <li>Check grammar and spelling before submitting</li>
                                                <li>Aim for 150-250 words for optimal feedback</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8">
                                {/* Writing and Feedback Tabs */}
                                <div className="writing-feedback-container">
                                    <div className="tabs-container">
                                        <div className="nav-tabs-custom">
                                            <button
                                                className={`tab-button ${activeTab === "write" ? "active" : ""}`}
                                                onClick={() => setActiveTab("write")}
                                            >
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Write
                                            </button>
                                            <button
                                                className={`tab-button ${activeTab === "feedback" ? "active" : ""}`}
                                                onClick={() => setActiveTab("feedback")}
                                                disabled={!feedback}
                                            >
                                                <i className="bi bi-chat-square-text me-2"></i>
                                                Feedback
                                                {score !== null && <span className="score-badge">{score}/10</span>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="tab-content">
                                        {/* Write Tab */}
                                        <div className={`tab-pane ${activeTab === "write" ? "active" : ""}`}>
                                            <div className="writing-area">
                                                <textarea
                                                    className="writing-textarea"
                                                    rows="12"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    placeholder="Write your letter here..."
                                                ></textarea>

                                                <div className="writing-footer">
                                                    <div className="word-count">
                                                        <i className="bi bi-text-paragraph me-2"></i>
                                                        <span>{wordCount} words</span>
                                                        <span
                                                            className={`word-count-indicator ${wordCount < 100 ? "low" : wordCount > 250 ? "high" : "good"
                                                                }`}
                                                        ></span>
                                                    </div>

                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-primary submit-button"
                                                            onClick={handleSubmit}
                                                            disabled={isSubmitting || !content.trim()}
                                                        >
                                                            {isSubmitting ? (
                                                                <>
                                                                    <span
                                                                        className="spinner-border spinner-border-sm me-2"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="bi bi-send me-2"></i>
                                                                    Submit for Review
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback Tab */}
                                        <div className={`tab-pane ${activeTab === "feedback" ? "active" : ""}`}>
                                            {isSubmitting ? (
                                                <div className="feedback-loading">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p>Analyzing your writing...</p>
                                                </div>
                                            ) : feedback ? (
                                                <div className="feedback-content">
                                                    {score !== null && (
                                                        <div className="score-section">
                                                            <div className="score-circle">
                                                                <div className="score-value">{score}</div>
                                                                <div className="score-max">/10</div>
                                                            </div>
                                                            <div className="score-label">
                                                                {score >= 8 ? "Excellent!" : score >= 6 ? "Good job!" : "Keep practicing!"}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="feedback-section">
                                                        <h3 className="feedback-title">
                                                            <i className="bi bi-chat-square-text me-2"></i>
                                                            Feedback
                                                        </h3>
                                                        <div className="feedback-text">{feedback}</div>
                                                    </div>

                                                    {correctedText && (
                                                        <div className="corrected-section">
                                                            <h3 className="corrected-title">
                                                                <i className="bi bi-pencil me-2"></i>
                                                                Corrected Version
                                                            </h3>
                                                            <div className="corrected-text">{correctedText}</div>
                                                        </div>
                                                    )}

                                                    <div className="feedback-actions">
                                                        <button className="btn btn-outline-primary" onClick={() => setActiveTab("write")}>
                                                            <i className="bi bi-pencil-square me-2"></i>
                                                            Edit Your Writing
                                                        </button>

                                                        {showSaveButton && (
                                                            <button className="btn btn-success" onClick={handleSaveResult} disabled={isSaving}>
                                                                {isSaving ? (
                                                                    <>
                                                                        <span
                                                                            className="spinner-border spinner-border-sm me-2"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-save me-2"></i>
                                                                        Save Result
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="no-feedback">
                                                    <div className="no-feedback-icon">
                                                        <i className="bi bi-chat-square"></i>
                                                    </div>
                                                    <h3>No Feedback Yet</h3>
                                                    <p>Submit your writing to receive AI feedback and corrections.</p>
                                                    <button className="btn btn-primary" onClick={() => setActiveTab("write")}>
                                                        Go to Writing
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
                .writing-exercise-page {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .exercise-container {
                    padding-top: 80px; /* Adjust based on your header height */
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
                
                .error-icon {
                    font-size: 3rem;
                    color: #dc3545;
                    margin-bottom: 1rem;
                }
                
                /* Exercise Header */
                .exercise-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .exercise-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #333;
                    margin: 0;
                }
                
                .btn-outline-primary {
                    color: #4A90E2;
                    border-color: #4A90E2;
                    border-radius: 30px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-primary:hover {
                    background-color: #4A90E2;
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                /* Requirements Card */
                .requirements-card {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    height: 100%;
                    overflow: hidden;
                }
                
                .requirements-card .card-header {
                    background-color: #4A90E2;
                    color: white;
                    padding: 1.2rem 1.5rem;
                    border-bottom: none;
                }
                
                .requirements-card .card-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin: 0;
                    display: flex;
                    align-items: center;
                }
                
                .requirements-card .card-body {
                    padding: 1.5rem;
                }
                
                .requirements-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 1.5rem 0;
                }
                
                .requirement-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .requirement-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .requirement-item i {
                    color: #4A90E2;
                    margin-right: 10px;
                    margin-top: 3px;
                    flex-shrink: 0;
                }
                
                .tips-section {
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    padding: 1.2rem;
                    margin-top: 1.5rem;
                }
                
                .tips-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                }
                
                .tips-title i {
                    color: #FFD700;
                }
                
                .tips-list {
                    padding-left: 1.5rem;
                    margin-bottom: 0;
                }
                
                .tips-list li {
                    margin-bottom: 0.5rem;
                    color: #555;
                }
                
                .tips-list li:last-child {
                    margin-bottom: 0;
                }
                
                /* Writing and Feedback Container */
                .writing-feedback-container {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                }
                
                /* Tabs */
                .tabs-container {
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .nav-tabs-custom {
                    display: flex;
                    padding: 0 1rem;
                }
                
                .tab-button {
                    padding: 1rem 1.5rem;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    color: #666;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    position: relative;
                }
                
                .tab-button:hover {
                    color: #4A90E2;
                }
                
                .tab-button.active {
                    color: #4A90E2;
                    border-bottom-color: #4A90E2;
                }
                
                .tab-button:disabled {
                    color: #aaa;
                    cursor: not-allowed;
                }
                
                .score-badge {
                    background-color: #4A90E2;
                    color: white;
                    border-radius: 20px;
                    padding: 2px 8px;
                    font-size: 0.8rem;
                    margin-left: 8px;
                }
                
                /* Tab Content */
                .tab-content {
                    padding: 1.5rem;
                }
                
                .tab-pane {
                    display: none;
                }
                
                .tab-pane.active {
                    display: block;
                }
                
                /* Writing Area */
                .writing-area {
                    display: flex;
                    flex-direction: column;
                }
                
                .writing-textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    resize: vertical;
                    min-height: 300px;
                    font-size: 1rem;
                    line-height: 1.6;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                
                .writing-textarea:focus {
                    outline: none;
                    border-color: #4A90E2;
                    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
                }
                
                .writing-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .word-count {
                    display: flex;
                    align-items: center;
                    color: #666;
                }
                
                .word-count-indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-left: 8px;
                }
                
                .word-count-indicator.low {
                    background-color: #ffc107;
                }
                
                .word-count-indicator.good {
                    background-color: #28a745;
                }
                
                .word-count-indicator.high {
                    background-color: #dc3545;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }
                
                .btn-primary {
                    background-color: #4A90E2;
                    border-color: #4A90E2;
                    color: white;
                    border-radius: 30px;
                    padding: 10px 25px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover:not(:disabled) {
                    background-color: #3672b9;
                    border-color: #3672b9;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .btn-primary:disabled {
                    background-color: #a8c6eb;
                    border-color: #a8c6eb;
                }
                
                .btn-success {
                    background-color: #28a745;
                    border-color: #28a745;
                    color: white;
                    border-radius: 30px;
                    padding: 10px 25px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-success:hover:not(:disabled) {
                    background-color: #218838;
                    border-color: #218838;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
                }
                
                /* Feedback Content */
                .feedback-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 0;
                }
                
                .feedback-loading p {
                    margin-top: 1rem;
                    color: #666;
                }
                
                .no-feedback {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 0;
                    text-align: center;
                }
                
                .no-feedback-icon {
                    font-size: 3rem;
                    color: #aaa;
                    margin-bottom: 1rem;
                }
                
                .no-feedback h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #333;
                }
                
                .no-feedback p {
                    color: #666;
                    margin-bottom: 1.5rem;
                    max-width: 400px;
                }
                
                .feedback-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .score-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .score-circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .score-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    line-height: 1;
                }
                
                .score-max {
                    font-size: 1.2rem;
                    opacity: 0.8;
                }
                
                .score-label {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #333;
                }
                
                .feedback-section, .corrected-section {
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    padding: 1.5rem;
                }
                
                .feedback-title, .corrected-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                }
                
                .feedback-text, .corrected-text {
                    color: #555;
                    line-height: 1.7;
                    white-space: pre-line;
                }
                
                .feedback-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                /* Save Notification */
                .save-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .save-notification.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .save-notification-content {
                    background-color: #28a745;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 30px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .save-notification-content i {
                    font-size: 1.2rem;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .exercise-title {
                        font-size: 1.8rem;
                    }
                    
                    .requirements-card {
                        margin-bottom: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .exercise-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .writing-footer {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .action-buttons {
                        width: 100%;
                    }
                    
                    .btn-primary, .btn-success {
                        width: 100%;
                    }
                    
                    .feedback-actions {
                        flex-direction: column;
                    }
                    
                    .feedback-actions button {
                        width: 100%;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default WritingExerciseDetails

