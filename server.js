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
var formidable = require('formidable');
var qs = require("querystring");

var server = http.createServer(function (req, res) {
    console.log("Żądany adres to: ("+req.method+") " + req.url);


    switch (req.method) {
        case "GET":
            if (req.url == "/") {
              db.printSongs()
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            } else if(req.url.indexOf(".js") != -1){
                fs.readFile("static" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            } else if(req.url.indexOf(".css") != -1){
                fs.readFile("static" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "text/css" });
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
            } else if(req.url == "/admin"){
                fs.readFile("static/admin.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            }
            break;
        case "POST":
            if (req.url == "/") {
                servResponse(req, res)
            } else if(req.url == "/upload"){
                var form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {

                });

                form.on('fileBegin', (name, file) => {
                  var splited_name = file.name.split("|");
                  var album = splited_name[splited_name.length-1];
                  var dir = './static/mp3/'+album;

                  if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                  }
                  splited_name.pop();
                  var file_name = splited_name.join("");

                  if(file.type == "audio/mpeg"){
                    file.path = __dirname + '/static/mp3/'+ album + "/" + file_name;
                  } else {
                    var extension = file_name.split(".")[file_name.split(".").length -1]
                    file.path = __dirname + '/static/mp3/covers/' + album + "." + extension
                  }
                })
            }
            break;

    }
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
