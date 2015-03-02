/**
 * @background-script
 * code to trigger the clicked() on page load
 * Written by minhaz aka hector09 (or mebjas) <minhazav@gmail.com>
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {

	/**
	 * attempting to inject before complete load
	 * this will result in earl loading of all anims
	 */
	
	if (changeInfo.status === 'complete') {
		/**
		 * injecting code once load has been completed
		 */
		chrome.tabs.executeScript(tabId, { file: "jquery-2.1.0.min.js" }, function() {
			chrome.tabs.executeScript(tabId, {file: "code.js"}, function(){
				chrome.tabs.executeScript(tabId, {code:'clicked(false);'});
			});
		});	
    }
});

/**
 * Code to get information about UI change
 * TASK: Report it to all open tabs as well
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  	if (typeof request.signature != 'undefined'
  		&& (request.signature == 'cryptofcc'
  			|| request.signature == 'cryptofcc40')) {
  		// @todo - remove the older signature - ^^

  		//-- inform this to others
  		// -- pass these info to all active tabs
		chrome.tabs.query({}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
			    chrome.tabs.sendMessage(tabs[i].id, request);
			}
		});
  		sendResponse({code: 200});
  	} else {
  		sendResponse({code: 403});
  	}     
 });