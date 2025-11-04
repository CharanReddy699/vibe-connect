
import React, { useState, useEffect, useCallback } from "react";
import { Connection } from "@/entities/Connection";
import { UserProfile } from "@/entities/UserProfile";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Users, 
  Check, 
  X, 
  Heart,
  Clock,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter({ onNotificationUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadNotifications = useCallback(async (user) => {
    try {
      // Get pending connection requests where current user is the recipient
      const connections = await Connection.filter({ 
        user2_id: user.id,
        status: "pending"
      });

      // Get profile details for each sender
      const notificationsWithProfiles = await Promise.all(
        connections.map(async (connection) => {
          try {
            const profiles = await UserProfile.filter({ 
              created_by: connection.user1_id 
            });
            const senderProfile = profiles[0];
            
            return {
              id: connection.id,
              type: "connection_request",
              connection,
              senderProfile,
              timestamp: connection.created_date,
              isRead: false
            };
          } catch (error) {
            console.error("Error loading profile for connection:", error);
            return null;
          }
        })
      );

      const validNotifications = notificationsWithProfiles.filter(n => n !== null);
      setNotifications(validNotifications);
      
      // Update notification count in parent component
      if (onNotificationUpdate) {
        onNotificationUpdate(validNotifications.length);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [onNotificationUpdate]);

  const checkForNewNotifications = useCallback(async () => {
    if (!currentUser) return;
    await loadNotifications(currentUser);
  }, [currentUser, loadNotifications]);

  const initializeNotifications = useCallback(async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      await loadNotifications(user);
    } catch (error) {
      console.error("Error initializing notifications:", error);
    }
  }, [loadNotifications]);

  useEffect(() => {
    initializeNotifications();
    // Poll for new notifications every 20 seconds
    const interval = setInterval(checkForNewNotifications, 20000); // Changed from 10 seconds to 20 seconds
    return () => clearInterval(interval);
  }, [initializeNotifications, checkForNewNotifications]);

  const handleConnectionAction = async (connectionId, action) => {
    setIsLoading(true);
    try {
      await Connection.update(connectionId, { status: action });
      
      // Remove notification from list
      setNotifications(prev => prev.filter(n => n.connection.id !== connectionId));
      
      // Update notification count
      const newCount = notifications.length - 1;
      if (onNotificationUpdate) {
        onNotificationUpdate(newCount);
      }

      // Show success message based on action
      if (action === "accepted") {
        showNotificationToast("Connection accepted! 🎉");
      }
    } catch (error) {
      console.error("Error updating connection:", error);
    }
    setIsLoading(false);
  };

  const showNotificationToast = (message) => {
    // Simple toast notification - you could enhance this with a proper toast library
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Profile Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    {notification.senderProfile?.profile_image ? (
                      <img
                        src={notification.senderProfile.profile_image}
                        alt={notification.senderProfile.display_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {notification.senderProfile?.display_name?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-900">
                        New Connection Request
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-3">
                      <strong>{notification.senderProfile?.display_name}</strong> wants to connect with you!
                    </p>

                    {notification.connection.message && (
                      <div className="bg-white/70 rounded-lg p-2 mb-3 text-sm italic text-gray-600">
                        "{notification.connection.message}"
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleConnectionAction(notification.connection.id, "accepted")}
                        disabled={isLoading}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleConnectionAction(notification.connection.id, "declined")}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500">
              No new notifications right now.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
