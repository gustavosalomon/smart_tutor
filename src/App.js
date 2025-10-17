import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/Subjects';
import MyProgress from './pages/MyProgress';
import SettingsPage from './pages/SettingsPage';
import TrackingPage from './pages/TrackingPage';
import ResourcesPage from './pages/ResourcesPage';
import Footer from './components/Footer'; // footer
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/my-progress" element={<MyProgress />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer /> {/* 👈 Footer agregado aquí */}
      </div>
    </BrowserRouter>
  );
}

export default App;
