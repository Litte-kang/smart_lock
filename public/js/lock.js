document.write("<script src='js/my_http.js'></script>");
document.write("<script src='js/msg_dialog.js'></script>");

var OldTimeTamp = 0;
var OldDoorName = '';
var MyLocks;

function modifyDoorName(obj)
{	
	if (0 == OldTimeTamp)
	{
		OldTimeTamp = new Date().getTime();
		setTimeout("OldTimeTamp = 0;", 1000);
	}
	else
	{
		var curTimeTamp = new Date().getTime();

		if (500 > (curTimeTamp - OldTimeTamp))
		{
			var doorName = document.getElementById(obj.id).innerHTML;

			OldDoorName = doorName;

			document.getElementById(obj.id).innerHTML = '<input id="tmp_input" name="'+ obj.id + '" class="INPUT_TXT" type="text" onkeydown="saveDoorName(event, this);" value="' + doorName + '">';
			document.getElementById("tmp_input").focus();
		}

		OldTimeTamp = 0;
	}
}

function saveDoorName(evt, obj)
{
	var res;
	var lockInfo = {

		id:'',
		name:'',
		password:''
	};

	switch (evt.keyCode)
	{
		case 13:

			lockInfo.id = obj.name.substring(5);
			lockInfo.name = obj.value;

			if (OldDoorName != obj.value)
			{
				res = sendHttpReq("POST", "modify/door_lock", JSON.stringify(lockInfo));

				if ('修改成功' == res)
				{
					document.getElementById(obj.name).innerHTML = obj.value;
				}
				else
				{
					alert("修改失败");
					document.getElementById(obj.name).innerHTML = OldDoorName;				
				}				
			}
			else
			{
				document.getElementById(obj.name).innerHTML = OldDoorName;
			}

			break;
		default:
			break;
	}
}

function displayOneNewDoorLock(lockInfo)
{
	var myLocks 	= document.getElementById("my_locks").innerHTML;
	var element 	= document.getElementById("null_lock_0");
	var start;
	var end;

	if (!element)
	{
		start  = myLocks.indexOf('<tbody>') + 7;
		end = myLocks.indexOf('</tbody>');		

		myLocks = myLocks.substring(start, end);

		myLocks = myLocks + 
				'<tr align="center">' + 
					'<td>' + 
					 	'<img src="imgs/lock.png" onclick="openDoorDialog(\'block\',\'lock_' + lockInfo.id + '\')"></br>' +
					 	'<div id="lock_' + lockInfo.id + '" onclick="modifyDoorName(this)">' + lockInfo.name + '</div>' +
					 '</td>' +
					 '<td id="null_lock_0"></td>' +
				'</tr>';	

		document.getElementById("my_locks").innerHTML = myLocks;			
	}
	else
	{
		element.innerHTML = '<img src="imgs/lock.png" onclick="openDoorDialog(\'block\', \'lock_' + lockInfo.id + '\')"></br>' +
					 		'<div id="lock_' + lockInfo.id + '" onclick="modifyDoorName(this)">' + lockInfo.name + '</div>';
		
		document.getElementById("null_lock_0").id = '';

		if (document.getElementById("null_lock_1"))
		{
			document.getElementById("null_lock_1").id = "null_lock_0";
		}
	}
	
}

