var browserArray = new Array();
function displayData(){
    deleteRows();    
    fileOpen("data/"+parent.document.getElementById("globalProjectName").value+"/buildsummary.xml");    
    if (xmlhttp.status == 200){	
        var nodes = getXMLNodes("/stateofbuilds/build[@branch='"+parent.document.getElementById("globalProjectName").value+"']",xmlDoc);
        buildsLength = nodes.length;
        if (buildsLength <= noOfBuildsToBeShown){
            noOfBuildsToBeShown = nodes.length;
        }
        var i = buildsLength - 1;
        if (buildsLength > 0){
            var brCount = 0;
            var ieNode = getXMLNode("/stateofbuilds/build[@branch='"+parent.document.getElementById("globalProjectName").value+"']/regressionstatus/summary/os/testtype[@name='Selenium']/browser[@type='ieexplore']",xmlDoc);
            if (ieNode){
                brCount++;                
            }
            var chromeNode = getXMLNode("/stateofbuilds/build[@branch='"+parent.document.getElementById("globalProjectName").value+"']/regressionstatus/summary/os/testtype[@name='Selenium']/browser[@type='chrome']",xmlDoc);
            if (chromeNode){
                brCount++;
            }
            var firefoxNode = getXMLNode("/stateofbuilds/build[@branch='"+parent.document.getElementById("globalProjectName").value+"']/regressionstatus/summary/os/testtype[@name='Selenium']/browser[@type='firefox']",xmlDoc);
            if (firefoxNode){
                brCount++;
            }
            var safariNode = getXMLNode("/stateofbuilds/build[@branch='"+parent.document.getElementById("globalProjectName").value+"']/regressionstatus/summary/os/testtype[@name='Selenium']/browser[@type='safari']",xmlDoc);
            if (safariNode){
                brCount++;
            }            
            browserArray = new Array(brCount);
            if (brCount > 0){
                var arrayCntr = 0;
                if (ieNode){
                    browserArray[arrayCntr] = new Array();
                    browserArray[arrayCntr][0] = ieNode.parentNode.parentNode.getAttribute("type") + ":ieexplore";
                    arrayCntr++;
                } 
                if (chromeNode){
                    browserArray[arrayCntr] = new Array();
                    browserArray[arrayCntr][0] = chromeNode.parentNode.parentNode.getAttribute("type") + ":chrome";
                    arrayCntr++;
                }
                if (firefoxNode){
                    browserArray[arrayCntr] = new Array();
                    browserArray[arrayCntr][0] = firefoxNode.parentNode.parentNode.getAttribute("type") + ":firefox";
                    arrayCntr++;
                }
                if (safariNode){
                    browserArray[arrayCntr] = new Array();
                    browserArray[arrayCntr][0] = safariNode.parentNode.parentNode.getAttribute("type") + ":safari";
                }
            }            
        }
        createTableHeader();
        i = buildsLength - (parseInt(noOfBuildsToBeShown) + 1);   // initial index for starting the build number
        
        while (i >= 0){
            var bldNo = nodes[i].getAttribute("buildnumber");
            var failedIndex = bldNo.indexOf("Failed");
            var timeoutIndex = bldNo.indexOf("Timeout");
            fontClass = "textClass";
            if (failedIndex > 0){
                bldNo = bldNo.substring(0,failedIndex-1);
                fontClass = "highLightfontColor";
            }
            bldDate = getLocalizedDateString(nodes[i].getAttribute("timeofbuild"));
            var osNodes = getXMLNodes("./buildstatus/osstatus",nodes[i]);
            var bldReadyFlag = true;
            var osArray = new Array(enviromentsArray.length);            
            for (var index=0;index<enviromentsArray.length;index++){                
                osArray[index] = new Array();          //No. of parameters for each OS;                
                osArray[index][0] = enviromentsArray[index];     //OS type;
                osArray[index][1] = "textClass";         //text fontclass;
                //osArray[index][1] = "highLightfontColor";         //text fontclass;              
                var osExists = false;
                for (var k=0;k<osNodes.length;k++){
                    if (osNodes[k].getAttribute("type") == enviromentsArray[index].toLowerCase()){
                        if (getNodeText(osNodes[k]) != "Ready"){
                            bldReadyFlag = false;
                        }
                        if (getNodeText(osNodes[k]) == "Failed") {
                            osArray[index][1] = "highLightfontColor";
                        } 
                        osArray[index][2] = getNodeText(osNodes[k]);     //build Status;
                        osExists = true;
                    } 
                }
                if (!osExists){
                    osArray[index][2] = ".....";     //build Status;
                }
            }            
            if (bldReadyFlag){
                imgSrc = "images/build-pass.png"; 
            } else if (failedIndex > 0){
                imgSrc = "images/build-fail.png";
            } else if (timeoutIndex > 0){
                imgSrc = "images/timeout-build.gif";
            } else {
                imgSrc = "images/build-inprogress.png";
            }            
            var instStatusNodes = getXMLNodes("./regressionstatus/server/installationstatus",nodes[i]);            
            if (instStatusNodes){
                if (checkNode("./regressionstatus/server[installationstatus ='Failed']",nodes[i])){
                    instImg = "images/installation-fail.png";
                } else if (checkNode("./regressionstatus/server[installationstatus ='Timeout']",nodes[i])){
                    instImg = "images/timeout-installation.gif";
                } else if (checkNode("./regressionstatus/server[installationstatus ='Started']",nodes[i])){
                    instImg = "images/installation-inprogress.gif";
                } else if (checkNode("./regressionstatus/server[installationstatus ='Successful']",nodes[i])){ 
                    instImg = "images/installation-pass.png";
                } else {
                    instImg = "images/installation-empty.png";
                }
            } else {
                instImg = "images/installation-empty.png";
            }
            var regnStatusNodes = getXMLNodes("./regressionstatus/server",nodes[i]);            
            if (regnStatusNodes){
                if (checkNode("./regressionstatus/server[@result ='failed']",nodes[i])){ 
                    regImg = "images/regression-fail.png";
                } else if (checkNode("./regressionstatus/server[@result ='Timeout']",nodes[i])){ 
                    regImg = "images/timeout-regression.gif";
                } else if (checkNode("./regressionstatus/server[@result ='Inprogress']",nodes[i])){ 
                    regImg = "images/regression-inprogress.gif";
                } else if (checkNode("./regressionstatus/server[@result ='Completed']",nodes[i])){ 
                    regImg = "images/regression-pass.png";
                } else {
                    regImg = "images/regression-empty.png";    // change this icon;
                }
            } else {
                regImg = "images/regression-empty.png";    // change this icon;
            }            
            for (var k=0;k<enviromentsArray.length;k++){            
                var failedInstallations = getXMLNodes("./regressionstatus/server[@type='"+enviromentsArray[k].toLowerCase()+"'][installationstatus='Failed']",nodes[i]);
                if (failedInstallations.length > 0){
                    osArray[k][3] = failedInstallations.length + " Failed";      // No of installation failures;
                    osArray[k][4] = "highLightfontColor";
                } else {
                    var timeoutInstallations = getXMLNodes("./regressionstatus/server[@type='"+enviromentsArray[k].toLowerCase()+"'][installationstatus='Timeout']",nodes[i]);
                    if (timeoutInstallations.length > 0){
                        osArray[k][3] = timeoutInstallations.length + " Timeout";      // No of installation timeouts;
                        osArray[k][4] = "highLightfontColor";
                    } else {
                        var successInstallations = getXMLNodes("./regressionstatus/server[@type='"+enviromentsArray[k].toLowerCase()+"'][installationstatus='Successful']",nodes[i]);
                        var totalInstallations = getXMLNodes("./regressionstatus/server[@type='"+enviromentsArray[k].toLowerCase()+"']",nodes[i]);
                        if (totalInstallations.length > 0){
                            if (totalInstallations.length == successInstallations.length){
                                osArray[k][3] = "All Passed";
                                osArray[k][4] = "textClass";
                            } else {
                                osArray[k][3] = getXMLNodeValue("installationstatus",totalInstallations[0]);
                                osArray[k][4] = "textClass";
                            }
                        } else {
                            osArray[k][3] = ".....";
                            osArray[k][4] = "textClass";
                        }
                    }
                }
                var osNode = getXMLNode("./regressionstatus/summary/os[@type='"+enviromentsArray[k].toLowerCase()+"']",nodes[i]);
                if (osNode){
                    if (osNode.getAttribute("failures") > 0){        //check with Hari about this attribute when there are no failures;
                        var selnmNode = getXMLNode("testtype[@name='Selenium']",osNode);
                        if (selnmNode){
                            var backendTests = parseInt(osNode.getAttribute("failures")) - parseInt(selnmNode.getAttribute("failures"));
                            osArray[k][5] = backendTests;
                            if (backendTests > 0){
                                osArray[k][6] = "highLightfontColor";
                            } else {
                                osArray[k][6] = "textClass";
                            }                            
                        } else {
                            osArray[k][5] = osNode.getAttribute("failures"); 
                            osArray[k][6] = "highLightfontColor";
                        }                        
                        var seleniumNode = getXMLNode("./testtype[@name='Selenium']",osNode);
                        var browserCtr = 7; // initial index;
                        if (seleniumNode){
                            for (var u=0;u<browserArray.length;u++){
                                var osName =  browserArray[u][0].split(":")[0];
                                if (osName.toLowerCase() == osArray[k][0].toLowerCase()){                                    
                                    var brsr = browserArray[u][0].split(":")[1];    //browser Name;    
                                    var browserExists = getXMLNode("./browser[@type='"+brsr+"']",seleniumNode); 
                                    if (browserExists){
                                        osArray[k][browserCtr] = browserExists.getAttribute("type"); 
                                        osArray[k][browserCtr+1] = browserExists.getAttribute("failures"); 
                                        if (browserExists.getAttribute("failures") > 0){
                                            osArray[k][browserCtr+2] = "highLightfontColor";
                                        } else {
                                            osArray[k][browserCtr+2] = "textClass";
                                        }
                                        browserCtr = browserCtr + 3;
                                    } else {
                                        osArray[k][browserCtr] = brsr; 
                                        osArray[k][browserCtr+1] = "..."; 
                                        osArray[k][browserCtr+2] = "textClass";
                                        browserCtr = browserCtr + 3;
                                    }
                                }
                            }
                        } else {
                        
                            for (var u=0;u<browserArray.length;u++){
                                 var osName =  browserArray[u][0].split(":")[0];
                                
                                if (osName.toLowerCase() == osArray[k][0].toLowerCase()){
                                    var brsr = browserArray[u][0].split(":")[1];    //browser Name;
                                    osArray[k][browserCtr] = brsr; 
                                    osArray[k][browserCtr+1] = "..."; 
                                    osArray[k][browserCtr+2] = "textClass";
                                    browserCtr = browserCtr + 3;
                                } 
                            }
                        }
                    } else {
                        osArray[k][5] = "All Passed";
                        osArray[k][6] = "textClass";
                    }
                    
                } else {
                    osArray[k][5] = ".....";
                    osArray[k][6] = "textClass";
                    
                    for (var u=0;u<browserArray.length;u++){
                         var osName =  browserArray[u][0].split(":")[0];
                         browserCtr = 7;   
                        //if (osName.toLowerCase() == osArray[k][0].toLowerCase()){                            
                            var brsr = browserArray[u][0].split(":")[1];    //browser Name;
                            osArray[k][browserCtr] = brsr; 
                            osArray[k][browserCtr+1] = "..."; 
                            osArray[k][browserCtr+2] = "textClass";
                            browserCtr = browserCtr + 3;
                        //} 
                    }
                }
                //alert(osArray[k].length);
            }            
            insertTableData(imgSrc,instImg,regImg,nodes[i].getAttribute("branch"),bldNo,fontClass,bldDate,osArray);            
            i--
        }
    }  else {
        alert("No builds are available for the selected project");
    }    
    xmlhttp = null;
    xmlDoc = null;
}
function createTableHeader(){
    var tRow;
    var tCell;
    tRow = mainTab.insertRow(0);
    tRow.className = "textClass";
    tRow.align = "center";    
    var browserSpan = 0;
    for (var z=0;z<browserArray.length;z++){
        for (var a=0;a<browserArray[z].length;a++){
            browserSpan++;
        }
    }    
    insertColumn(tRow,tCell,0,"",3,"&nbsp;","","","","","","");
    cSpan = parseInt(enviromentsArray.length);    
    insertColumn(tRow,tCell,1,"tdTopLeftBorder",cSpan+1,"<b>Build</b>","","","","","","");
    insertColumn(tRow,tCell,2,"tdTopLeftBorder",cSpan,"<b>Installation</b>","","","","","","");
    insertColumn(tRow,tCell,3,"tdTopLeftBorder",cSpan,"<b>Tests</b>","","","","","","");    
    if (browserArray.length > 0){
        insertColumn(tRow,tCell,4,"tdTopLeftBorder",browserSpan,"<b>UI Tests</b>","","","","","","");
        insertColumn(tRow,tCell,5,"tdTopLeftRightBorder",1,"<b>View</b>","","","","","","");
    } else {
        insertColumn(tRow,tCell,4,"tdTopLeftRightBorder",1,"<b>View</b>","","","","","","");
    }
    tRow = mainTab.insertRow(1);
    tRow.className = "textClass";
    tRow.align = "center";
    insertColumn(tRow,tCell,0,"tableHeader",1,"<img src='images/rabitimages/build.gif' alt='Build Status'/>","","","","","","");
    insertColumn(tRow,tCell,1,"tableHeader",1,"<img src='images/rabitimages/installation.gif' alt='Installation Status'/>","","","","","","");
    insertColumn(tRow,tCell,2,"tableHeader",1,"<img src='images/rabitimages/regression.gif' alt='Regression Status'/>","","","","","","");
    insertColumn(tRow,tCell,3,"tableHeader",1,"Bld #","","","","","","");
    var cellCntr = 4;
    for (i=0;i<enviromentsArray.length;i++){
        insertColumn(tRow,tCell,cellCntr,"tableHeader",1,enviromentsArray[i]+" Status","","","","","","");
        cellCntr++;
    }
    for (i=0;i<enviromentsArray.length;i++){
        insertColumn(tRow,tCell,cellCntr,"tableHeader",1,enviromentsArray[i],"","","","","","");
        cellCntr++;
    }
    for (i=0;i<enviromentsArray.length;i++){
        insertColumn(tRow,tCell,cellCntr,"tableHeader",1,enviromentsArray[i],"","","","","","");
        cellCntr++;
    }
    var imgStr;
    for (var z=0;z<browserArray.length;z++){
        for (var a=0;a<browserArray[z].length;a++){            
            var bType = browserArray[z][a].split(":")[1];
            var oType = browserArray[z][a].split(":")[0];
            if (bType == "ieexplore"){
                imgStr = "<img src='images/ie.png' title='IE, OS="+oType+"' >"; 
            } else if (bType == "chrome"){
                imgStr = "<img src='images/chrome.png' title='Chrome, OS="+oType+"' >";  
            } else if (bType == "firefox"){
                imgStr = "<img src='images/firefox.png' title='Firefox, OS="+oType+"' >"; 
            } else if (bType == "safari"){
                imgStr = "<img src='images/safari.png' title='Safari, OS="+oType+"' >";  
            }
            insertColumn(tRow,tCell,cellCntr,"tableHeader",1,imgStr,"","","","","","");
            cellCntr++;
        }
    }
    insertColumn(tRow,tCell,cellCntr,"tableHeader tdRightBorder",1,"Dashboard","","","","","","");   
}
function insertColumn(tRow,tCell,cellNo,className,cspan,value,cellAlign,padding,cellTitle,textAlign,paddingRight,paddingLeft){
    tCell = tRow.insertCell(cellNo);
    tCell.className = className;
    if (cspan == 0){
        cspan = 1;
    }
    tCell.colSpan = cspan;
    if (cellAlign != "");
        tCell.align = cellAlign;
    if (cellTitle != "")
        tCell.title = cellTitle;
    if (padding != "")
        tCell.style.padding = padding;
    if (textAlign != "")
        tCell.style.textAlign = textAlign;
    if (paddingRight != "")
        tCell.style.paddingRight = paddingRight;
    if (paddingLeft != "")
        tCell.style.paddingLeft = paddingLeft;
    tCell.innerHTML = value;
}
var lastbldtime = "";
function insertTableData(bldImg,instlnImg,regnImg,branchName,buldNo,fontClass,bldTime,noOfOSArray){
    var rowCount = mainTab.rows.length;
    var tRow;
    var tCell;
    tRow = mainTab.insertRow(rowCount);
    insertColumn(tRow,tCell,0,"tableClassTD tdLeftBorder",1,"<img src="+bldImg+">","center","4px","","","","");
    insertColumn(tRow,tCell,1,"tableClassTD tdLeftBorder",1,"<img src="+instlnImg+">","center","","","","","");
    insertColumn(tRow,tCell,2,"tableClassTD tdLeftBorder",1,"<img src="+regnImg+">","center","","","","","");
   var paramObject = new Array(3);
    paramObject[0] = branchName;
    paramObject[1] = buldNo;
    paramObject[2] = bldTime;
    insertColumn(tRow,tCell,3,"tableClassTD tdLeftBorder",1,"<a href='buildinfo.html?pObject="+paramObject+"' class="+fontClass+" style='TEXT-DECORATION:none;'>"+buldNo+"</a>","","",bldTime,"right","8px","");
    var cellCntr = 4;
    for (i=0;i<enviromentsArray.length;i++){
        insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder",1,noOfOSArray[i][2],"","","","","","4px");
        cellCntr++;
    }
    for (i=0;i<enviromentsArray.length;i++){
        insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder",1,noOfOSArray[i][3],"","","","","","4px");
        cellCntr++;
    }
    for (i=0;i<enviromentsArray.length;i++){
        if (parseInt(noOfOSArray[i][5]) > 0){
            insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder "+noOfOSArray[i][6],1,noOfOSArray[i][5] +" Failed","right","","","","4px","");
        } else {
            insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder",1,noOfOSArray[i][5],"right","","","","4px","");
        }
        cellCntr++;
    }
    for (var z=0;z<browserArray.length;z++){
        if (noOfOSArray[z]){
            for (var a=7;a<noOfOSArray[z].length;a++){
                if (noOfOSArray[z][a+1] == 0){
                    insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder "+noOfOSArray[z][a+2],1,"All Passed","right","","","","4px","");
                } else if (noOfOSArray[z][a+1] == "..."){
                    insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder "+noOfOSArray[z][a+2],1,noOfOSArray[z][a+1],"center","","","","","");
                } else {
                    insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder "+noOfOSArray[z][a+2],1,noOfOSArray[z][a+1] +" Failed","right","","","","4px","");
                }
                cellCntr++;
                a = a+2;
            }
        } 
    }
    insertColumn(tRow,tCell,cellCntr,"tableClassTD tdLeftBorder tdRightBorder",1,
        "<a href='projectdashboard/projectdashboardtabs.html?pObject="+paramObject+"' style='TEXT-DECORATION:none;'><img src='images/bpmview.gif' style='border:0'/></a>"
        ,"center","","","","","");
}
function deleteRows(){
    var rowCount = mainTab.rows.length-1;
    for(var i=rowCount;i>=0;i--){
        mainTab.deleteRow(i);
    }
}
function init(){
    //refreshSlider("refreshSliderCell","Refresh Time","sec","8","30",setRefresh);
    populateSelectBox();
    //createTableHeader();
}
var enviromentsArray = new Array();
function changeBranch(){
    noOfBuildsToBeShown = 5;
    fileOpen("configuration/project/"+parent.document.getElementById("globalProjectName").value+"_configuration.xml");
    enviromentsArray = new Array();
    if (xmlhttp.status == 200){
	    noOfBuildsToBeShown = getXMLNodeValue("/configuration/project/projectdetails/buildstobeshown",xmlDoc);
        var enviromentNodes = getXMLNodes("/configuration/project/projectdetails/environmenttypes/type",xmlDoc);
        for (i=0;i<enviromentNodes.length;i++){
            enviromentsArray[i] = getNodeText(enviromentNodes[i]);
        }
    }
    displayData();
}
var noOfBuildsToBeShown = 5;
function populateSelectBox(){
	fileOpen("configuration/project/projectmetainfo.xml");
	if (xmlhttp.status == 200){
        var nodes = getXMLNodes("/projectmetadata/project",xmlDoc);
        for (i=0;i<nodes.length;i++){
            branchValue = nodes[i].getAttribute("name");
            branchOption = branchValue.toUpperCase();
            addSelectOptions(branchOption,branchValue);
        }
        changeBranch();
	}
}
function addSelectOptions(text,value){
	branchList.options[branchList.length] = new Option(text,value);
}
var gRefreshRate;
var iTimerId = null;
var aDisplayTable;

/***********Function to refresh the page at a fixed interval ***********/
function setRefresh(value){
    gRefreshRate = value;
    if(iTimerId != null){
	    clearInterval(iTimerId);
    }
    iTimerId = setInterval("displayData()",gRefreshRate*1000);
}
function getLocalizedDateString(str_date){
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