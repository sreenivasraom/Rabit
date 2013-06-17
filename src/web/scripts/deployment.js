var paramObject = window.location.href.split('?par=');
var projectName = paramObject[1].split(',')[0];
var buldNo = paramObject[1].split(',')[1];
function loadDeploymentServers()
{
    var xmlDoc = fileOpen("configuration/project/"+projectName+"_configuration.xml");
    if (xmlhttp.status == 200){
        if (window.ActiveXObject || window.XMLHttpRequest){
            deploymentXMLDoc = getXMLNode("/configuration/project/builddetails/deploymentservers",xmlDoc);
            if(deploymentXMLDoc==null || deploymentXMLDoc.text==""){
                alert("No server is configured for deployment for this project Please configure and continue");
                document.getElementById("startregression").disabled = true;
                return false;
            }
            var deploymentNodes = getXMLNodeValue("/configuration/project/builddetails/deploymentservers",deploymentXMLDoc,"");
            var deploymentServerList = deploymentNodes.split(",");
            if (deploymentServerList.length > 1){
                addOption(document.getElementById("deploymentServersIpList"), "All", "All");
                document.getElementById("deploymentServersIpList").value = "All";
            }
            for (i=0;i<deploymentServerList.length;i++){
               addOption(document.getElementById("deploymentServersIpList"), deploymentServerList[i], deploymentServerList[i]);
            }
        }
    }
}		
function addOption(selectbox,text,value ){
    var optn = document.createElement("OPTION");
    optn.text = text;
    optn.value = value;
    selectbox.options.add(optn);
}
function startRegression()
{
   	var paramstr = "<arg0>"+projectName+"</arg0><arg1>"+buldNo+"</arg1>";
	var req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://webservices.deployment.rabit.com/\"><soapenv:Body><web:startRegression>"+paramstr+"</web:startRegression></soapenv:Body></soapenv:Envelope>";	
	var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		   alert(getXMLNodeValue(".//return",xmlhttp.responseXML,""));
		}
		else if (xmlhttp.readyState == 4 && xmlhttp.status!=200)
		{
			alert(getXMLNodeValue(".//faultstring",xmlhttp.responseXML,""));
		}
	}
	var soapaction = "http://webservices.deployment.rabit.com/startRegression";
	xmlhttp.open("POST","http://"+RegressionServerIP+":"+RegressionServicePort+"/triggerservice?wsdl",true);
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", soapaction);
	xmlhttp.send(req);    
}