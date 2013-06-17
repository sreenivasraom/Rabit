var xmlDoc;		
function displayData(){
    var branchName = parent.selectedProject;
    var bldNo = parent.selectedBuild;
    var bldTime = parent.selectedBuildTime;
    fileOpen("data/"+branchName+"/"+bldNo+"/checkininfo.xml");    	            
    if (xmlhttp.status == 200){    
        document.getElementById("checkincount").innerHTML = getXMLNode("/log",xmlDoc).getAttribute("noofcheckins");
        document.getElementById("filesmodified").innerHTML = getXMLNode("/log",xmlDoc).getAttribute("nooffilesmodified"); 
        document.getElementById("locmodified").innerHTML = getXMLNode("/log",xmlDoc).getAttribute("nooflinesmodified"); 
        document.getElementById("branchname").innerHTML = branchName;
        document.getElementById("bldno").innerHTML = bldNo;
        document.getElementById("bldtime").innerHTML = bldTime;            
        var logentryNodes = getXMLNodes("/log/logentry",xmlDoc);            
        for (i=logentryNodes.length-1;i>=0;i--){                
            revNo = logentryNodes[i].getAttribute("revision");
            authorName = getXMLNodeValue("./author",logentryNodes[i]);
            committedDate = getXMLNodeValue("./date",logentryNodes[i]); //logentryNodes[i].selectSingleNode("./date").text
            committedDate = committedDate.substring(0,16);
            var repChar = "&nbsp;";
            committedDate = committedDate.split("T"); 
            committedDate = committedDate.join(repChar);                
            modifiedFiles = logentryNodes[i].getAttribute("nooffilesmodified");
            linesModified = logentryNodes[i].getAttribute("nooflinesmodified");                
            insertTableData(revNo,authorName,committedDate,modifiedFiles,linesModified);
        }
    } else {
        alert("Checkin information is not available");
        document.location.href = "activebuilds.html";
    }
    setDIVHeight();        
}

