import React from 'react';
import './AgentPages.css';

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
          <p>Drop these blocks into your flows as soon as content is ready.</p>
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
    </div>
  );
};

// --- Individual agent configs (placeholder copy; structure is final) ---

const gtmSalesConfig: AgentConfig = {
  id: 'gtm-sales',
  title: 'Autonomous GTM & Sales Agent — Your Always-On Growth Partner',
  eyebrow: 'GTM & Sales Agent',
  overview:
    'A fully autonomous growth partner that discovers opportunities, initiates outreach, manages campaigns, and elevates every conversation. Precision, speed, and intelligence — engineered for revenue teams that want consistent results at scale.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '🎯',
      title: 'Lead Generation',
      description: 'Identifies high-intent prospects using intelligent filtering and real-time signals.',
    },
    {
      icon: '🧭',
      title: 'Lead Enrichment',
      description: 'Automatically enriches profiles with company, contact, and industry insights before outreach.',
    },
    {
      icon: '🎙️',
      title: 'Multilingual Voice Calling + Voice Cloning',
      description: 'Conducts outbound sales calls in lifelike voices — including a cloned version of your brand’s tone.',
    },
    {
      icon: '⚡',
      title: 'Campaign Automation',
      description: 'Runs targeted, multi-channel sequences that adapt in real time to prospect behavior.',
    },
    {
      icon: '⏱',
      title: 'Automated Follow-Ups',
      description: 'Maintains perfect follow-up cadence so no opportunity slips through the cracks.',
    },
    {
      icon: '📝',
      title: 'AI Meeting Assistant',
      description: 'Joins sales calls quietly, capturing key moments, summaries, and action items automatically.',
    },
    {
      icon: '📊',
      title: 'Sales Analytics',
      description: 'Delivers clear dashboards on conversions, outreach performance, and pipeline movement.',
    },
  ],
};

const hrRecruitmentConfig: AgentConfig = {
  id: 'hr-recruitment',
  title: 'HR & Recruitment Agent',
  eyebrow: 'Talent, orchestrated',
  overview:
    'From sourcing to onboarding, this agent keeps every candidate and employee journey quietly coordinated.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '✉︎',
      title: 'Smart Sourcing',
      description:
        'Search, screen, and shortlist candidates while keeping hiring teams aligned in one view.',
    },
    {
      icon: '☑︎',
      title: 'Interview Coordination',
      description:
        'Route availability, send reminders, and surface context so every conversation feels prepared.',
    },
    {
      icon: '∞',
      title: 'Lifecycle Workflows',
      description:
        'Automate repetitive HR flows — from offers and onboarding to reviews and offboarding.',
    },
  ],
};

const cfoFinanceConfig: AgentConfig = {
  id: 'cfo-finance',
  title: 'CFO & Finance Agent',
  eyebrow: 'Finance with foresight',
  overview:
    'A calm layer over budgets, forecasts, and cash — always ready with the next best move for your team.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '₼',
      title: 'Live Forecasting',
      description:
        'Roll up scenarios from every team and see the impact on runway, margin, and cash in seconds.',
    },
    {
      icon: '⌁',
      title: 'Close Automation',
      description:
        'Pull data from your stack, reconcile, and prep close packs without spreadsheets flying around.',
    },
    {
      icon: '◆',
      title: 'Spend Intelligence',
      description:
        'Spot waste, unusual patterns, and contract renewals before they become last‑minute fire drills.',
    },
  ],
};

const customerSupportConfig: AgentConfig = {
  id: 'customer-support',
  title: 'Customer Support Agent',
  eyebrow: 'Always-on, never noisy',
  overview:
    'Frontline support that feels human, learns from every ticket, and feeds product back with clarity.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '✺',
      title: 'Multichannel Inbox',
      description:
        'Unify email, chat, and voice into a single triaged queue with AI-suggested responses.',
    },
    {
      icon: '☾',
      title: 'Self-Serve Experiences',
      description:
        'Turn your knowledge base into guided flows that resolve questions before they become tickets.',
    },
    {
      icon: '❖',
      title: 'Insight Loops',
      description:
        'Cluster issues, tag patterns, and send crisp summaries straight to product and ops.',
    },
  ],
};

const realEstateConfig: AgentConfig = {
  id: 'real-estate',
  title: 'Real Estate & Property Agent',
  eyebrow: 'Portfolio in one glance',
  overview:
    'From leads to leases and maintenance, this agent keeps your portfolio humming in the background.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '▣',
      title: 'Lead-to-Lease Flows',
      description:
        'Capture, qualify, and convert inquiries into signed agreements without manual chasing.',
    },
    {
      icon: '☼',
      title: 'Maintenance Routing',
      description:
        'Triage tickets, notify vendors, and keep residents updated with a single, clear thread.',
    },
    {
      icon: '◎',
      title: 'Occupancy Insights',
      description:
        'Watch occupancy, renewals, and risk units in a simple, cinematic dashboard view.',
    },
  ],
};

const healthcareConfig: AgentConfig = {
  id: 'healthcare',
  title: 'Healthcare Agent',
  eyebrow: 'Care, coordinated',
  overview:
    'A focused layer for intake, scheduling, and follow-ups — designed for clinics and care teams.',
  videoSrc: '/videos/Untitled design-4.mp4',
  features: [
    {
      icon: '✚',
      title: 'Patient Intake',
      description:
        'Guide patients through forms, eligibility, and consent without adding work to the front desk.',
    },
    {
      icon: '⏱',
      title: 'Scheduling & Reminders',
      description:
        'Fill calendars, reduce no‑shows, and sync changes instantly with your practice systems.',
    },
    {
      icon: '✉︎',
      title: 'Follow‑Up Loops',
      description:
        'Automate check‑ins, instructions, and surveys while keeping clinicians in full control.',
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


