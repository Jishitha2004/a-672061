
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="max-w-md text-center">
        <div className="text-6xl font-bold text-gray-300">404</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h1>
        <p className="mt-6 text-base text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the meme you're looking for. It might have been deleted or never existed in the first place.
        </p>
        <div className="mt-10">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
