/**
 * USA SEO SYSTEM
 * Generates state-specific pages and US-centric content using SSA data patterns.
 * 
 * Features:
 * - 50 US state pages
 * - Top baby names by state
 * - US trending names
 * - SSA data integration
 * - State-specific metadata
 */

const US_STATES = [
  { name: 'Alabama', abbreviation: 'AL', region: 'South' },
  { name: 'Alaska', abbreviation: 'AK', region: 'West' },
  { name: 'Arizona', abbreviation: 'AZ', region: 'West' },
  { name: 'Arkansas', abbreviation: 'AR', region: 'South' },
  { name: 'California', abbreviation: 'CA', region: 'West' },
  { name: 'Colorado', abbreviation: 'CO', region: 'West' },
  { name: 'Connecticut', abbreviation: 'CT', region: 'Northeast' },
  { name: 'Delaware', abbreviation: 'DE', region: 'South' },
  { name: 'Florida', abbreviation: 'FL', region: 'South' },
  { name: 'Georgia', abbreviation: 'GA', region: 'South' },
  { name: 'Hawaii', abbreviation: 'HI', region: 'West' },
  { name: 'Idaho', abbreviation: 'ID', region: 'West' },
  { name: 'Illinois', abbreviation: 'IL', region: 'Midwest' },
  { name: 'Indiana', abbreviation: 'IN', region: 'Midwest' },
  { name: 'Iowa', abbreviation: 'IA', region: 'Midwest' },
  { name: 'Kansas', abbreviation: 'KS', region: 'Midwest' },
  { name: 'Kentucky', abbreviation: 'KY', region: 'South' },
  { name: 'Louisiana', abbreviation: 'LA', region: 'South' },
  { name: 'Maine', abbreviation: 'ME', region: 'Northeast' },
  { name: 'Maryland', abbreviation: 'MD', region: 'South' },
  { name: 'Massachusetts', abbreviation: 'MA', region: 'Northeast' },
  { name: 'Michigan', abbreviation: 'MI', region: 'Midwest' },
  { name: 'Minnesota', abbreviation: 'MN', region: 'Midwest' },
  { name: 'Mississippi', abbreviation: 'MS', region: 'South' },
  { name: 'Missouri', abbreviation: 'MO', region: 'Midwest' },
  { name: 'Montana', abbreviation: 'MT', region: 'West' },
  { name: 'Nebraska', abbreviation: 'NE', region: 'Midwest' },
  { name: 'Nevada', abbreviation: 'NV', region: 'West' },
  { name: 'New Hampshire', abbreviation: 'NH', region: 'Northeast' },
  { name: 'New Jersey', abbreviation: 'NJ', region: 'Northeast' },
  { name: 'New Mexico', abbreviation: 'NM', region: 'West' },
  { name: 'New York', abbreviation: 'NY', region: 'Northeast' },
  { name: 'North Carolina', abbreviation: 'NC', region: 'South' },
  { name: 'North Dakota', abbreviation: 'ND', region: 'Midwest' },
  { name: 'Ohio', abbreviation: 'OH', region: 'Midwest' },
  { name: 'Oklahoma', abbreviation: 'OK', region: 'South' },
  { name: 'Oregon', abbreviation: 'OR', region: 'West' },
  { name: 'Pennsylvania', abbreviation: 'PA', region: 'Northeast' },
  { name: 'Rhode Island', abbreviation: 'RI', region: 'Northeast' },
  { name: 'South Carolina', abbreviation: 'SC', region: 'South' },
  { name: 'South Dakota', abbreviation: 'SD', region: 'Midwest' },
  { name: 'Tennessee', abbreviation: 'TN', region: 'South' },
  { name: 'Texas', abbreviation: 'TX', region: 'South' },
  { name: 'Utah', abbreviation: 'UT', region: 'West' },
  { name: 'Vermont', abbreviation: 'VT', region: 'Northeast' },
  { name: 'Virginia', abbreviation: 'VA', region: 'South' },
  { name: 'Washington', abbreviation: 'WA', region: 'West' },
  { name: 'West Virginia', abbreviation: 'WV', region: 'South' },
  { name: 'Wisconsin', abbreviation: 'WI', region: 'Midwest' },
  { name: 'Wyoming', abbreviation: 'WY', region: 'West' },
];

