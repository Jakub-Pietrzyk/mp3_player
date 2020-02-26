console.log("wczytano plik Net.js")
class Net {
    constructor() {
        console.log("konstruktor klasy Net")
        this.getAlbums();
    }

    displaySongs(songs, album_text = ""){
      this.songs = songs;
      $(".songs").empty();
      for(var i=0;i<songs.length;i++){
        var div = $('<div class="song '+ i +'">');
        var album = $("<span class='song-span not-active album-info'>")
        album.html(album_text);
        album.appendTo(div);
        var song_name = $("<span class='song-span song-name'>")
        song_name.html(songs[i][0])
        song_name.appendTo(div);
        var song_size = $("<span class='song-span not-active'>")
        song_size.html(songs[i][1] + " MB")
        song_size.appendTo(div);
        var song_play = $("<img class='span-play' src='/play.png'>");
        song_play.appendTo(div)
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
            for(var i=0;i<data["dirs"].length;i++){
              if(data["dirs"][i] != "covers"){
                var img = $('<img class="album-cover" id='+ data["dirs"][i] +'>');
                img.attr('src', "/"+data["dirs"][i] + ".jpg");
                img.appendTo('.album-covers');
              }
            }
            instance.displaySongs(data["files"], data['dirs'][0])
            $("#audio").prop("src", "static/mp3/" + data['dirs'][0] + "/" + data["files"][0][0]);
            instance.song = data["files"][0][0];
            instance.album = data['dirs'][0];
            ui.song_clicks();
            ui.control_clicks();
            ui.hoverActiveSong();
          },
          error: function (xhr, status, error) {
              console.log(xhr);
          },
      })
    }

    changeSongs(id){
      var instance = this;
      $.ajax({
        url: '/',
        data: {
            action: "NEXT",
            id: id
        },
        type: 'POST',
        success: function (response) {
          var data = JSON.parse(response)
          instance.displaySongs(data["files"], id);
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
}
