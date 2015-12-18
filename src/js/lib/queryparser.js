function getQueryString(i){
  return i.split('?')[1]
}
function getQueryObjectFromString(queryString){
  return (queryString.split('&amp;').reduce(function(acc, val){
    var key = val.split('=')[0]
    var value = val.split('=')[1].split('+').join(' ')

    acc[key] = value
    return acc
  },{}))
}

module.exports = {
  getEncodedUrl: function(u){
    return encodeURIComponent(u)
  },
  queryParser: function(input) {
    return getQueryObjectFromString(getQueryString(input))
  }

}
