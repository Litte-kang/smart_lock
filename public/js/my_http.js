function createXmlHttpRequest()
{
	if (window.ActiveXObject)
	{
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else if (window.XMLHttpRequest)
	{
		return new XMLHttpRequest();
	}
}

function sendHttpReq(method, url, data)
{
	var http_request = createXmlHttpRequest();
		
	http_request.open(method, url, false);
	http_request.setRequestHeader('Content-Type', 'text/plain');
	http_request.send(data);
	
	return http_request.responseText;
}