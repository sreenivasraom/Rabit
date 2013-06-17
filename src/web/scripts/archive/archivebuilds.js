function init(){
    fileOpen("../configuration/project/projectmetainfo.xml");
    if (xmlhttp.status == 200){
        var nodes = getXMLNodes("/projectmetadata/project",xmlDoc);
        for (i=0;i<nodes.length;i++){
            var selectBox = document.getElementById("projectName");
            branchValue = nodes[i].getAttribute("name");
            addSelectOptions(selectBox,branchValue,branchValue);
        }
    }
    displayBuilds();
}
function clearOptions(selBox){
    for (var x=selBox.options.length-1;x>=0;x--){
        removeOption(selBox,x);
    }
}
function displayBuilds(){
    clearOptions(document.getElementById("builds"));
    clearOptions(document.getElementById("selectedbuilds"));
    fileOpen("../data/"+document.getElementById("projectName").value+"/buildsummary.xml");
    if (xmlhttp.status == 200){
         var nodes = getXMLNodes("/stateofbuilds/build[@branch='"+document.getElementById("projectName").value+"']",xmlDoc);
         for (var x=0;x<nodes.length;x++){
            var selectBox = document.getElementById("builds");
            var bldNumber = nodes[x].getAttribute("buildnumber");
            addSelectOptions(selectBox,bldNumber,bldNumber);
         }
    }
}
function addSelectOptions(selBox,text,value){
	selBox.options[selBox.length] = new Option(text,value);
}
function triggerProcess(actionType,locationInput){
    var buildsForAction = buildsSelected();    
    var uName = document.getElementById("username").value;
    var pWord = document.getElementById("pwd").value;    
    if (locationInput != ""){
        processRequest(document.getElementById("projectName").value,buildsForAction,actionType,document.getElementById("archiveLocation").value,uName,pWord);
    } else {
        processRequest(document.getElementById("projectName").value,buildsForAction,actionType,"",uName,pWord);
    }
}
function processRequest(prjname,buildnos,archievaltype,location,uName,pWord){
    var req = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://ws.service.rabit.com/\"><soapenv:Body><web:manageOldData><projectname>" + prjname+ "</projectname><buildnumbers>"+buildnos+"</buildnumbers><type>"+archievaltype+"</type><location>"+location+"</location><username>"+uName+"</username><password>"+pWord+"</password></web:manageOldData></soapenv:Body></soapenv:Envelope>";
    var xmlhttp = new XMLHttpRequest();    
    xmlhttp.onreadystatechange=function(){
	    if (xmlhttp.readyState==4 && xmlhttp.status==200){
	      var response = xmlhttp.responseXML;
	      alert(response.selectSingleNode(".//return").text);
	    } else if ( xmlhttp.readyState==4 ) {
		    var response = xmlhttp.responseXML;
	        alert(response.selectSingleNode(".//faultstring").text);
	    }
    }
    var soapaction = "http://ws.service.rabit.com/manageOldData";
    xmlhttp.open("POST","http://"+controlserverIP+":"+rabitservicesport+"/rabitservices?wsdl",true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlhttp.setRequestHeader("SOAPAction", soapaction);
    xmlhttp.send(req);
}
function buildsSelected(){
    var selBox = document.getElementById("selectedbuilds")
    var str = "";
    if(selBox.options.length > 0){
        for (var x=selBox.options.length-1;x>=0;x--){
            if (str == ""){
                str = selBox.options[x].value;
            } else {
                str = str  + "," + selBox.options[x].value;
            }
        }
    }
    return str;
}
function addBuilds(fromControl,toControl){
    var selBox = document.getElementById(fromControl)
    if(selBox.options.length > 0){
        for (var x=selBox.options.length-1;x>=0;x--){
            
            if (selBox.options[x].selected){
                var selectBox = document.getElementById(toControl);
                var bldNumber = selBox.options[x].value;
                addSelectOptions(selectBox,bldNumber,bldNumber);
                removeOption(document.getElementById(fromControl),x);
            }
        }
    }
}
function removeOption(selBox,optionIndex){
    selBox.remove(optionIndex);
}
function isEmpty(val){
    if (val.match(/^s+$/) || val == ""){
        return true;
    } else {
        strRE = new RegExp( );
        strRE.compile( '^[\s ]*$', 'gi' );
        return strRE.test( str);
    } 
}
function enableButton(){
    var str = document.getElementById("archiveLocation").value;
    str = str.replace(/^\s+/,"");
    str = str.replace(/\s+$/,"");
    document.getElementById("archiveLocation").value = str;
    if (!((str.match(/^s+$/) || str == ""))){
        strRE = new RegExp( );
        strRE.compile( '^[\s ]*$', 'gi' );
        if (!strRE.test(str)){
            document.getElementById("arcBuilds").disabled = false;
            document.getElementById("milestonebuilds").disabled = false;
        } else {
            document.getElementById("arcBuilds").disabled = true;
            document.getElementById("milestonebuilds").disabled = true;
        }
    } else {
        document.getElementById("arcBuilds").disabled = true;
            document.getElementById("milestonebuilds").disabled = true;
    }
}