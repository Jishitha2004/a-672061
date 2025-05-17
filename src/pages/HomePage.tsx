
import React, { useState } from 'react';
import { useMeme } from '@/contexts/MemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemeOfTheDay from '@/components/memes/MemeOfTheDay';
import MemeGrid from '@/components/memes/MemeGrid';

const HomePage = () => {
  const { memes, memeOfTheDay, activeTab, setActiveTab } = useMeme();
  const [visibleMemes, setVisibleMemes] = useState(6); // Number of memes initially visible
  
  const handleLoadMore = () => {
    // Increase the number of visible memes
    setVisibleMemes(prev => prev + 6);
  };
  
  // Filter memes based on the active tab
  const getFilteredMemes = () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let filteredMemes = [...memes];
    
    switch (activeTab) {
      case 'new':
        // Sort by creation date (newest first)
        filteredMemes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'top-day':
        // Filter for last 24 hours and sort by votes
        filteredMemes = filteredMemes
          .filter(meme => meme.createdAt >= oneDayAgo)
          .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'top-week':
        // Filter for last week and sort by votes
        filteredMemes = filteredMemes
          .filter(meme => meme.createdAt >= oneWeekAgo)
          .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'top-all':
        // Sort by all-time votes
        filteredMemes.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      default:
        break;
    }
    
    return filteredMemes.slice(0, visibleMemes);
  };

  const hasMoreToLoad = visibleMemes < memes.length;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Meme of the day section */}
      {memeOfTheDay && <MemeOfTheDay meme={memeOfTheDay} />}
      
      {/* Tab navigation */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={value => {
          setActiveTab(value);
          setVisibleMemes(6); // Reset count when changing tabs
        }}
        className="w-full"
      >
        <TabsList className="mb-6 w-full grid grid-cols-4">
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="top-day">Top (24h)</TabsTrigger>
          <TabsTrigger value="top-week">Top (week)</TabsTrigger>
          <TabsTrigger value="top-all">Top (all time)</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {/* Meme grid */}
          <MemeGrid memes={getFilteredMemes()} />
          
          {/* Load more button */}
          {hasMoreToLoad && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
