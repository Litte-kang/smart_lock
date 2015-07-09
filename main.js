var http 	= require("http");
var fs 		= require("fs");
var events	= require("events");
var Evt 	= new events.EventEmitter();

http.createServer(function(req, res){

	var body = "";
	
	console.log(req.method + " " + "http://" + req.headers.host + req.url);
	
	req.on('data',function(chunk){
		
		body += chunk;
	});
	
	req.on('end', function(){
		

		if ("GET" === req.method || "get" === req.method)
		{
			var urls 	= req.url.substring(1).split('/');
			var tmp 	= '';
					
			Evt.emit(("get"+req.url), res, req);

			for (var i = 0; i < (urls.length - 1); ++i)
			{
				tmp = '/' + urls[i];
			}

			console.log(tmp);

			Evt.emit(("get" + tmp), res, req);
		}
		else
		{
			var urls 	= req.url.substring(1).split('/');
			var tmp 	= '';
					
			Evt.emit(("post" + req.url), res, req, body);

			for (var i = 0; i < (urls.length - 1); ++i)
			{
				tmp = '/' + urls[i];
			}

			console.log(tmp);

			Evt.emit(("post" + tmp), res, req, body);
		}

		
		req.removeAllListeners();
	});

}).listen(8080);

function get(url, callback)
{
	Evt.on(("get" + url), callback);
}

function post(url, callback)
{
	Evt.on(("post" + url), callback);
}

get("/", function(res, req){

	fs.readFile("./web/index.html", function(err, data){
		
		res.setHeader("Content-Type", "text/html");
		res.writeHeader(200);
		res.write(data.toString());
		res.end();		
	});	

});

get("/imgs/lock.png", function(res, req){

	fs.readFile("./public/imgs/lock.png", function(err, data){
		
		res.setHeader("Content-Type", "text/html");
		res.writeHeader(200);
		res.write(data);
		res.end();		
	});	

});

get("/door", function(res, req){

	console.log(":" + req.url);

	res.end();
});

get("/js/lock.js", function (res, req){

	fs.readFile("./public/js/lock.js", function(err, data){
		
		res.setHeader("Content-Type", "text/html");
		res.writeHeader(200);
		res.write(data);
		res.end();		
	});		
});

get("/js/my_http.js", function (res, req){

	fs.readFile("./public/js/my_http.js", function(err, data){
		
		res.setHeader("Content-Type", "text/html");
		res.writeHeader(200);
		res.write(data);
		res.end();		
	});		
});

get("/js/msg_dialog.js", function (res, req){

	fs.readFile("./public/js/msg_dialog.js", function(err, data){
		
		res.setHeader("Content-Type", "text/html");
		res.writeHeader(200);
		res.write(data);
		res.end();		
	});		
});

post("/door", function(res, req, body){

	console.log(body);
	res.write('ok');
	res.end();
});







