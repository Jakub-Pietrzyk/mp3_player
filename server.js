var db = require(__dirname + "/db.js");

function servResponse(req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData);
        var send_data = {
            dirs: [],
            files: []
        }

        if (finish["action"] == "FIRST") {
            fs.readdir(__dirname + "/static/mp3", function (err, files) {
                if (err) {
                    return console.log(err);
                }

                files.forEach(function (fileName) {
                    send_data.dirs.push(fileName);
                });
                var album = files[0];
                fs.readdir(__dirname + "/static/mp3/" + album, function (err, files) {
                    if (err) {
                        return console.log(err);
                    }

                    db.getAll().then(function(docs) {
                      songs_in_db = docs.map(function(x) {return x.song});

                      files.forEach(function (fileName) {
                          var stats = fs.statSync(__dirname + "/static/mp3/" + album + "/" + fileName);
                          var fileSizeInBytes = stats["size"] / 1000000.0;
                          var in_db = songs_in_db.includes(fileName);
                          send_data.files.push([fileName, Math.round(fileSizeInBytes * 100) / 100, in_db, album]);
                      });
                      res.end("" + JSON.stringify(send_data), null, 4);
                    });


                })
            });
        } else if (finish["action"] == "NEXT") {
            fs.readdir(__dirname + "/static/mp3/" + finish["id"], function (err, files) {
                if (err) {
                    return console.log(err);
                }



                db.getAll().then(function(docs) {
                  songs_in_db = docs.map(function(x) {return x.song});

                  files.forEach(function (fileName) {
                      var stats = fs.statSync(__dirname + "/static/mp3/" + finish["id"] + "/" + fileName);
                      var fileSizeInBytes = stats["size"] / 1000000.0;
                      var in_db = songs_in_db.includes(fileName);
                      send_data.files.push([fileName, Math.round(fileSizeInBytes * 100) / 100, in_db, finish["id"]]);
                  });
                  res.end("" + JSON.stringify(send_data), null, 4);
                });

            })
        } else if(finish["action"] == "ADD") {
          db.addSong(finish["album"], finish["song"], finish["weight"]);
          res.end(finish["album"], null, 4);
        } else if(finish["action"] == "DEL") {
          db.delSong(finish["album"], finish["song"], finish["weight"]);
          res.end(finish["album"], null, 4);
        } else if(finish["action"] == "PLAYLIST"){
          db.getAll().then(function(docs) {
            for(var i=0;i<docs.length;i++){
              send_data.files.push([docs[i].song, docs[i].weight, true, docs[i].album]);
            }
            res.end("" + JSON.stringify(send_data), null, 4);
          });
        }
    })
}

var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var server = http.createServer(function (req, res) {
    // console.log("Żądany adres to: " + req.url);


    switch (req.method) {
        case "GET":
            if (req.url == "/") {
              db.printSongs()
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/jq.js") {
                fs.readFile("static/jq.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/style.css") {
                fs.readFile("static/style.css", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                })
            } else if(req.url == "/progress_bar.css"){
              fs.readFile("static/progress_bar.css", function (error, data) {
                  res.writeHead(200, { 'Content-Type': 'text/css' });
                  res.write(data);
                  res.end();
              })
            } else if (req.url == "/Net.js") {
                fs.readFile("static/Net.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/Ui.js") {
                fs.readFile("static/Ui.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url == "/Main.js") {
                fs.readFile("static/Main.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            } else if (req.url.indexOf(".mp3") != -1) {
                fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "audio/mpeg" });
                    res.write(data);
                    res.end();
                })
            } else if (req.url.indexOf(".jpg") != -1) {
                fs.readFile("static/mp3/covers" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/jpeg" });
                    res.write(data);
                    res.end();
                })
            } else if (req.url.indexOf(".png") != -1) {
                fs.readFile("static/images" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/png" });
                    res.write(data);
                    res.end();
                })
            }
            break;
        case "POST":
            if (req.url == "/") {
                servResponse(req, res)
            }
            break;

    }
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
