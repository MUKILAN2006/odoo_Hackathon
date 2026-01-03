import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, MapPin, Calendar, Globe, Settings, LogOut, Camera, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { user } from "@/data/mockData";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: user.location || "San Francisco, CA",
    bio: user.bio || "Passionate traveler exploring the world one destination at a time.",
  });

  const handleSave = () => {
    // Save profile logic here
    console.log("Profile saved:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      location: user.location || "San Francisco, CA",
      bio: user.bio || "Passionate traveler exploring the world one destination at a time.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <div className="flex gap-2">
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  
                  {/* Stats */}
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{user.trips || 12}</p>
                      <p className="text-sm text-muted-foreground">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{user.countries || 8}</p>
                      <p className="text-sm text-muted-foreground">Countries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{user.friends || 156}</p>
                      <p className="text-sm text-muted-foreground">Friends</p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    <Globe className="w-3 h-3 mr-1" />
                    Travel Enthusiast
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">About Me</h3>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-1 w-full h-24 p-3 border rounded-md resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} className="gap-2">
                        <User className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.location || "San Francisco, CA"}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground mt-1" />
                      <p className="text-muted-foreground">
                        {user.bio || "Passionate traveler exploring the world one destination at a time."}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: MapPin, text: "Created new trip to Tokyo", time: "2 hours ago" },
                    { icon: Calendar, text: "Updated Italy itinerary", time: "1 day ago" },
                    { icon: User, text: "Added 3 new travel friends", time: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <activity.icon className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
