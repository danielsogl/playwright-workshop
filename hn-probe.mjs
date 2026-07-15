import Parser from 'rss-parser';
const parser = new Parser();
for (const url of ['https://hnrss.org/frontpage', 'https://ir.thomsonreuters.com/rss/news-releases.xml']) {
  try {
    const feed = await parser.parseURL(url);
    console.log(`OK   ${url} -> ${feed.items.length} items`);
  } catch (e) {
    console.log(`FAIL ${url} -> ${e.message}`);
  }
}
