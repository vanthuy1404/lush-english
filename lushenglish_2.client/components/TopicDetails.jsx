"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const TopicDetails = () => {
    const { topicID } = useParams()
    const [topic, setTopic] = useState(null)
    const [vocabularies, setVocabularies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("video")
    const navigate = useNavigate()

    // Fetch topic details and vocabularies
    useEffect(() => {
        setLoading(true)

        const fetchTopicDetails = axios.get(`http://103.82.132.113:8080/api/Topics/${topicID}`)
        const fetchVocabularies = axios.get(`http://103.82.132.113:8080/api/Vocabularies/topic/${topicID}`)

        Promise.all([fetchTopicDetails, fetchVocabularies])
            .then(([topicResponse, vocabResponse]) => {
                setTopic(topicResponse.data)
                setVocabularies(vocabResponse.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setError("Failed to load lesson content. Please try again later.")
                setLoading(false)
            })
    }, [topicID])

    // Get YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null
        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)|youtu\.be\/([^?&]+)/
        const match = url.match(regex)
        return match ? match[1] || match[2] : null
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                <p>Loading lesson content...</p>

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
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Try Again
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

    const videoId = getYouTubeVideoId(topic?.linkVideo)

    return (
        <div className="topic-details-page">
            <Header />

            {/* Topic Header */}
            <div className="topic-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <span className="topic-category">English Lesson</span>
                            <h1 className="topic-title">{topic.topicName}</h1>
                            <p className="topic-description">{topic.description}</p>

                            <div className="topic-meta">
                                <div className="topic-meta-item">
                                    <i className="bi bi-book"></i>
                                    <span>{vocabularies.length} vocabulary words</span>
                                </div>
                                <div className="topic-meta-item">
                                    <i className="bi bi-clock"></i>
                                    <span>Approx. 30 minutes</span>
                                </div>
                                <div className="topic-meta-item">
                                    <i className="bi bi-bar-chart"></i>
                                    <span>Intermediate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>

            {/* Content Tabs */}
            <div className="content-tabs">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <ul className="nav nav-pills mb-4 justify-content-center" id="lessonTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === "video" ? "active" : ""}`}
                                        onClick={() => setActiveTab("video")}
                                    >
                                        <i className="bi bi-play-circle me-2"></i>
                                        Video Lesson
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === "vocabulary" ? "active" : ""}`}
                                        onClick={() => setActiveTab("vocabulary")}
                                    >
                                        <i className="bi bi-journal-text me-2"></i>
                                        Vocabulary
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === "practice" ? "active" : ""}`}
                                        onClick={() => setActiveTab("practice")}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Practice
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content" id="lessonTabContent">
                                {/* Video Tab */}
                                <div className={`tab-pane fade ${activeTab === "video" ? "show active" : ""}`}>
                                    <div className="video-container">
                                        {videoId ? (
                                            <div className="ratio ratio-16x9 video-wrapper">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title={topic.topicName}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="no-video">
                                                <i className="bi bi-camera-video-off"></i>
                                                <p>No video available for this lesson</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="video-info mt-4">
                                        <h3>About this lesson</h3>
                                        <p>
                                            This lesson covers essential vocabulary and concepts related to {topic.topicName.toLowerCase()}.
                                            Watch the video to learn proper pronunciation and usage in context.
                                        </p>

                                        <div className="key-points mt-4">
                                            <h4>Key Learning Points</h4>
                                            <ul>
                                                <li>Understanding the core vocabulary for {topic.topicName.toLowerCase()}</li>
                                                <li>Proper pronunciation and usage in conversations</li>
                                                <li>Common phrases and expressions</li>
                                                <li>Cultural context and practical applications</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Vocabulary Tab */}
                                <div className={`tab-pane fade ${activeTab === "vocabulary" ? "show active" : ""}`}>
                                    <div className="vocabulary-container">
                                        <div className="vocabulary-header">
                                            <h3>
                                                <i className="bi bi-journal-text me-2"></i>
                                                Vocabulary List
                                            </h3>
                                            <p>Master these {vocabularies.length} words to improve your English skills</p>
                                        </div>

                                        {vocabularies.length > 0 ? (
                                            <div className="vocabulary-grid">
                                                {vocabularies.map((vocab) => (
                                                    <div className="vocabulary-card" key={vocab.vocabularyID}>
                                                        <div className="vocabulary-card-inner">
                                                            <div className="vocabulary-card-front">
                                                                <div className="word-type">{vocab.type}</div>
                                                                <h4 className="word">{vocab.word}</h4>
                                                                <div className="pronunciation">{vocab.pronunciation}</div>
                                                            </div>
                                                            <div className="vocabulary-card-back">
                                                                <h5>Meaning</h5>
                                                                <p>{vocab.meaning}</p>
                                                                <div className="audio-control">
                                                                    <button className="btn btn-sm btn-audio">
                                                                        <i className="bi bi-volume-up"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-vocabulary">
                                                <i className="bi bi-journal-x"></i>
                                                <p>No vocabulary words available for this lesson</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Practice Tab */}
                                <div className={`tab-pane fade ${activeTab === "practice" ? "show active" : ""}`}>
                                    <div className="practice-container text-center">
                                        <div className="practice-icon">
                                            <i className="bi bi-pencil-square"></i>
                                        </div>
                                        <h3>Ready to practice?</h3>
                                        <p>
                                            Test your knowledge of these vocabulary words with interactive exercises. Complete the practice to
                                            reinforce your learning.
                                        </p>
                                        <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate("/practices")}>
                                            <i className="bi bi-lightning-charge me-2"></i>
                                            Start Practice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="lesson-navigation">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="navigation-buttons">
                                <button className="btn btn-outline-primary" onClick={() => navigate("/lessons")}>
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to Lessons
                                </button>
                                <div>
                                    <button className="btn btn-outline-secondary me-2">
                                        <i className="bi bi-bookmark me-1"></i>
                                        Save
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        <i className="bi bi-share me-1"></i>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Topics */}
            <div className="related-topics py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-4">
                            <h3 className="section-title">Related Topics</h3>
                            <p className="section-subtitle">Continue your learning journey with these related lessons</p>
                        </div>
                    </div>
                    <div className="row">
                        {[1, 2, 3].map((item) => (
                            <div className="col-md-4" key={item}>
                                <div className="related-topic-card">
                                    <div className="related-topic-image">
                                        <img src={`/placeholder.svg?height=150&width=300`} alt="Related topic" />
                                    </div>
                                    <div className="related-topic-content">
                                        <h4>Related English Topic {item}</h4>
                                        <p>Continue building your vocabulary with this related lesson</p>
                                        <a href="#" className="btn btn-link">
                                            View Lesson <i className="bi bi-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                /* Topic Header */
                .topic-header {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    padding: 80px 0 100px;
                    position: relative;
                }
                
                .topic-category {
                    display: inline-block;
                    background-color: rgba(255, 255, 255, 0.2);
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }
                
                .topic-title {
                    font-size: 2.8rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                
                .topic-description {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    max-width: 700px;
                    margin: 0 auto 25px;
                }
                
                .topic-meta {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                }
                
                .topic-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .topic-meta-item i {
                    font-size: 1.2rem;
                }
                
                .wave-bottom {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                /* Content Tabs */
                .content-tabs {
                    padding: 50px 0;
                }
                
                .nav-pills {
                    background-color: #f8f9fa;
                    border-radius: 50px;
                    padding: 5px;
                    display: inline-flex;
                }
                
                .nav-pills .nav-link {
                    border-radius: 50px;
                    padding: 10px 20px;
                    color: #555;
                    font-weight: 500;
                    margin: 0 5px;
                    transition: all 0.3s ease;
                }
                
                .nav-pills .nav-link.active {
                    background-color: #4A90E2;
                    color: white;
                    box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
                }
                
                .tab-content {
                    margin-top: 30px;
                }
                
                /* Video Tab */
                .video-wrapper {
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .no-video {
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 80px 20px;
                    text-align: center;
                    color: #777;
                }
                
                .no-video i {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    opacity: 0.5;
                }
                
                .video-info {
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 25px;
                }
                
                .video-info h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .key-points {
                    background-color: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                }
                
                .key-points h4 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #4A90E2;
                }
                
                .key-points ul {
                    padding-left: 20px;
                }
                
                .key-points li {
                    margin-bottom: 10px;
                    position: relative;
                }
                
                /* Vocabulary Tab */
                .vocabulary-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .vocabulary-header h3 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .vocabulary-header p {
                    color: #666;
                }
                
                .vocabulary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .vocabulary-card {
                    perspective: 1000px;
                    height: 200px;
                }
                
                .vocabulary-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                }
                
                .vocabulary-card:hover .vocabulary-card-inner {
                    transform: rotateY(180deg);
                }
                
                .vocabulary-card-front, .vocabulary-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 15px;
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                }
                
                .vocabulary-card-front {
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                    color: #333;
                }
                
                .vocabulary-card-back {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    transform: rotateY(180deg);
                }
                
                .word-type {
                    display: inline-block;
                    background-color: rgba(74, 144, 226, 0.1);
                    color: #4A90E2;
                    padding: 3px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-bottom: 15px;
                    align-self: flex-start;
                }
                
                .word {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                
                .pronunciation {
                    font-style: italic;
                    color: #666;
                }
                
                .vocabulary-card-back h5 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                
                .audio-control {
                    margin-top: auto;
                    align-self: flex-end;
                }
                
                .btn-audio {
                    background-color: rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .btn-audio:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .no-vocabulary {
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 80px 20px;
                    text-align: center;
                    color: #777;
                }
                
                .no-vocabulary i {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    opacity: 0.5;
                }
                
                /* Practice Tab */
                .practice-container {
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 60px 20px;
                }
                
                .practice-icon {
                    width: 80px;
                    height: 80px;
                    background-color: rgba(74, 144, 226, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                
                .practice-icon i {
                    font-size: 2.5rem;
                    color: #4A90E2;
                }
                
                .practice-container h3 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .practice-container p {
                    max-width: 600px;
                    margin: 0 auto;
                    color: #666;
                }
                
                .btn-primary {
                    background-color: #4A90E2;
                    border-color: #4A90E2;
                    border-radius: 30px;
                    padding: 12px 30px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    background-color: #3672b9;
                    border-color: #3672b9;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                /* Navigation Buttons */
                .lesson-navigation {
                    padding: 20px 0 50px;
                }
                
                .navigation-buttons {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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
                
                .btn-outline-secondary {
                    color: #6c757d;
                    border-color: #6c757d;
                    border-radius: 30px;
                    padding: 8px 15px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-secondary:hover {
                    background-color: #6c757d;
                    color: white;
                }
                
                /* Related Topics */
                .related-topics {
                    background-color: #f8f9fa;
                }
                
                .section-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .section-subtitle {
                    color: #666;
                    margin-bottom: 30px;
                }
                
                .related-topic-card {
                    background-color: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    height: 100%;
                }
                
                .related-topic-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                
                .related-topic-image img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                
                .related-topic-content {
                    padding: 20px;
                }
                
                .related-topic-content h4 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .related-topic-content p {
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }
                
                .btn-link {
                    color: #4A90E2;
                    padding: 0;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-link:hover {
                    color: #3672b9;
                }
                
                .btn-link i {
                    transition: transform 0.3s ease;
                }
                
                .btn-link:hover i {
                    transform: translateX(5px);
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .topic-title {
                        font-size: 2.3rem;
                    }
                    
                    .topic-meta {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .vocabulary-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                }
                
                @media (max-width: 768px) {
                    .topic-header {
                        padding: 60px 0 80px;
                    }
                    
                    .topic-title {
                        font-size: 2rem;
                    }
                    
                    .nav-pills {
                        width: 100%;
                        border-radius: 30px;
                        overflow-x: auto;
                        white-space: nowrap;
                        display: flex;
                        padding: 3px;
                    }
                    
                    .nav-pills .nav-link {
                        padding: 8px 15px;
                        font-size: 0.9rem;
                    }
                    
                    .navigation-buttons {
                        flex-direction: column;
                        gap: 15px;
                        align-items: center;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default TopicDetails

