"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const PracticeQuestions = () => {
    const { practiceID } = useParams()
    const navigate = useNavigate()
    const [practice, setPractice] = useState(null)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [correctAnswers, setCorrectAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes (600 seconds)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

    // Fetch practice details and questions
    useEffect(() => {
        setLoading(true)

        const fetchPractice = axios.get(`http://103.82.132.113:8080/api/Practices/${practiceID}`)
        const fetchQuestions = axios.get(`http://103.82.132.113:8080/api/Questions/practice/${practiceID}`)

        Promise.all([fetchPractice, fetchQuestions])
            .then(([practiceResponse, questionsResponse]) => {
                setPractice(practiceResponse.data)
                setQuestions(questionsResponse.data)

                // Set correct answers map
                const correctMap = {}
                questionsResponse.data.forEach((q) => {
                    correctMap[q.questionID] = q.correctAnswer
                })
                setCorrectAnswers(correctMap)

                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setError("Failed to load practice questions. Please try again later.")
                setLoading(false)
            })
    }, [practiceID])

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
            return () => clearInterval(timer)
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit()
        }
    }, [timeLeft, isSubmitted])

    const handleAnswerSelect = (questionID, choiceKey) => {
        setAnswers({ ...answers, [questionID]: choiceKey })
    }

    const handleSubmit = async () => {
        if (showConfirmSubmit) {
            setShowConfirmSubmit(false)
            setIsSubmitted(true)

            let correctCount = 0
            questions.forEach((q) => {
                if (answers[q.questionID] === correctAnswers[q.questionID]) {
                    correctCount++
                }
            })

            setScore(correctCount)

            const userID = localStorage.getItem("userID")
            if (!userID) return

            try {
                // Check if user already has a score for this practice
                const response = await axios.get(`http://103.82.132.113:8080/api/Scores/user/${userID}/practice/${practiceID}`)
                const existingScore = response.data

                if (existingScore) {
                    // If exists, update score
                    await axios.put(`http://103.82.132.113:8080/api/Scores/${existingScore.scoreID}`, {
                        scoreID: existingScore.scoreID,
                        userID: userID,
                        practiceID: practiceID,
                        totalPoints: correctCount,
                    })
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // If doesn't exist, create new score
                    await axios.post("http://103.82.132.113:8080/api/Scores", {
                        scoreID: crypto.randomUUID(),
                        userID: userID,
                        practiceID: practiceID,
                        totalPoints: correctCount,
                    })
                } else {
                    console.error("Error saving score:", error)
                }
            }
        } else {
            setShowConfirmSubmit(true)
        }
    }

    const handleRetry = () => {
        setAnswers({})
        setTimeLeft(600) // Reset to 10 minutes
        setIsSubmitted(false)
        setScore(0)
        setCurrentQuestionIndex(0)
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
    }

    const getTimeColor = () => {
        if (timeLeft > 300) return "text-success" // More than 5 minutes
        if (timeLeft > 120) return "text-warning" // More than 2 minutes
        return "text-danger" // Less than 2 minutes
    }

    const navigateToQuestion = (index) => {
        setCurrentQuestionIndex(index)
    }

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const getAnsweredQuestionsCount = () => {
        return Object.keys(answers).length
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                <p>Loading practice questions...</p>

                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f8f9fa;
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
                `}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate("/practices")}>
                    Back to Practices
                </button>

                <style jsx>{`
                    .error-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        text-align: center;
                        padding: 0 20px;
                    }
                    
                    .error-icon {
                        font-size: 4rem;
                        color: #dc3545;
                        margin-bottom: 20px;
                    }
                    
                    .error-container h2 {
                        margin-bottom: 15px;
                        color: #333;
                    }
                    
                    .error-container p {
                        margin-bottom: 25px;
                        color: #666;
                        max-width: 500px;
                    }
                `}</style>
            </div>
        )
    }

    // If no questions found
    if (questions.length === 0) {
        return (
            <div className="no-questions-container">
                <Header />
                <div className="container py-5 text-center">
                    <div className="no-questions-icon">
                        <i className="bi bi-question-circle"></i>
                    </div>
                    <h2>No Questions Available</h2>
                    <p>There are no questions available for this practice exercise.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/practices")}>
                        Back to Practices
                    </button>
                </div>

                <style jsx>{`
                    .no-questions-container {
                        min-height: 100vh;
                        background-color: #f8f9fa;
                    }
                    
                    .no-questions-icon {
                        font-size: 4rem;
                        color: #6c757d;
                        margin-bottom: 20px;
                        opacity: 0.5;
                    }
                `}</style>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex]
    const choicesObj = JSON.parse(currentQuestion.choices)
    const choiceEntries = Object.entries(choicesObj)
    const userAnswer = answers[currentQuestion.questionID]
    const correctAnswer = correctAnswers[currentQuestion.questionID]

    // Results screen
    if (isSubmitted) {
        return (
            <div className="results-page">
                <Header />

                <div className="results-container">
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <div className="results-card">
                                    <div className="results-header">
                                        <div className="results-icon">
                                            {score / questions.length >= 0.7 ? (
                                                <i className="bi bi-trophy"></i>
                                            ) : (
                                                <i className="bi bi-emoji-smile"></i>
                                            )}
                                        </div>
                                        <h2 className="results-title">Practice Completed!</h2>
                                        <div className="score-display">
                                            <div className="score-circle">
                                                <div className="score-number">{score}</div>
                                                <div className="score-total">/{questions.length}</div>
                                            </div>
                                            <div className="score-text">
                                                {score / questions.length >= 0.8
                                                    ? "Excellent!"
                                                    : score / questions.length >= 0.6
                                                        ? "Good job!"
                                                        : "Keep practicing!"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="results-body">
                                        <h3>Question Review</h3>
                                        <div className="question-review">
                                            {questions.map((question, index) => {
                                                const isCorrect = answers[question.questionID] === correctAnswers[question.questionID]
                                                return (
                                                    <div
                                                        key={question.questionID}
                                                        className={`review-item ${isCorrect ? "correct" : "incorrect"}`}
                                                        onClick={() => setCurrentQuestionIndex(index)}
                                                    >
                                                        <span className="question-number">{index + 1}</span>
                                                        <span className="question-status">
                                                            {isCorrect ? (
                                                                <i className="bi bi-check-circle-fill"></i>
                                                            ) : (
                                                                <i className="bi bi-x-circle-fill"></i>
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="question-details mt-4">
                                            <h4>Question {currentQuestionIndex + 1}</h4>
                                            <p className="question-text">{currentQuestion.questionText}</p>

                                            <div className="choices-review">
                                                {choiceEntries.map(([choiceKey, choiceValue]) => {
                                                    let className = "choice-item"

                                                    if (choiceKey === correctAnswer) {
                                                        className += " correct"
                                                    } else if (userAnswer === choiceKey) {
                                                        className += " incorrect"
                                                    }

                                                    return (
                                                        <div className={className} key={choiceKey}>
                                                            <span className="choice-letter">{choiceKey}</span>
                                                            <span className="choice-text">{choiceValue}</span>
                                                            {choiceKey === correctAnswer && (
                                                                <span className="choice-icon correct">
                                                                    <i className="bi bi-check-circle-fill"></i>
                                                                </span>
                                                            )}
                                                            {userAnswer === choiceKey && choiceKey !== correctAnswer && (
                                                                <span className="choice-icon incorrect">
                                                                    <i className="bi bi-x-circle-fill"></i>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="results-footer">
                                        <button className="btn btn-outline-primary" onClick={() => navigate("/practices")}>
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Back to Practices
                                        </button>
                                        <button className="btn btn-primary" onClick={handleRetry}>
                                            <i className="bi bi-arrow-repeat me-2"></i>
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .results-page {
                        min-height: 100vh;
                        background-color: #f8f9fa;
                    }
                    
                    .results-container {
                        padding: 40px 0;
                    }
                    
                    .results-card {
                        background-color: white;
                        border-radius: 15px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .results-header {
                        background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                        color: white;
                        padding: 40px 20px;
                        text-align: center;
                    }
                    
                    .results-icon {
                        font-size: 3rem;
                        margin-bottom: 15px;
                    }
                    
                    .results-title {
                        font-size: 2rem;
                        font-weight: 700;
                        margin-bottom: 20px;
                    }
                    
                    .score-display {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .score-circle {
                        width: 120px;
                        height: 120px;
                        background-color: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 15px;
                    }
                    
                    .score-number {
                        font-size: 3rem;
                        font-weight: 700;
                        line-height: 1;
                    }
                    
                    .score-total {
                        font-size: 1.5rem;
                        opacity: 0.8;
                    }
                    
                    .score-text {
                        font-size: 1.5rem;
                        font-weight: 600;
                    }
                    
                    .results-body {
                        padding: 30px;
                    }
                    
                    .results-body h3 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    
                    .question-review {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin-bottom: 30px;
                    }
                    
                    .review-item {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .review-item.correct {
                        background-color: rgba(40, 167, 69, 0.1);
                        border: 2px solid #28a745;
                    }
                    
                    .review-item.incorrect {
                        background-color: rgba(220, 53, 69, 0.1);
                        border: 2px solid #dc3545;
                    }
                    
                    .review-item:hover {
                        transform: scale(1.1);
                    }
                    
                    .question-number {
                        font-weight: 600;
                        color: #333;
                    }
                    
                    .question-status {
                        position: absolute;
                        bottom: -5px;
                        right: -5px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background-color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.8rem;
                    }
                    
                    .review-item.correct .question-status {
                        color: #28a745;
                    }
                    
                    .review-item.incorrect .question-status {
                        color: #dc3545;
                    }
                    
                    .question-details {
                        background-color: #f8f9fa;
                        border-radius: 10px;
                        padding: 20px;
                    }
                    
                    .question-details h4 {
                        font-size: 1.2rem;
                        font-weight: 600;
                        color: #4A90E2;
                        margin-bottom: 10px;
                    }
                    
                    .question-text {
                        font-size: 1.1rem;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    
                    .choices-review {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .choice-item {
                        display: flex;
                        align-items: center;
                        padding: 12px 15px;
                        border-radius: 8px;
                        background-color: white;
                        border: 1px solid #dee2e6;
                        position: relative;
                    }
                    
                    .choice-item.correct {
                        background-color: rgba(40, 167, 69, 0.1);
                        border-color: #28a745;
                    }
                    
                    .choice-item.incorrect {
                        background-color: rgba(220, 53, 69, 0.1);
                        border-color: #dc3545;
                    }
                    
                    .choice-letter {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background-color: #e9ecef;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 600;
                        margin-right: 15px;
                    }
                    
                    .choice-item.correct .choice-letter {
                        background-color: #28a745;
                        color: white;
                    }
                    
                    .choice-item.incorrect .choice-letter {
                        background-color: #dc3545;
                        color: white;
                    }
                    
                    .choice-text {
                        flex-grow: 1;
                    }
                    
                    .choice-icon {
                        margin-left: 10px;
                    }
                    
                    .choice-icon.correct {
                        color: #28a745;
                    }
                    
                    .choice-icon.incorrect {
                        color: #dc3545;
                    }
                    
                    .results-footer {
                        padding: 20px 30px;
                        border-top: 1px solid #dee2e6;
                        display: flex;
                        justify-content: space-between;
                    }
                    
                    .btn-primary {
                        background-color: #4A90E2;
                        border-color: #4A90E2;
                        border-radius: 30px;
                        padding: 10px 25px;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }
                    
                    .btn-primary:hover {
                        background-color: #3672b9;
                        border-color: #3672b9;
                        transform: translateY(-3px);
                        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                    }
                    
                    .btn-outline-primary {
                        color: #4A90E2;
                        border-color: #4A90E2;
                        border-radius: 30px;
                        padding: 10px 25px;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }
                    
                    .btn-outline-primary:hover {
                        background-color: #4A90E2;
                        color: white;
                        transform: translateY(-3px);
                        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                    }
                    
                    @media (max-width: 768px) {
                        .results-footer {
                            flex-direction: column;
                            gap: 15px;
                        }
                        
                        .btn-outline-primary, .btn-primary {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="practice-questions-page">
            <Header />

            {/* Practice Header */}
            <div className="practice-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="practice-info">
                                <h1 className="practice-title">{practice?.practiceName || "Practice Exercise"}</h1>
                                <div className="practice-meta">
                                    <div className="practice-meta-item">
                                        <i className="bi bi-question-circle"></i>
                                        <span>{questions.length} Questions</span>
                                    </div>
                                    <div className="practice-meta-item">
                                        <i className="bi bi-clock"></i>
                                        <span>10 Minutes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Practice Content */}
            <div className="practice-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            {/* Timer and Progress */}
                            <div className="timer-progress-container">
                                <div className="timer-container">
                                    <div className={`timer ${getTimeColor()}`}>
                                        <i className="bi bi-clock"></i>
                                        <span>{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-text">
                                        <span>
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </span>
                                        <span>{getAnsweredQuestionsCount()} Answered</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-primary"
                                            role="progressbar"
                                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                            aria-valuenow={currentQuestionIndex + 1}
                                            aria-valuemin="0"
                                            aria-valuemax={questions.length}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Question Card */}
                            <div className="question-card">
                                <div className="question-header">
                                    <span className="question-number">Question {currentQuestionIndex + 1}</span>
                                    {userAnswer && (
                                        <span className="question-answered">
                                            <i className="bi bi-check-circle-fill"></i> Answered
                                        </span>
                                    )}
                                </div>
                                <div className="question-body">
                                    <h2 className="question-text">{currentQuestion.questionText}</h2>
                                    <div className="choices-container">
                                        {choiceEntries.map(([choiceKey, choiceValue]) => (
                                            <div
                                                className={`choice-item ${userAnswer === choiceKey ? "selected" : ""}`}
                                                key={choiceKey}
                                                onClick={() => handleAnswerSelect(currentQuestion.questionID, choiceKey)}
                                            >
                                                <div className="choice-letter">{choiceKey}</div>
                                                <div className="choice-text">{choiceValue}</div>
                                                {userAnswer === choiceKey && (
                                                    <div className="choice-selected">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="question-footer">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={goToPreviousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={goToNextQuestion}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Question Navigation */}
                            <div className="question-navigation">
                                <div className="navigation-header">
                                    <span>Question Navigation</span>
                                    <span>
                                        {getAnsweredQuestionsCount()} of {questions.length} answered
                                    </span>
                                </div>
                                <div className="navigation-buttons">
                                    {questions.map((question, index) => (
                                        <button
                                            key={question.questionID}
                                            className={`nav-button ${index === currentQuestionIndex ? "active" : ""} ${answers[question.questionID] ? "answered" : ""}`}
                                            onClick={() => navigateToQuestion(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="submit-container">
                                {showConfirmSubmit ? (
                                    <div className="confirm-submit">
                                        <p>
                                            Are you sure you want to submit? You have answered {getAnsweredQuestionsCount()} of{" "}
                                            {questions.length} questions.
                                        </p>
                                        <div className="confirm-buttons">
                                            <button className="btn btn-outline-secondary" onClick={() => setShowConfirmSubmit(false)}>
                                                Cancel
                                            </button>
                                            <button className="btn btn-primary" onClick={handleSubmit}>
                                                Yes, Submit
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn btn-primary btn-lg submit-button" onClick={handleSubmit}>
                                        <i className="bi bi-check2-circle me-2"></i>
                                        Submit Practice
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                /* Practice Header */
                .practice-header {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    padding: 40px 0;
                }
                
                .practice-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                
                .practice-meta {
                    display: flex;
                    gap: 30px;
                }
                
                .practice-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .practice-meta-item i {
                    font-size: 1.2rem;
                }
                
                /* Timer and Progress */
                .timer-progress-container {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 15px;
                    padding: 15px 20px;
                    margin-top: -20px;
                    margin-bottom: 20px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .timer-container {
                    margin-right: 20px;
                    padding-right: 20px;
                    border-right: 1px solid #dee2e6;
                }
                
                .timer {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.2rem;
                    font-weight: 700;
                }
                
                .progress-container {
                    flex-grow: 1;
                }
                
                .progress-text {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .progress {
                    height: 8px;
                    border-radius: 4px;
                    background-color: #f0f0f0;
                }
                
                .progress-bar {
                    background-color: #4A90E2;
                    border-radius: 4px;
                }
                
                /* Question Card */
                .question-card {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                
                .question-header {
                    background-color: #f8f9fa;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .question-number {
                    font-weight: 600;
                    color: #4A90E2;
                }
                
                .question-answered {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #28a745;
                    font-size: 0.9rem;
                }
                
                .question-body {
                    padding: 25px;
                }
                
                .question-text {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 25px;
                    color: #333;
                }
                
                .choices-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .choice-item {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .choice-item:hover {
                    border-color: #4A90E2;
                    background-color: rgba(74, 144, 226, 0.05);
                }
                
                .choice-item.selected {
                    border-color: #4A90E2;
                    background-color: rgba(74, 144, 226, 0.1);
                }
                
                .choice-letter {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background-color: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    margin-right: 15px;
                    transition: all 0.3s ease;
                }
                
                .choice-item.selected .choice-letter {
                    background-color: #4A90E2;
                    color: white;
                }
                
                .choice-text {
                    flex-grow: 1;
                }
                
                .choice-selected {
                    color: #4A90E2;
                    margin-left: 10px;
                }
                
                .question-footer {
                    padding: 15px 25px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                }
                
                /* Question Navigation */
                .question-navigation {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    padding: 20px;
                    margin-bottom: 30px;
                }
                
                .navigation-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .navigation-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .nav-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #dee2e6;
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .nav-button:hover {
                    border-color: #4A90E2;
                }
                
                .nav-button.active {
                    background-color: #4A90E2;
                    border-color: #4A90E2;
                    color: white;
                }
                
                .nav-button.answered {
                    background-color: rgba(74, 144, 226, 0.1);
                    border-color: #4A90E2;
                    color: #4A90E2;
                }
                
                .nav-button.active.answered {
                    background-color: #4A90E2;
                    color: white;
                }
                
                /* Submit Container */
                .submit-container {
                    text-align: center;
                    margin-bottom: 50px;
                }
                
                .submit-button {
                    background-color: #4A90E2;
                    border-color: #4A90E2;
                    border-radius: 30px;
                    padding: 12px 30px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .submit-button:hover {
                    background-color: #3672b9;
                    border-color: #3672b9;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .confirm-submit {
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 20px;
                    margin-top: 20px;
                }
                
                .confirm-submit p {
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .confirm-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
                
                .btn-outline-secondary {
                    color: #6c757d;
                    border-color: #6c757d;
                    border-radius: 30px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-secondary:hover {
                    background-color: #6c757d;
                    color: white;
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
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .practice-title {
                        font-size: 1.8rem;
                    }
                    
                    .practice-meta {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
                
                @media (max-width: 768px) {
                    .timer-progress-container {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .timer-container {
                        margin-right: 0;
                        padding-right: 0;
                        border-right: none;
                        margin-bottom: 15px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #dee2e6;
                    }
                    
                    .question-footer {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .btn-outline-secondary, .btn-outline-primary {
                        width: 100%;
                    }
                    
                    .confirm-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default PracticeQuestions

