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
			Evt.emit(req.url, res, req);
			Evt.emit("hello world");
		}
		else
		{
			Evt.emit(req.url, res, req);
			Evt.emit("hello world");
		}

		
		req.removeAllListeners();
	});

}).listen(8080);

function get(url, callback)
{
	Evt.on(url, callback);
}

function post(url, callback)
{
	Evt.on(url, callback);
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

post("/door:name", function(res, req){


});