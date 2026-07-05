// Source: U.S. Social Security Administration, National Baby Names Data
// (ssa.gov/oact/babynames) — 2025 file, released May 8, 2026 (most recent
// SSA release as of this writing). Trend deltas are calculated by comparing
// each name's 2025 rank to its 2024 rank within the same gender's top 100.
// Positive delta = name rose in popularity. "NEW" = name was outside the
// 2024 top 100 for that gender entirely.
//
// This combines the SSA's top 50 boy names + top 50 girl names for 2025
// into one 100-name list. Full top 1000 lists per gender live at ssa.gov
// if you want to extend this later.

export const lastUpdated = "2026-05-08";
export const dataYear = 2025;
export const totalBirthsTop100Boys = 649546;
export const totalBirthsTop100Girls = 506210;

export const boysNames = [
  { rank: 1, name: "Liam", meaning: "Strong-willed warrior", origin: "Irish (short form of William)", births: 20818, prevRank: 1, delta: 0 },
  { rank: 2, name: "Noah", meaning: "Rest, comfort", origin: "Hebrew", births: 20358, prevRank: 2, delta: 0 },
  { rank: 3, name: "Oliver", meaning: "Olive tree, symbol of peace", origin: "Latin / French", births: 14939, prevRank: 3, delta: 0 },
  { rank: 4, name: "Theodore", meaning: "Gift of God", origin: "Greek", births: 13355, prevRank: 4, delta: 0 },
  { rank: 5, name: "Henry", meaning: "Ruler of the estate", origin: "German", births: 12020, prevRank: 6, delta: 1 },
  { rank: 6, name: "James", meaning: "Supplanter", origin: "Hebrew (English form of Jacob)", births: 11945, prevRank: 5, delta: -1 },
  { rank: 7, name: "Elijah", meaning: "The Lord is my God", origin: "Hebrew", births: 11111, prevRank: 8, delta: 1 },
  { rank: 8, name: "Mateo", meaning: "Gift of God", origin: "Spanish / Italian (form of Matthew)", births: 11045, prevRank: 7, delta: -1 },
  { rank: 9, name: "William", meaning: "Resolute protector", origin: "German", births: 10545, prevRank: 10, delta: 1 },
  { rank: 10, name: "Lucas", meaning: "Bringer of light", origin: "Latin", births: 10219, prevRank: 9, delta: -1 },
  { rank: 11, name: "Benjamin", meaning: "Son of the right hand", origin: "Hebrew", births: 9762, prevRank: 11, delta: 0 },
  { rank: 12, name: "Levi", meaning: "Joined, attached", origin: "Hebrew", births: 9642, prevRank: 12, delta: 0 },
  { rank: 13, name: "Elias", meaning: "The Lord is my God", origin: "Greek (form of Elijah)", births: 8837, prevRank: 25, delta: 12 },
  { rank: 14, name: "Luca", meaning: "Bringer of light", origin: "Italian", births: 8759, prevRank: 23, delta: 9 },
  { rank: 15, name: "Jack", meaning: "God is gracious", origin: "English (form of John)", births: 8748, prevRank: 15, delta: 0 },
  { rank: 16, name: "Sebastian", meaning: "Venerable, revered", origin: "Greek", births: 8605, prevRank: 14, delta: -2 },
  { rank: 17, name: "Hudson", meaning: "Son of Hudde; river son", origin: "English", births: 8583, prevRank: 22, delta: 5 },
  { rank: 18, name: "Samuel", meaning: "God has heard", origin: "Hebrew", births: 8334, prevRank: 17, delta: -1 },
  { rank: 19, name: "Leo", meaning: "Lion", origin: "Latin", births: 8173, prevRank: 24, delta: 5 },
  { rank: 20, name: "Ezra", meaning: "Help", origin: "Hebrew", births: 8126, prevRank: 13, delta: -7 },
  { rank: 21, name: "Michael", meaning: "Who is like God", origin: "Hebrew", births: 8094, prevRank: 18, delta: -3 },
  { rank: 22, name: "Daniel", meaning: "God is my judge", origin: "Hebrew", births: 8085, prevRank: 16, delta: -6 },
  { rank: 23, name: "John", meaning: "God is gracious", origin: "Hebrew", births: 8027, prevRank: 21, delta: -2 },
  { rank: 24, name: "Ethan", meaning: "Strong, firm", origin: "Hebrew", births: 7852, prevRank: 19, delta: -5 },
  { rank: 25, name: "Julian", meaning: "Youthful", origin: "Latin", births: 7603, prevRank: 30, delta: 5 },
  { rank: 26, name: "Santiago", meaning: "Saint James", origin: "Spanish", births: 7554, prevRank: 29, delta: 3 },
  { rank: 27, name: "Cooper", meaning: "Barrel maker", origin: "English (occupational)", births: 7472, prevRank: 50, delta: 23 },
  { rank: 28, name: "Asher", meaning: "Happy, blessed", origin: "Hebrew", births: 7456, prevRank: 20, delta: -8 },
  { rank: 29, name: "Joseph", meaning: "God will increase", origin: "Hebrew", births: 7303, prevRank: 32, delta: 3 },
  { rank: 30, name: "Alexander", meaning: "Defender of the people", origin: "Greek", births: 7230, prevRank: 27, delta: -3 },
  { rank: 31, name: "Owen", meaning: "Young warrior; well-born", origin: "Welsh", births: 7190, prevRank: 26, delta: -5 },
  { rank: 32, name: "Matthew", meaning: "Gift of God", origin: "Hebrew", births: 7003, prevRank: 33, delta: 1 },
  { rank: 33, name: "Luke", meaning: "Light-giving", origin: "Greek / Latin", births: 6948, prevRank: 34, delta: 1 },
  { rank: 34, name: "Thomas", meaning: "Twin", origin: "Aramaic", births: 6917, prevRank: 39, delta: 5 },
  { rank: 35, name: "David", meaning: "Beloved", origin: "Hebrew", births: 6794, prevRank: 31, delta: -4 },
  { rank: 36, name: "Jackson", meaning: "Son of Jack", origin: "English", births: 6582, prevRank: 35, delta: -1 },
  { rank: 37, name: "Gabriel", meaning: "God is my strength", origin: "Hebrew", births: 6569, prevRank: 43, delta: 6 },
  { rank: 38, name: "Wyatt", meaning: "Brave in war", origin: "English", births: 6480, prevRank: 38, delta: 0 },
  { rank: 39, name: "Mason", meaning: "Stoneworker", origin: "English (occupational)", births: 6291, prevRank: 42, delta: 3 },
  { rank: 40, name: "Bennett", meaning: "Blessed", origin: "English (from Benedict)", births: 6268, prevRank: 60, delta: 20 },
  { rank: 41, name: "Dylan", meaning: "Son of the sea", origin: "Welsh", births: 6208, prevRank: 28, delta: -13 },
  { rank: 42, name: "Roman", meaning: "Citizen of Rome", origin: "Latin", births: 6162, prevRank: 52, delta: 10 },
  { rank: 43, name: "Jacob", meaning: "Supplanter", origin: "Hebrew", births: 6152, prevRank: 40, delta: -3 },
  { rank: 44, name: "Miles", meaning: "Soldier, merciful", origin: "Latin / German", births: 6072, prevRank: 37, delta: -7 },
  { rank: 45, name: "Carter", meaning: "Cart driver", origin: "English (occupational)", births: 6024, prevRank: 46, delta: 1 },
  { rank: 46, name: "Anthony", meaning: "Priceless, praiseworthy", origin: "Latin", births: 5967, prevRank: 44, delta: -2 },
  { rank: 47, name: "Isaac", meaning: "He will laugh", origin: "Hebrew", births: 5953, prevRank: 41, delta: -6 },
  { rank: 48, name: "Charles", meaning: "Free man", origin: "German", births: 5898, prevRank: 51, delta: 3 },
  { rank: 49, name: "Maverick", meaning: "Independent, unbranded", origin: "American English", births: 5894, prevRank: 36, delta: -13 },
  { rank: 50, name: "Thiago", meaning: "Supplanter", origin: "Portuguese (form of James)", births: 5835, prevRank: 55, delta: 5 },
];

