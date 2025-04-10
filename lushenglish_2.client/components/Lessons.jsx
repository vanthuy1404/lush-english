"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import Header from "./Header"

const Lessons = () => {
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios
            .get("https://localhost:7007/api/Topics")
            .then((response) => {
                setTopics(response.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching topics:", error)
                setError("Failed to load topics. Please try again later.")
                setLoading(false)
            })
    }, [])

    // Filter topics based on search term
    const filteredTopics = topics.filter((topic) => topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()))

    // Handle search button click
    const handleSearch = () => {
        setSearchTerm(searchQuery)
        setIsSearching(searchQuery.trim() !== "")
    }

    // Handle input change
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        // If search query is cleared, reset search
        if (e.target.value === "") {
            setSearchTerm("")
            setIsSearching(false)
        }
    }

    // Handle key press (Enter)
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    // Handle clear search
    const handleClearSearch = () => {
        setSearchQuery("")
        setSearchTerm("")
        setIsSearching(false)
    }

    // Determine which topics to display
    const displayedTopics = searchTerm ? filteredTopics : topics

    return (
        <div className="lessons-page">
            <Header />

            {/* Hero Section with Search */}
            <div className="lessons-hero">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-4">Explore Our Lessons</h1>
                            <p className="lead mb-4">
                                Discover a wide range of English topics designed to improve your language skills. Each lesson is
                                carefully crafted to make learning engaging and effective.
                            </p>
                            <div className="search-box-hero">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for topics..."
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <button className="search-btn" onClick={handleSearch}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Topics Section */}
            <div className="topics-section py-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="section-header">
                                    <h2 className="section-title">Available Topics</h2>
                                    {isSearching && (
                                        <div className="search-results-info">
                                            <span>
                                                Showing results for: <strong>"{searchTerm}"</strong>
                                                <button className="btn-clear-search" onClick={handleClearSearch}>
                                                    <i className="bi bi-x-circle-fill"></i>
                                                </button>
                                            </span>
                                            <div className="results-count">
                                                {filteredTopics.length} {filteredTopics.length === 1 ? "topic" : "topics"} found
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2 mt-3 mt-md-0">
                                    <div className="input-group search-box">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search topics..."
                                            value={searchQuery}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                        />
                                        {searchQuery && (
                                            <button className="btn btn-outline-secondary clear-btn" type="button" onClick={handleClearSearch}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        )}
                                        <button className="btn btn-outline-primary search-btn" type="button" onClick={handleSearch}>
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading topics...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    ) : displayedTopics.length === 0 ? (
                        <div className="no-results">
                            <div className="no-results-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3>No topics found</h3>
                            <p>We couldn't find any topics matching "{searchTerm}"</p>
                            <button className="btn btn-primary" onClick={handleClearSearch}>
                                Show all topics
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {displayedTopics.map((topic) => (
                                <div className="col-md-6 col-lg-3" key={topic.topicID}>
                                    <div className="topic-card">
                                        <div className="topic-card-img">
                                            <img src={topic.imgUrl || "/placeholder.svg"} alt={topic.topicName} />
                                            <div className="topic-difficulty">
                                                <span className="badge bg-primary">Intermediate</span>
                                            </div>
                                        </div>
                                        <div className="topic-card-body">
                                            <h3 className="topic-title">{topic.topicName}</h3>
                                            <p className="topic-description">{topic.description}</p>
                                            <div className="topic-meta">
                                                <span>
                                                    <i className="bi bi-clock"></i> 45 mins
                                                </span>
                                                <span>
                                                    <i className="bi bi-book"></i> 12 lessons
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => window.open(`/lessons/${topic.topicID}`, "_blank")}
                                                className="btn btn-study"
                                            >
                                                <span>Study Now</span>
                                                <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="cta-card">
                                <div className="row align-items-center">
                                    <div className="col-lg-8">
                                        <h2 className="cta-title">Can't find what you're looking for?</h2>
                                        <p className="cta-text">
                                            We're constantly adding new topics and lessons. Let us know what you'd like to learn next!
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                                        <button className="btn btn-light btn-lg">Request a Topic</button>
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
                .lessons-hero {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    position: relative;
                    padding: 80px 0 100px;
                    margin-top: 80px; /* Adjust based on your header height */
                }
                
                .wave-bottom {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                .search-box-hero {
                    position: relative;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .search-box-hero input {
                    padding: 15px 20px;
                    border-radius: 30px;
                    border: none;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    font-size: 1rem;
                    padding-right: 50px;
                }
                
                .search-box-hero .search-btn {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    background-color: #FFD700;
                    color: #333;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .search-box-hero .search-btn:hover {
                    background-color: #e6c200;
                    transform: scale(1.05);
                }
                
                /* Section Styling */
                .section-header {
                    position: relative;
                }
                
                .section-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #333;
                    position: relative;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                
                .section-title:after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 60px;
                    height: 3px;
                    background: linear-gradient(90deg, #4A90E2, #FFD700);
                    border-radius: 3px;
                }
                
                .search-results-info {
                    display: flex;
                    flex-direction: column;
                    margin-top: 5px;
                    color: #666;
                }
                
                .search-results-info span {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .btn-clear-search {
                    background: none;
                    border: none;
                    color: #dc3545;
                    padding: 0;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                
                .results-count {
                    font-size: 0.9rem;
                    color: #666;
                    margin-top: 5px;
                }
                
                /* Search Box */
                .search-box {
                    width: 300px;
                }
                
                .search-box input {
                    border-radius: 20px 0 0 20px;
                    border-right: none;
                }
                
                .search-box .clear-btn {
                    border-radius: 0;
                    border-left: none;
                    border-right: none;
                    background-color: white;
                    z-index: 10;
                }
                
                .search-box .search-btn {
                    border-radius: 0 20px 20px 0;
                    background-color: #4A90E2;
                    color: white;
                    border-color: #4A90E2;
                }
                
                .search-box .search-btn:hover {
                    background-color: #3672b9;
                    border-color: #3672b9;
                }
                
                /* No Results */
                .no-results {
                    text-align: center;
                    padding: 60px 20px;
                    background-color: #f8f9fa;
                    border-radius: 15px;
                }
                
                .no-results-icon {
                    font-size: 3rem;
                    color: #adb5bd;
                    margin-bottom: 20px;
                }
                
                .no-results h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .no-results p {
                    color: #666;
                    margin-bottom: 20px;
                }
                
                /* Topic Cards */
                .topic-card {
                    background-color: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .topic-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
                }
                
                .topic-card-img {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                
                .topic-card-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                .topic-card:hover .topic-card-img img {
                    transform: scale(1.1);
                }
                
                .topic-difficulty {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }
                
                .topic-card-body {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                
                .topic-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .topic-description {
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 15px;
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .topic-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    font-size: 0.85rem;
                    color: #777;
                }
                
                .topic-meta span {
                    display: flex;
                    align-items: center;
                }
                
                .topic-meta i {
                    margin-right: 5px;
                    color: #4A90E2;
                }
                
                .btn-study {
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
                    align-self: flex-start;
                }
                
                .btn-study:hover {
                    background-color: transparent;
                    color: #FFD700;
                }
                
                .btn-study i {
                    transition: transform 0.3s ease;
                }
                
                .btn-study:hover i {
                    transform: translateX(5px);
                }
                
                /* CTA Section */
                .cta-section {
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
                }
                
                .cta-card .btn-light {
                    background-color: #FFD700;
                    border-color: #FFD700;
                    color: #333;
                    font-weight: 600;
                    padding: 10px 25px;
                    border-radius: 30px;
                    transition: all 0.3s ease;
                }
                
                .cta-card .btn-light:hover {
                    background-color: white;
                    border-color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                /* Buttons */
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
                
                .btn-outline-primary {
                    color: #4A90E2;
                    border-color: #4A90E2;
                    border-radius: 30px;
                    padding: 10px 25px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-primary:hover {
                    background-color: #4A90E2;
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .lessons-hero {
                        padding: 60px 0 80px;
                    }
                    
                    .cta-card {
                        padding: 30px;
                    }
                    
                    .cta-title {
                        font-size: 1.5rem;
                    }
                    
                    .search-box {
                        width: 100%;
                    }
                }
                
                @media (max-width: 768px) {
                    .topic-card-img {
                        height: 180px;
                    }
                    
                    .section-title {
                        font-size: 1.8rem;
                    }
                    
                    .search-results-info {
                        margin-bottom: 15px;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default Lessons

