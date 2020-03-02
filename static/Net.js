console.log("wczytano plik Net.js")
class Net {
    constructor() {
        console.log("konstruktor klasy Net")
        this.playlist = false;
        this.getAlbums();
    }

    displaySongs(songs){
      this.songs = songs;
      $(".songs").empty();
      for(var i=0;i<songs.length;i++){
        var div = $('<div class="song '+ i +'">');
        var album = $("<span class='song-span not-active album-info'>")
        album.html(songs[i][3]);
        album.appendTo(div);
        var song_name = $("<span class='song-span song-name'>")
        song_name.html(songs[i][0])
        song_name.appendTo(div);
        var song_size = $("<span class='song-span not-active'>")
        song_size.html(songs[i][1] + " MB")
        song_size.appendTo(div);
        var song_play = $("<img class='span-play' src='/play.png'>");
        song_play.appendTo(div);
        var song_playlist = $("<span class='song-playlist'>");
        if(songs[i][2]){
          song_playlist.html("-");
        } else {
          song_playlist.html("+");
        }
        song_playlist.appendTo(div);
        div.appendTo(".songs");
      }
    }

    getAlbums() {
      var instance = this;
      $.ajax({
          url: '/',
          data: {
              action: "FIRST"
          },
          type: 'POST',
          success: function (response) {
            var data = JSON.parse(response)
            console.log(data);
            for(var i=0;i<data["dirs"].length;i++){
              if(data["dirs"][i] != "covers"){
                var img = $('<img class="album-cover" id='+ data["dirs"][i] +'>');
                img.attr('src', "/"+data["dirs"][i] + ".jpg");
                img.appendTo('.album-covers');
              }
            }
            instance.displaySongs(data["files"])
            $("#audio").prop("src", "static/mp3/" + data["files"][0][3] + "/" + data["files"][0][0]);
            instance.song = data["files"][0][0];
            instance.album = data["files"][0][3];
            ui.song_clicks();
            ui.control_clicks();
            ui.hoverActiveSong();
          },
          error: function (xhr, status, error) {
              console.log(xhr);
          },
      })
    }

    changeSongs(id, action="NEXT"){
      var instance = this;
      instance.playlist = false;
      $.ajax({
        url: '/',
        data: {
            action: action,
            id: id
        },
        type: 'POST',
        success: function (response) {
          var data = JSON.parse(response)
          instance.displaySongs(data["files"]);
          instance.album = id;
          instance.song = data["files"][0][0];
          var path = "static/mp3/" + id + "/" + data["files"][0][0];
          $("#audio").prop("src", path);
          ui.song_clicks();
          ui.hoverActiveSong();
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
      })
    }

    getPlaylist(){
      var instance = this;
      $.ajax({
        url: '/',
        data: {
            action: "PLAYLIST"
        },
        type: 'POST',
        success: function (response) {
          instance.playlist = true;
          var data = JSON.parse(response);
          instance.displaySongs(data["files"]);
          instance.album = data["files"][0][3];
          instance.song = data["files"][0][0];
          var path = "static/mp3/" + data["files"][0][3] + "/" + data["files"][0][0];
          $("#audio").prop("src", path);
          ui.song_clicks();
          ui.hoverActiveSong();
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
      })
    }

    addSongPlaylist(album, song, weight, target){
      var instance = this;
      $.ajax({
        url: '/',
        data: {
            action: "ADD",
            album: album,
            song: song,
            weight: weight
        },
        type: 'POST',
        success: function (response) {
          $(target).html("-")
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
      })
    }

    removeSongPlaylist(album, song, weight, target){
      var instance = this;
      $.ajax({
        url: '/',
        data: {
            action: "DEL",
            album: album,
            song: song,
            weight: weight
        },
        type: 'POST',
        success: function (response) {
          $(target).html("+")
        },
        error: function (xhr, status, error) {
            console.log(xhr);
        },
      })
    }
}
