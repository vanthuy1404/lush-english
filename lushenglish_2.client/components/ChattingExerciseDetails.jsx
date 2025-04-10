"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const ChattingExerciseDetails = () => {
    const [userInput, setUserInput] = useState("")
    const [exercise, setExercise] = useState(null)
    const [messages, setMessages] = useState([])
    const [saveMessages, setSaveMessages] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)
    const { ChattingExerciseID } = useParams()
    const navigate = useNavigate()

    // Add a new state variable for showing results
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)
    const [evaluation, setEvaluation] = useState("")

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Fetch exercise data
    const fetchExercise = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://103.82.132.113:8080/api/ChattingExercise/${ChattingExerciseID}`)
            setExercise(response.data)

            // Initialize messages
            if (response.data.messages && response.data.messages.length > 0) {
                setMessages(response.data.messages)
            } else if (response.data.openingQuestion) {
                setMessages([{ role: "assistant", content: response.data.openingQuestion }])
            } else {
                setMessages([
                    {
                        role: "assistant",
                        content: `Hello! I'm your conversation partner. I'll be playing the role of ${response.data.aiRole || "a friendly assistant"}. Let's practice English together!`,
                    },
                ])
            }

            setLoading(false)
        } catch (error) {
            console.error("Error fetching exercise:", error)
            setError("Failed to load conversation. Please try again later.")
            setLoading(false)
        }
    }, [ChattingExerciseID])

    useEffect(() => {
        fetchExercise()
    }, [fetchExercise])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Handle message submission
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault()
            if (!userInput.trim() || sending) return

            // Add user message to chat
            const updatedMessages = [...messages, { role: "user", content: userInput }]
            setMessages(updatedMessages)
            setSending(true)
            setUserInput("")

            // Prepare request data
            const requestBody = {
                chattingExerciseID: ChattingExerciseID,
                chatMessages: updatedMessages,
            }
            try {
                const response = await axios.post("http://103.82.132.113:8080/api/ChattingResponse", requestBody, {
                    headers: { "Content-Type": "application/json" },
                })

                if (response.data && response.data.replyMessage) {
                    // Add AI response to chat
                    setTimeout(() => {
                        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: response.data.replyMessage }])
                        setSending(false)
                        setEvaluation(response.data.evaluation)
                        setScore(response.data.score)
                        console.log(messages);

                    }, 500)
                } else {
                    setSending(false)
                }
            } catch (error) {
                console.error("Error sending message:", error)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." },
                ])
                setSending(false)
            }
        },
        [userInput, messages, ChattingExerciseID],
    )

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Add a function to handle showing results
    const handleShowResults = async () => {
        setLoading(true)
            setLoading(false)
            setShowResults(true)
        
    }
    const handleSaveResults = async () => {
        try {
            const response = await axios.get(`http://103.82.132.113:8080/api/ChattingResult/ChattingExercise/${ChattingExerciseID}`);
            const data = response.data;

            const requestBody = {
                chattingResultID: data?.chattingResultID || crypto.randomUUID(),
                chattingExerciseID: ChattingExerciseID,
                userID: localStorage.getItem("userID"),
                score: score,
                evaluation: evaluation,
                createdAt: new Date().toISOString()
            };

            if (!data) {
                await axios.post("http://103.82.132.113:8080/api/ChattingResult", requestBody);
                alert("Result saved successfully (POST)");
            } else {
                await axios.put("http://103.82.132.113:8080/api/ChattingResult", requestBody);
                alert("Result updated successfully (PUT)");
            }
        } catch (error) {
            console.error("Error saving result:", error);
            alert("Failed to save result.");
        }
    };

    if (loading) {
        return (
            <div className="chat-exercise-page">
                <Header />
                <div className="loading-container">
                    <div className="chat-loader">
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                    </div>
                    <p>Loading conversation...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="chat-exercise-page">
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
        <div className="chat-exercise-page">
            <Header />

            <div className="chat-container mt-5">
                <div className="chat-header">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <button className="back-button" onClick={() => navigate("/ai-mode/Chatting")}>
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                                <div className="chat-info">
                                    <h1 className="chat-title">{exercise?.chattingExerciseName || "Conversation Practice"}</h1>
                                    <div className="chat-subtitle">
                                        <span className="ai-role">
                                            <i className="bi bi-person-circle"></i>
                                            {exercise?.aiRole || "Conversation Partner"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 d-none d-md-block">
                                <div className="chat-actions">
                                    <div className="objective-badge me-2">
                                        <i className="bi bi-bullseye"></i>
                                        <span>Practice Objective</span>
                                    </div>
                                    <button className="results-button" onClick={handleShowResults} disabled={messages.length < 3}>
                                        <i className="bi bi-trophy"></i>
                                        <span>Submit and see results</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="chat-card">
                                {exercise?.objective && (
                                    <div className="objective-panel">
                                        <div className="objective-header">
                                            <i className="bi bi-bullseye"></i>
                                            <h3>Conversation Objective</h3>
                                        </div>
                                        <p>{exercise.objective}</p>
                                        <div className="objective-tips">
                                            <h4>Tips:</h4>
                                            <ul>
                                                <li>Respond naturally as if in a real conversation</li>
                                                <li>Try to use varied vocabulary and expressions</li>
                                                <li>Ask questions to keep the conversation flowing</li>
                                                <li>Practice proper greetings and conversation closings</li>
                                                <li>When you think the conversation finished, just click "Submit" button above to see your result</li>

                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="chat-messages" id="chat-messages">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message-container ${message.role === "user" ? "user-message-container" : "assistant-message-container"}`}
                                        >
                                            {message.role === "assistant" && (
                                                <div className="message-avatar">
                                                    <i className="bi bi-person-circle"></i>
                                                </div>
                                            )}

                                            <div className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
                                                <div className="message-content">{message.content}</div>
                                                {message.role === "assistant" && (
                                                    <button className="audio-button" title="Listen">
                                                        <i className="bi bi-volume-up"></i>
                                                    </button>
                                                )}
                                            </div>

                                            {message.role === "user" && (
                                                <div className="message-avatar user-avatar">
                                                    <i className="bi bi-person"></i>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {sending && (
                                        <div className="message-container assistant-message-container">
                                            <div className="message-avatar">
                                                <i className="bi bi-person-circle"></i>
                                            </div>
                                            <div className="message assistant-message typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="results-button-container d-md-none">
                                    <button className="btn btn-results w-100" onClick={handleShowResults} disabled={messages.length < 3}>
                                        <i className="bi bi-trophy me-2"></i>
                                        Submit and see results
                                    </button>
                                </div>

                                <div className="chat-input-container">
                                    <form onSubmit={handleSubmit} className="chat-form">
                                        <div className="input-group">
                                            <textarea
                                                className="form-control chat-input"
                                                placeholder="Type your message in English..."
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                                rows="1"
                                            />
                                            <button type="submit" className="send-button" disabled={!userInput.trim() || sending}>
                                                <i className="bi bi-send-fill"></i>
                                            </button>
                                        </div>
                                        <div className="input-help">Press Enter to send, Shift+Enter for new line</div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showResults && (
                <div className="results-modal-overlay">
                    <div className="results-modal">
                        <div className="results-modal-header">
                            <h2>Conversation Results</h2>
                            <button className="close-button" onClick={() => setShowResults(false)}>
                                ×
                            </button>
                        </div>
                        <div className="results-modal-body">
                            <div className="score-section">
                                <div className="score-circle">
                                    <div className="score-value">{score}</div>
                                    <div className="score-max">/10</div>
                                </div>
                                <div className="score-label">
                                    {score >= 8 ? "Excellent!" : score >= 6 ? "Good job!" : "Keep practicing!"}
                                </div>
                            </div>

                            <div className="evaluation-section">
                                <h3>Evaluation</h3>
                                <div className="evaluation-content">
                                    {evaluation || "No evaluation available yet. Continue the conversation to receive feedback."}
                                </div>
                            </div>
                        </div>
                        <div className="results-modal-footer">
                            <button className="btn btn-primary" onClick={() => setShowResults(false)}>
                                Continue Practicing
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveResults}>
                                Save Result
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Page Layout */
                .chat-exercise-page {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .chat-container {
                    padding-top: 80px; /* Adjust based on your header height */
                    padding-bottom: 30px;
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
                
                .chat-loader {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                
                .bubble {
                    width: 15px;
                    height: 15px;
                    margin: 0 5px;
                    background-color: #4A90E2;
                    border-radius: 50%;
                    animation: typing 1.5s infinite ease-in-out;
                }
                
                .bubble:nth-child(1) {
                    animation-delay: 0s;
                }
                
                .bubble:nth-child(2) {
                    animation-delay: 0.3s;
                }
                
                .bubble:nth-child(3) {
                    animation-delay: 0.6s;
                }
                
                @keyframes typing {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .error-icon {
                    font-size: 3rem;
                    color: #dc3545;
                    margin-bottom: 1rem;
                }
                
                /* Chat Header */
                .chat-header {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    padding: 20px 0;
                    margin-bottom: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .back-button {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    transition: all 0.3s ease;
                    float: left;
                }
                
                .back-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateX(-3px);
                }
                
                .chat-info {
                    overflow: hidden;
                }
                
                .chat-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .chat-subtitle {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                
                .ai-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .chat-actions {
                    display: flex;
                    justify-content: flex-end;
                }
                
                .objective-badge {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 30px;
                    padding: 8px 15px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .objective-badge:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }
                
                /* Chat Card */
                .chat-card {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: calc(80vh - 80px);
                    min-height: 500px;
                }
                
                /* Objective Panel */
                .objective-panel {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .objective-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                
                .objective-header i {
                    color: #4A90E2;
                    font-size: 1.2rem;
                }
                
                .objective-header h3 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0;
                    color: #333;
                }
                
                .objective-panel p {
                    color: #555;
                    margin-bottom: 15px;
                }
                
                .objective-tips {
                    background-color: rgba(74, 144, 226, 0.1);
                    border-radius: 10px;
                    padding: 15px;
                }
                
                .objective-tips h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #4A90E2;
                }
                
                .objective-tips ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .objective-tips li {
                    margin-bottom: 5px;
                    color: #555;
                }
                
                /* Chat Messages */
                .chat-messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .message-container {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    max-width: 85%;
                }
                
                .user-message-container {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
                
                .message-avatar {
                    width: 36px;
                    height: 36px;
                    background-color: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #4A90E2;
                    flex-shrink: 0;
                }
                
                .user-avatar {
                    background-color: #4A90E2;
                    color: white;
                }
                
                .message {
                    padding: 12px 15px;
                    border-radius: 18px;
                    position: relative;
                    max-width: 100%;
                    word-wrap: break-word;
                }
                
                .assistant-message {
                    background-color: #f0f2f5;
                    color: #333;
                    border-top-left-radius: 4px;
                }
                
                .user-message {
                    background-color: #4A90E2;
                    color: white;
                    border-top-right-radius: 4px;
                }
                
                .message-content {
                    line-height: 1.5;
                    white-space: pre-line;
                }
                
                .audio-button {
                    background: none;
                    border: none;
                    color: #6c757d;
                    padding: 0;
                    margin-left: 8px;
                    font-size: 0.9rem;
                    opacity: 0.7;
                    transition: all 0.2s ease;
                    position: absolute;
                    right: 8px;
                    bottom: 8px;
                }
                
                .audio-button:hover {
                    opacity: 1;
                    color: #4A90E2;
                }
                
                /* Typing Indicator */
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 15px 20px;
                    min-width: 60px;
                }
                
                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    background: #4A90E2;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 2px;
                    opacity: 0.6;
                    animation: typing-dot 1.4s infinite ease-in-out both;
                }
                
                .typing-indicator span:nth-child(1) {
                    animation-delay: -0.32s;
                }
                
                .typing-indicator span:nth-child(2) {
                    animation-delay: -0.16s;
                }
                
                @keyframes typing-dot {
                    0%, 80%, 100% { 
                        transform: scale(0.7);
                    } 
                    40% { 
                        transform: scale(1);
                    }
                }
                
                /* Chat Input */
                .chat-input-container {
                    padding: 15px 20px;
                    border-top: 1px solid #e9ecef;
                    background-color: white;
                }
                
                .chat-form {
                    display: flex;
                    flex-direction: column;
                }
                
                .chat-input {
                    border-radius: 24px;
                    resize: none;
                    padding: 12px 20px;
                    font-size: 1rem;
                    border: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                    max-height: 120px;
                    overflow-y: auto;
                }
                
                .chat-input:focus {
                    border-color: #4A90E2;
                    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
                    outline: none;
                }
                
                .send-button {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    background-color: #FFD700;
                    color: #333;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                    margin-left: 10px;
                }
                
                .send-button:hover:not(:disabled) {
                    background-color: #e6c200;
                    transform: translateY(-2px);
                }
                
                .send-button:disabled {
                    background-color: #e9ecef;
                    color: #adb5bd;
                    cursor: not-allowed;
                }
                
                .input-help {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-top: 5px;
                    text-align: right;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .chat-card {
                        height: calc(100vh - 150px);
                    }
                    
                    .chat-title {
                        font-size: 1.3rem;
                    }
                    
                    .message-container {
                        max-width: 90%;
                    }
                    
                    .objective-panel {
                        padding: 15px;
                    }
                    
                    .chat-messages {
                        padding: 15px;
                    }
                    
                    .chat-input-container {
                        padding: 10px 15px;
                    }
                }

                /* Results Button */
                .results-button {
                  background-color: #FFD700;
                  color: #333;
                  border: none;
                  border-radius: 30px;
                  padding: 8px 15px;
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 0.9rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }

                .results-button:hover:not(:disabled) {
                  background-color: #e6c200;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
                }

                .results-button:disabled {
                  background-color: #f8f9fa;
                  color: #adb5bd;
                  cursor: not-allowed;
                }

                .results-button-container {
                  padding: 10px 20px;
                  border-top: 1px solid #e9ecef;
                }

                .btn-results {
                  background-color: #FFD700;
                  color: #333;
                  font-weight: 600;
                  border-radius: 30px;
                  padding: 10px 20px;
                  transition: all 0.3s ease;
                }

                .btn-results:hover:not(:disabled) {
                  background-color: #e6c200;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
                }

                .btn-results:disabled {
                  background-color: #f8f9fa;
                  color: #adb5bd;
                }

                /* Results Modal */
                .results-modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 1000;
                  padding: 20px;
                }

                .results-modal {
                  background-color: white;
                  border-radius: 15px;
                  width: 90%;
                  max-width: 500px;
                  max-height: 90vh;
                  overflow-y: auto;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                  display: flex;
                  flex-direction: column;
                }

                .results-modal-header {
                  padding: 20px;
                  border-bottom: 1px solid #e9ecef;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }

                .results-modal-header h2 {
                  margin: 0;
                  font-size: 1.5rem;
                  font-weight: 700;
                  color: #333;
                }

                .close-button {
                  background: none;
                  border: none;
                  font-size: 1.5rem;
                  color: #adb5bd;
                  cursor: pointer;
                  transition: all 0.2s ease;
                }

                .close-button:hover {
                  color: #333;
                }

                .results-modal-body {
                  padding: 20px;
                  flex-grow: 1;
                  overflow-y: auto;
                }

                .score-section {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-bottom: 30px;
                }

                .score-circle {
                  width: 120px;
                  height: 120px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                  color: white;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 15px;
                  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }

                .score-value {
                  font-size: 3rem;
                  font-weight: 700;
                  line-height: 1;
                }

                .score-max {
                  font-size: 1.2rem;
                  opacity: 0.8;
                }

                .score-label {
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #333;
                }

                .evaluation-section {
                  background-color: #f8f9fa;
                  border-radius: 10px;
                  padding: 20px;
                }

                .evaluation-section h3 {
                  font-size: 1.3rem;
                  font-weight: 600;
                  margin-bottom: 15px;
                  color: #4A90E2;
                }

                .evaluation-content {
                  color: #555;
                  line-height: 1.7;
                  white-space: pre-line;
                }

                .results-modal-footer {
                  padding: 15px 20px;
                  border-top: 1px solid #e9ecef;
                  display: flex;
                  justify-content: flex-end;
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default ChattingExerciseDetails

