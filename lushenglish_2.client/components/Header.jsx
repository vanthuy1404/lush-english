"use client"

import { useState, useEffect } from "react"

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const userID = localStorage.getItem("userID")
        setIsLoggedIn(!!userID)

        // Add scroll event listener for navbar styling
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "scrolled" : ""}`}
            style={{
                background: "linear-gradient(135deg, #4A90E2 0%, #3672b9 100%)",
                padding: "10px 0",
                transition: "all 0.3s ease",
                boxShadow: isScrolled ? "0 4px 10px rgba(0, 0, 0, 0.1)" : "none",
            }}
        >
            <div className="container">
                {/* Logo and Brand */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <img
                        src="/lushenglishlogo.png"
                        alt="Lush English Logo"
                        style={{
                            height: isScrolled ? "80px" : "100px",
                            objectFit: "contain",
                            transition: "height 0.3s ease",
                        }}
                        className="d-inline-block"
                    />
                    <div className="ms-3">
                        <strong
                            style={{
                                fontSize: "1.8rem",
                                color: "#FFD700",
                                fontWeight: 700,
                                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Lush English
                        </strong>
                        <div
                            className="d-none d-md-block"
                            style={{
                                fontSize: "0.9rem",
                                color: "rgba(255,255,255,0.8)",
                                marginTop: "-5px",
                            }}
                        >
                            Learn English Effortlessly
                        </div>
                    </div>
                </a>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{
                        border: "none",
                        padding: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "5px",
                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav mx-auto">
                        {["Home", "AI Mode", "Lessons", "Practices"].map((item, index) => (
                            <li className="nav-item mx-2" key={index}>
                                <a
                                    className="nav-link text-white position-relative"
                                    href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                                    style={{
                                        fontSize: "1.1rem",
                                        fontWeight: 500,
                                        padding: "10px 15px",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    {item}
                                    <span className="hover-underline"></span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Login/Account Button */}
                    <a
                        className="btn btn-gold"
                        href={isLoggedIn ? "/account" : "/login"}
                        role="button"
                        style={{
                            backgroundColor: "#FFD700",
                            color: "#4A90E2",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            padding: "8px 20px",
                            borderRadius: "30px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            border: "2px solid #FFD700",
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "transparent"
                            e.target.style.color = "#FFD700"
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#FFD700"
                            e.target.style.color = "#4A90E2"
                        }}
                    >
                        {isLoggedIn ? "My Account" : "Login / Sign Up"}
                    </a>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
        .navbar.scrolled {
          padding: 5px 0;
        }
        
        .nav-link:hover {
          color: #FFD700 !important;
        }
        
        .hover-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #FFD700;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover .hover-underline {
          width: 80%;
        }
        
        @media (max-width: 992px) {
          .navbar-collapse {
            background-color: rgba(74, 144, 226, 0.95);
            margin-top: 10px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          .nav-item {
            margin: 5px 0;
          }
          
          .btn-gold {
            margin-top: 10px;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
        </nav>
    )
}

export default Header

