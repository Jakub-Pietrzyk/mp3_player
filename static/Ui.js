console.log("wczytano plik Ui.js")

class Ui {
    constructor() {
        console.log("konstruktor klasy Ui")
        this.playing = false;
    }

    //obsługa kliknięć w Ui
    clearSpanPlay(){
      var btns = $(".span-play");
      for(var i=0;i<btns.length;i++){
        $(btns[i]).prop("src", "/play.png");
      }
    }

    changeSmallPlay(file){
      var btns = $(".song-span.song-name");
      for(var i=0;i<btns.length;i++){
        if($(btns[i]).html() == net.song){
          $(btns[i]).parent().children(".span-play").prop("src", file)
        }
      }
    }

    hoverActiveSong(){
      var songs = $(".song");
      for(var i=0;i< songs.length;i++){
        $(songs[i]).removeClass("playing");
      }

      var index = net.songs.map(function(x){return x[0]}).indexOf(net.song);
      $("."+index+"").addClass("playing");
    }


    song_clicks() {
      var instance = this;
      $(".album-cover").on("click", function(){
        instance.playing = false;
        document.querySelector("#audio").pause();
        $(".play").prop("src", "/play.png");
        instance.clearSpanPlay();
        net.changeSongs(this.id);
        instance.hoverActiveSong()
      })

      $(".song-name").on("click", function(){
        var album_name = $(this).parent().children(".album-info").html();
        var song_name = $(this).parent().children(".song-name").html()
        var path = "static/mp3/" + album_name + "/" + song_name;
        net.song = song_name;
        $("#audio").prop("src", path);
        $(".play").prop("src", "/play.png");
        instance.clearSpanPlay();
        instance.playing = false;
        instance.hoverActiveSong()
      })

      $(".span-play").on("click", function(e){
        var album_name = $(this).parent().children(".album-info").html();
        var song_name = $(this).parent().children(".song-name").html()
        var path = "static/mp3/" + album_name + "/" + song_name;
        if(song_name == net.song && instance.playing){
          instance.clearSpanPlay();
          $(".play").prop("src", "/play.png");
          $(e.target).prop("src", "/play.png");
          document.querySelector("#audio").pause();
        } else{
          net.song = song_name;
          $("#audio").prop("src", path);
          instance.clearSpanPlay();
          $(".play").prop("src", "/pause.png");
          $(e.target).prop("src", "/pause.png");
          instance.playing = true;
          document.querySelector("#audio").play();
        }
        instance.hoverActiveSong()
      })
    }

    control_clicks() {
      var instance = this;
      $(".play").on("click", function(){
        if(!instance.playing){
          document.querySelector("#audio").play();
          instance.playing = true;
          instance.clearSpanPlay();
          $(".play").prop("src", "/pause.png");
          instance.changeSmallPlay("/pause.png");
        } else if(instance.playing){
          document.querySelector("#audio").pause();
          instance.playing = false;
          $(".play").prop("src", "/play.png");
          instance.clearSpanPlay();
        }
        instance.hoverActiveSong()
      })

      $("#next").on("click", function(){
        var next_song;
        for(var i=0;i<net.songs.length;i++){
          if(net.song == net.songs[i][0] && i+1 < net.songs.length){
            next_song = net.songs[i+1][0]
          } else if(net.song == net.songs[i][0] && i+1 >= net.songs.length){
            next_song = net.songs[0][0]
          }
        }
        net.song = next_song;
        instance.clearSpanPlay();
        $(".play").prop("src", "/pause.png");
        instance.changeSmallPlay("/pause.png");
        instance.playing = true;
        var path = "static/mp3/" + net.album + "/" + net.song;
        $("#audio").prop("src", path);

        document.querySelector("#audio").play();
        instance.hoverActiveSong()
      })

      $("#undo").on("click", function(){
        var next_song;
        for(var i=0;i<net.songs.length;i++){
          if(net.song == net.songs[i][0] && i-1 >= 0){
            next_song = net.songs[i-1][0]
          } else if(net.song == net.songs[i][0] && i-1 < 0){
            next_song = net.songs[net.songs.length-1][0]
          }
        }

        net.song = next_song;
        instance.clearSpanPlay();
        $(".play").prop("src", "/pause.png");
        instance.changeSmallPlay("/pause.png");
        instance.playing = true;
        var path = "static/mp3/" + net.album + "/" + net.song;
        $("#audio").prop("src", path);

        document.querySelector("#audio").play();
        instance.hoverActiveSong()
      })
    }

}
