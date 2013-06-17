var xmlDoc;
var xmlDocument;
function fileOpen(fileName){
	if (window.XMLHttpRequest){ // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",fileName,false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	return xmlDoc;
}
function openXMLFile(fileName){
	if (window.XMLHttpRequest){ // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",fileName,false);
	xmlhttp.send();
	xmlDocument = xmlhttp.responseXML;
}
function createXMLNode(node,nodeValue,xpath,nameArray,valueArray){
	nodeTag = xmlDoc.createElement(node);
	if (nodeValue !=""){
		nodeTag.appendChild(xmlDoc.createTextNode(nodeValue))
	}	 
	if (nameArray.length != 0){
		for (x=0;x<nameArray.length;x++){
			nodeTag.setAttribute(nameArray[x],valueArray[x])
		}
	}
	if (xpath){
		xpath.appendChild(nodeTag)
	}
	return nodeTag;
}
function saveXMLNode(node,filePath,xpathStr,ip,port){
	var req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://saveconfig.rabit.com/\"><soapenv:Body><web:updateUIServerConfig><xmlnode>" + node.xml + "</xmlnode><filepath>" + filePath + "</filepath><xpathStr>" + xpathStr +" </xpathStr></web:updateUIServerConfig></soapenv:Body></soapenv:Envelope>";
	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	var reqXML = xmlDoc.loadXML(req);
	var xmlhttp=new XMLHttpRequest();
	var soapaction = "http://saveconfig.rabit.com/UpdateUIServerConfig";
	xmlhttp.open("POST","http://"+ip+":"+port+"/saveproject?wsdl",false);
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", soapaction);
	xmlhttp.send(req);
	return xmlhttp;
}
function addOption(selectbox,text,value ){
	var optn = document.createElement("OPTION");
	optn.text = text;
	optn.value = value;
	selectbox.options.add(optn);
}	
function getXMLNodeValue(xPath,srcNode,defaultValue){
	if (defaultValue == undefined){
		defaultValue = "NA";
	}
    if (window.ActiveXObject){
        if (srcNode.selectSingleNode(xPath)){
            return srcNode.selectSingleNode(xPath).text
        } else {
            return defaultValue;
        }
    } else if (document.implementation && document.implementation.createDocument){
        xmlDoc = (srcNode.ownerDocument || srcNode );
        srcNode = srcNode.documentElement || srcNode;
        return xmlDoc.evaluate(xPath,srcNode,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.textContent;
    }
}
function getNodeText(node){
	if (window.ActiveXObject){
		return node.text;
	} else if (document.implementation && document.implementation.createDocument){
		return node.nodeValue ? node.nodeValue : node.textContent;
	}
}
function getXMLNodes(xPath,srcNode){
	if (window.ActiveXObject){
		return srcNode.selectNodes(xPath)
	} else if (document.implementation && document.implementation.createDocument){
		xmlDoc = (srcNode.ownerDocument || srcNode );
		srcNode = srcNode.documentElement || srcNode;
		var nodeList = xmlDoc.evaluate(xPath,srcNode,null,XPathResult.ANY_TYPE,null);
		var result = new Array();
		var node, nodeIndex = 0;
		if ( node = nodeList.iterateNext()){
			do{
				result[nodeIndex++] = node;
			} while ( node = nodeList.iterateNext() )
		}
		return result;
	}
}
function getXMLNode(xPath,srcNode){
	if (window.ActiveXObject){
		return srcNode.selectSingleNode(xPath)
	} else if (document.implementation && document.implementation.createDocument){
		xmlDoc = (srcNode.ownerDocument || srcNode );
		srcNode = srcNode.documentElement || srcNode;
		return xmlDoc.evaluate(xPath,srcNode,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	}
}
function checkNode(xPath,srcNode){
	if (window.ActiveXObject){
		if (srcNode.selectSingleNode(xPath)){
			return true;
		} else {
			return false;
		}
	} else if (document.implementation && document.implementation.createDocument){
		xmlDoc = (srcNode.ownerDocument || srcNode );
		srcNode = srcNode.documentElement || srcNode;
		if (xmlDoc.evaluate(xPath,srcNode,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue){
			return true;
		} else {
			return false;
		}		
	}
}
