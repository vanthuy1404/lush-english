import React, { useState, useEffect } from 'react';

const WritingComponent = ({ WritingExerciseID }) => {
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await fetch(`https://localhost:7007/api/WritingExercise/${WritingExerciseID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercise data');
        }
        const data = await response.json();
        // Parse the JSON string in requirement field
        data.requirement = JSON.parse(data.requirement);
        setExerciseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [WritingExerciseID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback('Your letter is being evaluated...');
    setScore('8.5/10');
    setShowSaveButton(true);
  };

  const handleSaveResult = () => {
    console.log('Saving result...');
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Header Section */}
          <div className="mb-4">
            <div className="bg-light p-4 rounded">
              <h3 className="h4 text-dark">
                Topic: {exerciseData.exerciseName}
              </h3>
              <div className="mt-3">
                <h4 className="h5 text-secondary">Requirements:</h4>
                <ul className="list-group list-group-flush">
                  {exerciseData.requirement.map((req, index) => (
                    <li key={index} className="list-group-item bg-transparent">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Writing Form Section */}
          <div className="mb-4">
            <h4 className="h5 text-secondary mb-3">Your letter:</h4>
            <div className="form-group">
              <textarea
                className="form-control mb-3"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your letter here"
                style={{
                  resize: 'vertical',
                  minHeight: '200px',
                  border: '1px solid #ced4da',
                  borderRadius: '8px'
                }}
              />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  style={{
                    padding: '0.5rem 2rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s'
                  }}
                >
                  Submit
                </button>
                {showSaveButton && (
                  <button
                    className="btn btn-success"
                    onClick={handleSaveResult}
                    style={{
                      padding: '0.5rem 2rem',
                      borderRadius: '8px',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    Save Result
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-light p-4 rounded">
            <h4 className="h5 text-secondary">AI review and score</h4>
            <div className="mt-3">
              {feedback && (
                <div className="alert alert-info">
                  {feedback}
                </div>
              )}
              {score && (
                <div className="mt-3 border-top pt-3">
                  <p className="mb-1 fw-bold">Review:</p>
                  <p className="mb-0">Score: {score}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingComponent; 