import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { EasterEggProvider } from "@/contexts/EasterEggContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MyActivitiesProvider } from "@/contexts/MyActivitiesContext";
import { SavedFiltersProvider } from "@/contexts/SavedFiltersContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { TourOverviewPage } from "@/pages/TourOverviewPage";
import { TourDetailPage } from "@/pages/TourDetailPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <EasterEggProvider>
        <AuthProvider>
          <FavoritesProvider>
            <MyActivitiesProvider>
              <SavedFiltersProvider>
                <Routes>
                  <Route path="/" element={<TourOverviewPage />} />
                  <Route path="/tours/:id" element={<TourDetailPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <LoginDialog />
              </SavedFiltersProvider>
            </MyActivitiesProvider>
          </FavoritesProvider>
        </AuthProvider>
      </EasterEggProvider>
    </TooltipProvider>
  );
}
