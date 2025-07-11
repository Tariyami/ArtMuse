import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Palette, Heart, Sparkles, Camera, Star } from 'lucide-react';
import { router } from '@inertiajs/react';
import FloatingElements from './components/FloatingElements';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      if (response.ok) {
        // ✅ Redirect after login success
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.visit('/feed');
        return;
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error, try again');
    }
  };
  




  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <FloatingElements />
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
      <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Palette className="h-10 w-10 text-pink-400" />
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ArtMuse
          </span>
        </div>
        <h1 className="text-3xl font-bold text-pink-800 mb-2">Welcome Back</h1>
        <p className="text-pink-600">Sign in to your creative sanctuary</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type="email"
              name="email"
              value= {email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 placeholder-pink-400"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value= {password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 placeholder-pink-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-pink-400 border-pink-300 rounded focus:ring-pink-300"
            />
            <span className="ml-2 text-sm text-pink-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-pink-400 hover:text-pink-600 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-2xl font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Sign In
        </button>

        <div className="text-center">
          <span className="text-pink-600">Don't have an account? </span>
          <a
            href="/register"
            className="text-pink-400 hover:text-pink-600 font-semibold transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-pink-500 text-sm">
          <p>✨ Where creativity meets community ✨</p>
        </div>
      </div>
    </div>
  );
};

export default Login;