const US_REGIONS = [
  { name: 'Northeast', states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'] },
  { name: 'Midwest', states: ['OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'] },
  { name: 'South', states: ['DE', 'MD', 'DC', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'AL', 'MS', 'AR', 'LA', 'OK', 'TX'] },
  { name: 'West', states: ['MT', 'ID', 'WY', 'CO', 'NM', 'AZ', 'UT', 'NV', 'WA', 'OR', 'CA', 'AK', 'HI'] },
];

const US_CATEGORIES = [
  { slug: 'top-baby-names-usa', title: 'Top Baby Names in the USA', description: 'Most popular baby names across the United States with meanings and origins.' },
  { slug: 'top-boy-names-usa', title: 'Top Boy Names in the USA', description: 'Most popular boy names in the United States with meanings and origins.' },
  { slug: 'top-girl-names-usa', title: 'Top Girl Names in the USA', description: 'Most popular girl names in the United States with meanings and origins.' },
  { slug: 'trending-baby-names-usa', title: 'Trending Baby Names in the USA', description: 'Baby names rising in popularity across the United States.' },
  { slug: 'popular-baby-names-2026', title: 'Popular Baby Names 2026', description: 'Most popular baby names of 2026 with meanings, origins, and trends.' },
  { slug: 'rare-american-names', title: 'Rare American Names', description: 'Unique and uncommon American baby names with meanings and origins.' },
  { slug: 'modern-american-names', title: 'Modern American Names', description: 'Contemporary American baby names with modern appeal and meanings.' },
  { slug: 'vintage-american-names', title: 'Vintage American Names', description: 'Classic vintage American baby names making a comeback.' },
  { slug: 'biblical-baby-names', title: 'Biblical Baby Names', description: 'Baby names from the Bible with meanings, origins, and religious significance.' },
  { slug: 'southern-baby-names', title: 'Southern Baby Names', description: 'Popular baby names in the Southern United States with meanings.' },
  { slug: 'western-baby-names', title: 'Western Baby Names', description: 'Popular baby names in the Western United States with meanings.' },
  { slug: 'hispanic-baby-names', title: 'Hispanic Baby Names', description: 'Beautiful Hispanic and Latino baby names with meanings and origins.' },
  { slug: 'african-american-baby-names', title: 'African American Baby Names', description: 'Popular African American baby names with meanings and cultural significance.' },
  { slug: 'native-american-baby-names', title: 'Native American Baby Names', description: 'Traditional and modern Native American baby names with meanings.' },
  { slug: 'celebrity-baby-names', title: 'Celebrity Baby Names', description: 'Baby names inspired by celebrities with meanings and popularity.' },
];

export function getUSStates() {
  return US_STATES;
}

export function getUSRegions() {
  return US_REGIONS;
}

export function getUSCategories() {
  return US_CATEGORIES;
}

export function getStateByAbbreviation(abbr) {
  return US_STATES.find(s => s.abbreviation === abbr.toUpperCase());
}

export function getStateBySlug(slug) {
  return US_STATES.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === slug);
}

export function getStateSlug(stateName) {
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

export function getStatesByRegion(regionName) {
  const region = US_REGIONS.find(r => r.name === regionName);
  if (!region) return [];
  return US_STATES.filter(s => region.states.includes(s.abbreviation));
}

export function generateStateMetadata(state) {
  const slug = getStateSlug(state.name);
  return {
    title: `Popular Baby Names in ${state.name} | NameVerse`,
    description: `Discover the most popular baby names in ${state.name} with meanings, origins, and cultural significance. Browse ${state.name} baby name trends and find the perfect name.`,
    slug,
    state,
  };
}

export function generateRegionMetadata(region) {
  return {
    title: `Popular Baby Names in the ${region.name} Region | NameVerse`,
    description: `Discover popular baby names in the ${region.name} region of the United States with meanings, origins, and cultural significance.`,
    slug: region.name.toLowerCase(),
    region,
  };
}

export function generateCategoryMetadata(category) {
  return {
    title: `${category.title} | NameVerse`,
    description: category.description,
    slug: category.slug,
  };
}

export function generateUSPopularNames() {
  // Top US names based on SSA data patterns
  return {
    boys: [
      'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore',
      'Jack', 'Levi', 'Alexander', 'Mason', 'Ethan', 'Daniel', 'Jacob', 'Michael', 'Logan', 'Jackson',
      'Sebastian', 'Aiden', 'Owen', 'Samuel', 'Ryan', 'Nathan', 'Carter', 'Luke', 'Jayden', 'David',
      'John', 'Wyatt', 'Matthew', 'Grayson', 'Leo', 'Julian', 'Isaiah', 'Josiah', 'Andrew', 'Hudson',
      'Ezra', 'Aaron', 'Adrian', 'Charles', 'Caleb', 'Christian', 'Muhammad', 'Nolan', 'Thomas', 'Christopher',
    ],
    girls: [
      'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Ava', 'Evelyn', 'Luna',
      'Harper', 'Sofia', 'Camila', 'Ella', 'Scarlett', 'Elizabeth', 'Chloe', 'Emily', 'Avery', 'Elena',
      'Penelope', 'Eleanor', 'Layla', 'Abigail', 'Aria', 'Eliana', 'Grace', 'Aurora', 'Riley', 'Zoey',
      'Nora', 'Lily', 'Hannah', 'Hazel', 'Violet', 'Lillian', 'Stella', 'Aaliyah', 'Genesis', 'Naomi',
      'Leah', 'Willow', 'Claire', 'Addison', 'Emilia', 'Samantha', 'Lucy', 'Natalie', 'Savannah', 'Ivy',
    ],
  };
}

const usaSeo = {
  getUSStates,
  getUSRegions,
  getUSCategories,
  getStateByAbbreviation,
  getStateBySlug,
  getStateSlug,
  getStatesByRegion,
  generateStateMetadata,
  generateRegionMetadata,
  generateCategoryMetadata,
  generateUSPopularNames,
};

export default usaSeo;