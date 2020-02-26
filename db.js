var Datastore = require('nedb');

var db = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

var playlist = {
    addSong: function(album, song){
        
    },
    delSong: function(album, song){
        
    }
}

module.exports = playlist