import React from 'react';
import './AgentPages.css';
import Footer from '../components/Footer';

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type AgentConfig = {
  id: string;
  title: string;
  eyebrow: string;
  overview: string;
  videoSrc: string;
  features: Feature[];
};

interface AgentPageProps {
  config: AgentConfig;
}

const AgentPageTemplate: React.FC<AgentPageProps> = ({ config }) => {
  return (
    <div className="agent-page">
      {/* Hero */}
      <section className="agent-hero">
        <div className="agent-hero-inner">
          <p className="agent-hero-eyebrow">{config.eyebrow}</p>
          <h1 className="agent-hero-title">{config.title}</h1>
          <p className="agent-hero-overview">{config.overview}</p>
        </div>
      </section>

      {/* Video */}
      <section className="agent-video-section">
        <div className="agent-video-frame">
          <video
            className="agent-video-element"
            src={config.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </section>

      {/* Features */}
      <section className="agent-features-section">
        <div className="agent-features-header">
          <h2>What this agent can do</h2>
        </div>
        <div className="agent-features-grid">
          {config.features.map((feature) => (
            <article key={feature.title} className="agent-feature-card">
              <div className="agent-feature-icon">{feature.icon}</div>
              <h3 className="agent-feature-title">{feature.title}</h3>
              <p className="agent-feature-description">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Individual agent configs with provided content ---

const gtmSalesConfig: AgentConfig = {
  id: 'gtm-sales',
  title: 'GTM & Sales Agent',
  eyebrow: 'GTM & Sales Agent',
  overview:
    'Drive outreach, qualify intent, and keep deals in motion. A fully autonomous growth partner that discovers opportunities, initiates outreach, manages campaigns, and elevates every conversation.',
  videoSrc: '/sales.mp4',
  features: [
    {
      icon: '🎯',
      title: 'Lead Generation',
      description: 'Find and qualify high-intent leads with precision in seconds.',
    },
    {
      icon: '🔍',
      title: 'Lead Enrichment',
      description: 'Surface deep company insights automatically before outreach.',
    },
    {
      icon: '📞',
      title: 'Voice Calling',
      description: 'Call prospects in any language—or with your cloned voice.',
    },
    {
      icon: '⚡',
      title: 'Campaign Automation',
      description: 'Launch multi‑channel sequences that run on autopilot.',
    },
    {
      icon: '🔄',
      title: 'Follow‑Ups',
      description: 'Never miss a follow-up; the agent chases prospects relentlessly.',
    },
    {
      icon: '🤖',
      title: 'AI Meeting Assistant',
      description: 'Joins your calls silently and turns every word into actionable intelligence.',
    },
    {
      icon: '📊',
      title: 'Sales Analytics',
      description: 'Crystal‑clear pipeline insights, call logs, and performance reports.',
    },
  ],
};

const hrRecruitmentConfig: AgentConfig = {
  id: 'hr-recruitment',
  title: 'HR & Recruitment Agent',
  eyebrow: 'HR & Recruitment Agent',
  overview:
    'Orchestrate hiring, onboarding, and people ops flows. From sourcing to onboarding, this agent keeps every candidate and employee journey quietly coordinated.',
  videoSrc: '/HRvc.mp4',
  features: [
    {
      icon: '📄',
      title: 'Resume Screening',
      description: 'Filter hundreds of CVs instantly with skill‑accurate matching.',
    },
    {
      icon: '📞',
      title: 'Candidate Outreach',
      description: 'Call candidates, collect details, and schedule interviews automatically.',
    },
    {
      icon: '🎤',
      title: 'AI Interviewing',
      description: 'Conducts natural interviews based on JD + resume understanding.',
    },
    {
      icon: '❓',
      title: 'Cross‑Questioning',
      description: 'Tests real competence with smart follow-up questions.',
    },
    {
      icon: '⭐',
      title: 'Shortlisting',
      description: 'Ranks and selects top candidates with clean scorecards.',
    },
    {
      icon: '📋',
      title: 'Interview Summaries',
      description: 'Delivers transcripts, insights, and hiring recommendations.',
    },
  ],
};

const cfoFinanceConfig: AgentConfig = {
  id: 'cfo-finance',
  title: 'CFO & Finance Agent',
  eyebrow: 'CFO & Finance Agent',
  overview:
    'See cash, margin, and risk in one focused lane. A calm layer over budgets, forecasts, and cash — always ready with the next best move for your team.',
  videoSrc: '/AICFO.mp4',
  features: [
    {
      icon: '⚙️',
      title: 'Financial Automation',
      description: 'Automate AP, AR, reconciliation, and monthly closes.',
    },
    {
      icon: '💹',
      title: 'Cashflow Intelligence',
      description: 'Predict burn, runway, and financial health instantly.',
    },
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Spot anomalies and overspending in real time.',
    },
    {
      icon: '📈',
      title: 'Revenue Insights',
      description: 'Get instant P&L, balance sheets, and forecasts.',
    },
    {
      icon: '🛡️',
      title: 'Compliance‑Ready',
      description: 'Built for PDPL, NCA, HIPAA‑aligned data governance.',
    },
    {
      icon: '📊',
      title: 'CFO Reports',
      description: 'Receive clean, investor‑ready summaries on demand.',
    },
  ],
};

const customerSupportConfig: AgentConfig = {
  id: 'customer-support',
  title: 'Customer Support Agent',
  eyebrow: 'Customer Support Agent',
  overview:
    'Always-on help that feeds product with real signals. Frontline support that feels human, learns from every ticket, and feeds product back with clarity.',
  videoSrc: '/sal.mp4',
  features: [
    {
      icon: '💬',
      title: 'Multi‑Channel Support',
      description: 'Resolve queries across chat, WhatsApp, email, and voice.',
    },
    {
      icon: '🕐',
      title: '24/7 Availability',
      description: 'Instant, accurate responses at any hour.',
    },
    {
      icon: '🎫',
      title: 'Ticket Automation',
      description: 'Creates, assigns, and tracks tickets without human input.',
    },
    {
      icon: '🧠',
      title: 'Knowledge Learning',
      description: 'Learns from your docs and updates FAQs automatically.',
    },
    {
      icon: '📞',
      title: 'Voice Support',
      description: 'Handles verification, callbacks, and status updates.',
    },
    {
      icon: '📊',
      title: 'Support Analytics',
      description: 'Monitor response time, CSAT, volume, and trends.',
    },
  ],
};

const realEstateConfig: AgentConfig = {
  id: 'real-estate',
  title: 'Real Estate / Property Management Agent',
  eyebrow: 'Real Estate / Property Management Agent',
  overview:
    'From leads to leases and maintenance, handled quietly. From leads to leases and maintenance, this agent keeps your portfolio humming in the background.',
  videoSrc: '/sal.mp4',
  features: [
    {
      icon: '🏠',
      title: 'Property Matching',
      description: 'Suggest perfect units based on client needs instantly.',
    },
    {
      icon: '📞',
      title: 'Lead Calling',
      description: 'Qualify buyers and tenants using multilingual AI voice.',
    },
    {
      icon: '📅',
      title: 'Viewings Scheduling',
      description: 'Book, confirm, and manage property viewings effortlessly.',
    },
    {
      icon: '🔧',
      title: 'Tenant Issue Handling',
      description: 'Call tenants, diagnose issues, and create maintenance tickets.',
    },
    {
      icon: '⚙️',
      title: 'Maintenance Automation',
      description: 'Assign technicians and track task completion automatically.',
    },
    {
      icon: '🔄',
      title: 'Renewal & Follow‑Ups',
      description: 'Automate renewals, offers, and client nurturing.',
    },
  ],
};

const healthcareConfig: AgentConfig = {
  id: 'healthcare',
  title: 'Healthcare Agent',
  eyebrow: 'Healthcare Agent',
  overview:
    'Coordinate intake, scheduling, and follow‑ups with care. A focused layer for intake, scheduling, and follow-ups — designed for clinics and care teams.',
  videoSrc: '/sal.mp4',
  features: [
    {
      icon: '🏥',
      title: 'Patient Intake',
      description: 'Collect symptoms and context with medical‑grade questioning.',
    },
    {
      icon: '🚨',
      title: 'Triage Guidance',
      description: 'Routes cases safely without providing diagnosis.',
    },
    {
      icon: '📅',
      title: 'Appointment Scheduling',
      description: 'Books visits, reminders, and follow‑ups automatically.',
    },
    {
      icon: '🔬',
      title: 'Lab Explanation',
      description: 'Explains results in simple, patient‑friendly language.',
    },
    {
      icon: '🥗',
      title: 'Diet & Wellness Plans',
      description: 'Generates personalized lifestyle guidance.',
    },
    {
      icon: '🤝',
      title: 'Care Coordination',
      description: 'Manages summaries, insurance info, and communication.',
    },
  ],
};

// --- Page components wired into the router ---

export const GTMSalesAgentPage: React.FC = () => (
  <AgentPageTemplate config={gtmSalesConfig} />
);

export const HRRecruitmentAgentPage: React.FC = () => (
  <AgentPageTemplate config={hrRecruitmentConfig} />
);

export const CFOFinanceAgentPage: React.FC = () => (
  <AgentPageTemplate config={cfoFinanceConfig} />
);

export const CustomerSupportAgentPage: React.FC = () => (
  <AgentPageTemplate config={customerSupportConfig} />
);

export const RealEstateAgentPage: React.FC = () => (
  <AgentPageTemplate config={realEstateConfig} />
);

export const HealthcareAgentPage: React.FC = () => (
  <AgentPageTemplate config={healthcareConfig} />
);


