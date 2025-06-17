import React, { useState } from 'react';

const URI = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${URI}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      // You can store token in localStorage or redirect user here
      // localStorage.setItem('token', data.token);
    } else {
      console.error('Signup failed:', data.message);
      alert(data.message); // show error to user
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Something went wrong. Please try again.');
  }
};


  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-light">Create Account</h2>
                  <p className="text-muted">Join us today</p>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control border-0 bg-light"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control border-0 bg-light"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>

                <button
                  className="btn btn-dark w-100 py-2 mb-3"
                  onClick={handleSubmit}
                >
                  Create Account
                </button>

                <div className="text-center">
                  <span className="text-muted small">Already have an account? </span>
                  <a href="#" className="text-dark text-decoration-none small">
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}