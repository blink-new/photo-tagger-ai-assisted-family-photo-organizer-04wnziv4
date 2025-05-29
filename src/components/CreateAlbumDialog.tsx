import React, { useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import toast from 'react-hot-toast';

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAlbum: (name: string, description?: string) => void; // Callback for when album is created
}

export function CreateAlbumDialog({ open, onOpenChange, onCreateAlbum }: CreateAlbumDialogProps) {
  const [albumName, setAlbumName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!albumName.trim()) {
      toast.error('Please enter an album name');
      return;
    }

    setIsCreating(true);
    
    // Simulate API call for creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the parent callback
    onCreateAlbum(albumName, description);
    
    toast.success(`Album "${albumName}" created successfully!`);
    
    // Reset form and close dialog
    setAlbumName('');
    setDescription('');
    setIsCreating(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isCreating) onOpenChange(isOpen); // Prevent closing while creating
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5 text-blue-600" />
            <span>Create New Album</span>
          </DialogTitle>
          <DialogDescription>
            Create a new album to organize your photos. You can add photos and enhance them with AI tools.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="album-name">Album Name</Label>
            <Input
              id="album-name"
              type="text"
              placeholder="e.g., Summer Vacation 2024"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this album..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
            />
          </div>
        </form>
        
        <DialogFooter className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            type="submit" // This button will trigger the form's onSubmit
            onClick={handleSubmit} // Also call handleSubmit directly for clarity or if form tag is removed
            disabled={isCreating || !albumName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Album
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
