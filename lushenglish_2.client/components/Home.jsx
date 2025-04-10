"use client"
import Header from "./Header"
import Footer from "./Footer"

const Home = () => {
    // Remove AOS initialization

    return (
        <div className="home-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <h1 className="hero-title">
                                Learn English online for free with <span className="highlight">Lush English</span>
                            </h1>
                            <p className="hero-subtitle">
                                Master the language with our innovative learning methods and join thousands of successful students.
                            </p>
                            <ul className="feature-list">
                                <li>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Learn basic English for beginners or improve your skills
                                </li>
                                <li>
                                    <i className="bi bi-check-circle-fill"></i>
                                    English learning for students, professionals, and everyone
                                </li>
                                <li>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Learn conversational and academic English with daily lessons
                                </li>
                                <li>
                                    <i className="bi bi-check-circle-fill"></i>
                                    Easy to use, fun learning experience on all devices
                                </li>
                            </ul>
                            <div className="hero-buttons">
                                <a href="/lessons" className="btn btn-primary btn-lg me-3">
                                    Start Learning
                                </a>
                                <a href="/about" className="btn btn-outline-primary btn-lg">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <img src="/HomeIntroductionnnn.jpg" alt="Students learning English" className="hero-image img-fluid" />
                                <div className="floating-badge badge-students">
                                    <span className="badge-number">10K+</span>
                                    <span className="badge-text">Students</span>
                                </div>
                                <div className="floating-badge badge-lessons">
                                    <span className="badge-number">500+</span>
                                    <span className="badge-text">Lessons</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container py-5">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <span className="section-subtitle">WHY CHOOSE US</span>
                            <h2 className="section-title">The Lush English Advantage</h2>
                            <div className="section-divider"></div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            {
                                icon: "bi-translate",
                                title: "Effective Methodology",
                                description:
                                    "Our scientifically-backed learning method helps you retain vocabulary longer and speak confidently.",
                            },
                            {
                                icon: "bi-calendar-check",
                                title: "Flexible Schedule",
                                description: "Learn at your own pace with 24/7 access to all lessons and practice materials.",
                            },
                            {
                                icon: "bi-person-check",
                                title: "Expert Teachers",
                                description:
                                    "Learn from qualified teachers with years of experience in teaching English as a second language.",
                            },
                            {
                                icon: "bi-graph-up-arrow",
                                title: "Track Progress",
                                description: "Monitor your improvement with detailed statistics and performance analytics.",
                            },
                        ].map((feature, index) => (
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <i className={`bi ${feature.icon}`}></i>
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vocabulary Section */}
            <section className="vocabulary-section py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="content-wrapper">
                                <span className="section-subtitle">VOCABULARY MASTERY</span>
                                <h2 className="section-title">
                                    Memorize <span className="text-primary">1000 words</span> in one month
                                </h2>
                                <div className="section-divider mb-4"></div>
                                <p className="section-description">
                                    Learn at the golden time to effortlessly remember thousands of words with minimal effort. Our spaced
                                    repetition system ensures you'll retain vocabulary for the long term.
                                </p>
                                <ul className="content-list">
                                    <li>
                                        <i className="bi bi-check2-circle"></i> Scientifically proven memory techniques
                                    </li>
                                    <li>
                                        <i className="bi bi-check2-circle"></i> Visual and audio learning reinforcement
                                    </li>
                                    <li>
                                        <i className="bi bi-check2-circle"></i> Contextual learning for better retention
                                    </li>
                                    <li>
                                        <i className="bi bi-check2-circle"></i> Daily practice reminders and challenges
                                    </li>
                                </ul>
                                <a href="/lessons" className="btn btn-primary btn-lg mt-4">
                                    Try a lesson now
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="image-container">
                                <img src="/homeIntroduction.jpg" alt="Vocabulary learning" className="img-fluid rounded-4 shadow-lg" />
                                <div className="stats-card">
                                    <div className="stats-item">
                                        <div className="stats-number">5x</div>
                                        <div className="stats-text">Faster Learning</div>
                                    </div>
                                    <div className="stats-item">
                                        <div className="stats-number">95%</div>
                                        <div className="stats-text">Retention Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Habit Formation Section */}
            <section className="habit-section py-5 bg-light">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 order-lg-2">
                            <div className="content-wrapper">
                                <span className="section-subtitle">CONSISTENCY IS KEY</span>
                                <h2 className="section-title">
                                    Easily maintain <span className="text-primary">your English learning habit</span>
                                </h2>
                                <div className="section-divider mb-4"></div>
                                <p className="section-description">
                                    Join the 14-day challenge to develop a study habit and receive special rewards from Lush English. Our
                                    community of learners will help keep you motivated and accountable.
                                </p>
                                <div className="habit-tracker">
                                    <div className="habit-days">
                                        {[...Array(14)].map((_, i) => (
                                            <div key={i} className={`habit-day ${i < 5 ? "completed" : ""}`} data-day={i + 1}></div>
                                        ))}
                                    </div>
                                    <div className="habit-progress">
                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-primary"
                                                role="progressbar"
                                                style={{ width: "35%" }}
                                                aria-valuenow="35"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                5/14 Days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href="/study-group" className="btn btn-outline-primary btn-lg mt-4">
                                    <i className="bi bi-people-fill me-2"></i>
                                    Join Lush English's study group
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 order-lg-1">
                            <div className="image-container">
                                <img
                                    src="/homeIntroduction2.jpg"
                                    alt="Learning habit formation"
                                    className="img-fluid rounded-4 shadow-lg"
                                />
                                <div className="badge-container">
                                    <div className="achievement-badge">
                                        <i className="bi bi-trophy-fill"></i>
                                        <span>14-Day Challenge</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section py-5">
                <div className="container py-5">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <span className="section-subtitle">SUCCESS STORIES</span>
                            <h2 className="section-title">What Our Students Say</h2>
                            <div className="section-divider"></div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {[
                                        {
                                            name: "Minh Nguyen",
                                            role: "University Student",
                                            image: "https://randomuser.me/api/portraits/men/32.jpg",
                                            text: "Lush English helped me improve my IELTS score from 6.0 to 7.5 in just three months. The vocabulary lessons were particularly helpful!",
                                        },
                                        {
                                            name: "Linh Tran",
                                            role: "Business Professional",
                                            image: "https://randomuser.me/api/portraits/women/44.jpg",
                                            text: "I needed to improve my English for business meetings. The conversational practice on Lush English gave me the confidence to speak fluently.",
                                        },
                                        {
                                            name: "Tuan Pham",
                                            role: "High School Student",
                                            image: "https://randomuser.me/api/portraits/men/67.jpg",
                                            text: "The 14-day challenge really helped me develop a consistent study habit. Now I study English every day without even thinking about it!",
                                        },
                                    ].map((testimonial, index) => (
                                        <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                                            <div className="testimonial-card">
                                                <div className="row g-0">
                                                    <div className="col-md-4">
                                                        <div className="testimonial-image">
                                                            <img
                                                                src={testimonial.image || "/placeholder.svg"}
                                                                alt={testimonial.name}
                                                                className="img-fluid rounded-circle"
                                                            />
                                                            <div className="quote-icon">
                                                                <i className="bi bi-quote"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="testimonial-content">
                                                            <div className="testimonial-rating">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <i key={i} className="bi bi-star-fill"></i>
                                                                ))}
                                                            </div>
                                                            <p className="testimonial-text">"{testimonial.text}"</p>
                                                            <div className="testimonial-author">
                                                                <h4 className="author-name">{testimonial.name}</h4>
                                                                <p className="author-role">{testimonial.role}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#testimonialCarousel"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#testimonialCarousel"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="cta-card">
                                <div className="row align-items-center">
                                    <div className="col-lg-8">
                                        <h2 className="cta-title">Ready to start your English journey?</h2>
                                        <p className="cta-text">
                                            Join thousands of students who have improved their English with Lush English. Start learning today
                                            and see the difference!
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                                        <a href="/signup" className="btn btn-light btn-lg">
                                            Get Started For Free
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Custom CSS */}
            <style jsx>{`
        /* General Styles */
        .section-subtitle {
          font-size: 0.9rem;
          font-weight: 700;
          color: #4A90E2;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333;
        }
        
        .section-divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #4A90E2, #FFD700);
          margin: 0 auto 30px;
          border-radius: 2px;
        }
        
        .content-wrapper .section-divider {
          margin-left: 0;
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          position: relative;
          padding: 120px 0 100px;
          overflow: hidden;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          color: #333;
        }
        
        .hero-title .highlight {
          color: #4A90E2;
          position: relative;
          display: inline-block;
        }
        
        .hero-title .highlight:after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 10px;
          background-color: rgba(255, 215, 0, 0.3);
          z-index: -1;
          border-radius: 10px;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
          margin-bottom: 30px;
        }
        
        .feature-list li {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          font-size: 1.1rem;
          color: #555;
        }
        
        .feature-list li i {
          color: #4A90E2;
          margin-right: 10px;
          font-size: 1.2rem;
        }
        
        .hero-buttons .btn-primary {
          background-color: #4A90E2;
          border-color: #4A90E2;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
          transition: all 0.3s ease;
        }
        
        .hero-buttons .btn-primary:hover {
          background-color: #3672b9;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        }
        
        .hero-buttons .btn-outline-primary {
          color: #4A90E2;
          border-color: #4A90E2;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .hero-buttons .btn-outline-primary:hover {
          background-color: #4A90E2;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        }
        
        .hero-image-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .hero-image {
          border-radius: 20px;
          transition: transform 0.5s ease;
        }
        
        .hero-image-container:hover .hero-image {
          transform: scale(1.05);
        }
        
        .floating-badge {
          position: absolute;
          background-color: white;
          border-radius: 15px;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .badge-students {
          top: 20px;
          right: -15px;
        }
        
        .badge-lessons {
          bottom: 20px;
          left: -15px;
        }
        
        .badge-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4A90E2;
        }
        
        .badge-text {
          font-size: 0.8rem;
          color: #666;
        }
        
        .hero-wave {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          line-height: 0;
        }
        
        /* Features Section */
        .feature-card {
          background-color: white;
          border-radius: 15px;
          padding: 30px;
          height: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          background-color: rgba(74, 144, 226, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .feature-icon i {
          font-size: 30px;
          color: #4A90E2;
        }
        
        .feature-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }
        
        .feature-description {
          color: #666;
          line-height: 1.6;
        }
        
        /* Vocabulary Section */
        .vocabulary-section .content-wrapper {
          padding-right: 30px;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.7;
          margin-bottom: 25px;
        }
        
        .content-list {
          list-style: none;
          padding: 0;
          margin-bottom: 25px;
        }
        
        .content-list li {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          font-size: 1.05rem;
          color: #555;
        }
        
        .content-list li i {
          color: #4A90E2;
          margin-right: 10px;
          font-size: 1.1rem;
        }
        
        .image-container {
          position: relative;
        }
        
        .stats-card {
          position: absolute;
          bottom: -20px;
          right: 20px;
          background-color: white;
          border-radius: 15px;
          padding: 15px;
          display: flex;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .stats-item {
          padding: 0 20px;
          text-align: center;
          border-right: 1px solid #eee;
        }
        
        .stats-item:last-child {
          border-right: none;
        }
        
        .stats-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #4A90E2;
        }
        
        .stats-text {
          font-size: 0.8rem;
          color: #666;
        }
        
        /* Habit Section */
        .habit-tracker {
          background-color: white;
          border-radius: 15px;
          padding: 20px;
          margin-top: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .habit-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .habit-day {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 10px;
          background-color: #f0f0f0;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .habit-day:before {
          content: attr(data-day);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 600;
          color: #999;
        }
        
        .habit-day.completed {
          background-color: #4A90E2;
        }
        
        .habit-day.completed:before {
          color: white;
        }
        
        .habit-progress {
          margin-top: 15px;
        }
        
        .progress {
          height: 10px;
          border-radius: 5px;
          background-color: #f0f0f0;
        }
        
        .progress-bar {
          background-color: #4A90E2;
          border-radius: 5px;
        }
        
        .badge-container {
          position: absolute;
          top: -20px;
          left: 20px;
        }
        
        .achievement-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 600;
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }
        
        .achievement-badge i {
          margin-right: 8px;
        }
        
        /* Testimonials Section */
        .testimonial-card {
          background-color: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin: 20px 50px;
        }
        
        .testimonial-image {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background-color: #f8f9fa;
        }
        
        .testimonial-image img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border: 5px solid white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .quote-icon {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: #4A90E2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quote-icon i {
          color: white;
          font-size: 24px;
        }
        
        .testimonial-content {
          padding: 40px;
        }
        
        .testimonial-rating {
          margin-bottom: 20px;
        }
        
        .testimonial-rating i {
          color: #FFD700;
          font-size: 18px;
          margin-right: 5px;
        }
        
        .testimonial-text {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.7;
          font-style: italic;
          margin-bottom: 20px;
        }
        
        .testimonial-author {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        
        .author-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 5px;
        }
        
        .author-role {
          color: #777;
          font-size: 0.9rem;
        }
        
        .carousel-control-prev,
        .carousel-control-next {
          width: 50px;
          height: 50px;
          background-color: #4A90E2;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          opacity: 1;
        }
        
        .carousel-control-prev {
          left: -25px;
        }
        
        .carousel-control-next {
          right: -25px;
        }
        
        /* CTA Section */
        .cta-section {
          background-color: #f8f9fa;
        }
        
        .cta-card {
          background: linear-gradient(135deg, #4A90E2 0%, #3672b9 100%);
          border-radius: 15px;
          padding: 50px;
          box-shadow: 0 15px 30px rgba(74, 144, 226, 0.2);
        }
        
        .cta-title {
          color: white;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .cta-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin-bottom: 0;
        }
        
        .cta-card .btn-light {
          background-color: #FFD700;
          border-color: #FFD700;
          color: #4A90E2;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .cta-card .btn-light:hover {
          background-color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
          
          .section-title {
            font-size: 2.2rem;
          }
          
          .hero-section {
            padding: 100px 0 80px;
          }
          
          .testimonial-card {
            margin: 20px 0;
          }
          
          .carousel-control-prev,
          .carousel-control-next {
            display: none;
          }
          
          .cta-card {
            padding: 30px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.3rem;
          }
          
          .hero-section {
            padding: 80px 0 60px;
          }
          
          .vocabulary-section .content-wrapper,
          .habit-section .content-wrapper {
            padding-right: 0;
            margin-bottom: 40px;
          }
          
          .testimonial-image {
            padding: 20px;
          }
          
          .testimonial-content {
            padding: 25px;
          }
          
          .cta-title {
            font-size: 1.8rem;
          }
        }
      `}</style>

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    )
}

export default Home

