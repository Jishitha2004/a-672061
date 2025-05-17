
import React from 'react';
import { Meme } from '@/contexts/MemeContext';
import MemeCard from './MemeCard';

interface MemeGridProps {
  memes: Meme[];
}

const MemeGrid = ({ memes }: MemeGridProps) => {
  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300">No memes found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Be the first to add a meme to this category!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map(meme => (
        <MemeCard key={meme.id} meme={meme} />
      ))}
    </div>
  );
};

export default MemeGrid;
