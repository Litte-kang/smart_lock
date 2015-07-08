document.write("<script src='js/my_http.js'></script>");

var OldTimeTamp = 0;
var OldDoorName = '';

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

			document.getElementById(obj.id).innerHTML = '<input name="'+ obj.id + '" type="text" onkeydown="saveDoorName(event, this);" value="' + doorName + '">';
		}

		OldTimeTamp = 0;
	}
	//obj.innerHTML = '<input type="text" value="大门">';
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

			lockInfo.id = obj.name;
			lockInfo.name = obj.value;

			res = sendHttpReq("POST", "/door", JSON.stringify(lockInfo));

			if ('ok' == res)
			{
				document.getElementById(obj.name).innerHTML = obj.value;
			}
			else
			{
				alert("修改失败");
				document.getElementById(obj.name).innerHTML = OldDoorName;				
			}

			break;
		default:
			break;
	}
}

function addDoorLock()
{

}

function modifyLockPassword()
{
	
}

function openDoor(id)
{
	var doorName = document.getElementById(id).innerHTML;

	sendHttpReq("GET", ("door/" + id), null);

	alert("打开" + doorName + "欢迎进入");
}

function initSmartLock()
{

}












