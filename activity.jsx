import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Coffee,
  Mountain,
  Palette,
  Music,
  Gamepad2,
  Dumbbell,
  ChefHat,
  Camera,
  User
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const categoryIcons = {
  coffee: Coffee,
  outdoor: Mountain,
  creative: Palette,
  music: Music,
  gaming: Gamepad2,
  fitness: Dumbbell,
  food: ChefHat,
  other: Camera
};

const categoryColors = {
  coffee: "bg-amber-100 text-amber-700 border-amber-200",
  outdoor: "bg-green-100 text-green-700 border-green-200",
  creative: "bg-purple-100 text-purple-700 border-purple-200",
  music: "bg-pink-100 text-pink-700 border-pink-200",
  gaming: "bg-blue-100 text-blue-700 border-blue-200",
  fitness: "bg-orange-100 text-orange-700 border-orange-200",
  food: "bg-red-100 text-red-700 border-red-200",
  other: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function ActivityCard({ activity, currentUserId, onJoin }) {
  const Icon = categoryIcons[activity.category] || Camera;
  const isParticipant = activity.current_participants?.includes(currentUserId);
  const isOrganizer = activity.organizer_id === currentUserId;
  const isFull = activity.current_participants?.length >= activity.max_participants;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-0">
          {/* Activity Image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
            {activity.image_url ? (
              <img
                src={activity.image_url}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-16 h-16 text-white/70" />
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${categoryColors[activity.category]} border font-medium`}>
                <Icon className="w-3 h-3 mr-1" />
                {activity.category}
              </Badge>
            </div>

            {/* Participants Count */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="flex items-center gap-1 text-white text-sm">
                <Users className="w-3 h-3" />
                <span>{activity.current_participants?.length || 0}/{activity.max_participants}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activity.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {activity.description}
            </p>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(activity.date_time), "MMM d, yyyy")}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{format(new Date(activity.date_time), "h:mm a")}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{activity.location}</span>
          </div>

          {/* Organizer Badge */}
          {isOrganizer && (
            <div className="mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <User className="w-3 h-3 mr-1" />
                You're organizing this
              </Badge>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {activity.current_participants?.length || 0} joined
            </div>
            
            {isOrganizer ? (
              <Button variant="outline" disabled className="text-blue-600 border-blue-200">
                Your Activity
              </Button>
            ) : isParticipant ? (
              <Button variant="outline" disabled className="text-green-600 border-green-200">
                Already Joined
              </Button>
            ) : isFull ? (
              <Button variant="outline" disabled>
                Full
              </Button>
            ) : (
              <Button
                onClick={onJoin}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 transition-all duration-200"
              >
                Join Activity
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
