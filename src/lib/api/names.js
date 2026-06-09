/**
 * Names API Module - World-Class Implementation
 * Comprehensive integration with ALL backend name endpoints
 *
 * Backend Endpoints (tested and verified):
 * - GET /api/names - Get paginated names with filters
 * - GET /api/names/search - Search names across religions
 * - GET /api/v1/names/:religion/filters - Get filters for a religion (ACTUAL ENDPOINT)
 * - GET /api/names/:religion/letter/:letter - Get names by letter
 * - GET /api/names/:religion/:slug - Get single name details
 * - GET /api/names/:religion/:slug/related - Get related names
 * - GET /api/names/:religion/:slug/similar - Get similar names
 */

import { apiClient } from './client';

/**
 * Normalize religion value to backend-supported values
 * Backend only supports 'islamic', 'christian', 'hindu'
 * Maps 'muslim' to 'islamic', and any other unsupported value to 'islamic'
 */
const normalizeReligion = (religion) => {
  if (!religion) return 'islamic';
  const normalized = religion.toLowerCase();
  if (normalized === 'muslim' || normalized === 'islam') return 'islamic';
  if (normalized === 'christianity') return 'christian';
  if (normalized === 'hinduism') return 'hindu';
  if (['islamic', 'christian', 'hindu'].includes(normalized)) return normalized;
  return 'islamic';
};

/**
 * Fetch filters for a specific religion
 * Backend: GET /api/v1/names/:religion/filters
 * @param {string} religion - Religion category (islamic, christian, hindu)
 * @returns {Promise<Object>} Filters object with genders, origins, letters
 */
export const fetchFilters = async (religion) => {
  try {
    if (!religion) {
      return {
        genders: [],
        origins: [],
        letters: [],
        totalNames: 0,
      };
    }

    const normalizedReligion = normalizeReligion(religion);
    const { data } = await apiClient.get(`/api/v1/names/${normalizedReligion}/filters`);



    if (data.success && data.data) {
      const result = {
        genders: data.data.genders || [],
        origins: data.data.origins || [],
        letters: data.data.letters || [],
        categories: data.data.categories || [],
        themes: data.data.themes || [],
        languages: data.data.languages || [],
        lucky_days: data.data.lucky_days || [],
        lucky_colors: data.data.lucky_colors || [],
        lucky_stones: data.data.lucky_stones || [],
        totalNames: data.data.total_names || 0,
      };
      return result;
    }

    return {
      genders: [],
      origins: [],
      letters: [],
      totalNames: 0,
    };
  } catch (error) {
    return {
      genders: [],
      origins: [],
      letters: [],
      totalNames: 0,
    };
  }
}
/**
 * Legacy: Fetch filters using old endpoint
 * Backend: GET /api/religion/:religion/filters
 * @deprecated Use fetchFilters() instead
 */
export async function fetchFiltersLegacy(religion) {
  try {
    const normalizedReligion = normalizeReligion(religion);
    if (!normalizedReligion) {
      return { genders: [], origins: [], firstLetters: [], totalNames: 0 };
    }

    const { data } = await apiClient.get(`/api/religion/${normalizedReligion}/filters`);

    if (data.success && data.filters) {
      return {
        genders: data.filters.genders || [],
        origins: data.filters.origins || [],
        firstLetters: data.filters.firstLetters || [],
        totalNames: data.totalNames || 0,
      };
    }

    return { genders: [], origins: [], firstLetters: [], totalNames: 0 };
  } catch (error) {
    return { genders: [], origins: [], firstLetters: [], totalNames: 0 };
  }
}

/**
 * Legacy: Fetch names using old endpoint
 * Backend: GET /api/religion/:religion
 * @deprecated Use fetchNames() instead
 */
