import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
import { useMeme, type Meme } from '@/contexts/MemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthModal from '../auth/AuthModal';
import { Flag, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface MemeCardProps {
  meme: Meme;
  isFeatured?: boolean;
}

const MemeCard = ({ meme, isFeatured = false }: MemeCardProps) => {
  const { voteMeme, addComment, flagMeme } = useMeme();
  const { isAuthenticated } = useAuth();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isFeatured ? 'border-purple-300 dark:border-purple-800' : ''}`}>
        <div className="relative">
          {/* Meme Image and Text */}
          <div className="relative">
            <Link to={`/meme/${meme.id}`}>
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={meme.imageUrl} 
                  alt="Meme" 
                  className="w-full h-full object-cover" 
                />
                
                {/* Text overlay */}
                {meme.topText && (
                  <div className="absolute top-4 left-0 right-0 text-center">
                    <p className="text-2xl font-bold text-white stroke-black uppercase" style={{
                      textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>
                      {meme.topText}
                    </p>
                  </div>
                )}
                
                {meme.bottomText && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-2xl font-bold text-white stroke-black uppercase" style={{
                      textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>
                      {meme.bottomText}
                    </p>
                  </div>
                )}
              </div>
            </Link>
            
            {/* Vote overlay */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button 
                size="sm" 
                variant={meme.userVote === 'up' ? 'default' : 'outline'} 
                className={`rounded-full p-2 bg-white/70 hover:bg-white ${meme.userVote === 'up' ? 'text-green-600 border-green-600' : 'text-gray-800'}`}
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={meme.userVote === 'down' ? 'default' : 'outline'}
                className={`rounded-full p-2 bg-white/70 hover:bg-white ${meme.userVote === 'down' ? 'text-red-600 border-red-600' : 'text-gray-800'}`}
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Flag button */}
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute bottom-2 right-2 rounded-full p-2 bg-white/70 hover:bg-white text-gray-800"
              onClick={() => isAuthenticated ? setShowFlagDialog(true) : setShowAuthModal(true)}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          
          <CardContent className="p-4">
            {/* Creator info */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <img 
                  src={meme.creator.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt="Creator" 
                  className="h-6 w-6 rounded-full" 
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {meme.creator.username}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(meme.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* Vote count */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-sm">
                  <span className="font-medium text-green-600">{meme.upvotes}</span> upvotes
                </div>
                <div className="text-sm">
                  <span className="font-medium text-red-600">{meme.downvotes}</span> downvotes
                </div>
              </div>
              <div>
                <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-1" /> {meme.comments.length} comments
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardContent>
          
          <Collapsible open={isCommentsOpen}>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                  {meme.comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  ) : (
                    meme.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <img 
                            src={comment.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                            alt="User" 
                            className="h-5 w-5 rounded-full" 
                          />
                          <span className="text-xs font-medium">{comment.user.username}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment (max 140 chars)"
                    maxLength={140}
                  />
                  <Button onClick={handleAddComment}>Post</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
      
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
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default MemeCard;
