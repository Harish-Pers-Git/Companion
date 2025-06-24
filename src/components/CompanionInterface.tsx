
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Palette, BookOpen, Feather, Heart, MessageCircle, User, Zap } from "lucide-react";

interface CompanionInterfaceProps {
  onBack: () => void;
}

const CompanionInterface = ({ onBack }: CompanionInterfaceProps) => {
  const [activeTab, setActiveTab] = useState("companion");

  const companionActivities = [
    {
      title: "Chat & Talk",
      description: "Have meaningful conversations",
      icon: MessageCircle,
      color: "bg-blue-500"
    },
    {
      title: "Emotional Support",
      description: "Get support when you need it",
      icon: Heart,
      color: "bg-pink-500"
    },
    {
      title: "Personal Growth",
      description: "Grow together through activities",
      icon: Zap,
      color: "bg-purple-500"
    },
    {
      title: "Memory Sharing",
      description: "Build shared experiences",
      icon: BookOpen,
      color: "bg-green-500"
    }
  ];

  const physicalActivities = [
    {
      title: "Avatar Customization",
      description: "Customize your companion's appearance",
      icon: User,
      color: "bg-indigo-500"
    },
    {
      title: "Virtual Selfies",
      description: "Take photos together",
      icon: Camera,
      color: "bg-orange-500"
    },
    {
      title: "Style & Fashion",
      description: "Choose outfits and accessories",
      icon: Palette,
      color: "bg-cyan-500"
    },
    {
      title: "Room Design",
      description: "Decorate your shared space",
      icon: BookOpen,
      color: "bg-yellow-500"
    }
  ];

  const activityFeatures = [
    {
      title: "AI Art Creation",
      description: "Create art together using AI",
      icon: Palette,
      color: "bg-violet-500"
    },
    {
      title: "Story Writing",
      description: "Write fiction stories together",
      icon: BookOpen,
      color: "bg-emerald-500"
    },
    {
      title: "Poetry & Poems",
      description: "Generate poems with your companion",
      icon: Feather,
      color: "bg-rose-500"
    },
    {
      title: "Games & Puzzles",
      description: "Play interactive games",
      icon: Zap,
      color: "bg-amber-500"
    }
  ];

  const renderActivityGrid = (activities: typeof companionActivities) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activities.map((activity, index) => (
        <Card 
          key={index} 
          className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-white text-lg">{activity.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white/80">
              {activity.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <div className="text-2xl font-bold text-white">Create Your Companion</div>
        
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <TabsTrigger 
              value="physical" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Physical
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="companion" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Companion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="physical" className="mt-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Physical Customization</h2>
              <p className="text-white/80 text-lg">Personalize your companion's appearance and environment</p>
            </div>
            {renderActivityGrid(physicalActivities)}
          </TabsContent>

          <TabsContent value="activity" className="mt-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Creative Activities</h2>
              <p className="text-white/80 text-lg">Explore creative activities together</p>
            </div>
            {renderActivityGrid(activityFeatures)}
          </TabsContent>

          <TabsContent value="companion" className="mt-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Companion Features</h2>
              <p className="text-white/80 text-lg">Build a meaningful relationship with your AI companion</p>
            </div>
            {renderActivityGrid(companionActivities)}
          </TabsContent>
        </Tabs>

        {/* Start button */}
        <div className="text-center mt-12">
          <Button className="bg-white/90 hover:bg-white text-gray-800 text-lg px-12 py-4 rounded-full font-semibold transition-all hover:scale-105">
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanionInterface;
