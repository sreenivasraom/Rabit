var oRolled;
var sClicked="";
var iClicked = 1;
var oClicked = null;

/* new global variables */
var gSliderTitle = "";
var gColumns = 0;
var gColValue = 0;

var gPointedValue = 0;
var gSelectedValue = 0;

var gSliderTitleObj = null;

var gPointedObj = null;
var gSelectedObj = null;

var gSelectedIndex = 1;
var gPointedIndex = 1;

var gSliderUnit = "";

/* new methods */
function callback(value){}

function refreshSlider(parent, sliderTitle, sliderUnit, columns, colValue, callbackfunction){
	callback = callbackfunction;
	//initialize the global variables
	gSliderTitle = sliderTitle;
	gColumns = parseInt(columns);
	gColValue = parseInt(colValue);
	gSliderUnit = sliderUnit;
	
	//create the slider body
	var count=1;
	var colBody = "";
	while(count<=gColumns){
		colBody = colBody + "<td id=\"sCol_" + count + "\" class=\"sliderColumnClass\" onmouseover=\"SliderMouseOver(event)\" onmouseout=\"SliderMouseOut(event)\" onclick=\"SliderMouseClick(event)\"></td>";
		count++;
	}
	var parentBody = "<table id=\"sliderTable\"><tr id=\"sliderTitleRow\"><td id=\"sliderTitle\" colSpan=\"" + gColumns + "\" nowrap=\"nowrap\">" + sliderTitle + "</td></tr><tr id=\"sliderSliderRow\">" + colBody + "</tr></table>";
	
	document.getElementById(parent).innerHTML = parentBody;
	
	//Set the width of the table
	document.getElementById("sliderTable").style.width = gColumns * 13;
	
	//set the gloabal slider title obj
	gSliderTitleObj = document.getElementById("sliderTitle");
	
	//Initial setup of the slider
	gPointedValue = gColValue;
	gSliderTitleObj.innerHTML = gSliderTitle + ": " + gPointedValue + " " + gSliderUnit;
	gSelectedValue = gPointedValue;
	
	//Initialize the global object stores
	gSelectedObj = document.getElementById("sCol_1");
	gSelectedObj.className = "selectedObjClass";
	
	//Initialise the indexes
	gSelectedIndex = getIndexFromId(gSelectedObj.id);
	
	 callback(gSelectedValue);
}

function getIndexFromId(id)
{
	var tempArray = id.split("_");
	return parseInt(tempArray[1]);
}


function SliderMouseOver(oEvent)
{	
	oEvent = oEvent || window.event;		
	gPointedObj = oEvent.target || oEvent.srcElement;
	
	gPointedIndex = getIndexFromId(gPointedObj.id);

	
	if(gPointedIndex > gSelectedIndex)
		gPointedObj.className = "pointedObjClass";
	

	gPointedValue = gPointedIndex * gColValue;
	
	gSliderTitleObj.innerHTML = gSliderTitle + ": " + gPointedValue + " " + gSliderUnit;
}


function SliderMouseOut(oEvent){
	oEvent = oEvent || window.event;		
	gPointedObj = oEvent.target || oEvent.srcElement;

	gPointedIndex = getIndexFromId(gPointedObj.id);			

	if(gPointedIndex > gSelectedIndex)
		gPointedObj.className = "sliderColumnClass";
		
	gPointedValue = gPointedIndex * gColValue;
	
	gSliderTitleObj.innerHTML = gSliderTitle + ": " + gSelectedValue + " " + gSliderUnit; 
}

function SliderMouseClick(oEvent){
	oEvent = oEvent || window.event;		
	gSelectedObj = oEvent.target || oEvent.srcElement;

	gSelectedIndex = getIndexFromId(gSelectedObj.id);
	
	for(i=1;i<=gColumns;i++)
		document.getElementById("sCol_" + i).className ="sliderColumnClass" ;
	
	for(i=1;i<=gSelectedIndex;i++)
	    document.getElementById("sCol_" + i).className ="selectedObjClass" ;
	    
	 gSelectedValue = gSelectedIndex * gColValue;
	 
	 callback(gSelectedValue);
	
}


