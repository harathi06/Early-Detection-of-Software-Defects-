import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DatasetManagement from './pages/DatasetManagement';
import ModelTraining from './pages/ModelTraining';
import DefectPrediction from './pages/DefectPrediction';
import ModelComparison from './pages/ModelComparison';
import AboutProject from './pages/AboutProject';
import { checkBackendHealth } from './api/client';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeDataset, setActiveDataset] = useState('jm1');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    async function verifyHealth() {
      const status = await checkBackendHealth();
      setBackendStatus(status);
    }
    verifyHealth();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            setActivePage={setActivePage} 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
      case 'datasets':
        return (
          <DatasetManagement 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
      case 'training':
        return (
          <ModelTraining 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
      case 'prediction':
        return (
          <DefectPrediction 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
      case 'comparison':
        return (
          <ModelComparison 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
      case 'about':
        return <AboutProject />;
      default:
        return (
          <Dashboard 
            setActivePage={setActivePage} 
            activeDataset={activeDataset} 
            setActiveDataset={setActiveDataset} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Layout */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header 
          activePage={activePage}
          setIsMobileOpen={setIsMobileOpen}
          backendStatus={backendStatus}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
