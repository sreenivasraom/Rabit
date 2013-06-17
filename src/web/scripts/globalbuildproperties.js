function showorhide(action,divNo,cFlag){
        imgSrc = this.event.srcElement.src;
		var pos = imgSrc.lastIndexOf("/");
		imgName = imgSrc.substring(pos+1);
		collapseRowNo = this.event.srcElement.rID;
		if (imgName != null){
			if (imgName == "downarrow.png"){
				compDIV[collapseRowNo].style.display = "block";
				document.getElementsByName("collapseGIF")[collapseRowNo].src = "images/uparrow.png";
			} else {
				compDIV[collapseRowNo].style.display = "none";
				document.getElementsByName("collapseGIF")[collapseRowNo].src = "images/downarrow.png";
			}
		}
    }
var xmlDoc;
function updateBuilderProperties()
{
	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	var formNode = createXMLNode("properties","","","","");
	for (var index=1; index<=9; index++){
	    var input = document.getElementById("property"+index);
	    var key = createXMLNode(input.getAttribute("name"),input.value,formNode,"","");
	}
	var strObj=formNode.xml;
	var req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://ws.build.rabit.com/\"><soapenv:Body><web:updateBuilderProperties>" + strObj + "</web:updateBuilderProperties></soapenv:Body></soapenv:Envelope>";	
	var reqXML = xmlDoc.loadXML(req);
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			alert("Global RABIT settings saved successfully");
		}
		else if (xmlhttp.readyState == 4)
		{
			//alert(xmlhttp.responseXML.xml);
		}
	}
	var soapaction = "http://ws.build.rabit.com/updateBuilderProperties";
	xmlhttp.open("POST","http://"+buildserverIP+":"+buildserverserviceport+"/buildservice?wsdl",true);
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", soapaction);
	xmlhttp.send(req);
}
function loadDetails(){
    fileOpen("properties/prop.xml");    
    if (xmlhttp.status == 200){
        document.getElementById("property1").value = getXMLNodeValue("/properties/rabit_sdk.dir",xmlDoc);
        document.getElementById("property2").value = getXMLNodeValue("/properties/anthome",xmlDoc);
        document.getElementById("property3").value = getXMLNodeValue("/properties/project_automation_location",xmlDoc);        
        document.getElementById("property4").value = getXMLNodeValue("/properties/svn.user",xmlDoc);
        document.getElementById("property5").value = getXMLNodeValue("/properties/svn.password",xmlDoc);        
        document.getElementById("property6").value = getXMLNodeValue("/properties/ftpserver.ip",xmlDoc);
        document.getElementById("property7").value = getXMLNodeValue("/properties/ftp.user",xmlDoc);
        document.getElementById("property8").value = getXMLNodeValue("/properties/ftp.password",xmlDoc);
        //document.getElementById("property9").value = getXMLNodeValue("/properties/mailinglist",xmlDoc);
        document.getElementById("property9").value = getXMLNodeValue("/properties/mailserver",xmlDoc);        
    }    
}