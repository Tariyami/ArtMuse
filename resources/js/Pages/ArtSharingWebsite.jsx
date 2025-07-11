import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Search, Home, User, Plus, Grid, Settings, Palette, Sparkles, Camera } from 'lucide-react';
import { router } from '@inertiajs/react';

const ArtSharingWebsite = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!token) {
        console.log("No token found, redirecting to unauthorized page");
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
                console.log("User data fetched successfully:", userData);
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

  const posts = [
    {
      id: 1,
      user: { name: 'Luna Rose', avatar: '🌸', verified: true },
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      caption: 'Dreamy sunset painting with soft pastels 🌅✨',
      likes: 324,
      comments: 28,
      time: '2h ago',
      isAI: false
    },
    {
      id: 2,
      user: { name: 'Aria Dreams', avatar: '🦋', verified: false },
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      caption: 'AI-generated fairy garden concept 🧚‍♀️🌺',
      likes: 156,
      comments: 12,
      time: '4h ago',
      isAI: true
    },
    {
      id: 3,
      user: { name: 'Soft Aesthetic', avatar: '🌙', verified: true },
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      caption: 'Minimalist bedroom art piece 🤍',
      likes: 892,
      comments: 67,
      time: '6h ago',
      isAI: false
    }
  ];

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const NavBar = () => (
    <nav className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-pink-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                ArtMuse
              </span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-300" />
              <input
                type="text"
                placeholder="Search art, artists, or AI prompts..."
                className="w-full pl-10 pr-4 py-2 bg-white/70 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
              <Plus className="h-6 w-6 text-pink-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
              <Heart className="h-6 w-6 text-pink-400" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-b from-pink-50/50 to-purple-50/50 backdrop-blur-sm border-r border-pink-100 h-screen sticky top-16">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          {[
            { icon: Home, label: 'Feed', key: 'feed', onClick: () => setActiveTab('feed') },
            { icon: Search, label: 'Explore', key: 'explore', onClick: () => setActiveTab('explore') },
            { icon: Camera, label: 'Create', key: 'create', onClick: () => setActiveTab('create') },
            { icon: Sparkles, label: 'AI Generate', key: 'ai', onClick: () => setActiveTab('ai') },
            { icon: User, label: 'Profile', key: 'profile', onClick: () => setActiveTab('profile') },
            { icon: Settings, label: 'Settings', key: 'settings', onClick: () => router.visit('/Settings') },
          ].map(({ icon: Icon, label, key, onClick }) => (
            <button
              key={key}
              onClick={onClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 shadow-sm'
                  : 'hover:bg-pink-100/50 text-pink-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
  
        
      </div>
    </div>
  );
  
  const PostCard = ({ post }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 overflow-hidden mb-6 hover:shadow-xl transition-all duration-300">
      <div className="p-4 border-b border-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold">
              {post.user.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-pink-800">{post.user.name}</span>
                {post.user.verified && <span className="text-pink-400">✓</span>}
                {post.isAI && (
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    AI
                  </span>
                )}
              </div>
              <span className="text-sm text-pink-500">{post.time}</span>
            </div>
          </div>
          <button className="text-pink-400 hover:text-pink-600">
            <Grid className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={post.image}
          alt="Art post"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-1 transition-colors ${
                likedPosts.has(post.id) ? 'text-pink-500' : 'text-pink-400 hover:text-pink-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-pink-400 hover:text-pink-500">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            <button className="text-pink-400 hover:text-pink-500">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
          <button
            onClick={() => handleSave(post.id)}
            className={`transition-colors ${
              savedPosts.has(post.id) ? 'text-pink-500' : 'text-pink-400 hover:text-pink-500'
            }`}
          >
            <Bookmark className={`h-6 w-6 ${savedPosts.has(post.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <p className="text-pink-800 text-sm leading-relaxed">{post.caption}</p>
        
        <div className="mt-3 pt-3 border-t border-pink-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 text-sm text-pink-700 placeholder-pink-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
          A
        </div>
        <h1 className="text-2xl font-bold text-pink-800 mb-2">Your Art Studio</h1>
        <p className="text-pink-600 max-w-md mx-auto">Creating dreamy art pieces and AI-generated masterpieces ✨</p>
        
        <div className="flex justify-center space-x-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-800">127</div>
            <div className="text-sm text-pink-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-800">2.5K</div>
            <div className="text-sm text-pink-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-800">892</div>
            <div className="text-sm text-pink-600">Following</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000000}?w=300&h=300&fit=crop`}
              alt={`Art piece ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const CreateTab = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-8">
        <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Create New Art</h2>
        
        <div className="space-y-6">
          <div className="border-2 border-dashed border-pink-200 rounded-xl p-8 text-center hover:border-pink-300 transition-colors">
            <Camera className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <p className="text-pink-600 mb-2">Upload your artwork</p>
            <p className="text-sm text-pink-500">Drag and drop or click to browse</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Caption</label>
            <textarea
              placeholder="Describe your artwork..."
              className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none h-24"
            />
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-semibold hover:from-pink-500 hover:to-purple-500 transition-all">
              Share Artwork
            </button>
            <button className="px-6 py-3 border border-pink-200 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AITab = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-8">
        <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6" />
          <span>AI Art Generator</span>
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Describe your vision</label>
            <textarea
              placeholder="A dreamy sunset landscape with soft pastel colors and floating butterflies..."
              className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none h-32"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-800 mb-2">Art Style</label>
              <select className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option>Coquette Aesthetic</option>
                <option>Dreamy Pastel</option>
                <option>Soft Minimalist</option>
                <option>Fairy Core</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-800 mb-2">Resolution</label>
              <select className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option>1024x1024</option>
                <option>1280x720</option>
                <option>1920x1080</option>
              </select>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Generate AI Art</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'create':
        return <CreateTab />;
      case 'ai':
        return <AITab />;
      default:
        return (
          <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-pink-800">Latest Art</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                    Following
                  </button>
                  <button className="px-4 py-2 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50">
                    Discover
                  </button>
                </div>
              </div>
            </div>
            
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ArtSharingWebsite;