function submitDoorLockInfo(model)
{
	var res;
	var lockInfo = {

		id:'',
		name:'',
		password:'',
		oldPassword:''
	};
	var password_0;
	var password_1;
	var old_password;
	var act;

	if ('add' == model)
	{
		act = 'add/door_lock';

		lockInfo.name = document.getElementById("door_name").value;
		lockInfo.id = document.getElementById("lock_id").value;

		if ('' == lockInfo.name)
		{
			alert("房门名不能为空");
			document.getElementById("door_name").focus();
			return;
		}

		if ('' == lockInfo.id)
		{
			alert("门锁ID不能为空");
			document.getElementById("lock_id").focus();
			return;
		}
	}

	if ('modify_password' == model)
	{
		act = 'modify/door_lock';

		lockInfo.oldPassword = document.getElementById("old_lock_password").value;

		if ('' == lockInfo.oldPassword)
		{
			alert("请输入旧密码");
			document.getElementById("old_lock_password").focus();
			return;
		}

		var index = document.getElementById("doors").selectedIndex;
		
		lockInfo.id = document.getElementById("doors").options[index].value;
	}
	
	password_0 = document.getElementById("lock_password_0").value;
	password_1 = document.getElementById("lock_password_1").value;

	if ('' == password_0 || ''  == password_1)
	{
		alert("密码不能为空");

		if ('' == password_0)
		{
			document.getElementById("lock_password_0").focus();
		}
		else
		{
			document.getElementById("lock_password_1").focus();
		}
		
		return;
	}

	if (password_0 != password_1)
	{
		alert("俩次输入密码不正确");
		document.getElementById("lock_password_1").focus();
		return;
	}
	
	lockInfo.password = password_0;

	res = sendHttpReq("POST", act, JSON.stringify(lockInfo));

	if ('添加成功' == res)
	{
		displayOneNewDoorLock(lockInfo);
		document.getElementById("modify_door_lock_button").disabled = false;
		MyLocks.push({id:lockInfo.id, name:lockInfo.name});
	}
	else
	{
		alert(res);
	}

	if ('add' == model)
	{
		addLockDialog('none');
	}
	else
	{
		modifyLockPasswordDialog('none');
	}
}

function modifyLockPasswordDialog(display)
{
	var content = '<table bgcolor="#4C6874">\
			<tr>\
				<td width="100px">房门</td>\
				<td width="210px">: <select id="doors" class="INPUT_TXT" style="width:200px"></select></td>\
			</tr>\
			<tr>\
				<td>旧密码</td>\
				<td>: <input style="width:200px" id="old_lock_password" class="INPUT_TXT" type="password"></td>\
			</tr>\
			<tr>\
				<td>输入新密码</td>\
				<td>: <input style="width:200px" id="lock_password_0" class="INPUT_TXT" type="password"></td>\
			</tr>\
			<tr>\
				<td>再次输入密码</td>\
				<td>: <input style="width:200px" id="lock_password_1" class="INPUT_TXT" type="password"></td>\
			</tr>\
			<tr align="right">\
				<td></td>\
				<td>\
					<input class="MY_BUTTON" type="button" onclick="submitDoorLockInfo(\'modify_password\')" value="确认">\
					<input class="MY_BUTTON" type="button" onclick="modifyLockPasswordDialog(\'none\')" value="取消">\
				</td>\
			</tr>\
		</table>';

	createMsgDialog({
		title:"更改门锁",
		content:content,
		style:{
			display:display,
			position:"relative"
		}
	});	

	for (var i = 0; i < MyLocks.length; ++i)
	{
		document.getElementById("doors").options.add(new Option(MyLocks[i].name, MyLocks[i].id)); 
	}
	
	//document.getElementById("lock_id").focus();	
}

function openDoorDialog(display, id)
{
	var content = '<table bgcolor="#4C6874">\
				<tr align="center"><td style="color:#ff0000" colspan=\'2\' id=\'alert_msg\'></td></tr>\
				<tr>\
					<td width="80px">请输入密码</td>\
					<td width="230px">: <input style="width:220px" id="lock_password" class="INPUT_TXT" type="password"></td>\
				</tr>\
				<tr align="right">\
					<td></td>\
					<td>\
						<input class="MY_BUTTON" type="button" onclick="openDoor(\'' + id + '\')" value="确认">\
						<input class="MY_BUTTON" type="button" onclick="openDoorDialog(\'none\',\'\')" value="取消">\
					</td>\
				</tr>\
			</table>';
	var doorName = '';

	if ('none' != display)
	{
		doorName = document.getElementById(id).innerHTML;
	}
	
	createMsgDialog({
		title:doorName,
		content:content,
		style:{
			display:display,
			position:"relative"
		}
	});	

	document.getElementById("lock_password").focus();
}

