import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PhoneFrame from "@/components/layout/PhoneFrame";
import { TTSProvider } from "@/components/StandaloneTranslateTTS";

import Splash from "@/pages/splash";
import Onboarding from "@/pages/onboarding";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import QueueToken from "@/pages/queue";
import Locker from "@/pages/locker";
import FAQ from "@/pages/faq";
import Services from "@/pages/services";
import NewGrievance from "@/pages/grievance";
import TrackRequest from "@/pages/track";
import Profile from "@/pages/profile";
import ServiceForm from "@/pages/service-form";
import KioskLocator from "@/pages/locator";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminComplaints from "@/pages/admin/AdminComplaints";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminUsers from "@/pages/admin/AdminUsers";

const queryClient = new QueryClient();

function CitizenRouter() {
  return (
    <PhoneFrame>
      <Switch>
        <Route path="/" component={Splash} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/queue" component={QueueToken} />
        <Route path="/tickets">
          {() => {
            const [, setLoc] = useLocation();
            setLoc("/track");
            return null;
          }}
        </Route>
        <Route path="/locker" component={Locker} />
        <Route path="/faq" component={FAQ} />
        <Route path="/services/:dept" component={Services} />
        <Route path="/grievance/new" component={NewGrievance} />
        <Route path="/track" component={TrackRequest} />
        <Route path="/locator" component={KioskLocator} />
        <Route path="/profile" component={Profile} />
        <Route path="/service-form/:type" component={ServiceForm} />
        <Route component={NotFound} />
      </Switch>
    </PhoneFrame>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <Switch>
              <Route path="/admin" component={AdminOverview} />
              <Route path="/admin/complaints" component={AdminComplaints} />
              <Route path="/admin/analytics" component={AdminAnalytics} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route component={AdminOverview} />
            </Switch>
          </AdminLayout>
        )}
      </Route>
    </Switch>
  );
}

function AppRouter() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  return isAdmin ? <AdminRouter /> : <CitizenRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TTSProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster />
        </TTSProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