export const girlsNames = [
  { rank: 1, name: "Olivia", meaning: "Olive tree", origin: "Latin", births: 13544, prevRank: 1, delta: 0 },
  { rank: 2, name: "Charlotte", meaning: "Free woman", origin: "French (feminine of Charles)", births: 13400, prevRank: 4, delta: 2 },
  { rank: 3, name: "Emma", meaning: "Whole, universal", origin: "German", births: 12754, prevRank: 2, delta: -1 },
  { rank: 4, name: "Amelia", meaning: "Work, industriousness", origin: "German / Latin", births: 12699, prevRank: 3, delta: -1 },
  { rank: 5, name: "Sophia", meaning: "Wisdom", origin: "Greek", births: 12561, prevRank: 6, delta: 1 },
  { rank: 6, name: "Mia", meaning: "Mine; beloved", origin: "Scandinavian / Italian", births: 11078, prevRank: 5, delta: -1 },
  { rank: 7, name: "Isabella", meaning: "Devoted to God", origin: "Italian / Spanish (form of Elizabeth)", births: 10666, prevRank: 7, delta: 0 },
  { rank: 8, name: "Evelyn", meaning: "Wished-for child", origin: "English", births: 9123, prevRank: 8, delta: 0 },
  { rank: 9, name: "Sofia", meaning: "Wisdom", origin: "Greek / Italian", births: 8252, prevRank: 10, delta: 1 },
  { rank: 10, name: "Eliana", meaning: "God has answered", origin: "Hebrew", births: 8191, prevRank: 18, delta: 8 },
  { rank: 11, name: "Ava", meaning: "Life; bird", origin: "Latin", births: 7732, prevRank: 9, delta: -2 },
  { rank: 12, name: "Eleanor", meaning: "Bright, shining one", origin: "Greek / French", births: 7649, prevRank: 14, delta: 2 },
  { rank: 13, name: "Violet", meaning: "Purple flower", origin: "English / Latin", births: 7546, prevRank: 15, delta: 2 },
  { rank: 14, name: "Ailany", meaning: "Meaning not firmly established; a contemporary coinage", origin: "Modern", births: 7136, prevRank: null, delta: "NEW" },
  { rank: 15, name: "Aurora", meaning: "Dawn", origin: "Latin", births: 7065, prevRank: 16, delta: 1 },
  { rank: 16, name: "Harper", meaning: "Harp player", origin: "English (occupational)", births: 6792, prevRank: 12, delta: -4 },
  { rank: 17, name: "Elizabeth", meaning: "God is my oath", origin: "Hebrew", births: 6760, prevRank: 17, delta: 0 },
  { rank: 18, name: "Lily", meaning: "Lily flower, purity", origin: "English", births: 6673, prevRank: 24, delta: 6 },
  { rank: 19, name: "Camila", meaning: "Attendant at a ceremony", origin: "Latin / Italian", births: 6591, prevRank: 11, delta: -8 },
  { rank: 20, name: "Nora", meaning: "Honor; light", origin: "Irish / Latin", births: 6380, prevRank: 22, delta: 2 },
  { rank: 21, name: "Hazel", meaning: "The hazel tree", origin: "English", births: 6318, prevRank: 19, delta: -2 },
  { rank: 22, name: "Penelope", meaning: "Weaver", origin: "Greek", births: 6225, prevRank: 28, delta: 6 },
  { rank: 23, name: "Chloe", meaning: "Blooming, verdant", origin: "Greek", births: 6203, prevRank: 20, delta: -3 },
  { rank: 24, name: "Ellie", meaning: "Light; shining one", origin: "English (short form of Eleanor)", births: 6176, prevRank: 21, delta: -3 },
  { rank: 25, name: "Lucy", meaning: "Light", origin: "Latin", births: 6176, prevRank: 34, delta: 9 },
  { rank: 26, name: "Aria", meaning: "Air; melody", origin: "Italian", births: 6130, prevRank: 26, delta: 0 },
  { rank: 27, name: "Luna", meaning: "Moon", origin: "Latin", births: 6076, prevRank: 13, delta: -14 },
  { rank: 28, name: "Isla", meaning: "Island", origin: "Scottish", births: 6012, prevRank: 35, delta: 7 },
  { rank: 29, name: "Ella", meaning: "Beautiful fairy woman", origin: "German / English", births: 5831, prevRank: 30, delta: 1 },
  { rank: 30, name: "Lainey", meaning: "Bright, shining light", origin: "Modern variant of Elaine", births: 5738, prevRank: 38, delta: 8 },
  { rank: 31, name: "Zoe", meaning: "Life", origin: "Greek", births: 5646, prevRank: 29, delta: -2 },
  { rank: 32, name: "Scarlett", meaning: "Red", origin: "English", births: 5644, prevRank: 27, delta: -5 },
  { rank: 33, name: "Gianna", meaning: "God is gracious", origin: "Italian (form of Joanna)", births: 5634, prevRank: 23, delta: -10 },
  { rank: 34, name: "Emily", meaning: "Rival, industrious", origin: "Latin", births: 5451, prevRank: 25, delta: -9 },
  { rank: 35, name: "Valentina", meaning: "Strong, healthy", origin: "Latin", births: 5354, prevRank: 47, delta: 12 },
  { rank: 36, name: "Layla", meaning: "Night", origin: "Arabic", births: 5338, prevRank: 37, delta: 1 },
  { rank: 37, name: "Avery", meaning: "Ruler of the elves", origin: "English", births: 5267, prevRank: 31, delta: -6 },
  { rank: 38, name: "Grace", meaning: "Grace, God's favor", origin: "Latin", births: 5127, prevRank: 40, delta: 2 },
  { rank: 39, name: "Ivy", meaning: "Ivy plant, faithfulness", origin: "English", births: 5117, prevRank: 36, delta: -3 },
  { rank: 40, name: "Madison", meaning: "Son of Matthew / Maud", origin: "English", births: 4945, prevRank: 45, delta: 5 },
  { rank: 41, name: "Abigail", meaning: "Father's joy", origin: "Hebrew", births: 4941, prevRank: 32, delta: -9 },
  { rank: 42, name: "Elena", meaning: "Bright, shining light", origin: "Greek / Spanish (form of Helen)", births: 4836, prevRank: 46, delta: 4 },
  { rank: 43, name: "Mila", meaning: "Gracious, dear", origin: "Slavic", births: 4796, prevRank: 33, delta: -10 },
  { rank: 44, name: "Willow", meaning: "Willow tree, grace", origin: "English", births: 4763, prevRank: 41, delta: -3 },
  { rank: 45, name: "Emilia", meaning: "Rival, industrious", origin: "Latin / Italian", births: 4677, prevRank: 43, delta: -2 },
  { rank: 46, name: "Nova", meaning: "New", origin: "Latin", births: 4657, prevRank: 39, delta: -7 },
  { rank: 47, name: "Naomi", meaning: "Pleasantness", origin: "Hebrew", births: 4644, prevRank: 44, delta: -3 },
  { rank: 48, name: "Riley", meaning: "Courageous; rye clearing", origin: "Irish", births: 4441, prevRank: 42, delta: -6 },
  { rank: 49, name: "Eloise", meaning: "Healthy; wide", origin: "French (form of Louise)", births: 4251, prevRank: 64, delta: 15 },
  { rank: 50, name: "Sadie", meaning: "Princess", origin: "English (form of Sarah)", births: 4168, prevRank: 57, delta: 7 },
];

// Pre-computed "biggest movers" for the trends section — real deltas, not invented.
export const biggestRisersBoys = [
  { name: "Cooper", delta: 23 },
  { name: "Bennett", delta: 20 },
  { name: "Elias", delta: 12 },
  { name: "Roman", delta: 10 },
  { name: "Luca", delta: 9 },
];
export const biggestFallersBoys = [
  { name: "Dylan", delta: -13 },
  { name: "Maverick", delta: -13 },
  { name: "Asher", delta: -8 },
  { name: "Ezra", delta: -7 },
  { name: "Miles", delta: -7 },
];
export const biggestRisersGirls = [
  { name: "Ailany", delta: "NEW" },
  { name: "Eloise", delta: 15 },
  { name: "Valentina", delta: 12 },
  { name: "Lucy", delta: 9 },
  { name: "Sadie", delta: 7 },
];
export const biggestFallersGirls = [
  { name: "Luna", delta: -14 },
  { name: "Gianna", delta: -10 },
  { name: "Mila", delta: -10 },
  { name: "Emily", delta: -9 },
  { name: "Abigail", delta: -9 },
];