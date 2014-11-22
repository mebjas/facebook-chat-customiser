/**
 * chrome extension main js code that do all the tasks
 * written by minhaz aka hector09
 */
 var property = {
	isfirstTime: true,
	count: 0,
	maxheight: 550,
	height: 500,
	font: 'Calibri',
	fontsize: 12,
	fontcolor: 'black',
	op_titlebar: 75,
	op_background: 100,
	color_titlebar: '#0080c0',
	color_background: '#edeff4',
	default_color_background: '#edeff4',
	default_op_background: 100,
	background: '',
	titlebar: '',
	isDPCircular: true,
	isInpageEnabled: true,
	signature: 'cryptofcc',
	timestamp: 0
};

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
	 * Gets properties <- localStorage
	 * Called on init
	 * @param: void
	 * @return: void
	 */
	_getProperties: function() {
		var value = '';

		if((value = fcc._getls('isFirsttime')) !== false)
			property.isFirsttime = false;
		if((value = fcc._getls('count')) !== false) {
			property.count = parseInt(value);
		}
		if ((value = fcc._getls('height')) !== false)
			property.height = parseInt(value);
		if ((value = fcc._getls('font')) !== false)
			property.font = value;
		if ((value = fcc._getls('fontsize')) !== false)
			property.fontsize = parseInt(value);
		if ((value = fcc._getls('fontcolor')) !== false)
			property.fontcolor = value;
		if ((value = fcc._getls('op_titlebar')) !== false)
			property.op_titlebar = value;
		if ((value = fcc._getls('op_background')) !== false)
			property.op_background = value;
		if ((value = fcc._getls('color_titlebar')) !== false)
			property.color_titlebar = value;
		if ((value = fcc._getls('color_background')) !== false)
			property.color_background = value;
		if ((value = fcc._getls('isDPCircular')) !== false) {
			property.isDPCircular = (value.length > 0) ? true : false;
		} else {
			property.isDPCircular = false;
		}
		if ((value = fcc._getls('isInpageEnabled')) !== false) {
			property.isInpageEnabled = (value.length > 0) ? true : false;
		} else {
			property.isInpageEnabled = false;
		}

		// Calculate titlebar and background value
		var hex = hexToRgb(property.color_titlebar);
		property.titlebar = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.op_titlebar/100) +')';
		// -- background
		hex = hexToRgb(property.color_background);
		property.background = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.op_background/100) +')';	

		if ((value = fcc._getls('timestamp')) !== false)
			property.timestamp = parseInt(value);	
	},
	_updateSettings: function() {
		localStorage['height'] = property.height;
		localStorage['font'] = property.font;
		localStorage['fontsize'] = property.fontsize;
		localStorage['fontcolor'] = property.fontcolor;
		localStorage['op_titlebar'] = property.op_titlebar;
		localStorage['op_background'] = property.op_background;
		localStorage['color_titlebar'] = property.color_titlebar;
		localStorage['color_background'] = property.color_background;
		localStorage['isDPCircular'] = (property.isDPCircular) ? 'true' : '';
		localStorage['isInpageEnabled'] = (property.isInpageEnabled) ? 'true' : '';
		// Set the values of titlebar and background
		localStorage['titlebar'] = property.titlebar;
		localStorage['background'] = property.background;
		localStorage['timestamp'] = property.timestamp;

		// -- reflect changes in UI
		clicked(false);
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




//==================variables ends here ===============
// main function that draw all data
// @param: broadcase, bool -true if settings need to be broadcasted
function clicked(broadcast)
{
	fcc._getProperties();	// Get Properties 
	
	/** applying height **/
	var obj = document.getElementsByClassName('fbDockChatTabFlyout');
	var textObj = document.getElementsByClassName('_552m');
	var height = new Array();

	for (i=0 ; i < obj.length; i++)	{
		height[i] = textObj[i].style.height;
		obj[i].style.height = property.height +'px';
	}

	var countHeight = 0;
	var innerObj = document.getElementsByClassName('fbNubFlyoutBody');

	for (i = 1; i < (innerObj.length - 1); i++) {
		innerObj[i].style.height = (property.height - 37 - parseInt(height[countHeight++])) + 'px';

		if (property.background !== '') {
			innerObj[i].style.background = property.background;
		}
	}

	innerObj = document.getElementsByClassName('fbNubFlyoutOuter');
	for (i = 0; i < innerObj.length; i++) {
		innerObj[i].style.height = property.height + 'px';
	}

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
		$("._5ys_").css("background-image","none");
	} else {
		$("._5ys_ img").css("border-radius","none");
	}

	$(".fbNubFlyoutInner").css('background','none');

	// --inform the new settings to the extension
	if (broadcast) {
		_informExtension(true);
	}
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


