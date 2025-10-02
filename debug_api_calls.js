// Debug test to check what's happening with the novel-setup-wizard API calls
const API_BASE_URL = 'http://localhost:8000/api';

async function debugApiCalls() {
    console.log('=== DEBUGGING NOVEL SETUP WIZARD API CALLS ===');
    
    // Test the exact same calls the novel-setup-wizard makes
    try {
        console.log('1. Testing direct API calls...');
        
        // Test genres
        console.log('Calling genres API...');
        const genresResponse = await fetch(`${API_BASE_URL}/genres/?ordering=name`);
        console.log(`Genres response status: ${genresResponse.status}`);
        
        if (genresResponse.ok) {
            const genresData = await genresResponse.json();
            console.log(`Genres - Total: ${genresData.count}, This page: ${genresData.results.length}`);
            console.log('First 3 genres:', genresData.results.slice(0, 3).map(g => g.name));
        } else {
            console.log('Genres error:', await genresResponse.text());
        }
        
        // Test tags  
        console.log('\nCalling tags API...');
        const tagsResponse = await fetch(`${API_BASE_URL}/tags/?ordering=name`);
        console.log(`Tags response status: ${tagsResponse.status}`);
        
        if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            console.log(`Tags - Total: ${tagsData.count}, This page: ${tagsData.results.length}`);
            console.log('First 3 tags:', tagsData.results.slice(0, 3).map(t => t.name));
        } else {
            console.log('Tags error:', await tagsResponse.text());
        }
        
        console.log('\n2. Testing full pagination collection...');
        
        // Test full collection like the API service should do
        const allGenres = [];
        let genresUrl = `${API_BASE_URL}/genres/?ordering=name`;
        
        while (genresUrl) {
            const response = await fetch(genresUrl);
            if (!response.ok) break;
            
            const data = await response.json();
            allGenres.push(...data.results);
            
            genresUrl = data.next;
            if (genresUrl) {
                console.log(`Following next genres URL: ${genresUrl}`);
            }
        }
        
        console.log(`Collected ${allGenres.length} total genres through pagination`);
        
        // Quick tags test (first 3 pages)
        const allTags = [];
        let tagsUrl = `${API_BASE_URL}/tags/?ordering=name`;
        let pageCount = 0;
        
        while (tagsUrl && pageCount < 3) {
            const response = await fetch(tagsUrl);
            if (!response.ok) break;
            
            const data = await response.json();
            allTags.push(...data.results);
            
            tagsUrl = data.next;
            pageCount++;
        }
        
        console.log(`Collected ${allTags.length} tags from ${pageCount} pages`);
        
        console.log('\n=== SUMMARY ===');
        console.log(`✓ API is working: ${allGenres.length} genres, ${allTags.length}+ tags available`);
        
    } catch (error) {
        console.error('❌ API Debug Error:', error);
    }
}

// Check if we can access the API
console.log('Starting API debug test...');
debugApiCalls().catch(console.error);