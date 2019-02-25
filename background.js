function onError(error){
	console.log('Error: ${error}');
}

var details={sites :[
  "https://www.independent.co.uk",
  "https://www.bbc.co.uk",
  "https://www.duolingo.com/",
  "http://www.theverge.com",
  "https://www.wired.com/",
  "http://www.aljazeera.com/"],
  date : 32,
  on: true
};

//Load up the sites if it is a new day
function loadsites(details){
	var day1=details.date;
	var day2=new Date();
	    day2=day2.getDate();
	console.log('Current date:', day2, 'Date last opened:', day1);
	if (day1!=day2 && details.on){
		for (a in details.sites){
            console.log('Opening ',details.sites[a]);
			browser.tabs.create({url: details.sites[a]});
		}
		details.date=day2;
		let day=browser.storage.sync.set({details});
		day.then(null, onError);
	}
}

//Retrieve or set details
function checkStoredSettings(storedSettings) {
  if (storedSettings.details==undefined) {
    console.log('setting new variables');
    let set1=browser.storage.sync.set({details});
	set1.then(null, onError);
	loadsites(details);
  }
  else {
    console.log('Loading Variables');
	loadsites(storedSettings.details);
  }
}

//Get details from storage
function newday(){
  const gettingStoredSettings = browser.storage.sync.get();
  gettingStoredSettings.then(checkStoredSettings, onError);
}

newday();

//Periodic Alarm to check if the day has changed
browser.alarms.onAlarm.addListener(newday);
browser.alarms.create('newday', {periodInMinutes: 75});
