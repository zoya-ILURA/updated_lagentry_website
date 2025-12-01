import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import AgentDemoCards from './components/AgentDemoCards';
import WhyChooseLagentry from './components/WhyChooseLagentry';
import ChooseConnectComplete from './components/ChooseConnectComplete';
import Dashboard from './components/Dashboard';
import GmailSection from './components/GmailSection';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import BookDemo from './pages/BookDemo';
import Waitlist from './pages/Waitlist';
import Features from './pages/Features';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <WelcomePage />
      <AgentDemoCards />
      <WhyChooseLagentry />
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
