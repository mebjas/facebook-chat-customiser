/**
 * chrome extension main js code that do all the tasks
 * @content-script for chrome extension
 * Written by minhaz aka hector09 <minhazav@gmail.com>
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
		$("#fcc_topcolor").val(property.titlebar.background);
		$("#fcc_txtcolor").val(property.message_r.color);
		$("#fcc_bg_trans").val(property.body.opacity);
		$("#fcc_font").val(property.message_r.font);
		$("#fcc_fontsize").val(property.message_r.fontsize);
	}
};


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
		property = JSON.parse(value);
		chrome.storage.local.set(property);
		// clear the localStorage
		localStorage.removeItem('fcc_props');
	}

	chrome.storage.local.get(function(obj) {
		if (typeof obj.count != "undefined")
			property = obj;

		/** applying height **/
		$('.fbDockChatTabFlyout').css('height', property.height +'px');

		var height = new Array();
		var attachmentBoxHeight = new Array();
		var innerHeaders = new Array();

		var chatboxes = document.getElementsByClassName('fbDockChatTabFlyout');
		for(i = 0 ; i < chatboxes.length; i++) {
			height[i] = chatboxes[i].getElementsByClassName('_552h')[0].offsetHeight;
			attachmentBoxHeight[i] = chatboxes[i].getElementsByClassName('fbNubFlyoutAttachments')[0].offsetHeight;
			innerHeaders[i] = chatboxes[i].getElementsByClassName('fbNubFlyoutHeader')[0].offsetHeight;
		}
		var textObj = document.getElementsByClassName('_552h');

		var countHeight = 0;
		var innerObj = document.getElementsByClassName('fbNubFlyoutBody');
		for (i = 1; i < (innerObj.length - 1); i++) {
			innerObj[i].style.height = (property.height - 30 - parseInt(height[i-1]) - parseInt(attachmentBoxHeight[i-1])) - parseInt(innerHeaders[i-1]) + 'px';

			if (property.body.bg !== '') {
				innerObj[i].style.background = property.body.bg;
			}
		}

		$('.fbNubFlyoutOuter').css('height', property.height + 'px');
		
		/** applying color **/
		$(".fbNubFlyoutTitlebar").css("background", property.titlebar.bg);
		$(".fbNubFlyoutTitlebar").css("border", "1px solid " +property.titlebar.bg);
		$(".titlebarText").css("color", property.titlebar.color);
		
		$("._1nc7 ._5w1r").css("color", property.message_r.color);
		$("._1nc7 ._5w1r").css("font-size", property.message_r.fontsize +"px");
		$("._1nc7 ._5w1r").css("font-family", property.message_r.font);
		$("._1nc7 ._5w1r").css("background-image", "-webkit-linear-gradient(bottom, " +property.message_r.background[0] +", " +property.message_r.background[1] +")");

		// for sender
		$("._1nc6 ._5w1r").css("color", property.message_s.color);
		$("._1nc6 ._5w1r").css("font-size", property.message_s.fontsize +"px");
		$("._1nc6 ._5w1r").css("font-family", property.message_s.font);
		$("._1nc6 ._5w1r").css("background-image", "-webkit-linear-gradient(bottom, " +property.message_s.background[0] +", " +property.message_s.background[1] +")");


		// to remove <==== in box
		$("._5wdf").addClass("__fcc_pd");
		$("body").append("<style type='text/css'>.__fcc_pd:after, .__fcc_pd:before {width: 0px;}._5ys_:after{background-image: none}</style>");

		/**
		 * to make rounded dp
		 */
		if (property.isDPCircular) {
			$("._5ys_ img").css("border-radius","18px");
			// to remove the border image behind the dp in chatbox
		} else {
			$("._5ys_ img").css("border-radius","none");
		}

		// Set the back background to zero
		$(".fbNubFlyoutInner").css("background-color", "rgba(0,0,0,0)");

		// Make changes to inline menu
		fcc._resetUI();

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
		&& typeof prop.titlebar != 'undefined'
		&& typeof prop.body != 'undefined')
			return true;
	return false;
}

// Recieve the UI change broadcast information
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
  		fcc._resetUI();
  		sendResponse({code: 200});
  	} else {
  		sendResponse({code: 403});
  	}     
 });


