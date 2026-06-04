import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PhoneFrame from "@/components/layout/PhoneFrame";

import Splash from "@/pages/splash";
import Onboarding from "@/pages/onboarding";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Locker from "@/pages/locker";
import FAQ from "@/pages/faq";
import Services from "@/pages/services";
import NewGrievance from "@/pages/grievance";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/locker" component={Locker} />
      <Route path="/faq" component={FAQ} />
      <Route path="/services/:dept" component={Services} />
      <Route path="/grievance/new" component={NewGrievance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <PhoneFrame>
            <Router />
          </PhoneFrame>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;