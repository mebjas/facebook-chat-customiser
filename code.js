/**
 * @injected-script: this script will be injected to facebook page by background script
 * these scripts will be executed when page load is completeds
 * Written by minhaz aka hector09 (or mebjas) <minhazav@gmail.com>
 */


// Default properties
var property = {
	isfirstTime: true,
	count: 0,
	maxheight: 550,
	titlebar: {
		color: 'white',
		background: '#0080c0',
		opacity: 75,
		bg: ''
	},
	body: {
		background: '#edeff4',
		opacity: 100,
		bg: '#edeff4',
		default: {
			background: '#edeff4',
			opacity: 100
		}
	},
	message_r: {
		color: 'black',
		background: ['#FFFFFF', '#F9F9F9'],
		isDPCircular: true,
		fontsize: 12,
		font: 'Calibri'
	},
	height: 500,
	isInpageEnabled: true,
	signature: 'cryptofcc',
	timestamp: 0
};


var flags = {
	hasMenuBeenSet: false
};

//===========================================================
// -- request the extension for the current properties
//===========================================================

/** adding event listner to right-chat box */
$(document).ready(function(){
	$(document).on('DOMNodeInserted','.fbDockChatTabFlyout', function(event) {
		clicked();
	});
});

//===========================================================
// Code to change the facebook logo 
//===========================================================
//document.getElementById('pageLogo').innerHTML = '<img onclick="window.location.href=\'\'" src="https://lh4.googleusercontent.com/ZcayaK7FB8XKioDmF4WG0Agn_dY2U-D2TJAPOrdZ6jvFy-qrE3tvhnK-eNsZ62_KFaqcpkQhSDs=s128-h128-e365" title="powered by Cistoner Facebook Chat Customiser" width="40px">';

//===========================================================
// APIS
//===========================================================
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var fcc = {
	_getTimeStamp: function(){
		return new Date().getTime();
	},
	// -- Level - 2, custom APIs starts here
	_setTitleBarProperties: function() {
		var hex = hexToRgb(property.titlebar.background);
		property.titlebar.bg = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
										+(property.titlebar.opacity/100) +')';
	},

	_setBackgroundProperties: function() {
		var hex = hexToRgb(property.body.background);
		property.body.bg = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
										+(property.body.opacity /100) +')';
	},
	_getls: function(key) {
		if (localStorage[key])
			return localStorage[key];
		return false;
	},

	/**
	 * -- send this setting to extension
	 * -- extension should send this to all other tabs
	 * -- extension should send ack
	 */
	_updateSettings: function(clickTrue) {
		property.timestamp = fcc._getTimeStamp();

		localStorage['fcc_props'] = JSON.stringify(property);
		// -- reflect changes in UI
		if (clickTrue) clicked(true);
		else clicked(false);
	},
	/**
	 * Function to set properties as set to the inpage menu
	 */
	_resetUI: function() {
		$("#fcc_height").val(property.height);
		$("#fcc_topcolor").val(property.titlebar.background);
		$("#fcc_txtcolor").val(property.message_r.color);
		$("#fcc_bg_trans").val(property.body.opacity);
		$("#fcc_font").val(property.message_r.font);
		$("#fcc_fontsize").val(property.message_r.fontsize);
	}
};


//============APIS ENDS HERE=================================

/**
 * code to add fcc menu item
 */
 $(document).ready(function(){
 	if(document.getElementsByClassName('fcc_toolpabel').length == 0){
 		if (property.isInpageEnabled) {
 			
			var url = chrome.extension.getURL("inject/inject-menu.htm");
			var xhrObj = new XMLHttpRequest();
			xhrObj.open("GET",url);
			xhrObj.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var menu = this.responseText;
					var targetObj = document.getElementById('userNavigation');
					var previousObj = targetObj.getElementsByClassName('menuDivider')[0];
					var wrapper= document.createElement('div');
					wrapper.innerHTML= menu;
					var taregtDiv = wrapper.firstChild;
					if (!flags.hasMenuBeenSet) {
						flags.hasMenuBeenSet = true;
						previousObj.parentNode.insertBefore(wrapper, previousObj.nextSibling);
						// -- now menu has been loaded, check the properties in localStorage
						// and reflect it to UI
						fcc._resetUI();
					}

					// -- Add event listener to new menu
					$("#fcc_height").change(function() {
						property.height = $(this).val();
						// -- send this info to all
						fcc._updateSettings(true);
					});

					$("#fcc_topcolor").change(function() {
						property.titlebar.background = $(this).val();
						// -- calculate the top color
						fcc._setTitleBarProperties();
						fcc._updateSettings(true);
					});
					$("#fcc_txtcolor").change(function() {
						property.message_r.color = $(this).val();
						fcc._updateSettings(true);
					});
					$("#fcc_bg_trans").change(function(){
						property.body.opacity = $(this).val();
						fcc._setBackgroundProperties();
						fcc._updateSettings(true);
					});
					$("#fcc_font").change(function(){
						property.message_r.font = $(this).val();
						fcc._updateSettings(true);
					});
					$("#fcc_fontsize").change(function(){
						property.message_r.fontsize = parseInt($(this).val());
						fcc._updateSettings(true);
					});
				}
			};

			xhrObj.send();
		}	
	}
});



