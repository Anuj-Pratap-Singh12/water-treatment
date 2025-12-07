import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WaterDashboard from "./components/WaterDashboard";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SensorsPage from "./pages/SensorsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import ProcessDesignPage from "./pages/ProcessDesignPage";
import MarketplacePage from "./pages/MarketplacePage";
import EDNAMonitorPage from "./pages/EDNAMonitorPage";

import ThemeProvider from "./theme/ThemeProvider";

// Visual & interactive helpers
import BackgroundFX from "./components/BackgroundFX";
import CustomCursor from "./components/CustomCursor";
import SidePanelNav from "./components/SidePanelNav";
import PageTransitionWrapper from "./components/PageTransitionWrapper";

// Hook that attaches IntersectionObserver to reveal elements with `.reveal`
import useScrollReveal from "./hooks/useScrollReveal";

export default function App() {
  // simple route state (keeps your project's existing structure)
  const [route, setRoute] = React.useState("home");

  // initialize global scroll reveal (applies to elements with class "reveal")
  // call at top-level so every page benefits from reveals
  useScrollReveal();

  // pages dictionary
  const pages = {
    home: <HomePage onNavigate={setRoute} />,
    // NOTE: If WaterDashboard replaces the old DashboardPage, ensure you map it here.
    // Assuming 'swrr' is the correct key based on previous conversation:
    dashboard: <DashboardPage />, 
    sensors: <SensorsPage />,
    analytics: <AnalyticsPage />,
    reports: <ReportsPage />,
    process: <ProcessDesignPage />,
    swrr: <WaterDashboard />, // <-- WaterDashboard is correctly registered here
    marketplace: <MarketplacePage />,
    edna: <EDNAMonitorPage />,
  };

  // helper to render current page inside the page-transition wrapper
  const renderCurrent = () => {
    // Falls back to 'home' if the route is unknown
    const pageNode = pages[route] || pages.home; 
    // PageTransitionWrapper provides a smooth fade/slide between page switches
    return (
      <PageTransitionWrapper locationKey={route}>
        {pageNode}
      </PageTransitionWrapper>
    );
  };
  

  return (
    <ThemeProvider>
      {/* Background effects layer (blobs, animated gradient, optional particles) */}
      <BackgroundFX />

      {/* Custom cursor (hidden on mobile by CSS) */}
      <CustomCursor />

      {/* App shell */}
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header: stays at top */}
        <Header current={route} onNavigate={setRoute} />

        {/* Side panel navigation lives at root (off-canvas drawer opens/closes via SidePanelNav internals) */}
        <SidePanelNav current={route} onNavigate={setRoute} />

        {/* Main content area */}
        <main className={`flex-1 ${route === "home" ? "px-0 pt-0" : "container mx-auto px-6 pt-20 pb-12"}`}>

          {/* FIX: Ensure the component is ONLY rendered here via renderCurrent().
            If you previously added <WaterDashboard /> directly here or before the Footer,
            that was the cause of the duplication.
          */}
          {renderCurrent()}
        </main>
        

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
