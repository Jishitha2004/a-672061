
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useMeme } from '@/contexts/MemeContext';
import { toast } from 'sonner';

// Template meme images
const MEME_TEMPLATES = [
  { id: 'template1', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', name: 'Surprised Developer' },
  { id: 'template2', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', name: 'Coding Screen' },
  { id: 'template3', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', name: 'Laptop Workflow' },
  { id: 'template4', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', name: 'Programming Session' },
  { id: 'template5', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', name: 'Dev Meeting' },
];

// Font options
const FONT_OPTIONS = [
  { value: 'Impact', label: 'Impact (Classic)' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Courier New', label: 'Courier New' },
];

// Font sizes
const FONT_SIZES = [
  { value: '24px', label: 'Small' },
  { value: '36px', label: 'Medium' },
  { value: '48px', label: 'Large' },
  { value: '64px', label: 'Extra Large' },
];

// Font colors
const FONT_COLORS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#FF0000', label: 'Red' },
  { value: '#00FF00', label: 'Green' },
  { value: '#0000FF', label: 'Blue' },
  { value: '#FFFF00', label: 'Yellow' },
];

const CreateMemePage = () => {
  const { isAuthenticated } = useAuth();
  const { createMeme } = useMeme();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadTab, setUploadTab] = useState<string>('template');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState('36px');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to create a meme');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File is too large', { description: 'Please upload an image smaller than 2MB' });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please upload an image file' });
      return;
    }
    
    // Create object URL
    const objectUrl = URL.createObjectURL(file);
    setUploadedImage(objectUrl);
    setSelectedImage(objectUrl);
    
    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      // Don't add duplicate tags
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newMeme = await createMeme({
        imageUrl: selectedImage,
        topText: topText,
        bottomText: bottomText,
        tags: tags
      });
      
      toast.success('Meme created successfully!');
      navigate(`/meme/${newMeme.id}`);
    } catch (error) {
      toast.error('Failed to create meme', { 
        description: 'Please try again later' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview styles based on user selections
  const textStyle = {
    fontFamily,
    fontSize,
    color: fontColor,
    textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`,
    textTransform: 'uppercase' as const,
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Meme</h1>
      
      {/* Steps indicator */}
      <div className="flex mb-8">
        <div className={`flex-1 px-4 py-2 text-center rounded-l-md ${currentStep === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          1. Choose Image
        </div>
        <div className={`flex-1 px-4 py-2 text-center ${currentStep === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          2. Add Text
        </div>
        <div className={`flex-1 px-4 py-2 text-center rounded-r-md ${currentStep === 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          3. Finish & Publish
        </div>
      </div>
      
      {/* Step 1: Image Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select an Image</CardTitle>
            <CardDescription>
              Choose from our templates or upload your own image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={uploadTab} onValueChange={setUploadTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="template">Use Template</TabsTrigger>
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="template" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MEME_TEMPLATES.map(template => (
                    <div
                      key={template.id}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                        selectedImage === template.url ? 'border-purple-500' : 'border-transparent'
                      }`}
                      onClick={() => handleImageSelect(template.url)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={template.url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium">{template.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span className="mt-2">Click to upload an image</span>
                      <span className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </span>
                    </div>
                  </Label>
                </div>
                
                {uploadedImage && (
                  <div className="mt-4">
                    <p className="mb-2 font-medium">Selected Image:</p>
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextStep}>Next</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 2: Text Editing */}
      {currentStep === 2 && selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Add Text</CardTitle>
            <CardDescription>
              Customize your meme with text captions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="top-text">Top Text</Label>
                  <Input
                    id="top-text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Enter top text"
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bottom-text">Bottom Text</Label>
                  <Input
                    id="bottom-text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Enter bottom text"
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font</Label>
                  <select
                    id="font-family"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {FONT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Size</Label>
                    <select
                      id="font-size"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {FONT_SIZES.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-color">Color</Label>
                    <select
                      id="font-color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {FONT_COLORS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Live Preview */}
              <div className="border rounded-md overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={selectedImage}
                    alt="Meme Preview"
                    className="w-full h-full object-cover"
                  />
                  {topText && (
                    <div className="absolute top-4 left-0 right-0 text-center">
                      <p className="text-2xl font-bold" style={textStyle}>
                        {topText}
                      </p>
                    </div>
                  )}
                  
                  {bottomText && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-2xl font-bold" style={textStyle}>
                        {bottomText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>Back</Button>
            <Button onClick={handleNextStep}>Next</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 3: Publish */}
      {currentStep === 3 && selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Finalize & Publish</CardTitle>
            <CardDescription>
              Add tags to help others find your meme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (press Enter to add)</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="javascript, bugs, frontend..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center"
                    >
                      #{tag}
                      <button
                        className="ml-2 text-gray-600 hover:text-gray-800"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Final Preview */}
              <div className="border rounded-md overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={selectedImage}
                    alt="Meme Preview"
                    className="w-full h-full object-cover"
                  />
                  {topText && (
                    <div className="absolute top-4 left-0 right-0 text-center">
                      <p className="text-2xl font-bold" style={textStyle}>
                        {topText}
                      </p>
                    </div>
                  )}
                  
                  {bottomText && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-2xl font-bold" style={textStyle}>
                        {bottomText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>Back</Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Meme'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CreateMemePage;
