import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ToastProvider"; // NEW: Add toast provider
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import DigitalId from "@/pages/DigitalId";
import SafetyHub from "@/pages/SafetyHub";
import ScamAwareness from "@/pages/ScamAwareness";
import AiAssistant from "@/pages/AiAssistant";
import TravelerConnect from "@/pages/TravelerConnect";
import NotFound from "@/pages/not-found";
import { AuthorityMessenger } from "@/components/AuthorityMessenger"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/digital-id" component={DigitalId} />
      <Route path="/safety-hub" component={SafetyHub} />
      <Route path="/scam-awareness" component={ScamAwareness} />
      <Route path="/ai-assistant" component={AiAssistant} />
      <Route path="/traveler-connect" component={TravelerConnect} />
       <Route path="/authority-messenger" component={AuthorityMessenger} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ToastProvider /> {/* NEW: Add toast notifications */}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
