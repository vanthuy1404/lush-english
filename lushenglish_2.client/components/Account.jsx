"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Header from "./Header"
import { logout } from "../src/redux/userSlice"
import { useDispatch } from "react-redux"
import {
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaIdCard,
    FaStar,
    FaSignOutAlt,
    FaEdit,
    FaTrophy,
    FaHistory,
    FaBookmark,
    FaChartLine,
    FaExclamationTriangle,
} from "react-icons/fa"

function Account() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("profile")
    const userID = localStorage.getItem("userID")
    const dispatch = useDispatch()
    const [showEditModal, setShowEditModal] = useState(false)
    const [editName, setEditName] = useState("")
    const [totalScore, setTotalScore] = useState(null)
    const modalRef = useRef(null)

    const handleLogout = () => {
        localStorage.removeItem("userID")
        dispatch(logout())
        window.location.href = "/"
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!userID) {
                setError("User ID not found")
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`http://103.82.132.113:8080/api/Users/${userID}`)
                setData(response.data)
            } catch (error) {
                console.error("Error fetching user details:", error)
                setError("Failed to fetch user data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userID])

    useEffect(() => {
        const fetchTotalScore = async () => {
            if (!userID) return
            try {
                const response = await axios.get(`http://103.82.132.113:8080/api/Scores/total/user/${userID}`)
                setTotalScore(response.data)
            } catch (error) {
                console.error("Error fetching total score:", error)
                setTotalScore(0)
            }
        }

        fetchTotalScore()
    }, [userID])

    useEffect(() => {
        if (data) {
            setEditName(data.fullName)
        }
    }, [data])

    const handleEditNameClick = () => {
        setShowEditModal(true)
    }

    const handleCloseModal = () => {
        setShowEditModal(false)
        setEditName(data.fullName)
    }

    const handleSaveName = async () => {
        try {
            await axios.put(`http://103.82.132.113:8080/api/Users/${userID}`, {
                ...data,
                fullName: editName,
            })

            setData({
                ...data,
                fullName: editName,
            })

            setShowEditModal(false)
        } catch (error) {
            console.error("Error updating name:", error)
        }
    }

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal()
            }
        }

        if (showEditModal) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showEditModal])

    if (loading) {
        return (
            <div>
                <Header />
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className="error-container">
                    <div className="error-icon">
                        <FaExclamationTriangle size={48} className="text-danger" />
                    </div>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => (window.location.href = "/")}>
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="account-page">
            <Header />

            {/* Hero Section */}
            <div className="account-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="account-title">My Account</h1>
                            <p className="account-subtitle">Manage your profile and view your learning progress</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button className="btn btn-logout" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
               
            </div>

            <div className="container account-container">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3 mb-4">
                        <div className="profile-sidebar">
                            <div className="profile-avatar">
                                <div className="avatar-circle">{data.fullName ? data.fullName.charAt(0).toUpperCase() : "U"}</div>
                                <h3 className="profile-name">{data.fullName}</h3>
                                <div className="profile-level">
                                    <div className="level-badge">
                                        <FaStar className="me-1" />
                                        Level {Math.floor((totalScore || 0) / 100) + 1}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-exp">
                                <div className="exp-label">Experience Points</div>
                                <div className="exp-value">{totalScore !== null ? totalScore : "Loading..."}</div>
                                <div className="progress exp-progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${totalScore % 100}%` }}
                                        aria-valuenow={totalScore % 100}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <div className="exp-next">{100 - (totalScore % 100)} XP to next level</div>
                            </div>

                            <div className="profile-nav">
                                <button
                                    className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                                    onClick={() => setActiveTab("profile")}
                                >
                                    <FaUser className="nav-icon" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    className={`nav-item ${activeTab === "progress" ? "active" : ""}`}
                                    onClick={() => setActiveTab("progress")}
                                >
                                    <FaChartLine className="nav-icon" />
                                    <span>Learning Progress</span>
                                </button>
                                <button
                                    className={`nav-item ${activeTab === "history" ? "active" : ""}`}
                                    onClick={() => setActiveTab("history")}
                                >
                                    <FaHistory className="nav-icon" />
                                    <span>Activity History</span>
                                </button>
                                <button
                                    className={`nav-item ${activeTab === "saved" ? "active" : ""}`}
                                    onClick={() => setActiveTab("saved")}
                                >
                                    <FaBookmark className="nav-icon" />
                                    <span>Saved Lessons</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        {activeTab === "profile" && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h2 className="card-title">Profile Information</h2>
                                    <button className="btn btn-edit" onClick={handleEditNameClick}>
                                        <FaEdit className="me-2" />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="card-body">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaUser />
                                        </div>
                                        <div className="info-content">
                                            <div className="info-label">Full Name</div>
                                            <div className="info-value">{data.fullName}</div>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaEnvelope />
                                        </div>
                                        <div className="info-content">
                                            <div className="info-label">Email Address</div>
                                            <div className="info-value">{data.email}</div>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaCalendarAlt />
                                        </div>
                                        <div className="info-content">
                                            <div className="info-label">Member Since</div>
                                            <div className="info-value">
                                                {new Date(data.createdAt).toLocaleDateString("en-GB", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaIdCard />
                                        </div>
                                        <div className="info-content">
                                            <div className="info-label">User ID</div>
                                            <div className="info-value user-id">{data.userID}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="account-actions">
                                        <button className="btn btn-danger" onClick={handleLogout}>
                                            <FaSignOutAlt className="me-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "progress" && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h2 className="card-title">Learning Progress</h2>
                                </div>
                                <div className="card-body">
                                    <div className="progress-stats">
                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FaTrophy />
                                            </div>
                                            <div className="stat-value">{totalScore || 0}</div>
                                            <div className="stat-label">Total Points</div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <i className="bi bi-book"></i>
                                            </div>
                                            <div className="stat-value">0</div>
                                            <div className="stat-label">Lessons Completed</div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <i className="bi bi-chat-dots"></i>
                                            </div>
                                            <div className="stat-value">0</div>
                                            <div className="stat-label">Conversations</div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <i className="bi bi-pencil-square"></i>
                                            </div>
                                            <div className="stat-value">0</div>
                                            <div className="stat-label">Writing Exercises</div>
                                        </div>
                                    </div>

                                    <div className="progress-message text-center mt-4">
                                        <p>Start learning to see your progress here!</p>
                                        <button className="btn btn-primary">Go to Lessons</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h2 className="card-title">Activity History</h2>
                                </div>
                                <div className="card-body">
                                    <div className="empty-state">
                                        <div className="empty-icon">
                                            <FaHistory />
                                        </div>
                                        <h3>No Activity Yet</h3>
                                        <p>Your learning activities will appear here once you start using Lush English.</p>
                                        <button className="btn btn-primary">Start Learning</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "saved" && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h2 className="card-title">Saved Lessons</h2>
                                </div>
                                <div className="card-body">
                                    <div className="empty-state">
                                        <div className="empty-icon">
                                            <FaBookmark />
                                        </div>
                                        <h3>No Saved Lessons</h3>
                                        <p>Bookmark your favorite lessons to access them quickly later.</p>
                                        <button className="btn btn-primary">Browse Lessons</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="edit-modal" ref={modalRef}>
                        <div className="modal-header">
                            <h3>Edit Profile</h3>
                            <button className="close-button" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="form-control"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" className="form-control" value={data.email} disabled />
                                <small className="form-text text-muted">Email cannot be changed</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveName}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS */}
            <style jsx>{`
                /* Page Layout */
                .account-page {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .account-container {
                    margin-top: -50px;
                    margin-bottom: 50px;
                    position: relative;
                    z-index: 10;
                }
                
                /* Hero Section */
                .account-hero {
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    padding: 100px 0 100px;
                    position: relative;
                    margin-top: 80px; /* Adjust based on your header height */
                }
                
                .account-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                
                .account-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }
                
                .btn-logout {
                    background-color: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    padding: 10px 20px;
                    transition: all 0.3s ease;
                }
                
                .btn-logout:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                    transform: translateY(-3px);
                }
                
                .hero-wave {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    line-height: 0;
                }
                
                /* Profile Sidebar */
                .profile-sidebar {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .profile-avatar {
                    padding: 30px 20px;
                    text-align: center;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-bottom: 1px solid #e9ecef;
                }
                
                .avatar-circle {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0 auto 15px;
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .profile-name {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .profile-level {
                    margin-bottom: 10px;
                }
                
                .level-badge {
                    display: inline-flex;
                    align-items: center;
                    background-color: #FFD700;
                    color: #333;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .profile-exp {
                    padding: 20px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .exp-label {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .exp-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #4A90E2;
                    margin-bottom: 10px;
                }
                
                .exp-progress {
                    height: 8px;
                    background-color: #e9ecef;
                    margin-bottom: 8px;
                }
                
                .exp-progress .progress-bar {
                    background-color: #4A90E2;
                }
                
                .exp-next {
                    font-size: 0.8rem;
                    color: #666;
                    text-align: right;
                }
                
                .profile-nav {
                    padding: 15px 0;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    width: 100%;
                    border: none;
                    background: none;
                    text-align: left;
                    color: #555;
                    transition: all 0.3s ease;
                    border-left: 3px solid transparent;
                }
                
                .nav-item:hover {
                    background-color: #f8f9fa;
                    color: #4A90E2;
                }
                
                .nav-item.active {
                    background-color: #f0f7ff;
                    color: #4A90E2;
                    border-left-color: #4A90E2;
                }
                
                .nav-icon {
                    margin-right: 15px;
                    font-size: 1.1rem;
                }
                
                /* Content Card */
                .content-card {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    height: 100%;
                }
                
                .card-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    color: #333;
                }
                
                .btn-edit {
                    background-color: #f0f7ff;
                    color: #4A90E2;
                    border: none;
                    border-radius: 30px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                }
                
                .btn-edit:hover {
                    background-color: #e0f0ff;
                    transform: translateY(-2px);
                }
                
                .card-body {
                    padding: 25px;
                }
                
                .card-footer {
                    padding: 20px 25px;
                    border-top: 1px solid #e9ecef;
                    background-color: #f8f9fa;
                }
                
                /* Info Items */
                .info-item {
                    display: flex;
                    margin-bottom: 25px;
                    padding-bottom: 25px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .info-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .info-icon {
                    width: 50px;
                    height: 50px;
                    background-color: #f0f7ff;
                    color: #4A90E2;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    margin-right: 20px;
                    flex-shrink: 0;
                }
                
                .info-content {
                    flex-grow: 1;
                }
                
                .info-label {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .info-value {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #333;
                }
                
                .user-id {
                    font-family: monospace;
                    background-color: #f8f9fa;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 0.9rem;
                    display: inline-block;
                }
                
                /* Progress Stats */
                .progress-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .stat-card {
                    background-color: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                }
                
                .stat-icon {
                    font-size: 2rem;
                    color: #4A90E2;
                    margin-bottom: 15px;
                }
                
                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 5px;
                }
                
                .stat-label {
                    color: #666;
                    font-size: 0.9rem;
                }
                
                /* Empty States */
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                }
                
                .empty-icon {
                    font-size: 3rem;
                    color: #adb5bd;
                    margin-bottom: 20px;
                }
                
                .empty-state h3 {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .empty-state p {
                    color: #666;
                    margin-bottom: 20px;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                /* Modal */
                .modal-overlay {
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
                }
                
                .edit-modal {
                    background-color: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                }
                
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
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
                
                .modal-body {
                    padding: 20px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }
                
                .form-control {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ced4da;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                
                .form-control:focus {
                    border-color: #4A90E2;
                    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
                    outline: none;
                }
                
                .form-text {
                    font-size: 0.85rem;
                    margin-top: 5px;
                }
                
                .modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                
                .btn-secondary {
                    background-color: #f8f9fa;
                    color: #495057;
                    border: 1px solid #ced4da;
                    border-radius: 8px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-secondary:hover {
                    background-color: #e9ecef;
                }
                
                .btn-primary {
                    background-color: #4A90E2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    background-color: #3672b9;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
                }
                
                .btn-danger {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-danger:hover {
                    background-color: #c82333;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
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
                
                /* Responsive Adjustments */
                @media (max-width: 992px) {
                    .account-hero {
                        padding: 80px 0 80px;
                    }
                    
                    .account-title {
                        font-size: 2rem;
                    }
                    
                    .profile-sidebar {
                        margin-bottom: 30px;
                    }
                    
                    .progress-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .account-hero {
                        padding: 60px 0 80px;
                        text-align: center;
                    }
                    
                    .btn-logout {
                        margin-top: 20px;
                    }
                    
                    .progress-stats {
                        grid-template-columns: 1fr;
                    }
                    
                    .info-item {
                        flex-direction: column;
                    }
                    
                    .info-icon {
                        margin-right: 0;
                        margin-bottom: 15px;
                    }
                }
            `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default Account

