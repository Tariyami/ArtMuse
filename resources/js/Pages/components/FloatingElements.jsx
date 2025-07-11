import { Heart, Sparkles, Star, Camera, Palette } from 'lucide-react';
import React from 'react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 text-pink-200 opacity-50 animate-pulse">
        <Heart className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-purple-200 opacity-40 animate-bounce">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute bottom-40 left-20 text-rose-200 opacity-60 animate-pulse">
        <Star className="h-7 w-7" />
      </div>
      <div className="absolute bottom-20 right-10 text-pink-200 opacity-30 animate-bounce">
        <Camera className="h-9 w-9" />
      </div>
      <div className="absolute top-60 left-1/4 text-purple-200 opacity-40 animate-pulse">
        <Palette className="h-5 w-5" />
      </div>
      <div className="absolute top-80 right-1/3 text-rose-200 opacity-50 animate-bounce">
        <Heart className="h-6 w-6" />
      </div>
    </div>
  )
}

export default FloatingElements

