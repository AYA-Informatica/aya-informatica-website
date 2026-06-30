/**
 * Content layer abstraction.
 *
 * Currently reads from local constants. When ready to integrate a CMS
 * (Sanity, Contentful, etc.), replace these functions with API calls.
 * All pages import content through this module, making migration simple.
 *
 * To integrate Sanity:
 *   1. npm install @sanity/client next-sanity
 *   2. Create sanity.config.ts with project credentials
 *   3. Replace the functions below with GROQ queries
 */

import { PRODUCTS, SERVICES, ROADMAP, STATS, APPROACH, TESTIMONIALS } from "./constants"

export function getProducts() {
  return PRODUCTS
}

export function getServices() {
  return SERVICES
}

export function getRoadmap() {
  return ROADMAP
}

export function getStats() {
  return STATS
}

export function getApproach() {
  return APPROACH
}

export function getTestimonials() {
  return TESTIMONIALS
}
