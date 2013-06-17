function initTab1(){
    tab1.className = "tabHeaderClass"
    tabParent1.className = ""
}

function initTab2(){
    tab2.className = "tabHeaderClass"
    tabParent2.className = ""
}
function initTab3(){
    tab3.className = "tabHeaderClass"
    tabParent3.className = ""
}
function initTab4(){
    tab4.className = "tabHeaderClass"
    tabParent4.className = ""
}
function initTab5(){
    tab5.className = "tabHeaderClass"
    tabParent5.className = ""
}
function initTab6(){
    tab6.className = "tabHeaderClass"
    tabParent6.className = ""
}
function openTab(tabNo,openPage){
	if (openPage =="comments" || openPage =="modified" || openPage =="deleted" || openPage =="added"){
		if (revisionNo == 0){
			alert("Select the revision number");
			return;
		}
	}
	if (document.all.tab6){
        initTab6();
		initTab5();
		initTab4();
        initTab3();
        initTab2();
        initTab1();
	} else if (document.all.tab5){
        initTab5();
		initTab4();
        initTab3();
        initTab2();
        initTab1();
	} else if (document.all.tab4){
        initTab4();
        initTab3();
        initTab2();
        initTab1();
    } else if (document.all.tab3){
        initTab3();
        initTab2();
        initTab1();
    } else if (document.all.tab2){
        initTab2();
        initTab1();
    } 
    document.all["tab"+tabNo].className = "tabclick";
    document.all["tabParent"+tabNo].className = "tabPclick";

	if (openPage == "PMD"){
		document.getElementById("iframeID").src = "pmdsummary.html?"+pObject;
		document.all.iframeID.style.border = 0;
	} else if (openPage == "MBV"){
		document.getElementById("iframeID").src = "mbsummary.html?"+pObject;
	} else if (openPage == "CCV"){
		alert("Under Construction")
	} else if (openPage == "comments"){
		openComments();
	} else if (openPage == "modified"){
		openTabContent("modTable","M");
	} else if (openPage == "deleted"){
		openTabContent("delTable","D");
	} else if (openPage == "added"){
		openTabContent("addTable","A");
	} else if (openPage == "build"){
		document.getElementById("iframeID").src = "build.html?"+projectName;
	} else if (openPage == "components"){
		document.getElementById("iframeID").src = "components.html?"+projectName;
	} else if (openPage == "testcases"){
		document.getElementById("iframeID").src = "testcases.html?"+projectName;
	} else if (openPage == "bugzilla"){
		document.getElementById("iframeID").src = "bugzilla.html?"+projectName;
	} else if (openPage == "testlink"){
		document.getElementById("iframeID").src = "testlink.html?"+projectName;
	} else if (openPage == "project"){
		document.getElementById("iframeID").src = "newproject.html?"+projectName;
	} else if (openPage == "Failures"){
		showFailureDetails()
	} else if (openPage == "Errors"){
		showErrorDetails()
	} else if (openPage == "Success"){
		showSuccessDetails()
	}
	
	
}