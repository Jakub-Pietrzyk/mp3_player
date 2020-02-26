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

                    files.forEach(function (fileName) {
                        var stats = fs.statSync(__dirname + "/static/mp3/" + album + "/" + fileName);
                        var fileSizeInBytes = stats["size"] / 1000000.0;
                        send_data.files.push([fileName, Math.round(fileSizeInBytes * 100) / 100]);
                    });
                    res.end("" + JSON.stringify(send_data), null, 4);

                })
            });
        } else if (finish["action"] == "NEXT") {
            fs.readdir(__dirname + "/static/mp3/" + finish["id"], function (err, files) {
                if (err) {
                    return console.log(err);
                }

                files.forEach(function (fileName) {
                    var stats = fs.statSync(__dirname + "/static/mp3/" + finish["id"] + "/" + fileName);
                    var fileSizeInBytes = stats["size"] / 1000000.0;
                    send_data.files.push([fileName, Math.round(fileSizeInBytes * 100) / 100]);
                });
                res.end("" + JSON.stringify(send_data), null, 4);

            })
        }
    })
}

var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var server = http.createServer(function (req, res) {
    console.log("Żądany adres to: " + req.url);

    switch (req.method) {
        case "GET":
            if (req.url == "/") {
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
