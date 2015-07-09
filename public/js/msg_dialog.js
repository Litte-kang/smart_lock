function createMsgDialog(params)
{
	var bottom;
	var right;

	bottom = document.body.clientHeight / 2;
	right = document.body.clientWidth / 2 - 180;

	document.getElementById("msg_dialog_title").innerHTML = params.title;
	document.getElementById('msg_dialog_title').style.background = "#52CCCC";

    document.getElementById('msg_dialog').style.position = params.style.position;//"relative";//"absolute";
    document.getElementById('msg_dialog').style.zIndex = "1112"

	document.getElementById("msg_dialog_content").innerHTML = params.content;

    document.getElementById('msg_dialog').style.background = "#4C6874";
    document.getElementById('msg_dialog').style.zIndex = "1112"
    document.getElementById('msg_dialog').style.bottom = bottom + "px";
    document.getElementById('msg_dialog').style.right = right + "px";

    document.getElementById("msg_dialog").style.display = params.style.display;  
}