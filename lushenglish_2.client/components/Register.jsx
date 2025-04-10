import { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra điều kiện trước khi gửi yêu cầu
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Password and Confirm Password don't match.");
            return;
        }

        try {
            // Gửi yêu cầu đăng ký
            const response = await axios.post('http://103.82.132.113:8080/api/Authentication/register', formData);
            alert("Registration successful!");
            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            window.location.href = '/login';
        } catch (error) {
            // Xử lý lỗi khi đăng ký không thành công
            setErrorMessage(error.response?.data?.message || 'Registration failed!');
        }
    };

    return (
        <div style={{ backgroundImage: `url('/bgregister1.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center' }}>
                <img src="/lushenglishlogo.png" alt="Logo" style={{ height: '120px', marginRight: '10px', objectFit: 'contain' }} />
                <h3 style={{ color: '#FFD700', fontWeight: 'bold', margin: 0, fontSize: '1.8rem' }}>Lush English</h3>
            </div>
            <div className="container" style={{ width: '40%', padding: '30px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-center" style={{ color: '#4A90E2' }}><b>Register</b></h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form className="needs-validation" noValidate method="POST" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full of Name</label>
                        <input type="text" className="form-control" id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" required value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                        <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn d-block mx-auto mb-3" style={{ backgroundColor: '#FFD700', color: 'white', fontWeight: 500 }}>
                        Register
                    </button>
                    <a href="/login" style={{ color: '#4A90E2' }} className="text-center d-block">You have an account?, Login!</a>
                </form>
            </div>
        </div>
    );
}

export default Register;
