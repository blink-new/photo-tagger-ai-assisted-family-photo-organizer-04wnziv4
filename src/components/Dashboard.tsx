import React, { useState } from 'react';
import { Camera, Plus, Folder, User, LogOut, Settings, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { CreateAlbumDialog } from './CreateAlbumDialog';
import { PhotoUploader } from './PhotoUploader';

interface Album {
  id: string;
  name: string;
  username: string;
  photoCount: number;
  lastModified: string;
  coverPhoto?: string;
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      name: 'Summer Vacation 2024',
      username: user?.username || '',
      photoCount: 24,
      lastModified: '2024-01-15',
      coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
      id: '2', 
      name: 'Family Christmas',
      username: user?.username || '',
      photoCount: 18,
      lastModified: '2024-01-10',
      coverPhoto: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Kids Birthday Party',
      username: user?.username || '',
      photoCount: 42,
      lastModified: '2024-01-08',
      coverPhoto: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    }
  ]);

  const handleAlbumClick = (album: Album) => {
    // Navigate to album view
    window.location.href = `/album/${album.username}/${encodeURIComponent(album.name)}`;
  };

  const handleCreateAlbum = (name: string, description?: string) => {
    setAlbums(prev => [
      {
        id: Date.now().toString(),
        name,
        photoCount: 0,
        coverPhoto: undefined,
        lastModified: '2024-01-01',
        owner: user?.username || 'unknown',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PhotoTagger</h1>
                <p className="text-sm text-gray-500">Family Photo Organizer</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              {user?.role === 'admin' && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Organize, enhance, and preserve your family memories with AI-powered tools.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setShowCreateAlbum(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Album
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowUploader(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
            <Button variant="outline">
              <Folder className="h-4 w-4 mr-2" />
              Browse All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Albums</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAlbums.length}</div>
              <p className="text-xs text-muted-foreground">
                Across your collection
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAlbums.reduce((sum, album) => sum + album.photoCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready to organize
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enhanced</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                AI-enhanced photos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Albums Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Albums</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          {mockAlbums.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No albums yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first album to start organizing your photos
                </p>
                <Button onClick={() => setShowCreateAlbum(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Album
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAlbums.map((album) => (
                <Card 
                  key={album.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => handleAlbumClick(album)}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                      {album.coverPhoto ? (
                        <img
                          src={album.coverPhoto}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90">
                          {album.photoCount} photos
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {album.name}
                    </CardTitle>
                    <CardDescription>
                      Last modified: {new Date(album.lastModified).toLocaleDateString()}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Album Dialog */}
      <CreateAlbumDialog 
        open={showCreateAlbum} 
        onOpenChange={setShowCreateAlbum}
        onCreateAlbum={handleCreateAlbum}
      />

      {/* Upload Photos Dialog */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              Add new photos to your collection. Select an album or create a new one.
            </DialogDescription>
          </DialogHeader>
          <PhotoUploader 
            albumName="General"
            onUploadComplete={() => {
              setShowUploader(false);
              // Could refresh albums here
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const mockAlbums: Album[] = [
  // ... existing mock albums ...
];