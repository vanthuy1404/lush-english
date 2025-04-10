"use client"

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#333333",
        color: "#8ECAE6",
        position: "relative",
        overflow: "hidden",
      }}
    >
      

      <div className="container py-5">
        <div className="row g-4">
          {/* Logo and Brand Column */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center mb-4">
              <img
                src="/lushenglishlogo.png"
                alt="Lush English Logo"
                style={{
                  height: "100px",
                  objectFit: "contain",
                }}
              />
              <strong
                style={{
                  fontSize: "1.8rem",
                  color: "#FFD700",
                  fontWeight: 700,
                  marginLeft: "15px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Lush English
              </strong>
            </div>
            <p className="mb-4" style={{ color: "rgba(142, 202, 230, 0.9)", lineHeight: "1.6" }}>
              Join our community of English learners and master the language with our innovative learning methods. We
              make learning English fun, effective, and accessible to everyone.
            </p>
            <div className="social-icons d-flex gap-3">
              {["facebook", "instagram", "youtube", "twitter"].map((platform) => (
                <a key={platform} href={`#${platform}`} className="social-icon" aria-label={platform}>
                  <i className={`bi bi-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-3 col-md-6 ps-lg-5">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/courses">Courses</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/policies">Policies</a>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div className="col-lg-4 col-md-12">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <div className="d-flex mb-3">
                <i className="bi bi-geo-alt-fill me-3" style={{ color: "#48CAE4" }}></i>
                <p style={{ margin: 0 }}>Số 3, đường Trần Hưng Đạo, thành phố Nam Định</p>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-telephone-fill me-3" style={{ color: "#48CAE4" }}></i>
                <p style={{ margin: 0 }}>
                  <a href="tel:0977657241" className="text-white text-decoration-none">
                    0977657241
                  </a>
                </p>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-envelope-fill me-3" style={{ color: "#48CAE4" }}></i>
                <p style={{ margin: 0 }}>
                  <a href="mailto:info@lushenglish.com" className="text-white text-decoration-none">
                    info@lushenglish.com
                  </a>
                </p>
              </div>
              <div className="d-flex">
                <i className="bi bi-facebook me-3" style={{ color: "#48CAE4" }}></i>
                <p style={{ margin: 0 }}>
                  <a href="https://facebook.com/lushenglish" className="text-white text-decoration-none">
                    Lush English
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="newsletter-box p-4 rounded-4" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h4 style={{ color: "#48CAE4" }}>Subscribe to Our Newsletter</h4>
                  <p className="mb-0 d-none d-lg-block" style={{ color: "rgba(142, 202, 230, 0.9)" }}>
                    Get the latest updates, lessons and special offers
                  </p>
                </div>
                <div className="col-lg-6 mt-3 mt-lg-0">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                      style={{
                        padding: "12px",
                        borderTopLeftRadius: "30px",
                        borderBottomLeftRadius: "30px",
                      }}
                    />
                    <button
                      className="btn"
                      type="button"
                      style={{
                        backgroundColor: "#48CAE4",
                        color: "#333333",
                        fontWeight: "600",
                        borderTopRightRadius: "30px",
                        borderBottomRightRadius: "30px",
                        padding: "0 25px",
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div className="border-top border-light pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <p className="mb-0" style={{ color: "rgba(142, 202, 230, 0.7)" }}>
                © {new Date().getFullYear()} Lush English. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .wave-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 0;
          overflow: hidden;
        }
        
        .footer-heading {
          color: #48CAE4;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        
        .footer-heading:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #48CAE4;
          border-radius: 3px;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: 12px;
        }
        
        .footer-links a {
          color: rgba(142, 202, 230, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 15px;
        }
        
        .footer-links a:before {
          content: '→';
          position: absolute;
          left: 0;
          color: #48CAE4;
          transition: transform 0.3s ease;
        }
        
        .footer-links a:hover {
          color: #90E0EF;
          padding-left: 20px;
        }
        
        .footer-links a:hover:before {
          transform: translateX(5px);
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: #48CAE4;
          color: #333333;
          transform: translateY(-3px);
        }
        
        .contact-info p, .contact-info a {
          color: rgba(142, 202, 230, 0.8);
        }
        
        .contact-info a:hover {
          color: #90E0EF;
          text-decoration: underline !important;
        }

        .cta-card .btn-light {
          background-color: #FFD700;
          border-color: #FFD700;
          color: #333333;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
    </footer>
  )
}

export default Footer

