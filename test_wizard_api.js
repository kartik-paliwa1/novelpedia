// Test to simulate the exact API service behavior after our fix
const API_BASE_URL = 'http://localhost:8000/api';

// Simulate the buildQueryString function
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

// Simulate the EXACT api.getTags function after our fix
async function getTagsFixed(params) {
    console.log('🔍 Starting getTags with params:', params);
    
    let allTags = [];
    let url = `/tags/`;
    
    // Add any additional params to the first request
    if (params) {
        const query = buildQueryString(params);
        url += query;
    }
    
    console.log('📡 Initial URL:', url);
    
    try {
        while (url) {
            const fullUrl = `${API_BASE_URL}${url}`;
            console.log(`🌐 Fetching: ${fullUrl}`);
            
            const response = await fetch(fullUrl);
            console.log(`📊 Response status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log(`📦 Response data structure:`, {
                count: responseData.count,
                resultsLength: responseData.results?.length,
                hasNext: !!responseData.next,
                nextUrl: responseData.next
            });
            
            if (responseData.results && Array.isArray(responseData.results)) {
                allTags = [...allTags, ...responseData.results];
                console.log(`📈 Total collected so far: ${allTags.length}/${responseData.count}`);
                
                // Get the next page URL (if any) - using the FIXED logic
                if (responseData.next) {
                    // Extract just the path and query from the full URL
                    try {
                        const nextUrl = new URL(responseData.next);
                        let path = `${nextUrl.pathname}${nextUrl.search}`;
                        // Remove /api/ prefix if present to avoid duplication with API_BASE_URL
                        if (path.startsWith('/api/')) {
                            path = path.substring(4); // Remove '/api'
                        }
                        url = path;
                        console.log(`🔗 Next relative URL: ${url}`);
                    } catch {
                        // Fallback if URL parsing fails
                        let path = responseData.next.replace(/^https?:\/\/[^\/]+/, '');
                        if (path.startsWith('/api/')) {
                            path = path.substring(4); // Remove '/api'
                        }
                        url = path;
                        console.log(`🔗 Next relative URL (fallback): ${url}`);
                    }
                } else {
                    url = null; // No more pages
                    console.log('✅ No more pages');
                }
            } else {
                console.log('❌ Invalid response structure');
                return {
                    data: [],
                    status: 500,
                    message: 'Invalid response structure'
                };
            }
        }
        
        console.log(`🎉 Successfully collected ${allTags.length} tags`);
        return {
            data: allTags,
            status: 200,
            message: `Fetched ${allTags.length} tags successfully`
        };
    } catch (error) {
        console.error('💥 Error in getTags:', error);
        return {
            data: [],
            status: 500,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

// Simulate the EXACT api.getGenres function after our fix  
async function getGenresFixed(params) {
    console.log('🔍 Starting getGenres with params:', params);
    
    let allGenres = [];
    let url = `/genres/`;
    
    // Add any additional params to the first request
    if (params) {
        const query = buildQueryString(params);
        url += query;
    }
    
    console.log('📡 Initial URL:', url);
    
    try {
        while (url) {
            const fullUrl = `${API_BASE_URL}${url}`;
            console.log(`🌐 Fetching: ${fullUrl}`);
            
            const response = await fetch(fullUrl);
            console.log(`📊 Response status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log(`📦 Response data structure:`, {
                count: responseData.count,
                resultsLength: responseData.results?.length,
                hasNext: !!responseData.next,
                nextUrl: responseData.next
            });
            
            if (responseData.results && Array.isArray(responseData.results)) {
                allGenres = [...allGenres, ...responseData.results];
                console.log(`📈 Total collected so far: ${allGenres.length}/${responseData.count}`);
                
                // Get the next page URL (if any) - using the FIXED logic
                if (responseData.next) {
                    // Extract just the path and query from the full URL
                    try {
                        const nextUrl = new URL(responseData.next);
                        let path = `${nextUrl.pathname}${nextUrl.search}`;
                        // Remove /api/ prefix if present to avoid duplication with API_BASE_URL
                        if (path.startsWith('/api/')) {
                            path = path.substring(4); // Remove '/api'
                        }
                        url = path;
                        console.log(`🔗 Next relative URL: ${url}`);
                    } catch {
                        // Fallback if URL parsing fails
                        let path = responseData.next.replace(/^https?:\/\/[^\/]+/, '');
                        if (path.startsWith('/api/')) {
                            path = path.substring(4); // Remove '/api'
                        }
                        url = path;
                        console.log(`🔗 Next relative URL (fallback): ${url}`);
                    }
                } else {
                    url = null; // No more pages
                    console.log('✅ No more pages');
                }
            } else {
                console.log('❌ Invalid response structure');
                return {
                    data: [],
                    status: 500,
                    message: 'Invalid response structure'
                };
            }
        }
        
        console.log(`🎉 Successfully collected ${allGenres.length} genres`);
        return {
            data: allGenres,
            status: 200,
            message: `Fetched ${allGenres.length} genres successfully`
        };
    } catch (error) {
        console.error('💥 Error in getGenres:', error);
        return {
            data: [],
            status: 500,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

// Test the exact same calls that novel-setup-wizard makes
async function testNovelSetupWizardCalls() {
    console.log('🧪 TESTING NOVEL SETUP WIZARD API CALLS');
    console.log('==========================================\n');
    
    try {
        console.log('1️⃣ Testing Promise.all like novel-setup-wizard does...\n');
        
        const [genresResponse, tagsResponse] = await Promise.all([
            getGenresFixed({ ordering: "name" }),
            getTagsFixed({ ordering: "name" }),
        ]);
        
        console.log('\n📋 FINAL RESULTS:');
        console.log('=================');
        console.log(`Genres Response:`, {
            status: genresResponse.status,
            dataLength: genresResponse.data?.length || 0,
            message: genresResponse.message
        });
        
        console.log(`Tags Response:`, {
            status: tagsResponse.status,
            dataLength: tagsResponse.data?.length || 0,
            message: tagsResponse.message
        });
        
        // Simulate the novel-setup-wizard processing
        const rawGenres = Array.isArray(genresResponse.data) ? genresResponse.data : [];
        const rawTags = Array.isArray(tagsResponse.data) ? tagsResponse.data : [];
        
        const validGenres = rawGenres.filter((genre) => 
            genre && typeof genre.name === "string" && genre.name.trim().length > 0
        );
        
        const validTags = rawTags.filter((tag) => 
            tag && typeof tag.name === "string" && tag.name.trim().length > 0
        );
        
        console.log(`\n🎯 FINAL PROCESSED COUNTS:`);
        console.log(`Valid genres: ${validGenres.length}`);
        console.log(`Valid tags: ${validTags.length}`);
        
        console.log(`\n📝 This should log: "Loaded ${validGenres.length} genres and ${validTags.length} tags from API"`);
        
        if (validGenres.length === 0 && validTags.length === 0) {
            console.log('\n🚨 PROBLEM: Both counts are 0 - this matches the user\'s issue!');
        } else {
            console.log('\n✅ SUCCESS: API service should be working correctly!');
        }
        
    } catch (error) {
        console.error('\n💥 ERROR during Promise.all:', error);
    }
}

// Run the test
testNovelSetupWizardCalls().catch(console.error);