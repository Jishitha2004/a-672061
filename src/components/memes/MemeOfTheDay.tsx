
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { type Meme } from '@/contexts/MemeContext';
import MemeCard from './MemeCard';

interface MemeOfTheDayProps {
  meme: Meme;
}

const MemeOfTheDay = ({ meme }: MemeOfTheDayProps) => {
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-1 shadow-lg">
      <div className="relative w-full rounded-lg bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <MemeCard meme={meme} isFeatured={true} />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                Meme of the Day
              </span>
              <h2 className="text-2xl font-bold mt-2">Today's Top Developer Meme</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                This meme has been voted the best by our community in the last 24 hours!
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img 
                  src={meme.creator.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt="Creator" 
                  className="h-6 w-6 rounded-full" 
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Created by <span className="font-medium">{meme.creator.username}</span>
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total votes: {meme.upvotes - meme.downvotes}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to={`/meme/${meme.id}`} className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                See Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeOfTheDay;
