var Datastore = require('nedb');

var db = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

var playlist = {
    addSong: function(album, song, weight){
      db.findOne({ album: album, song: song }, function (err, doc) {
        if(doc == null){
          var doc = {
            album: album,
            song: song,
            weight: weight
          }
          db.insert(doc, function (err, newDoc) {
            console.log("dodano dokument (obiekt):")
            console.log(newDoc)
          });
        }
      });
    },

    delSong: function(album, song){
      db.remove({album: album, song: song}, function (err, oldDoc) {
        console.log(oldDoc)
      });
    },

    printSongs: function(){
      db.find({ }, function (err, docs) {
        console.log(docs)
      });
    },

    getAll: function() {
      return new Promise(function(resolve, reject) {
        db.find({}, function(err, docs) {
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
      })
    }
}

module.exports = playlist
