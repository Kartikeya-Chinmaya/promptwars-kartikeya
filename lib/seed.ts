import { Need, Profile } from "./types";

export const seedProfiles: Profile[] = [
  {
    id: "profile-priya",
    name: "Priya Nair",
    skills: ["React", "UI Design", "Backend", "Figma"],
    interests: ["Frontend", "Design Systems", "Accessibility"],
    availability: "Weekends",
    bio: "Frontend dev who loves turning rough ideas into polished, usable interfaces fast. Comfortable wiring up a lightweight backend when a project needs it.",
    email: "priya.nair@example.com",
  },
  {
    id: "profile-dev",
    name: "Dev Patel",
    skills: ["Python", "Machine Learning", "Data Analysis", "TensorFlow"],
    interests: ["AI/ML", "Research", "Data Viz"],
    availability: "Weekday evenings",
    bio: "ML engineer who's happiest wiring up a model that actually ships instead of sitting in a notebook.",
    email: "dev.patel@example.com",
  },
  {
    id: "profile-sam",
    name: "Sam Okafor",
    skills: ["Node.js", "Backend", "PostgreSQL", "System Design"],
    interests: ["Backend", "DevOps", "APIs"],
    availability: "Weekends",
    bio: "Backend-focused builder — APIs, databases, and making sure things don't fall over under a demo crowd.",
    email: "sam.okafor@example.com",
  },
];

export const seedNeeds: Need[] = [
  {
    id: "need-study-buddy",
    title: "AI Study Buddy",
    description:
      "A hackathon app that turns lecture notes into AI-generated practice quizzes. Core flow is sketched out — need help finishing the interface and hooking up the model.",
    skills_required: ["React", "UI Design", "Backend", "Machine Learning"],
    availability_required: "Weekends",
  },
  {
    id: "need-campus-marketplace",
    title: "Campus Marketplace",
    description:
      "A buy/sell/trade app for students on campus, built around a simple listings feed with in-app messaging.",
    skills_required: ["React", "Node.js", "PostgreSQL"],
    availability_required: "Weekends",
  },
  {
    id: "need-fitness-ml",
    title: "Fitness Tracker ML",
    description:
      "A workout tracker that predicts personalized training plans from logged sessions using a small ML model.",
    skills_required: ["Python", "Machine Learning", "TensorFlow", "React"],
    availability_required: "Weekday evenings",
  },
];
