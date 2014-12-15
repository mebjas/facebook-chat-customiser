/**
 * chrome extension main js code that do all the tasks
 * written by minhaz aka hector09
 */

var freq = 300;
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var fcc = {
	_getls: function(key) {
		if (localStorage[key])
			return localStorage[key];
		return false;
	},
	/**
	 * Function to set properties as set to the inpage menu
	 */
	_resetUI: function() {
		$("#fcc_height").val(property.height);
		$("#fcc_topcolor").val(property.color_titlebar);
		$("#fcc_txtcolor").val(property.fontcolor);
		$("#fcc_bg_trans").val(property.op_background);
		$("#fcc_font").val(property.font);
		$("#fcc_fontsize").val(property.font);
	}
};

function chromeStorageTolocalStorage() {}
function localStorageToChromeStorage() {}
function updatePropertyFromChromeStorage() {}


//==================variables ends here ===============
// main function that draw all data
// @param: broadcase, bool -true if settings need to be broadcasted
function clicked(broadcast) {
	// Steps
	// 1. Check if there is some temporary property set in local Storage
	// 		1.1 YES - get the property, set it to chromeStorge, clear localStorage
	// 		1.2 NO - get property from chromeStorage if there else use default pro

	var value;
	if ((value = fcc._getls('fcc_props')) != false) {
		console.log('fcc props retrieved from localStorage');
		property = JSON.parse(value);
		console.log(property);
		chrome.storage.local.set(property);
		// clear the localStorage
		localStorage.removeItem('fcc_props');
	}

	chrome.storage.local.get(function(obj) {
		property = obj;
		console.log('property object retrieved!');
	
		/** applying height **/
		$('.fbDockChatTabFlyout').css('height', property.height +'px');
		var textObj = document.getElementsByClassName('_552m');
		var height = new Array();

		for (i=0 ; i < $('.fbDockChatTabFlyout').length; i++)	{
			height[i] = textObj[i].style.height;
		}
		var countHeight = 0;
		var innerObj = document.getElementsByClassName('fbNubFlyoutBody');
		for (i = 1; i < (innerObj.length - 1); i++) {
			innerObj[i].style.height = (property.height - 37 - parseInt(height[countHeight++])) + 'px';

			if (property.background !== '') {
				innerObj[i].style.background = property.background;
			}
		}

		$('.fbNubFlyoutOuter').css('height', property.height + 'px');

		for (i = 0; i < textObj.length; i++) {
			textObj[i].style.height = parseInt(height[i]);
		}
		
		/** applying color **/
		innerObj = document.getElementsByClassName('fbNubFlyoutTitlebar');
		for (i = 0; i < innerObj.length; i++) {
			innerObj[i].style.background = property.titlebar;
			innerObj[i].style.border = "1px solid " +property.titlebar;
		}
		
		innerObj = document.getElementsByClassName('_5yl5');
		$("._5w1r").css("color", property.fontcolor);
		$("._5w1r").css("font-size", property.fontsize +"px");
		$("._5w1r").css("font-family", property.font);


		/**
		 * to make rounded dp
		 */
		if (property.isDPCircular) {
			$("._5ys_ img").css("border-radius","18px");
			// to remove the border image behind the dp in chatbox
			$("body").append("<style type='text/css'>._5ys_::after{background-image: none}</style>")
		} else {
			$("._5ys_ img").css("border-radius","none");
		}

		$(".fbNubFlyoutInner").css('background','none');

		// --inform the new settings to the extension
		if (broadcast) {
			_informExtension(true);
		}
	});
}

function _informExtension(iterate){
	chrome.runtime.sendMessage(property, function(response) {
  		if (typeof response.code != 'undefined'
  			&& response.code == 200) {
  			// -- success
  		} else if(iterate) {
  			// if fails once, try again
  			_informExtension(false);
  		}
	});
}


function _isValidObject(prop) {
	if(typeof prop.isfirstTime != 'undefined'
		&& typeof prop.count != 'undefined'
		&& typeof prop.height != 'undefined'
		&& typeof prop.font != 'undefined'
		&& typeof prop.fontcolor != 'undefined'
		&& typeof prop.fontsize != 'undefined'
		&& typeof prop.op_titlebar != 'undefined'
		&& typeof prop.op_background != 'undefined'
		&& typeof prop.color_titlebar != 'undefined'
		&& typeof prop.color_background != 'undefined'
		&& typeof prop.titlebar != 'undefined'
		&& typeof prop.background != 'undefined')
			return true;
	return false;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (typeof request.signature != 'undefined'
  		&& request.signature == 'cryptofcc') {

  		if(typeof request.need != 'undefined') {
  			// -- means requesting resource
  			sendResponse(property);
  			return;
  		}
  		property = request;
  		fcc._updateSettings(false);
  		fcc._resetUI();
  		sendResponse({code: 200});
  	} else {
  		sendResponse({code: 403});
  	}     
 });

console.log('cs.js is executed ');


