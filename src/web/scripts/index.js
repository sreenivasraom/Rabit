var message="Sorry, right-click has been disabled";
function clickIE() {
    if (document.all) {(message);return false;}
} 
function clickNS(e) {
    if (document.layers||(document.getElementById&&!document.all)) { 
        if (e.which==2||e.which==3) {(message);return false;}
    }
} 
if (document.layers){
    document.captureEvents(Event.MOUSEDOWN);document.onmousedown=clickNS;
} else{
    document.onmouseup=clickNS;document.oncontextmenu=clickIE;
} 
document.oncontextmenu=new Function("return false");
var selectedProject = "";
var selectedBuild = "";
var selectedBuildTime = "";
var selectedRegType = "";
var ie = (typeof window.ActiveXObject != 'undefined');
function openURL(selectedItem){
	var menuItems = document.getElementsByName("itemRow");
    for (i = 0; i < menuItems.length; i++){
        if (selectedItem == menuItems[i].getAttribute("item")){
            document.getElementsByName("itemRow")[i].className = "headerTextSeparator headerTextAltClass";
        } else {
            document.getElementsByName("itemRow")[i].className = "headerTextSeparator headerTextClass";
        }
    }
	switch (selectedItem){
	    case 'activebuilds':
	        document.getElementById("contentframe").src = "activebuilds.html";
	        break;
        case 'project':
             document.getElementById("contentframe").src = "projects/projectlistview.html";
	        break;
        case 'archivedbuilds':
             document.getElementById("contentframe").src = "archivedbuilds.html";
	        break;
	    case 'archivebuilds':
             document.getElementById("contentframe").src = "archive/archivebuilds.html";
	        break;
	    case 'settings':
            document.getElementById("contentframe").src = "globalbuildproperties.html";
	        break;
	    case 'close':
            window.close();
	        break;
    }
}