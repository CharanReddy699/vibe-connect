
import React, { useState, useEffect } from "react";
import { UserProfile, Connection } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Filter,
  Sparkles,
  Coffee,
  Camera,
  Music,
  Gamepad2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import UserCard from "../components/discover/UserCard";
import FilterPanel from "../components/discover/FilterPanel";
import WelcomeHero from "../components/discover/WelcomeHero";

const exampleUsers = [
  { name: "Charan", color: "bg-blue-300" },
  { name: "Shiva", color: "bg-green-300" },
  { name: "Sathwik", color: "bg-red-300" },
  { name: "Priya", color: "bg-yellow-300" },
  { name: "Arjun", color: "bg-indigo-300" },
];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserProfile, setHasUserProfile] = useState(false);

  useEffect(() => {
    // loadProfiles is now defined inside useEffect to capture the 'user' object
    // from User.me() directly, avoiding dependency issues with currentUser state.
    const loadProfiles = async (user) => {
      try {
        const allProfiles = await UserProfile.list();
        // For this demo, we are showing all profiles including the current user's
        // to ensure the sample data is always visible.
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
      }
    };
    
    const initializePage = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user); // Set current user for other component logic

        // Check if user has a profile
        const userProfiles = await UserProfile.filter({ created_by: user.email });
        setHasUserProfile(userProfiles.length > 0);
        
        if (userProfiles.length > 0) {
          // Pass the freshly fetched 'user' object to loadProfiles
          await loadProfiles(user); 
        } else {
          // If no user profile, still load all profiles for demonstration
          await loadProfiles(user);
        }
      } catch (error) {
        console.error("Error loading user or profile:", error);
        // Handle cases where user might not be logged in or other errors
        // Optionally set hasUserProfile to false if there's no user or profile
        // setHasUserProfile(false); 
        // Even if there's an error, try to load profiles for display
        await loadProfiles(null); // Pass null if no user
      }
      setIsLoading(false);
    };

    initializePage();
  }, []); // Empty dependency array means this runs once on mount

  const handleConnect = async (targetProfile) => {
    try {
      if (!currentUser) {
        console.error("Cannot connect: current user is not defined.");
        // Potentially redirect to login or show an error message
        return;
      }
      await Connection.create({
        user1_id: currentUser.id,
        user2_id: targetProfile.id,
        initiated_by: currentUser.id,
        message: "Hey! I'd love to connect and maybe hang out sometime! 👋"
      });
      
      // Remove the profile from the list
      setProfiles(prev => prev.filter(p => p.id !== targetProfile.id));
      
      // Show success notification
      showNotificationToast(`Connection request sent to ${targetProfile.display_name}! 🚀`);
    } catch (error) {
      console.error("Error creating connection:", error);
    }
  };

  const showNotificationToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.interests?.some(interest => 
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesVibes = selectedVibes.length === 0 ||
      selectedVibes.some(vibe => profile.vibes?.includes(vibe));
    
    const matchesActivities = selectedActivities.length === 0 ||
      selectedActivities.some(activity => 
        profile.preferred_activities?.includes(activity)
      );
    
    return matchesSearch && matchesVibes && matchesActivities;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If user has no profile, show the WelcomeHero component
  if (!hasUserProfile) {
    return <WelcomeHero />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex gap-4">
                <Coffee className="w-8 h-8 text-orange-200 animate-bounce" style={{animationDelay: '0s'}} />
                <Camera className="w-8 h-8 text-pink-200 animate-bounce" style={{animationDelay: '0.5s'}} />
                <Music className="w-8 h-8 text-purple-200 animate-bounce" style={{animationDelay: '1s'}} />
                <Gamepad2 className="w-8 h-8 text-indigo-200 animate-bounce" style={{animationDelay: '1.5s'}} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Tribe
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Find amazing people nearby who share your energy and interests
            </p>

            <div className="mt-12 flex justify-center items-center gap-4 flex-wrap">
              <p className="text-purple-200 mr-4 text-sm font-medium">Connect with people like:</p>
              {exampleUsers.map((user, index) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md"
                >
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center font-bold text-gray-700`}>
                    {user.name[0]}
                  </div>
                  <span className="font-medium text-white pr-2">{user.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-white/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, interests, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-purple-100 focus:border-purple-300 rounded-full"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <FilterPanel
            selectedVibes={selectedVibes}
            setSelectedVibes={setSelectedVibes}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Profiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            People Near You ({filteredProfiles.length})
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Within 10 miles</span>
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No matches found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <UserCard
                key={profile.id}
                profile={profile}
                onConnect={() => handleConnect(profile)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
