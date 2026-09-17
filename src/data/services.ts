import { PROJECT_REFERENCES, SERVICES } from "./data.js";

export type ServiceCategory = "IT" | "Design" | "IT/Design";

export type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  estimatedDays: number | null;
  estimatedPrice: number | null;
  demoImages: string[];
};

export type ProjectReference = {
  id: string;
  name: string;
  category: ServiceCategory;
  image: string;
  link?: string;
};

export const services = SERVICES as Service[];

export const projectReferences = PROJECT_REFERENCES as ProjectReference[];

export const categories = ["all", "IT", "Design", "IT/Design"] as const;

export type FilterCategory = (typeof categories)[number];
