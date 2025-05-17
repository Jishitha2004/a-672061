
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMeme } from '@/contexts/MemeContext';
import MemeCard from '@/components/memes/MemeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getUserMemes } = useMeme();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in the useEffect
  }
  
  // Get user's memes
  const userMemes = getUserMemes(user.id);
  
  // Calculate stats
  const totalUpvotes = userMemes.reduce((sum, meme) => sum + meme.upvotes, 0);
  const totalDownvotes = userMemes.reduce((sum, meme) => sum + meme.downvotes, 0);
  const totalComments = userMemes.reduce((sum, meme) => sum + meme.comments.length, 0);
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{userMemes.length}</div>
                  <div className="text-sm text-gray-500">Memes</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold text-green-600">{totalUpvotes}</div>
                  <div className="text-sm text-gray-500">Upvotes</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{totalComments}</div>
                  <div className="text-sm text-gray-500">Comments</div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => navigate('/create')}>Create New Meme</Button>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Memes</h2>
        
        {userMemes.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 text-center rounded-lg">
            <h3 className="text-xl font-medium mb-2">You haven't created any memes yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Share your developer humor with the community!
            </p>
            <Button onClick={() => navigate('/create')}>Create Your First Meme</Button>
          </div>
        ) : (
          <Tabs defaultValue="memes">
            <TabsList className="mb-6">
              <TabsTrigger value="memes">All Memes</TabsTrigger>
              <TabsTrigger value="stats">Engagement Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="memes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userMemes.map(meme => (
                  <MemeCard key={meme.id} meme={meme} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Meme Performance</h3>
                  <div className="space-y-4">
                    {userMemes.map(meme => (
                      <div key={meme.id} className="border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={meme.imageUrl} 
                              alt="Meme thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">
                              {meme.topText || ''} {meme.bottomText ? '/ ' + meme.bottomText : ''}
                            </h4>
                            <div className="text-sm text-gray-500">
                              Posted on {new Date(meme.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600">{meme.upvotes}</span>
                            <span className="text-sm text-gray-500">upvotes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-red-600">{meme.downvotes}</span>
                            <span className="text-sm text-gray-500">downvotes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{meme.comments.length}</span>
                            <span className="text-sm text-gray-500">comments</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
