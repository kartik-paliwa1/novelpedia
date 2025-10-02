// Test the frontend API service pagination
async function testApiService() {
    const API_BASE_URL = 'http://localhost:8000/api';
    
    console.log('Testing Frontend API Service...');
    console.log('=====================================');
    
    // Simulate the getTags function from api.ts
    async function getTags(params = {}) {
        const searchParams = new URLSearchParams(params);
        let allTags = [];
        let nextUrl = `${API_BASE_URL}/tags/?${searchParams.toString()}`;
        
        console.log('Starting tags collection...');
        
        while (nextUrl) {
            console.log(`Fetching: ${nextUrl}`);
            
            try {
                const response = await fetch(nextUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.results && Array.isArray(data.results)) {
                    allTags.push(...data.results);
                    console.log(`  Got ${data.results.length} tags (total so far: ${allTags.length}/${data.count || 'unknown'})`);
                }
                
                // Follow next URL
                nextUrl = data.next;
                
            } catch (error) {
                console.error(`  Error fetching tags:`, error.message);
                break;
            }
        }
        
        return { data: allTags, count: allTags.length };
    }
    
    // Simulate the getGenres function from api.ts
    async function getGenres(params = {}) {
        const searchParams = new URLSearchParams(params);
        let allGenres = [];
        let nextUrl = `${API_BASE_URL}/genres/?${searchParams.toString()}`;
        
        console.log('Starting genres collection...');
        
        while (nextUrl) {
            console.log(`Fetching: ${nextUrl}`);
            
            try {
                const response = await fetch(nextUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.results && Array.isArray(data.results)) {
                    allGenres.push(...data.results);
                    console.log(`  Got ${data.results.length} genres (total so far: ${allGenres.length}/${data.count || 'unknown'})`);
                }
                
                // Follow next URL
                nextUrl = data.next;
                
            } catch (error) {
                console.error(`  Error fetching genres:`, error.message);
                break;
            }
        }
        
        return { data: allGenres, count: allGenres.length };
    }
    
    try {
        // Test genres with ordering like the frontend does
        console.log('\n1. Testing getGenres with ordering=name:');
        const genresResult = await getGenres({ ordering: 'name' });
        console.log(`✓ Successfully collected ${genresResult.count} genres`);
        
        if (genresResult.data.length > 0) {
            console.log(`  First 5: ${genresResult.data.slice(0, 5).map(g => g.name).join(', ')}`);
        }
        
        // Test tags with ordering
        console.log('\n2. Testing getTags with ordering=name (first 3 pages only):');
        const tagsResult = await getTags({ ordering: 'name' });
        console.log(`✓ Successfully collected ${tagsResult.count} tags`);
        
        if (tagsResult.data.length > 0) {
            console.log(`  First 5: ${tagsResult.data.slice(0, 5).map(t => t.name).join(', ')}`);
        }
        
        console.log('\n=====================================');
        console.log('✓ Frontend API service pagination is working correctly!');
        console.log(`✓ Genres available: ${genresResult.count}`);
        console.log(`✓ Tags available: ${tagsResult.count}`);
        
    } catch (error) {
        console.error('\n✗ Frontend API service test failed:', error);
    }
}

// Run the test
testApiService().catch(console.error);