// Careers index content — verbatim from 22-careers.md +
// 24-careers-working-at-miller.md. Narrative spine: PageHero → Why
// Miller (4 core values) → Open Positions (2 cards) → Benefits teaser
// → DEI block (verbatim) → close.

import { EMAIL_HR } from "./brand";

export const CAREERS = {
  eyebrow: "Careers",
  title: "Committed to Leadership in Our Industry",
  lead:
    "If you are looking for a career that will challenge you to grow and give your all, then contact us today and start your career at Miller.",
  photo: "/miller/careers/working-at-miller-1.webp",

  whyTitle: "Core values that define us",
  whyLead:
    "At Miller, we don't just talk about sustainability — we live it. We're looking for like-minded individuals who are passionate about making a difference, solving complex environmental challenges, and being part of a team that values respect, accountability, teamwork, and a healthy work culture.",
  whyCards: [
    {
      title: "Respect",
      body:
        "Every team member, every client, every community we operate in — treated with respect first.",
    },
    {
      title: "Empowerment & Accountability",
      body:
        "Owners of their work — empowered to make calls in the field and accountable for outcomes.",
    },
    {
      title: "Teamwork",
      body:
        "Operations, treatment, and remediation depend on tight coordination across crews and disciplines.",
    },
    {
      title: "Healthy Work Environment",
      body:
        "Physical safety, mental wellbeing, and a culture that supports both.",
    },
  ],

  positionsTitle: "Open Positions",
  positionsLead: "We are actively hiring for the following roles.",
  positions: [
    {
      title: "Plant Manager",
      href: "/careers/plant-manager/",
      summary:
        "Operating leadership at the Vaughn Bullough Environmental Centre.",
    },
    {
      title: "Enterprise Automation Manager",
      href: "/careers/enterprise-automation-manager/",
      summary:
        "Lead Miller's enterprise systems, automation, and process digitisation roadmap.",
    },
  ],

  benefitsTitle: "Total rewards",
  benefitsBody:
    "Total rewards compensation program, growth potential, and Manitoba pride are just some of the reasons to join the Miller Team. Health, retirement, time off, and professional development — the full picture is on the Benefits & Rewards page.",
  benefitsCta: { label: "Benefits & Rewards", href: "/careers/benefits-rewards/" },

  // Verbatim DEI block from 24-careers-working-at-miller.md.
  deiTitle: "Diversity, Equity, and Inclusion at Miller",
  deiBody:
    "At Miller, we understand that a diverse and inclusive workforce benefits us all. Each individual employee provides Miller with a unique perspective on the world, and we are committed to learning the best practices for implementing and maintaining an equitable working environment for all.",
  deiInitiatives: [
    "Employee Advisory Committee (EAC)",
    "The Miller Diversity, Equity, and Inclusion program",
  ],

  closeTitle: "Send us your resume",
  closeBody:
    "If you're ready to join us in our mission and share our values, we invite you to explore the career opportunities we have to offer, and the rewards that come from being part of the Miller team. Together, we can work towards a more sustainable and environmentally responsible world.",
  emailHr: EMAIL_HR,
};
