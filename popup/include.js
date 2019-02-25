function onError(error){
	console.log('Error: ${error}');
}

function onGot(item){
	console.log(item);
}

function refresh(){
	location.reload();
}

//Remove an item from list of sites
function removeitem(e){
	console.log('Removing: ', e.target.name);
	browser.storage.sync.get().then(
	(storedSettings) => {
		var details=storedSettings.details;
		details.sites.splice(e.target.name, 1);
		browser.storage.sync.set({details}).then(refresh, onError);
	},
	onError
	)
}

//Create a table list of sites
function create_table(storedSettings){
	var details=storedSettings.details;
	console.log("Creating table");
	var body = document.body,
        tbl  = document.createElement('table');
        document.getElementById("onOff").checked=details.on;
        console.log(document.getElementById("onOff").value)
		
	var lis=details.sites;
	var l=lis.length;

    for(var i = 0; i < l; i++){
        var tr = tbl.insertRow();
		   var td = tr.insertCell();
                td.appendChild(document.createTextNode(lis[i]));
			var td = tr.insertCell();
			    td.class="button";
				  var el=document.createElement("img");
				  el.src="../icons/bin.svg";
				  el.name=i;
				  el.width=18;
				  el.height=18;
				  el.class="bin";
				  el.addEventListener('click', removeitem);
				td.appendChild(el);
    }
    body.appendChild(tbl);
}

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(create_table, onError);

//Get input
document.addEventListener("click", (e) => {
  console.log(e);
  //Add site to list
  if (e.target.classList.contains("adding")) {
	gettingStoredSettings.then((storedSettings) => {
	  let details=storedSettings.details;
      browser.tabs.query({active: true, currentWindow: true})
		  .then( (tabs) => {console.log(tabs[0].url);
		    if (!(tabs[0].url in details.sites)){
			  details.sites.push(tabs[0].url);
			  browser.storage.sync.set({details}).then(refresh, onError);
		    }
			else{console.log('URL already in list');
			console.log('Added', tabs[0].url);    
			    }
		  } );
	}, onError);
  }
  //Turn on or off
  else if (e.target.id == "onOff"){
      gettingStoredSettings.then((storedSettings)=>
      {
          let details=storedSettings.details;
          details.on=e.target.checked
          browser.storage.sync.set({details}).then(null, onError);}, onError);
      
}

});
