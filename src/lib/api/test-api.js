/**
 * API Testing Utility
 * Comprehensive testing for all backend endpoints
 * Run: node src/lib/api/test-api.js
 */

import namesAPI from './names.js';
import { apiClient } from './client.js';

// Test configuration
const TEST_CONFIG = {
  religions: ['islamic', 'christian', 'hindu'],
  testSlug: 'ahmad', // Common Islamic name
  searchQuery: 'ali',
  pageLimit: 10,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Logger utility
 */
const logger = {
  success: (msg) => {},
  error: (msg) => {},
  warning: (msg) => {},
  info: (msg) => {},
  section: (msg) => {},
};

/**
 * Test runner
 */
class APITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
    };
  }

  /**
   * Run a single test
   */
  async runTest(name, testFn) {
    this.results.total++;
    try {
      await testFn();
      this.results.passed++;
      logger.success(name);
      return true;
    } catch (error) {
      this.results.failed++;
      logger.error(`${name}: ${error.message}`);
      return false;
    }
  }

  /**
   * Assert condition
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Print summary
   */
  printSummary() {
    logger.section('Test Summary');
    
    
    
      `Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(2)}%\n`
    );
  }
}

/**
 * Main test suite
 */
async function runTests() {
  const tester = new APITester();

  logger.section('API Endpoint Testing');
  logger.info(`Base URL: ${apiClient.defaults.baseURL}`);
  logger.info(`Timeout: ${apiClient.defaults.timeout}ms\n`);

  // Test 1: Health Check
  logger.section('Health Check');
  await tester.runTest('GET /health', async () => {
    const { data } = await apiClient.get('/health');
    tester.assert(data.status === 'healthy', 'Health check failed');
    tester.assert(data.database === 'connected', 'Database not connected');
  });

  // Test 2: Warmup
  await tester.runTest('GET /warmup', async () => {
    const { data } = await apiClient.get('/warmup');
    tester.assert(data.status === 'warm', 'Warmup failed');
    tester.assert(typeof data.totalMs === 'number', 'Invalid response format');
  });

  // Test 3: Filters for each religion
  logger.section('Filters Endpoint');
  for (const religion of TEST_CONFIG.religions) {
    await tester.runTest(`GET /api/filters/${religion}`, async () => {
      const filters = await namesAPI.fetchFilters(religion);
      tester.assert(Array.isArray(filters.genders), 'Genders should be an array');
      tester.assert(Array.isArray(filters.origins), 'Origins should be an array');
      tester.assert(Array.isArray(filters.letters), 'Letters should be an array');
      tester.assert(typeof filters.totalNames === 'number', 'Total names should be a number');
      tester.assert(filters.totalNames > 0, `No names found for ${religion}`);
    });
  }

  // Test 4: Fetch names for each religion
  logger.section('Names Endpoint');
  for (const religion of TEST_CONFIG.religions) {
    await tester.runTest(`GET /api/names?religion=${religion}`, async () => {
      const result = await namesAPI.fetchNames({
        religion,
        page: 1,
        limit: TEST_CONFIG.pageLimit,
      });
      tester.assert(result.success, 'API call failed');
      tester.assert(Array.isArray(result.data), 'Data should be an array');
      tester.assert(result.data.length > 0, `No names returned for ${religion}`);
      tester.assert(result.pagination.total > 0, 'Total should be greater than 0');

      // Validate name structure
      const firstName = result.data[0];
      tester.assert(firstName.name, 'Name should have name field');
      tester.assert(firstName.slug, 'Name should have slug field');
    });
  }

  // Test 5: Fetch names with filters
  logger.section('Filtered Names');
  await tester.runTest('GET /api/names with gender filter', async () => {
    const result = await namesAPI.fetchNames({
      religion: 'islamic',
      gender: 'male',
      limit: 5,
    });
    tester.assert(result.success, 'API call failed');
    tester.assert(result.data.length > 0, 'No filtered results');
  });

  await tester.runTest('GET /api/names with startsWith filter', async () => {
    const result = await namesAPI.fetchNames({
      religion: 'islamic',
      startsWith: 'A',
      limit: 5,
    });
    tester.assert(result.success, 'API call failed');
    tester.assert(result.data.length > 0, 'No filtered results');
    tester.assert(
      result.data[0].name.toUpperCase().startsWith('A'),
      'Name should start with A'
    );
  });

  // Test 6: Fetch single name detail
  logger.section('Single Name Detail');
  await tester.runTest(`GET /api/names/religion/islamic/1/${TEST_CONFIG.testSlug}`, async () => {
    const name = await namesAPI.fetchNameDetail('islamic', TEST_CONFIG.testSlug);
    tester.assert(name !== null, 'Name not found');
    tester.assert(name.slug === TEST_CONFIG.testSlug, 'Incorrect slug');
    tester.assert(name.name, 'Name should have name field');
    tester.assert(name.short_meaning || name.meaning, 'Name should have meaning');
  });

  // Test 7: Search functionality
  logger.section('Search Endpoint');
  await tester.runTest(`GET /api/search?q=${TEST_CONFIG.searchQuery}`, async () => {
    const result = await namesAPI.searchNames(TEST_CONFIG.searchQuery);
    tester.assert(result.success, 'Search failed');
    tester.assert(Array.isArray(result.data), 'Results should be an array');
    tester.assert(result.count >= 0, 'Count should be present');
  });

  await tester.runTest('GET /api/search with religion filter', async () => {
    const result = await namesAPI.searchNames(TEST_CONFIG.searchQuery, {
      religion: 'islamic',
    });
    tester.assert(result.success, 'Search failed');
    tester.assert(Array.isArray(result.data), 'Results should be an array');
  });

  // Test 8: Legacy endpoints
  logger.section('Legacy Endpoints');
  await tester.runTest('GET /api/religion/islamic (legacy)', async () => {
    const result = await namesAPI.fetchNamesLegacy({
      religion: 'islamic',
      page: 1,
      limit: 5,
    });
    tester.assert(result.success, 'Legacy endpoint failed');
    tester.assert(Array.isArray(result.data), 'Data should be an array');
  });

  await tester.runTest('GET /api/religion/islamic/filters (legacy)', async () => {
    const filters = await namesAPI.fetchFiltersLegacy('islamic');
    tester.assert(Array.isArray(filters.genders), 'Genders should be an array');
    tester.assert(typeof filters.totalNames === 'number', 'Total names should be a number');
  });

  // Test 9: Pagination
  logger.section('Pagination Tests');
  await tester.runTest('Pagination - Page 1', async () => {
    const page1 = await namesAPI.fetchNames({
      religion: 'islamic',
      page: 1,
      limit: 5,
    });
    tester.assert(page1.success, 'Page 1 failed');
    tester.assert(page1.data.length === 5, 'Should return 5 results');
    tester.assert(page1.pagination.page === 1, 'Page number should be 1');
  });

  await tester.runTest('Pagination - Page 2', async () => {
    const page2 = await namesAPI.fetchNames({
      religion: 'islamic',
      page: 2,
      limit: 5,
    });
    tester.assert(page2.success, 'Page 2 failed');
    tester.assert(page2.pagination.page === 2, 'Page number should be 2');
  });

  // Test 10: Error handling
  logger.section('Error Handling');
  await tester.runTest('Invalid religion', async () => {
    const result = await namesAPI.fetchNames({ religion: 'invalid' });
    tester.assert(!result.success || result.data.length === 0, 'Should handle invalid religion');
  });

  await tester.runTest('Invalid slug', async () => {
    const name = await namesAPI.fetchNameDetail('islamic', 'nonexistent-slug-12345');
    tester.assert(name === null, 'Should return null for invalid slug');
  });

  await tester.runTest('Empty search query', async () => {
    const result = await namesAPI.searchNames('');
    tester.assert(!result.success, 'Should fail for empty query');
  });

  // Print final summary
  tester.printSummary();

  // Exit with appropriate code
  process.exit(tester.results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  logger.error(`Test suite crashed: ${error.message}`);
  
  process.exit(1);
});
