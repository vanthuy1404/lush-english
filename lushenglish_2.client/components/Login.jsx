import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserID } from '../src/redux/userSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://103.82.132.113:8080/api/Authentication/login',
                {
                    email: formData.email,
                    password: formData.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data);

           
            const userID = response.data.userID;
            dispatch(setUserID(userID));

            // Luu id
            try {
                localStorage.setItem('userID', userID);
                
                console.log('ID nguoi dung đã được lưu vào localStorage');
                
                

            } catch (error) {
                console.error('Lỗi khi lưu trữ vào localStorage:', error);
            }



            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Server response:', error.response);
                setErrorMessage(error.response.data || 'Login failed. Please try again.');
            } else if (error.request) {
                console.error('Request error:', error.request);
                setErrorMessage('No response from server.');
            } else {
                console.error('Unexpected error:', error.message);
                setErrorMessage('Unexpected error occurred.');
            }
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url('/bgregister1.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Logo và tên trang web */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <img
                    src="/lushenglishlogo.png"
                    alt="Logo"
                    style={{
                        height: '120px', marginRight: '10px', objectFit: 'contain'
                    }}
                />
                <h3 style={{
                    color: '#FFD700', fontWeight: 'bold', margin: 0, fontSize: '1.8rem'
                }}>Lush English</h3>
            </div>
            <div
                className="container"
                style={{
                    width: '40%',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
            >
                <h2 className="text-center" style={{ color: '#4A90E2' }}><b>Login</b></h2>

                {/* Hiển thị thông báo lỗi nếu có */}
                {errorMessage && (
                    <div style={{ color: 'red', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                            Please enter a valid email.
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                            Please enter password.
                        </div>
                    </div>

                    {/* Nút đăng nhập */}
                    <button
                        type="submit"
                        className="btn d-block mx-auto mb-3"
                        style={{
                            backgroundColor: '#FFD700',
                            color: 'white',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            boxShadow: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#FFC000';
                            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFD700';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Login
                    </button>
                    <a href="/register" style={{ color: '#4A90E2' }} className="text-center d-block">You do not have an account yet?, Register!</a>
                </form>
            </div>
        </div>
    );
}

export default Login;
