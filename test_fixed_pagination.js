// Test the fixed API service pagination
const API_BASE_URL = 'http://localhost:8000/api';

// Mock the buildQueryString function
function buildQueryString(params) {
    if (!params) return '';
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.set(key, String(value));
        }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}

// Test the URL extraction logic
function testUrlExtraction() {
    console.log('Testing URL extraction logic...');
    
    // Test cases
    const testUrls = [
        'http://localhost:8000/api/genres/?ordering=name&page=2',
        'https://api.example.com/api/tags/?ordering=name&page=3',
        '/api/genres/?ordering=name&page=4' // Already relative
    ];
    
    testUrls.forEach(fullUrl => {
        let extractedPath;
        try {
            const nextUrl = new URL(fullUrl);
            extractedPath = `${nextUrl.pathname}${nextUrl.search}`;
        } catch {
            // Fallback if URL parsing fails
            extractedPath = fullUrl.replace(/^https?:\/\/[^\/]+/, '');
        }
        
        console.log(`${fullUrl} -> ${extractedPath}`);
    });
}

// Simulate the fixed getTags function
async function testGetTagsFixed(params = {}) {
    let allTags = [];
    let url = `/tags/`;
    
    // Add any additional params to the first request
    if (params) {
        const query = buildQueryString(params);
        url += query;
    }
    
    console.log('\\nTesting fixed getTags pagination...');
    let pageCount = 0;
    
    try {
        while (url && pageCount < 3) { // Limit to 3 pages for testing
            console.log(`Fetching: ${API_BASE_URL}${url}`);
            
            const response = await fetch(`${API_BASE_URL}${url}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.results && Array.isArray(data.results)) {
                allTags.push(...data.results);
                console.log(`  Got ${data.results.length} tags (total so far: ${allTags.length}/${data.count || 'unknown'})`);
            }
            
            // Get the next page URL (if any) - using the FIXED logic
            if (data.next) {
                // Extract just the path and query from the full URL
                try {
                    const nextUrl = new URL(data.next);
                    let path = `${nextUrl.pathname}${nextUrl.search}`;
                    // Remove /api/ prefix if present to avoid duplication with API_BASE_URL
                    if (path.startsWith('/api/')) {
                        path = path.substring(4); // Remove '/api'
                    }
                    url = path;
                    console.log(`  Next relative URL: ${url}`);
                } catch {
                    // Fallback if URL parsing fails
                    let path = data.next.replace(/^https?:\/\/[^\/]+/, '');
                    if (path.startsWith('/api/')) {
                        path = path.substring(4); // Remove '/api'
                    }
                    url = path;
                    console.log(`  Next relative URL (fallback): ${url}`);
                }
            } else {
                url = null; // No more pages
                console.log('  No more pages');
            }
            
            pageCount++;
        }
        
        console.log(`✓ Successfully collected ${allTags.length} tags from ${pageCount} pages`);
        return { data: allTags, count: allTags.length };
        
    } catch (error) {
        console.error(`✗ Error:`, error.message);
        return { data: [], count: 0 };
    }
}

// Run the tests
testUrlExtraction();
testGetTagsFixed({ ordering: 'name' }).catch(console.error);