var revisionNo = 0;
var rowNumber = 0;
var prevClickRow=0;
function rowClick(){
    revisionNo = window.event.srcElement.innerText;
    rowNumber = window.event.srcElement.getAttribute("rowNo");
    if (parseInt(prevClickRow) != parseInt(rowNumber)){
       mainTable.rows[parseInt(prevClickRow)+1].className = "";
    }
    window.event.srcElement.parentElement.className = "rowHighLightColor";
    prevClickRow = rowNumber;    
    if (getXMLNode("/log/logentry[@revision="+revisionNo+"]/msg",xmlDoc)){
        var textNode = getXMLNode("/log/logentry[@revision="+revisionNo+"]/msg",xmlDoc);
        commentsDIV.innerHTML = getNodeText(textNode);
    }
    commentsDIV.style.display = "block";
    modifiedDIV.style.display = "none";
    addedDIV.style.display = "none";
    deletedDIV.style.display = "none";    
    openTab(1,"comments");
}
function insertTableData(rNo,aName,cDate,mFiles,lModified){    
    var rowCount = mainTable.rows.length;
    var tRow;
    var tCell;    
    tRow = mainTable.insertRow(rowCount);    
    tCell = tRow.insertCell(0);
    tCell.className = "tableClassTD tdLeftBorder hyperLinkTextColor";
    tCell.align = "right";
    tCell.style.paddingRight = "8px";
    tCell.style.cursor = "hand";
    tCell.setAttribute("rowNo",rowNumber);
    tCell.innerHTML = rNo;
    if (window.ActiveXObject){
        tCell.attachEvent("onclick",rowClick);
    }else if(window.XMLHttpRequest){
        tCell.addEventListener("click",rowClick,false);
    }  
    rowNumber++;    
    tCell = tRow.insertCell(1);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.style.paddingLeft = "8px";
    tCell.innerHTML = aName;
    tCell = tRow.insertCell(2);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.style.paddingLeft = "8px";
    tCell.innerHTML = cDate;
    tCell = tRow.insertCell(3);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.style.paddingRight = "8px";
    tCell.align = "right";
    tCell.innerHTML = mFiles;        
    tCell = tRow.insertCell(4);
    tCell.className = "tableClassTD tdLeftBorder tdRightBorder";
    tCell.style.paddingRight = "8px";
    tCell.align = "right";
    tCell.innerHTML = lModified;
}
function deleteRows(tableName){
    var rowCount = document.all[tableName].rows.length-1;
    for(var i=rowCount;i>0;i--){
        document.all[tableName].deleteRow(i);
    }
}
var delFlag = false;
var modFlag = false;
var addFlag = false;
function openTabContent(tName,action){
    deleteRows(tName);    
    commentsDIV.style.display = "none";
    modifiedDIV.style.display = "none";
    addedDIV.style.display = "none";
    deletedDIV.style.display = "none";
    delFlag = false;
    modFlag = false;
    addFlag = false;
    if (action == "M"){
         modifiedDIV.style.display = "block";
    } else if (action == "D"){
        deletedDIV.style.display = "block";
    } else if (action == "A"){
        addedDIV.style.display = "block";
    }    
    var compName = "";
    var fileName = "";
    var linesModified = "";
    var changeSet = "&nbsp;";
    if (getXMLNode("/log/logentry[@revision="+revisionNo+"]",xmlDoc)){        
        compNodes = getXMLNodes("/log/logentry[@revision="+revisionNo+"]/component",xmlDoc);
        for(i=0;i<compNodes.length;i++){
            pathNodes = getXMLNodes("./path[@action='"+action+"']",compNodes[i]);
            for (x=0;x<pathNodes.length;x++){     
                compName= compNodes[i].getAttribute("name");
                fileName = getNodeText(pathNodes[x]);
                linesModified = pathNodes[x].getAttribute("nooflinesmodified");
                if (action == "M"){
                    modFlag = true;
                } else if (action == "D"){
                    delFlag = true;
                } else if (action == "A"){
                    addFlag = true;
                }
                insertTabData(compName,fileName,linesModified,changeSet,tName);
            }
        }               
    }
    if (modFlag == false && delFlag == false && addFlag == false){
        createEmptyRow(tName)
    }
}
function createEmptyRow(tlName){
    var rowCount = document.all[tlName].rows.length;
    var tRow;
    var tCell;       
    tRow = document.all[tlName].insertRow(rowCount)
    tCell = tRow.insertCell(0);
    tCell.colSpan = 4;
    tCell.className = "tableClassTD tdLeftBorder tdRightBorder"
    tCell.align = "center";
    tCell.innerHTML = "No Files"
}
function insertTabData(cName,fName,lModified,cSet,tbName){
    var rowCount = document.all[tbName].rows.length;
    var tRow;
    var tCell;       
    tRow = document.all[tbName].insertRow(rowCount);
    tCell = tRow.insertCell(0);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.style.paddingLeft = "8px";
    tCell.innerHTML = cName;    
    tCell = tRow.insertCell(1);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.style.paddingLeft = "8px";
    tCell.innerHTML = fName;
    tCell = tRow.insertCell(2);
    tCell.className = "tableClassTD tdLeftBorder";
    tCell.align = "right";
    tCell.style.paddingRight = "8px";
    tCell.innerHTML = lModified;
    tCell = tRow.insertCell(3);
    tCell.className = "tableClassTD tdLeftBorder tdRightBorder";
    tCell.style.paddingLeft = "8px";
    tCell.innerHTML = cSet;
}
function openComments(){
    commentsDIV.style.display = "block";
    modifiedDIV.style.display = "none";
    addedDIV.style.display = "none";
    deletedDIV.style.display = "none"; 
    if(getXMLNode("/log/logentry[@revision="+revisionNo+"]/msg",xmlDoc)){
        var textNode = getXMLNode("/log/logentry[@revision="+revisionNo+"]/msg",xmlDoc);
        commentsDIV.innerHTML = getNodeText(textNode);    
    }
}
function getLocalizedDateString(str_date)
{
	var monthArray = new Array ("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var dateArray  = str_date.split('.');
	var buildDate  = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[3],dateArray[4],00);
	var localDate  = new Date();
	var timeDiff   = localDate.getTimezoneOffset();

	buildDate.setMinutes(buildDate.getMinutes() - timeDiff);
	
	var iHours     = parseInt(buildDate.getHours());
	var timeOfDay  = "am";
	if(iHours >= 12)
	{
		iHours = iHours==12 ? iHours : iHours-12;
		timeOfDay = "pm";
	}
	var iMinutes = parseInt(buildDate.getMinutes());
	if(iMinutes < 10)
	 iMinutes = "0"+iMinutes;	 
	if(iHours < 10){
		iHours = "0"+iHours;
	}	
	var iDate = buildDate.getDate();
	if(iDate < 10)
		iDate = "0" + iDate;		
	var sDate_Time   = iDate +"-"+monthArray[buildDate.getMonth()]+"-"+buildDate.getFullYear()+";  "+iHours+":"+iMinutes+" "+timeOfDay;	
	return sDate_Time;
}
function setDIVHeight(){
    if (window.ActiveXObject){
        padDiv.style.padding = "10px";
    } else {
        padDiv.style.paddingTop = "40px";
        padDiv.align = "center";
        tabs.style.height = "250px"
        commentsDIV.style.width = "96.5%";
        commentsDIV.style.height = "70%";
        
        modifiedDIV.style.width = "96.5%";
        modifiedDIV.style.height = "70%";
        
        deletedDIV.style.width = "96.5%";
        deletedDIV.style.height = "70%";
        
        addedDIV.style.width = "96.5%";
        addedDIV.style.height = "70%";
        
    }
}