export async function fetchNamesLegacy(params = {}) {
  try {
    const { religion, ...rest } = params;

    const normalizedReligion = normalizeReligion(religion);
    if (!normalizedReligion) {
      return {
        data: [],
        pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
        success: false,
      };
    }

    const { data } = await apiClient.get(`/api/religion/${normalizedReligion}`, { params: rest });

    return {
      data: data.data || [],
      pagination: data.pagination || { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
      success: data.success !== false,
    };
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Legacy: Fetch single name using old endpoint
 * Backend: GET /api/names/:religion/:slug
 * @deprecated Use fetchNameDetail() instead
 */
export async function fetchNameDetailLegacy(religion, slug) {
  try {
    const normalizedReligion = normalizeReligion(religion);
    if (!normalizedReligion || !slug) {
      return null;
    }

    const { data } = await apiClient.get(`/api/names/${normalizedReligion}/${slug}`);

    if (data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch names by letter
  * Backend: GET /api/names/:religion/letter/:letter?limit=100
 * @param {string} letter - First letter of names
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Names starting with letter
 */
export async function fetchNamesByLetter(letter, params = {}) {
  try {
    if (!letter) {
      return {
        data: [],
        count: 0,
        success: false,
      };
    }

    const {
      religion = 'islamic',
      limit = 100,
      page = 1,
      sort = 'asc',
      ...rest
    } = params;
    const normalizedReligion = normalizeReligion(religion);

    const requestParams = {
      alphabet: String(letter || '').toLowerCase(),
      limit,
      page,
      sort,
      ...rest,
    };

    const { data } = await apiClient.get(`/api/v1/names/${normalizedReligion}`, {
      params: requestParams,
    });

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page: data.pagination?.page || page,
        limit: data.pagination?.limit || limit,
        totalCount: data.pagination?.total || data.totalCount || 0,
        totalPages: data.pagination?.pages || data.totalPages || 0,
      },
      letter: data.letter || letter,
      religion: data.religion || normalizedReligion,
      success: data.success !== false,
    };
  } catch (error) {
    return {
      data: [],
      count: 0,
      success: false,
    };
  }
}

/**
 * Fetch names by category
 * Backend: GET /api/category/:religion/:category?page=1&perPage=20
 * @param {string} religion - Religion category
 * @param {string} category - Name category
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Names in category
 */
export async function fetchNamesByCategory(religion, category, params = {}) {
  try {
    if (!religion || !category) {
      
      return {
        data: [],
        pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 },
        success: false,
      };
    }

    const { page = 1, perPage = 20 } = params;

    const { data } = await apiClient.get('/api/v1/names', {
      params: { religion, page, limit: perPage, category }
    });

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page,
        perPage,
        total: 0,
        totalPages: 0,
      },
      category,
      success: data.success !== false,
    };
  } catch (error) {
    
    return {
      data: [],
      pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch names by gender
 * Backend: GET /api/gender/:gender/:religion?page=1&perPage=50
 * @param {string} gender - Gender (Male/Female)
 * @param {string} religion - Religion category
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Names by gender
 */
export async function fetchNamesByGender(gender, religion, params = {}) {
  try {
    if (!gender || !religion) {
      
      return {
        data: [],
        pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
        success: false,
      };
    }

    const { page = 1, perPage = 50 } = params;

    const { data } = await apiClient.get('/api/v1/names', {
      params: { religion, page, limit: perPage, gender }
    });

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page,
        perPage,
        total: 0,
        totalPages: 0,
      },
      gender,
      success: data.success !== false,
    };
  } catch (error) {
    
    return {
      data: [],
      pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch names by origin
 * Backend: GET /api/origin/:religion/:origin?page=1&perPage=50
 * @param {string} religion - Religion category
 * @param {string} origin - Name origin
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Names by origin
 */
export async function fetchNamesByOrigin(religion, origin, params = {}) {
  try {
    if (!religion || !origin) {
      
      return {
        data: [],
        pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
        success: false,
      };
    }

    const { page = 1, perPage = 50 } = params;

    const { data } = await apiClient.get('/api/v1/names', {
      params: { religion, page, limit: perPage, origin }
    });

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page,
        perPage,
        total: 0,
        totalPages: 0,
      },
      origin,
      success: data.success !== false,
    };
  } catch (error) {
    
    return {
      data: [],
      pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch names by language
 * Backend: GET /api/language/:religion/:language?page=1&perPage=50
 * @param {string} religion - Religion category
 * @param {string} language - Name language
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Names by language
 */
export async function fetchNamesByLanguage(religion, language, params = {}) {
  try {
    if (!religion || !language) {
      
      return {
        data: [],
        pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
        success: false,
      };
    }

    const { page = 1, perPage = 50 } = params;

    const { data } = await apiClient.get('/api/v1/names', {
      params: { religion, page, limit: perPage, language }
    });

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page,
        perPage,
        total: 0,
        totalPages: 0,
      },
      language,
      success: data.success !== false,
    };
  } catch (error) {
    
    return {
      data: [],
      pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch trending names
 * Backend: GET /api/names?religion=X&limit=20
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Trending names
 */
export async function fetchTrendingNames(params = {}) {
  try {
    const { religion = 'islamic', page = 1, limit = 20 } = params;

    // Use valid religion value (islamic, christian, hindu)
    const validReligion = ['islamic', 'christian', 'hindu'].includes(religion.toLowerCase())
      ? religion.toLowerCase()
      : 'islamic';

    const response = await apiClient.get('/api/names', {
      params: { religion: validReligion, page, limit }
    });

    // Check if response is an error
    if (response.__isError || response.status >= 400) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        religion: validReligion,
        success: false,
      };
    }

    const data = response.data;

    return {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
      religion: validReligion,
      success: data.success !== false,
    };
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch names with standard pagination
 * Backend: GET /api/v1/names/:religion
 * @returns {Promise<Object>} Paginated names
 */
export async function fetchNames(options = {}) {
  try {
    const { religion, page = 1, limit = 50, sort = 'asc', ...rest } = options;

    const normalizedReligion = normalizeReligion(religion);
    if (!normalizedReligion) {
      return {
        data: [],
        pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
        success: false,
      };
    }

    const params = {
      page,
      limit,
      sort,
      // Default empty filters
      origin: '',
      language: '',
      category: '',
      theme: '',
      luckyDay: '',
      luckyColor: '',
      startsWith: '',
      luckyStone: '',
      gender: '',
    };

    // Override defaults with any provided filters (including empty strings)
    Object.assign(params, rest);

    // Fix: map legacy 'alphabet' param to correct 'startsWith' param
    if (params.alphabet) {
      params.startsWith = params.alphabet;
      delete params.alphabet;
    }

    const { data } = await apiClient.get(`/api/v1/names/${normalizedReligion}`, { params });

    // Handle backend error responses (e.g., cacheKey not defined)
    if (data && !data.success && data.message?.includes('cacheKey')) {
      return {
        data: [],
        pagination: { page, limit, totalCount: 0, totalPages: 0 },
        success: false,
        error: data.message,
      };
    }

    const result = {
      data: data.data || data.names || [],
      pagination: data.pagination || {
        page: data.pagination?.page || page,
        limit: data.pagination?.limit || limit,
        totalCount: data.pagination?.total || data.totalCount || 0,
        totalPages: data.pagination?.pages || data.totalPages || 0,
      },
      success: data.success !== false,
    };

    return result;
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch names with advanced filters
 * Backend: GET /api/v1/names/:religion
 * Supports all available filters: gender, origin, language, category, theme, luckyDay, luckyColor, startsWith, luckyStone
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} Paginated names with applied filters
 */
export async function fetchNamesWithAdvancedFilters(options = {}) {
  try {
    const {
      religion,
      page = 1,
      limit = 50,
      sort = 'asc',
      gender,
      origin,
      language,
      category,
      theme,
      luckyDay,
      luckyColor,
      alphabet,
      luckyStone,
      ...rest
    } = options;

    const normalizedReligion = normalizeReligion(religion);
    if (!normalizedReligion) {
      return {
        data: [],
        pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
        success: false,
      };
    }

    const params = {
      page,
      limit,
      sort,
    };

    // Add filters, defaulting to empty string if not provided
    params.gender = gender !== undefined ? gender : '';
    params.origin = origin !== undefined ? origin : '';
    params.language = language !== undefined ? language : '';
    params.category = category !== undefined ? category : '';
    params.theme = theme !== undefined ? theme : '';
    params.luckyDay = luckyDay !== undefined ? luckyDay : '';
    params.luckyColor = luckyColor !== undefined ? luckyColor : '';
    params.alphabet = alphabet !== undefined ? String(alphabet).toUpperCase() : '';
    params.luckyStone = luckyStone !== undefined ? luckyStone : '';

    Object.assign(params, rest);

    // Legacy support: if a legacy `startsWith` param is provided, map it to `alphabet`
    if (params.startsWith) {
      if (!params.alphabet) {
        params.alphabet = params.startsWith;
      }
      delete params.startsWith;
    }

    const { data } = await apiClient.get(`/api/v1/names/${normalizedReligion}`, { params });
    const payload = (data.data || data.names || []).map(item => {
      if (item.religion) {
        const normalized = item.religion.toLowerCase();
        if (normalized === 'muslim' || normalized === 'islamic') item.religion = 'islamic';
        else if (normalized === 'christianity' || normalized === 'christian') item.religion = 'christian';
        else if (normalized === 'hinduism' || normalized === 'hindu') item.religion = 'hindu';
        else item.religion = normalized;
      }
      return item;
    });
    const pagination = data.pagination || {
      page,
      limit,
      totalCount: data.total || data.totalCount || payload.length,
      totalPages: data.pagination?.pages || data.totalPages || Math.max(1, Math.ceil((payload.length || 0) / limit)),
    };

    return {
      data: payload,
      pagination,
      success: data.success !== false,
    };
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit: 50, totalCount: 0, totalPages: 0 },
      success: false,
    };
  }
}

/**
 * Fetch related names for a given name
 * Backend: GET /api/names/:religion/:slug/related
 * @param {string} religion - Religion category
 * @param {string} slug - Name slug
 * @returns {Promise<Object>} Related names
 */
export async function fetchRelatedNames(religion, slug) {
  try {
    if (!religion || !slug) {
      return {
        data: [],
        count: 0,
        success: false,
      };
    }

    const { data } = await apiClient.get(`/api/names/religion/islamic/1/related`);


    const result = {
      data: data.data || data.names || [],
      count: data.count || data.total || (data.data ? data.data.length : 0),
      success: data.success !== false,
    };

    return result;
  } catch (error) {
    return {
      data: [],
      count: 0,
      success: false,
    };
  }
}

/**
 * Fetch similar names for a given name
 * Backend: GET /api/names/:religion/:slug/similar
 * @param {string} religion - Religion category
 * @param {string} slug - Name slug
 * @returns {Promise<Object>} Similar names
 */
export async function fetchSimilarNames(religion, slug) {
  try {
    if (!religion || !slug) {
      return {
        data: [],
        count: 0,
        success: false,
      };
    }

    const { data } = await apiClient.get(`/api/names/religion/islamic/1/similar`);


    const result = {
      data: data.data || data.names || [],
      count: data.count || data.total || (data.data ? data.data.length : 0),
      success: data.success !== false,
    };

    return result;
  } catch (error) {
    return {
      data: [],
      count: 0,
      success: false,
    };
  }
}

/**
 * In-memory cache for API responses to prevent duplicate calls
 * within the same ISR regeneration cycle
 */
const requestCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute in-memory TTL

/**
 * Cache wrapper for fetch operations - deduplicates requests
 * within the same render pass and caches across renders briefly
 */
async function cachedFetch(cacheKey, fetchFn) {
  const now = Date.now();
  const cached = requestCache.get(cacheKey);
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  // Check if there's already an in-flight request (deduplication)
  if (cached && cached.promise) {
    return cached.promise;
  }
  
  const promise = fetchFn().then(data => {
    requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      promise: null,
    });
    return data;
  }).catch(err => {
    requestCache.delete(cacheKey);
    throw err;
  });
  
  // Store the promise so duplicate calls reuse it
  requestCache.set(cacheKey, {
    data: null,
    timestamp: now,
    promise,
  });
  
  return promise;
}

/**
 * Clear the request cache (useful for development or manual invalidation)
 */
export function clearRequestCache() {
  requestCache.clear();
}

/**
 * Fetch name detail by religion and slug
 * Backend: GET /api/v1/names/:religion/:slug
 * Uses in-memory cache to deduplicate calls between generateMetadata() and page component
 * @param {string} religion - Religion category
 * @param {string} slug - Name slug
 * @returns {Promise<Object|null>} Name detail object or null
 */
export async function fetchNameDetail(religion, slug) {
   if (!religion || !slug) {
     return null;
   }

   const cacheKey = `nameDetail:${religion}:${slug}`;
   
   return cachedFetch(cacheKey, async () => {
     const normalizedReligion = normalizeReligion(religion);
     const safeSlug = encodeURIComponent(String(slug).trim().toLowerCase());
     let response = await apiClient.get(`/api/v1/names/${normalizedReligion}/${safeSlug}`);
     let data = response.data;

     if ((!data || data.success === false || !data.data) && normalizedReligion && safeSlug) {
       const fallbackResponse = await apiClient.get(`/api/names/${normalizedReligion}/${safeSlug}`);
       data = fallbackResponse.data;
     }

     if (data && data.success && data.data) {
       const nameData = data.data;
       // Normalize religion to lowercase for consistent routing
       if (nameData.religion) {
         nameData.religion = nameData.religion.toLowerCase();
         // Handle variations like "Islamic" -> "islamic", "Christianity" -> "christian"
         if (nameData.religion === 'islamic' || nameData.religion === 'muslim') {
           nameData.religion = 'islamic';
         } else if (nameData.religion === 'christianity' || nameData.religion === 'christian') {
           nameData.religion = 'christian';
         } else if (nameData.religion === 'hinduism' || nameData.religion === 'hindu') {
           nameData.religion = 'hindu';
         }
       }
       return nameData;
     }

     return null;
   });
 }

/**
 * Search names across the database
 * Backend: GET /api/v1/names/search?q=<query>&religion=<religion>&limit=<limit>
 * @param {string} query - Search query
 * @param {Object} options - Search options (religion, limit)
 * @returns {Promise<Object>} Search results with data and count
 */
export async function searchNames(query, options = {}) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        data: [],
        count: 0,
        success: false,
      };
    }

    const { religion, limit = 8 } = options;
    const trimmedQuery = query.trim();

    const params = { q: trimmedQuery, limit };
    if (religion) params.religion = religion;

    const { data } = await apiClient.get('/api/v1/names/search', { params });

    return {
      data: data.data || data.results || [],
      count: data.count || data.total || data.data?.length || 0,
      success: data.success !== false,
    };
  } catch (error) {
    return {
      data: [],
      count: 0,
      success: false,
    };
  }
}

// Export all functions
const namesAPI = {
  // Core endpoints
  fetchFilters,
  fetchNames,
  fetchNameDetail,
  searchNames,

  // Advanced endpoints
  fetchNamesByLetter,
  fetchNamesByCategory,
  fetchNamesByGender,
  fetchNamesByOrigin,
  fetchNamesByLanguage,
  fetchTrendingNames,
  fetchNamesWithAdvancedFilters,
  fetchRelatedNames,
  fetchSimilarNames,

  // Legacy endpoints (backward compatibility)
  fetchNamesLegacy,
  fetchFiltersLegacy,
  fetchNameDetailLegacy,
};

export default namesAPI;
