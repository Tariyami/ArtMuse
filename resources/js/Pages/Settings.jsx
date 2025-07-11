import { Head, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, Palette, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MuseLayout from '../Layouts/MuseLayout';
import FloatingElements from './components/FloatingElements';
export default function Settings({ auth, flash }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
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
          const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'include',
            body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            agreeTerms: formData.agreeTerms
            })
          });
        
          if (response.ok) {
            // ✅ Redirect after registration success
            router.visit('/login');
          } else {
            const error = await response.json();
            console.error('Registration failed:', error);
            alert(error.message || 'Registration failed');
          }
          } catch (error) {
          console.error('Registration error:', error);
          alert('Registration error, try again');
          }
        };

    useEffect(() => {
        if (!token) {
            router.visit("/unauthorized");
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setName(userData.name || '');
                    setEmail(userData.email || '');
                } else {
                    router.visit("/unauthorized");
                }
            } catch (error) {
                router.visit("/unauthorized");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleCancel = () => {
        setIsEditing(false);
        setData({
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            current_password: '',
            password: '',
            password_confirmation: '',
        });
        reset('current_password', 'password', 'password_confirmation');
    };

    return (
        <div > <Head title="Settings" />
        <MuseLayout>
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
           
            <FloatingElements/>
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
        <h1 className="text-3xl font-bold text-pink-800 mb-2">Edit Profile</h1>
        <p className="text-pink-600">Create your artistic journey today</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your artistic name"
              className="w-full pl-10 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 placeholder-pink-400"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
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

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full pl-10 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 placeholder-pink-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-pink-400 border-pink-300 rounded focus:ring-pink-300 mt-1 mr-2"
            required
          />
          <span className="text-sm text-pink-600 leading-relaxed">
            I agree to the{' '}
            <button type="button" className="text-pink-400 hover:text-pink-600 transition-colors underline">
              Terms of Service
            </button>
            {' '}and{' '}
            <button type="button" className="text-pink-400 hover:text-pink-600 transition-colors underline">
              Privacy Policy
            </button>
          </span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-2xl font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Create Account
        </button>

        <div className="text-center">
          <span className="text-pink-600">Already have an account? </span>
          <a
            href="/login"
            className="text-pink-400 hover:text-pink-600 font-semibold transition-colors"
          >
            Sign in
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
        </MuseLayout>
            
        </div>
        
    );
}
