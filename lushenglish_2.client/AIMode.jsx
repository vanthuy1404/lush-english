import React from 'react';
import Header from "./Header";

function AIMode() {
  const styles = {
    mainContainer: {
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '2rem 0'
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      flexWrap: 'wrap',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      width: '340px',
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      color: '#0d6efd'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#212529'
    },
    description: {
      color: '#6c757d',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      padding: '0.75rem 2rem',
      borderRadius: '8px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
      marginTop: 'auto'
    }
  };

  return (
    <div style={styles.mainContainer}>
      <Header/>
      <div style={styles.cardContainer}>
        
        {/* Writing Card */}
        <div 
          style={styles.card}
          className="hover-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <i className="bi bi-pencil-square" style={styles.icon}></i>
          <h3 style={styles.title}>Practice writing letter with AI</h3>
          <p style={styles.description}>
            Improve your English writing skills with our AI-powered letter writing practice. 
            Get instant feedback and suggestions to enhance your communication.
          </p>
          <button 
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b5ed7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d6efd'}
          >
            Study Now
          </button>
        </div>

        {/* Chatting Card */}
        <div 
          style={styles.card}
          className="hover-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <i className="bi bi-chat-dots" style={styles.icon}></i>
          <h3 style={styles.title}>Practice chatting with AI</h3>
          <p style={styles.description}>
            Practice real-world conversations with our AI chat partner. 
            Perfect your speaking and typing skills in a natural environment.
          </p>
          <button 
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b5ed7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d6efd'}
          >
            Study Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default AIMode; 