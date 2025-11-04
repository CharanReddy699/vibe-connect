
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Search, 
  Calendar, 
  MessageCircle, 
  User, 
  Settings,
  Sparkles 
} from "lucide-react";
import NotificationDropdown from "./components/notifications/NotificationDropdown";

const navigationItems = [
  {
    title: "Discover",
    url: createPageUrl("Discover"),
    icon: Search,
  },
  {
    title: "Activities",
    url: createPageUrl("Activities"),
    icon: Calendar,
  },
  {
    title: "Connections",
    url: createPageUrl("Connections"),
    icon: MessageCircle,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotificationUpdate = (count) => {
    setNotificationCount(count);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Discover")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VibeConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
              
              {/* Notification Bell */}
              <NotificationDropdown 
                notificationCount={notificationCount}
                onNotificationUpdate={handleNotificationUpdate}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 z-50">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.url
                  ? "text-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                location.pathname === item.url ? "fill-purple-100" : ""
              }`} />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add bottom padding for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
