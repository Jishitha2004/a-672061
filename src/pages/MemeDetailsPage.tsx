
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMeme } from '@/contexts/MemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AuthModal from '../components/auth/AuthModal';
import { ThumbsUp, ThumbsDown, Flag, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const MemeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemeById, voteMeme, addComment, flagMeme } = useMeme();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [comment, setComment] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  
  // Get meme by ID
  const meme = id ? getMemeById(id) : undefined;
  
  if (!meme) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h1 className="text-2xl font-bold mb-4">Meme not found</h1>
        <p className="text-gray-600 mb-6">The meme you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    await voteMeme(meme.id, voteType);
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    await addComment(meme.id, comment);
    setComment('');
  };
  
  const flagForm = useForm<{ reason: string }>({
    resolver: zodResolver(
      z.object({
        reason: z.string().min(5, { message: 'Please provide a reason' }).max(200),
      })
    ),
    defaultValues: {
      reason: '',
    },
  });

  const handleFlagSubmit = async (values: { reason: string }) => {
    await flagMeme(meme.id, values.reason);
    setShowFlagDialog(false);
    flagForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="relative aspect-square bg-gray-100">
                <img 
                  src={meme.imageUrl} 
                  alt="Meme" 
                  className="w-full h-full object-cover" 
                />
                
                {/* Text overlay */}
                {meme.topText && (
                  <div className="absolute top-4 left-0 right-0 text-center">
                    <p className="text-3xl font-bold text-white stroke-black uppercase" style={{
                      textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>
                      {meme.topText}
                    </p>
                  </div>
                )}
                
                {meme.bottomText && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-3xl font-bold text-white stroke-black uppercase" style={{
                      textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>
                      {meme.bottomText}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Vote buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button 
                  variant={meme.userVote === 'up' ? 'default' : 'outline'} 
                  className={`rounded-full w-10 h-10 p-0 ${meme.userVote === 'up' ? 'bg-green-500 hover:bg-green-600' : 'bg-white/80'}`}
                  onClick={() => handleVote('up')}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <Button
                  variant={meme.userVote === 'down' ? 'default' : 'outline'}
                  className={`rounded-full w-10 h-10 p-0 ${meme.userVote === 'down' ? 'bg-red-500 hover:bg-red-600' : 'bg-white/80'}`}
                  onClick={() => handleVote('down')}
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Flag button */}
              <Button 
                variant="outline" 
                className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-white/80"
                onClick={() => isAuthenticated ? setShowFlagDialog(true) : setShowAuthModal(true)}
              >
                <Flag className="h-5 w-5" />
              </Button>
            </div>
          </Card>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4">
              <div>
                <span className="font-medium text-green-600">{meme.upvotes}</span> upvotes
              </div>
              <div>
                <span className="font-medium text-red-600">{meme.downvotes}</span> downvotes
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              Posted on {new Date(meme.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">
              {meme.topText || ''} {meme.bottomText ? '/ ' + meme.bottomText : ''}
            </h1>
            <div className="flex items-center mt-2">
              <img 
                src={meme.creator.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                alt="Creator" 
                className="h-8 w-8 rounded-full mr-2" 
              />
              <span className="text-gray-600">
                by <span className="font-medium">{meme.creator.username}</span>
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {meme.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">Comments ({meme.comments.length})</h2>
            <div className="space-y-2 mb-4">
              <Input 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment (max 140 chars)"
                maxLength={140}
              />
              <Button onClick={handleAddComment} className="w-full">Post Comment</Button>
            </div>
            
            {meme.comments.length === 0 ? (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {meme.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={comment.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                        alt="User" 
                        className="h-6 w-6 rounded-full" 
                      />
                      <span className="font-medium">{comment.user.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
      
      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Inappropriate Content</DialogTitle>
          </DialogHeader>
          
          <Form {...flagForm}>
            <form onSubmit={flagForm.handleSubmit(handleFlagSubmit)} className="space-y-4">
              <FormField
                control={flagForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for flagging</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please explain why this content should be reviewed" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowFlagDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Flag</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemeDetailsPage;
