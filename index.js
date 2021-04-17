let http = require('http');
let formidable = require('formidable');
let fs = require('fs');
let path = require('path');
let finalhandler = require('finalhandler');
let serveStatic = require('serve-static');
const { nanoid } = require('nanoid');

let server = http.createServer(function (req, res) {

let serve = serveStatic("./");

  if (req.url == '/fileupload') {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let oldpath = files.filetoupload.path;
      let name = `${nanoid(5)}.${files.filetoupload.name.split('.').pop()}`;
      let newpath = path.join(__dirname, name)
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.writeHead(301,
          {Location: 'https://f.aidenybai.com/'+name}
        );
        res.end();
      });
    });
  } else if (req.url == '/upload') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  } else {
    let done = finalhandler(req, res);
    serve(req, res, done);
  }
})

server.listen(process.env.PORT || 8000)