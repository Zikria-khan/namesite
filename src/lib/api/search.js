/**
 * Global Search API Module - World-Class Implementation
 * Unified search across names, stories, and articles
 *
 * Backend Endpoints:
 * - GET /api/v1/names/search?q=query - Global search across all names
 * - GET /api/v1/names/search?q=query&religion=X - Search names by religion
 * - GET /api/stories/search?q=query - Search stories
 * - GET /api/articles/search?q=query - Search articles
 */

import { apiClient } from './client';
import { searchNames } from './names';
import { searchArticles } from './articles';

/**
 * Global search across all content types
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {string} options.type - Content type filter (names, stories, articles, all)
 * @param {string} options.religion - Religion filter for names
 * @param {number} options.limit - Results limit per type
 * @returns {Promise<Object>} Unified search results
 */
export async function globalSearch(query, options = {}) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        names: [],
        articles: [],
        total: 0,
        success: false,
        message: 'Query must be at least 2 characters',
      };
    }

    const { type = 'all', religion, limit = 8 } = options;
    const trimmedQuery = query.trim();

    // If searching all types, fetch from supported APIs in parallel
    if (type === 'all') {
      const [namesResult, articlesResult] = await Promise.all([
        searchNames(trimmedQuery, { religion, limit }),
        searchArticles(trimmedQuery, { limit }),
      ]);

      return {
        names: namesResult.data || [],
        articles: Array.isArray(articlesResult) ? articlesResult : (articlesResult.data || []),
        total: (namesResult.count || 0) + (Array.isArray(articlesResult) ? articlesResult.length : (articlesResult.data?.length || 0)),
        query: trimmedQuery,
        success: true,
      };
    }

    // Search specific type
    switch (type) {
      case 'names':
        const namesResult = await searchNames(trimmedQuery, { religion, limit });
        return {
          names: namesResult.data || [],
          articles: [],
          total: namesResult.count || 0,
          query: trimmedQuery,
          success: namesResult.success,
        };

      case 'articles':
        const articlesResult = await searchArticles(trimmedQuery, { limit });
        return {
          names: [],
          articles: articlesResult || [],
          total: articlesResult?.length || 0,
          query: trimmedQuery,
          success: true,
        };

      default:
        return {
          names: [],
          articles: [],
          total: 0,
          query: trimmedQuery,
          success: false,
          message: 'Invalid search type',
        };
    }
  } catch (error) {
    
    return {
      names: [],
      articles: [],
      total: 0,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Quick search - optimized for autocomplete/suggestions
 * Returns limited results quickly
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Quick search results
 */
export async function quickSearch(query, options = {}) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        suggestions: [],
        success: false,
      };
    }

    const { type = 'names', limit = 8 } = options;
    const trimmedQuery = query.trim();

    // Quick search optimized for autocomplete
    const results = await globalSearch(trimmedQuery, { type, limit });

    // Format as suggestions
    const suggestions = [];

    if (results.names?.length > 0) {
      suggestions.push(
        ...results.names.slice(0, limit).map(name => ({
          type: 'name',
          title: name.name,
          subtitle: name.short_meaning || name.meaning,
          religion: name.religion,
          slug: name.slug,
          url: /names/religion/islamic/1,
        }))
      );
    }

    // Stories are no longer supported

    if (results.articles?.length > 0) {
      suggestions.push(
        ...results.articles.slice(0, limit).map(article => ({
          type: 'article',
          title: article.title,
          subtitle: article.excerpt || article.summary,
          slug: article.slug,
          url: `/blog/${article.slug}`,
        }))
      );
    }

    return {
      suggestions: suggestions.slice(0, limit),
      success: true,
      query: trimmedQuery,
    };
  } catch (error) {
    
    return {
      suggestions: [],
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search with filters and advanced options
 * @param {string} query - Search query
 * @param {Object} filters - Advanced filters
 * @returns {Promise<Object>} Filtered search results
 */
export async function advancedSearch(query, filters = {}) {
  try {
    const {
      type = 'all',
      religion,
      category,
      gender,
      origin,
      tags,
      dateFrom,
      dateTo,
      sortBy = 'relevance',
      limit = 50,
      page = 1,
    } = filters;

    // Build search based on type and filters
    const searchOptions = {
      type,
      limit: limit * page, // Fetch up to current page
    };

    if (religion) searchOptions.religion = religion;

    const results = await globalSearch(query, searchOptions);

    // Apply additional filters client-side if needed
    let filteredNames = results.names || [];
    let filteredArticles = results.articles || [];

    // Filter names
    if (type === 'names' || type === 'all') {
      if (gender) {
        filteredNames = filteredNames.filter(n => n.gender?.toLowerCase() === gender.toLowerCase());
      }
      if (origin) {
        filteredNames = filteredNames.filter(n => n.origin?.toLowerCase() === origin.toLowerCase());
      }
      if (category) {
        filteredNames = filteredNames.filter(n => n.category?.toLowerCase() === category.toLowerCase());
      }
    }

    // Stories filtering removed

    // Filter articles
    if (type === 'articles' || type === 'all') {
      if (category) {
        filteredArticles = filteredArticles.filter(a => a.category?.toLowerCase() === category.toLowerCase());
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      names: filteredNames.slice(startIndex, endIndex),
      articles: filteredArticles.slice(startIndex, endIndex),
      total: filteredNames.length + filteredArticles.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil((filteredNames.length + filteredArticles.length) / limit),
      },
      query,
      filters,
      success: true,
    };
  } catch (error) {
    
    return {
      names: [],
      articles: [],
      total: 0,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get popular searches (trending queries)
 * @returns {Array<string>} Popular search queries
 */
export function getPopularSearches() {
  return [
    'Muhammad',
    'Ayesha',
    'Noah',
    'Grace',
    'Arjun',
    'Priya',
    'David',
    'Sarah',
    'Ali',
    'Fatima',
  ];
}

/**
 * Get search suggestions based on query
 * @param {string} query - Partial query
 * @returns {Array<string>} Search suggestions
 */
export function getSearchSuggestions(query) {
  if (!query || query.length < 2) return [];

  const suggestions = [
    'Islamic names',
    'Christian names',
    'Hindu names',
    'Muslim baby names',
    'Biblical names',
    'Quranic names',
    'Sanskrit names',
    'Arabic names',
    'Hebrew names',
    'Boy names',
    'Girl names',
    'Unique names',
    'Modern names',
    'Traditional names',
  ];

  return suggestions
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}

// Export all functions
const searchAPI = {
  globalSearch,
  quickSearch,
  advancedSearch,
  getPopularSearches,
  getSearchSuggestions,
};

export default searchAPI;