function openDoor(id)
{
	var doorName = document.getElementById(id).innerHTML;
	var password = document.getElementById('lock_password').value;
	var ret;

	if ('' == password)
	{
		document.getElementById("alert_msg").innerHTML = "请输入密码";
		document.getElementById("lock_password").focus();
		return;
	}

	ret = sendHttpReq("GET", ("open/door_lock/" + id.substring(5) + '?password=' + password), null);

	if ("ok" == ret)
	{
		openDoorDialog('none', '');
		alert("打开" + doorName + "欢迎进入");
	}
	else
	{
		document.getElementById("alert_msg").innerHTML = ret;
		document.getElementById("lock_password").focus();
	}
}

function addLockDialog(display)
{
	var content = '<table bgcolor="#4C6874">\
				<tr>\
					<td width="100px">房门名</td>\
					<td width="210px">: <input style="width:200px" id="door_name" class="INPUT_TXT" type="text"></td>\
				</tr>\
				<tr>\
					<td>门锁ID号</td>\
					<td>: <input style="width:200px" id="lock_id" class="INPUT_TXT" type="text"></td>\
				</tr>\
				<tr>\
					<td>输入密码</td>\
					<td>: <input style="width:200px" id="lock_password_0" class="INPUT_TXT" type="password"></td>\
				</tr>\
				<tr>\
					<td>再次输入密码</td>\
					<td>: <input style="width:200px" id="lock_password_1" class="INPUT_TXT" type="password"></td>\
				</tr>\
				<tr align="right">\
					<td></td>\
					<td>\
						<input class="MY_BUTTON" type="button" onclick="submitDoorLockInfo(\'add\')" value="确认">\
						<input class="MY_BUTTON" type="button" onclick="addLockDialog(\'none\')" value="取消">\
					</td>\
				</tr>\
			</table>';

	
	createMsgDialog({
		title:"添加门锁",
		content:content,
		style:{
			display:display,
			position:"relative"
		}
	});

	document.getElementById("door_name").focus();	
}

function initSmartLock()
{
	var myLocks = '';
	var res;

	res = sendHttpReq("get", 'door_locks', null);

	res = JSON.parse(res);

	MyLocks = res;

	if (0 == res.length)
	{
		myLocks = '<tr align="center"><td width="166px" id="null_lock_0">暂无门锁</td><td id="null_lock_1"></td></tr>';

		document.getElementById("modify_door_lock_button").disabled = true;		
	}
	else
	{		
		var len	= (res.length - (res.length % 2)) / 2;
		var n = 0;
		
		for (var i = 0; i < len; ++i)
		{
			myLocks = myLocks + 
					'<tr align="center">' + 
						'<td>' + 
						 	'<img src="imgs/lock.png" onclick="openDoorDialog(\'block\',\'lock_' + res[n].id + '\')"></br>' +
						 	'<div id="lock_' + res[n].id + '" onclick="modifyDoorName(this)">' + res[n].name + '</div>' +
						'</td>' +
						'<td>' +
							'<img src="imgs/lock.png" onclick="openDoorDialog(\'block\',\'lock_' + res[n + 1].id + '\')"></br>' +
						 	'<div id="lock_' + res[n + 1].id + '" onclick="modifyDoorName(this)">' + res[n + 1].name + '</div>' +
						'</td>' +
					'</tr>';	

			n += 2;		
		}

		if (n != res.length)
		{
			myLocks = myLocks + 
					'<tr align="center">' + 
						'<td>' + 
						 	'<img src="imgs/lock.png" onclick="openDoorDialog(\'block\',\'lock_' + res[n].id + '\')"></br>' +
						 	'<div id="lock_' + res[n].id + '" onclick="modifyDoorName(this)">' + res[n].name + '</div>' +
						'</td>' +
						'<td id="null_lock_0"></td>' +
					'</tr>';			
		}
			
	}

	document.getElementById('my_locks').innerHTML = myLocks;

	addLockDialog('none');
}










