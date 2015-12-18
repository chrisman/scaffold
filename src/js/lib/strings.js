module.exports = {
  corsAnywhere: "https://cors-anywhere.herokuapp.com/",
  rss2json: "http://rss2json.com/api.json?&rss_url=",
  apiEndPoint: "https://en.wikipedia.org/w/api.php",
  postOptions: {
    action: 'thank',
    format: 'json',
    rev: '624145252',
    source: 'diff',
    token: ''
  },
  getTokens: "https://en.wikipedia.org/w/api.php?action=query&meta=tokens&type=csrf&format=json",
  getFeedRecentChanges: "https://en.wikipedia.org/w/api.php?action=feedrecentchanges&hideminor=true&hidebots=true"
}
