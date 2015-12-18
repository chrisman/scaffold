module.exports = {
  chunk: function(array, n){
    var collector = []
    n = n || 2
    while (array.length > 0)
      collector.push(array.splice(0, n))
    return collector
  },
  flatten: function(array){
    return array.reduce(function(a, b){
      return a.concat(b)
    },[])
  }
}
