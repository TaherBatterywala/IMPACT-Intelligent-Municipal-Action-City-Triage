const asyncHandler = require('express-async-handler');
const Parser = require('rss-parser');
const parser = new Parser();

// @desc    Get top news for a specific city via Google News RSS
// @route   GET /api/news/:city
// @access  Public
const getNewsByCity = asyncHandler(async (req, res) => {
    const city = req.params.city || 'Indore';
    try {
        // Fetch municipal/civic news for the city
        const query = `${city} ("Municipal Corporation" OR "Nagar Nigam" OR "nagar palika" OR "civic body" OR "ward committee" OR "municipal tax" OR "municipal budget" OR "municipality" OR "civic amenities" OR "solid waste" OR "water supply" OR "sewage" OR "public works" OR "road repair" OR "pothole" OR "streetlight")`;
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        let feed = await parser.parseURL(feedUrl);

        // Keywords that must appear in the title to be considered civic/municipal
        const civicKeywords = [
            'municipal', 'nagar nigam', 'nagar palika', 'corporation', 'civic',
            'ward', 'municipality', 'sewage', 'pothole', 'road repair', 'water supply',
            'infrastructure', 'solid waste', 'sanitation', 'streetlight', 'drainage',
            'public works', 'mcgm', 'bmc', 'bbmp', 'nmmc', 'ghmc', 'mcd', 'mcg',
            'budget', 'tax', 'council', 'councillor', 'corporator', 'mayor'
        ];

        // Filter: only keep articles whose title contains a civic keyword
        const filtered = feed.items.filter(item => {
            const title = item.title?.toLowerCase() || '';
            return civicKeywords.some(kw => title.includes(kw));
        });

        // If filter yields nothing, fall back to first 5 raw results (better than empty)
        const pool = filtered.length > 0 ? filtered : feed.items;

        const articles = pool.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            publishedAt: item.pubDate,
            description: item.contentSnippet
        }));

        res.json({ articles });
    } catch (error) {
        console.error("Error fetching RSS feed for city:", city, error);
        res.status(500).json({ message: "Failed to fetch news" });
    }
});

module.exports = { getNewsByCity };
