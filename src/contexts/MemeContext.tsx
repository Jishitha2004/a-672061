
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface Meme {
  id: string;
  imageUrl: string;
  topText?: string;
  bottomText?: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  comments: Comment[];
  tags: string[];
  isFeatured?: boolean;
}

interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: Date;
}

interface MemeContextType {
  memes: Meme[];
  memeOfTheDay: Meme | null;
  featuredMemes: Meme[];
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  createMeme: (meme: Partial<Meme>) => Promise<Meme>;
  voteMeme: (memeId: string, voteType: 'up' | 'down') => Promise<void>;
  addComment: (memeId: string, text: string) => Promise<void>;
  flagMeme: (memeId: string, reason: string) => Promise<void>;
  getUserMemes: (userId: string) => Meme[];
  getMemeById: (id: string) => Meme | undefined;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export const useMeme = () => {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};

// Mock data for demonstration
const mockMemes: Meme[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    topText: 'When the code works',
    bottomText: 'But you don\'t know why',
    creator: {
      id: 'user1',
      username: 'javascriptNinja',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=javascript',
    },
    createdAt: new Date('2023-05-15'),
    upvotes: 350,
    downvotes: 12,
    comments: [],
    tags: ['javascript', 'debugging'],
    isFeatured: true
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    topText: 'My code in production',
    bottomText: 'My code in development',
    creator: {
      id: 'user2',
      username: 'reactRockstar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react',
    },
    createdAt: new Date('2023-05-16'),
    upvotes: 280,
    downvotes: 15,
    comments: [
      {
        id: 'comment1',
        text: 'This is so true!',
        user: {
          id: 'user3',
          username: 'pythonLover',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python',
        },
        createdAt: new Date('2023-05-16T10:30:00')
      }
    ],
    tags: ['production', 'bugs']
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    topText: 'CSS is easy',
    bottomText: 'Said no developer ever',
    creator: {
      id: 'user3',
      username: 'pythonLover',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=python',
    },
    createdAt: new Date('2023-05-17'),
    upvotes: 420,
    downvotes: 8,
    comments: [],
    tags: ['css', 'frontend']
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    topText: 'Debugging like',
    bottomText: 'Finding a needle in a haystack',
    creator: {
      id: 'user4',
      username: 'cssWizard',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=css',
    },
    createdAt: new Date('2023-05-18'),
    upvotes: 180,
    downvotes: 5,
    comments: [],
    tags: ['debugging', 'bugs']
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    topText: 'When someone asks',
    bottomText: 'If I tested my code',
    creator: {
      id: 'user5',
      username: 'nodeMaster',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=node',
    },
    createdAt: new Date('2023-05-19'),
    upvotes: 300,
    downvotes: 10,
    comments: [],
    tags: ['testing', 'memes']
  }
];

interface MemeProviderProps {
  children: ReactNode;
}

export const MemeProvider = ({ children }: MemeProviderProps) => {
  const [memes, setMemes] = useState<Meme[]>(mockMemes);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'top-day', 'top-week', 'top-all'
  const { user, isAuthenticated } = useAuth();

  // Determine meme of the day (highest upvotes in the last 24 hours)
  const memeOfTheDay = memes.find(meme => meme.isFeatured) || null;

  // Get featured memes (top 3 by upvotes)
  const featuredMemes = [...memes]
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);

  const createMeme = async (newMeme: Partial<Meme>): Promise<Meme> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      throw new Error('User must be logged in to create a meme');
    }
    
    const meme: Meme = {
      id: Date.now().toString(),
      imageUrl: newMeme.imageUrl || '',
      topText: newMeme.topText,
      bottomText: newMeme.bottomText,
      creator: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      tags: newMeme.tags || [],
    };
    
    setMemes(prevMemes => [meme, ...prevMemes]);
    setIsLoading(false);
    
    return meme;
  };

  const voteMeme = async (memeId: string, voteType: 'up' | 'down'): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to vote');
      return;
    }
    
    setMemes(prevMemes => 
      prevMemes.map(meme => {
        if (meme.id === memeId) {
          // If user already voted the same way, remove the vote
          if (meme.userVote === voteType) {
            return {
              ...meme,
              upvotes: voteType === 'up' ? meme.upvotes - 1 : meme.upvotes,
              downvotes: voteType === 'down' ? meme.downvotes - 1 : meme.downvotes,
              userVote: null
            };
          }
          
          // If user voted opposite way before, remove that vote and add new one
          if (meme.userVote !== null && meme.userVote !== voteType) {
            return {
              ...meme,
              upvotes: voteType === 'up' ? meme.upvotes + 1 : meme.upvotes - 1,
              downvotes: voteType === 'down' ? meme.downvotes + 1 : meme.downvotes - 1,
              userVote: voteType
            };
          }
          
          // New vote
          return {
            ...meme,
            upvotes: voteType === 'up' ? meme.upvotes + 1 : meme.upvotes,
            downvotes: voteType === 'down' ? meme.downvotes + 1 : meme.downvotes,
            userVote: voteType
          };
        }
        return meme;
      })
    );
  };

  const addComment = async (memeId: string, text: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (text.length > 140) {
      toast.error('Comments are limited to 140 characters');
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      createdAt: new Date()
    };
    
    setMemes(prevMemes => 
      prevMemes.map(meme => {
        if (meme.id === memeId) {
          return {
            ...meme,
            comments: [...meme.comments, newComment]
          };
        }
        return meme;
      })
    );
    
    toast.success('Comment added successfully');
  };

  const flagMeme = async (memeId: string, reason: string): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to flag content');
      return;
    }
    
    // In a real app, this would send the flag to be reviewed
    toast.success('Content has been flagged for review');
  };

  const getUserMemes = (userId: string): Meme[] => {
    return memes.filter(meme => meme.creator.id === userId);
  };

  const getMemeById = (id: string): Meme | undefined => {
    return memes.find(meme => meme.id === id);
  };

  return (
    <MemeContext.Provider value={{
      memes,
      memeOfTheDay,
      featuredMemes,
      isLoading,
      activeTab,
      setActiveTab,
      createMeme,
      voteMeme,
      addComment,
      flagMeme,
      getUserMemes,
      getMemeById
    }}>
      {children}
    </MemeContext.Provider>
  );
};
