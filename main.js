var http 	= require("http");
var fs 		= require("fs");
var events	= require("events");
var Evt 	= new events.EventEmitter();
var Sqlite	= require("./node_modules/sqlite/NodeSqlite");

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
				tmp = tmp + '/' + urls[i];
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
				tmp = tmp + '/' + urls[i];
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

get("/open/door_lock", function(res, req){

	var id 			= req.url.split('/')[3];
	var password 	= id;
	var ret;

	id = id.substring(0, id.indexOf('?'));
	password = password.substring((password.indexOf('=')+1));
	
	ret = Sqlite.getData('user.db', ('select password from \'door_lock_infos\' where id="' + id + '";'));

	if ("failed" !== ret)
	{
		ret = JSON.parse(ret);
	
		if (ret[0].password === password)
		{
			res.write("ok");
		}
		else
		{
			res.write("密码错误");
		}
	}
	else
	{
		res.write("此门锁不存在");
	}

	res.end();
});

get("/door_locks", function(res, req){

	var doorLocks = [
		{id:"01",name:"大门"},
		{id:"02",name:"大门0"},
		{id:"03",name:"大门1"}
	];

	doorLocks = Sqlite.getData('user.db', 'select id, name  from \'door_lock_infos\';');

	console.log(":" + req.url);

	if ('failed' == doorLocks)
	{
		doorLocks = '[]';
	}

	res.write(doorLocks);
	res.end();
});

post("/add/door_lock", function(res, req, body){

	var lockInfos 	= JSON.parse(body);
	var values		= '"' + lockInfos.id + '","' + lockInfos.name + '","' + lockInfos.password + '"';
	var sql 		= 'insert into \'door_lock_infos\' values(' + values + ');';
	var ret;

	console.log(sql);

	ret = Sqlite.execSql('user.db', sql);
	
	console.log(ret);

	if ('ok' === ret)
	{
		ret = "添加成功";
	}
	else if ('UNIQUE constraint failed: door_lock_infos.id' === ret)
	{
		ret = "此门锁已存在";
	}
	else if ('no such table: door_lock_infos' !== ret)
	{
		ret = '添加失败';
	}

	res.write(ret);
	res.end();
});

post("/modify/door_lock", function(res, req, body){

	var lockInfos = JSON.parse(body);
	var sql;
	var ret;
	
	ret = Sqlite.getData('user.db', ('select * from \'door_lock_infos\' where id="' + lockInfos.id + '";'));

	if ('failed' !== ret)
	{
		do
		{
			if ("" === lockInfos.password)
			{
				sql = 'update \'door_lock_infos\' set name="' + lockInfos.name + '" where id="' + lockInfos.id + '";';
			}
			else if ("" === lockInfos.name)
			{
				sql = 'update \'door_lock_infos\' set password="' + lockInfos.password + '" where id="' + lockInfos.id + '";';
				
				ret = JSON.parse(ret);
				console.log(ret);
				if (ret[0].password !== lockInfos.oldPassword)
				{
					ret = "旧密码不正确";
					break;
				}
			}

			console.log(sql);


			ret = Sqlite.execSql('user.db', sql);
			
			console.log(ret);

			if ('ok' === ret)
			{
				ret = "修改成功";
			}
			else
			{
				ret = '修改失败';
			}			
		}while(0)
		
	}
	else
	{
		ret = '修改失败';
	}

	res.write(ret);
	res.end();
});








