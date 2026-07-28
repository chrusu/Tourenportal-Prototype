import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TourOverviewPage } from "@/pages/TourOverviewPage";
import { TourDetailPage } from "@/pages/TourDetailPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Routes>
        <Route path="/" element={<TourOverviewPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  );
}
