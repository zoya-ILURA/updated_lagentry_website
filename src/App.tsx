import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import AgentDemoCards from './components/AgentDemoCards';
import ChooseConnectComplete from './components/ChooseConnectComplete';
import Dashboard from './components/Dashboard';
import GmailSection from './components/GmailSection';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import BookDemo from './pages/BookDemo';
import Waitlist from './pages/Waitlist';
import Features from './pages/Features';
import Agents from './pages/Agents';
import {
  GTMSalesAgentPage,
  HRRecruitmentAgentPage,
  CFOFinanceAgentPage,
  CustomerSupportAgentPage,
  RealEstateAgentPage,
  HealthcareAgentPage,
} from './pages/AgentPages';

// Track whether the intro (Header + purple animation) has been shown
// This value resets on a full page reload (hard refresh), but persists
// while navigating between routes in the SPA.
let introShownForThisLoad = false;

const HomePage: React.FC = () => {
  // Show the intro only once per page load (hard refresh resets this flag)
  const shouldShowIntro = !introShownForThisLoad;
  if (shouldShowIntro) {
    introShownForThisLoad = true;
  }

  return (
    <>
      {shouldShowIntro && <Header />}
      <WelcomePage />
      <AgentDemoCards />
      <ChooseConnectComplete />
      <Dashboard />
      <GmailSection />
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/gtm-sales" element={<GTMSalesAgentPage />} />
          <Route path="/agents/hr-recruitment" element={<HRRecruitmentAgentPage />} />
          <Route path="/agents/cfo-finance" element={<CFOFinanceAgentPage />} />
          <Route path="/agents/customer-support" element={<CustomerSupportAgentPage />} />
          <Route path="/agents/real-estate" element={<RealEstateAgentPage />} />
          <Route path="/agents/healthcare" element={<HealthcareAgentPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
