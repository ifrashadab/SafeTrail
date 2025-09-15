import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Home, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

interface NavigationProps {
  user?: User;
  showBackButton?: boolean;
}

export function Navigation({ user, showBackButton }: NavigationProps) {
  const showEmergencyAlert = () => {
    alert('🚨 EMERGENCY ALERT ACTIVATED!\n\nYour location has been shared with:\n• Local emergency services\n• Your emergency contacts\n• Tourist helpline\n\nHelp is on the way!');
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <Link href="/dashboard">
                <Button data-testid="button-home" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Safe Trail</h1>
                  <p className="text-sm text-muted-foreground">Smart Tourist Safety Platform</p>
                </div>
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.touristId}</p>
              </div>
              <Button 
                onClick={showEmergencyAlert}
                data-testid="button-emergency"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
