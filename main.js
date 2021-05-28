var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // querystring 모듈을 불러옴

function templateHTML(title, list, body, control){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a
    href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';

  return list;
}
// request 요청할때 웹브라우저가 보낸 정보, response 응답할때 우리가 웹브라우저에게 전송할 정보
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){

      // home 화면
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
          response.writeHead(200); // 200 - 파일을 성공적으로 전송했음
          response.end(template);
        })

        // id 값을 선택한 페이지
      } else {
        fs.readdir('./data', function(error, filelist){
          var list = templateList(filelist);
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var template = templateHTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
              `
              );
            response.writeHead(200); // 200 - 파일을 성공적으로 전송했음
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title" /></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
          `, '');
        response.writeHead(200); // 200 - 파일을 성공적으로 전송했음
        response.end(template);
      })
    } else if(pathname === '/create_process') {
      var body = '';

      // body에 data를 차곡차곡 쌓음.
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body); // querystring의 parse 함수, post에 전송된 정보가 들어있음.
        var title = post.title;
        var description = post.description;

        // writeFile의 callback 함수가 실행되면 파일에 입력이 끝났음을 의미,
        // 파일에 저장이 끝나면 response를 실행해줘야 하므로 콜백함수 안에 넣어줌.
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){

          // 입력시키고, 페이지를 redirect 한다!
          response.writeHead(302, {Location: `/?id=${title}`}); // 302는 page를 redirect 시키라는 의미
          response.end();
        })
      });

    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var template = templateHTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit" />
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a
            href="/update?id=${title}">update</a>`
            );
          response.writeHead(200); // 200 - 파일을 성공적으로 전송했음
          response.end(template);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';

      // body에 data를 차곡차곡 쌓음.
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body); // querystring의 parse 함수, post에 전송된 정보가 들어있음.
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
        console.log(post);
        /*
        // writeFile의 callback 함수가 실행되면 파일에 입력이 끝났음을 의미,
        // 파일에 저장이 끝나면 response를 실행해줘야 하므로 콜백함수 안에 넣어줌.
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){

          // 입력시키고, 페이지를 redirect 한다!
          response.writeHead(302, {Location: `/?id=${title}`}); // 302는 page를 redirect 시키라는 의미
          response.end();
        })
        */
      });
    } else if(pathname === '/delete_process'){
      var body = '';

      // body에 data를 차곡차곡 쌓음.
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;

        // unlink함수로 파일삭제 후 홈 화면으로 redirect
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
    } else {
      response.writeHead(200); // 404 - 파일을 찾을 수 없음
      response.end('Not found');
    }

});
app.listen(3000);
