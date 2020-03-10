console.log("wczytano plik Ui.js")

class Ui {
    constructor() {
        console.log("konstruktor klasy Ui")
        this.playing = false;
        this.adminClicks();
    }

    //obsługa kliknięć w Ui
    clearSpanPlay(){
      var btns = $(".span-play");
      for(var i=0;i<btns.length;i++){
        $(btns[i]).prop("src", "/play.png");
      }
    }

    changeDuration(){
      var song_length = Math.round($("#audio").prop("duration"));
      var max_min = Math.floor(song_length/60);
      var max_sec = Math.floor(song_length%60);
      if(max_min < 10){
        max_min = "0" + max_min;
      }
      if(max_sec < 10){
        max_sec = "0" + max_sec;
      }
      $("#song_length").html(max_min + ":" + max_sec);

      var now_length = Math.round($("#audio").prop("currentTime"));
      var now_min = Math.floor(now_length/60);
      var now_sec = Math.floor(now_length%60);
      if(now_min < 10){
        now_min = "0" + now_min;
      }
      if(now_sec < 10){
        now_sec = "0" + now_sec;
      }
      $("#current_time").html(now_min + ":" + now_sec);
    }

    changeSlider(){
      var song_length = Math.round($("#audio").prop("duration"));
      $("#music_progress").prop("max", song_length);
      $("#music_progress").prop("min", 0);
      $("#music_progress").val($("#audio").prop("currentTime"));
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

    nextSong(instance){
      var next_song;
        for(var i=0;i<net.songs.length;i++){
          if(net.song == net.songs[i][0] && i+1 < net.songs.length){
            next_song = net.songs[i+1]
          } else if(net.song == net.songs[i][0] && i+1 >= net.songs.length){
            next_song = net.songs[0]
          }
        }
        net.song = next_song[0];
        instance.clearSpanPlay();
        $(".play").prop("src", "/pause.png");
        instance.changeSmallPlay("/pause.png");
        instance.playing = true;
        var path = "static/mp3/" + next_song[3] + "/" + net.song;
        $("#audio").prop("src", path);

        document.querySelector("#audio").play();
        instance.hoverActiveSong()
    }

    song_clicks() {
      var instance = this;
      $('#audio').on('canplay canplaythrough', function()
      {
        instance.changeDuration();
        instance.changeSlider();
      });

      $("#audio").on("timeupdate", function () {
        instance.changeDuration();
        instance.changeSlider();
      });

      $("#audio").on("ended", function () {
        instance.nextSong(instance);
     })

      $(".album-cover").on("click", function(){
        instance.playing = false;
        document.querySelector("#audio").pause();
        $(".play").prop("src", "/play.png");
        instance.clearSpanPlay();
        if(this.id == "playlist"){
          net.getPlaylist();
        } else {
          net.changeSongs(this.id);
        }
        instance.hoverActiveSong()
      })

      $(".song-playlist").on("click", function(e){
        var song = net.songs[parseInt($(this).parent()[0].classList[1])]
        var album = $(this).siblings(".album-info").html();
        if($(e.target).html() == "+"){
          net.addSongPlaylist(album, song[0], song[1], e.target)
        } else if($(e.target).html() == "-") {
          net.removeSongPlaylist(album, song[0], song[1], e.target)
        }
      })

      $(".song-name").on("click", function(){
        var album_name = $(this).parent().children(".album-info").html();
        var song_name = $(this).parent().children(".song-name").html()
        var path = "static/mp3/" + album_name + "/" + song_name;
        net.song = song_name;
        net.album = album_name;
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

      $("#music_progress").on("input",function(){
        $("#audio").prop("currentTime",this.value)
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
        instance.nextSong(instance);
      })

      $("#undo").on("click", function(){
        var next_song;
        for(var i=0;i<net.songs.length;i++){
          if(net.song == net.songs[i][0] && i-1 >= 0){
            next_song = net.songs[i-1]
          } else if(net.song == net.songs[i][0] && i-1 < 0){
            next_song = net.songs[net.songs.length-1]
          }
        }

        net.song = next_song[0];
        instance.clearSpanPlay();
        $(".play").prop("src", "/pause.png");
        instance.changeSmallPlay("/pause.png");
        instance.playing = true;
        var path = "static/mp3/" + next_song[3] + "/" + net.song;
        $("#audio").prop("src", path);

        document.querySelector("#audio").play();
        instance.hoverActiveSong()
      })
    }

    adminClicks(){
      var files = [];
      $("html").on("dragover", function (e) {
        $(".upload-div").html("Tutaj");
        e.preventDefault();
        e.stopPropagation();
    });

    $("html").on("dragleave", function (e) {
      $(".upload-div").html("PRZECIĄGNIJ PLIKI TUTAJ");
      e.preventDefault();
      e.stopPropagation();
  });

    $("html").on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $('.upload-div').on('dragenter', function (e) {
      $(e.target).html("UPLOAD");
      e.stopPropagation();
      e.preventDefault();
  });

  $('.upload-div').on('dragover', function (e) {
    $(e.target).html("UPLOAD");
      e.stopPropagation();
      e.preventDefault();
  });


  $('.upload-div').on('dragleave', function (e) {
      e.stopPropagation();
      e.preventDefault();
  });

  $('.upload-div').on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();

    files = e.originalEvent.dataTransfer.files;
    var album = prompt("Podaj nazwę albumu(nie używaj znaku '|')");
    if(album == ""){
      var r = Math.random().toString(36).substring(7);
      album = "random_name_" + r;
    }
    album = album.split(" ")
    album = album.join("_")

    var fd = new FormData();
    fd.append("album", album);
    for(var i=0;i<files.length;i++){
      var blob = files[i].slice(0, files[i].size, files[i].type);
      var newFile = new File([blob], files[i].name + "|" + album, {type: files[i].type});
      fd.append(i,newFile)
    }
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: fd,
      contentType: false,
      processData: false,
      success: function (response) {
          console.log(response)
      },

    });


    })
  }
}
