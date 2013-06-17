var pObject = new Array(2);
function populateIFrame ()
{
	var filePath = window.location.href.split("?");
	var paramObject = filePath[1].split("pObject=");
	var actParameters = paramObject[1].split(",");
	var selectBranchObj = actParameters[0];
	var selectbuildNumberObj = actParameters[1];	
	pObject[0] = selectBranchObj;
	pObject[1] = selectbuildNumberObj;	
	document.getElementById("iframeID").src = "pmdsummary.html?"+pObject;
}