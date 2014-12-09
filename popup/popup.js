/**
 * facebook chat extension version 2.0.1
 */
// @todo - remove the notifications
/**
 * Set of all properties that are used / set / or get
 */
var reloadRequired = false;

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

/**
 * Converts a hex value to rgb values
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
	
}
function _getDomain(url) {
	if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0)
		return document.domain;
	return /http(s)?:\/\/([^\/]+)/.exec(url)[2];
}

var fcc = {
	_getTimeStamp: function() {
		return new Date().getTime();
	},
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
	/**
	 * Sets properties -> localStorage
	 * @param: void
	 * @return: void
	 */
	_setProperties: function() {
		localStorage['isFirsttime'] = 'NO';
		localStorage['count'] = property.count;
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
		localStorage['timestamp'] = property.timestamp;

		// Set the values of titlebar and background
		localStorage['titlebar'] = property.titlebar;
		localStorage['background'] = property.background;
	},
	/**
	 * Resets the UI, according to new properties
	 * @param: void
	 * @return: void
	 */
	_resetUI: function () {
		$("#height").val(property.height);
		$("#value_height").html(property.height +'px');

		$("#font").val(property.font);
		$("#fontsize").val(property.fontsize);
		$("#fontcolor").val(property.fontcolor);
		$("#examplefont").css('font-family', property.font)
							.css('font-size', property.fontsize +'px')
							.css('color', property.fontcolor);

		$("#op_titlebar").val(property.op_titlebar);
		$("#value_op_titlebar").html(property.op_titlebar +'%');
		
		$("#op_background").val(property.op_background);
		$("#value_op_background").html(property.op_background +'%');
		
		$("#color_background").val(property.color_background);
		$("#color_titlebar").val(property.color_titlebar);

		// -- set the titlebar and background demo
		$("#demo_titlebar").css('background', property.titlebar);
		$("#demo_background").css('background', property.background);

		document.getElementById('isDPCircular').checked = property.isDPCircular;
		if (property.isDPCircular) {
			$("#examplepic").css("border-radius","18px");
		} else {
			$("#examplepic").css("border-radius","none");
		}

		document.getElementById('isInpageEnabled').checked = property.isInpageEnabled;

		//document.getElementById('isInpageEnabled').checked = property.isInpageEnabled;
	},
	/**
	 * function that initialises the fcc
	 * @param: void
	 * @return: void
	 */
	_init: function() {
		fcc._getProperties();	// Init the properties

		// -- check if any tab has more latest settings

		fcc._resetUI();			// Modify UI accodingly
		chrome.tabs.query({}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
			    chrome.tabs.sendMessage(tabs[i].id, {signature: property.signature, need: true}, function(response) {
			    	if (typeof response.signature !== undefined
			    		&& response.signature == property.signature
			    		&& ( response.timestamp > property.timestamp 
			    			|| (property.timestamp == 0 && response.timestamp != 0))) {
			    		property = response;
			    		fcc._setProperties();
			    		fcc._resetUI();
			    	}
			    });
			}
		});

		property.count = property.count + 1;
		if (property.count === 2)
			$("#supportmessage").fadeIn();

		fcc._setProperties();	// Refresh properties to localStorage
	}
};

//==========================================================================
// Main API ends here
//==========================================================================

// -- Level - 2, custom APIs starts here
fcc._setTitleBarProperties = function() {
	var hex = hexToRgb(property.color_titlebar);
	property.titlebar = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.op_titlebar/100) +')';
};

fcc._setBackgroundProperties = function() {
	var hex = hexToRgb(property.color_background);
	property.background = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.op_background/100) +')';
};



// init the process
fcc._init();

// for chrome notification
var notif = {
  type: "basic",
  title: "Facebook Chat Customiser says:",
  message: "Thankyou for installing Facebook Chat Customiser! We have made some awesome changes in fcc, which is now butter smooth and feature rich. We'd are very glad people are loving it. ",
  iconUrl: "./resources/icon.png"
}

/**
 * for displaying notification for the first time load and 
 * for maintaining count
 */
if( property.isFirsttime ) {
	property.isFirsttime = 'NO';
	property.count = 1;
	fcc._setProperties();

	chrome.notifications.create("notiffcc", notif, function getnotifid(id){});
	chrome.tabs.executeScript( { code: "document.location.reload();"});
}

	
function applyChanges()
{
	$("#loader").fadeIn();
	// -- set properties to ls
	property.timestamp = fcc._getTimeStamp();
	fcc._setProperties();

	// -- pass these info to all active tabs
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
		    chrome.tabs.sendMessage(tabs[i].id, property);
		}
	});
	// hide the loader icon
	$("#loader").fadeOut();

	if (reloadRequired) {
		chrome.tabs.executeScript( { code: 'location.reload();'});	
	}
}



//================================================================ 
// Code for adding event listeners to onchange event
//================================================================
$(document).ready(function() {
	// -- main submit button
	$("#apply").click(function() {
		applyChanges();
	});

	// -- fontcolor
	$("#fontcolor").change(function(){
		property.fontcolor = $(this).val();
		fcc._resetUI();
	});

	// -- titlebar transparency
	$("#color_titlebar").change(function(){
		property.color_titlebar = $(this).val();
		fcc._setTitleBarProperties();
		fcc._resetUI();
	});

	// -- titlebar transparency
	$("#op_titlebar").change(function(){
		property.op_titlebar = $(this).val();
		fcc._setTitleBarProperties();
		fcc._resetUI();
	});

	// -- height
	$("#height").change(function(){
		property.height = $(this).val();
		fcc._resetUI();
	});

	// -- background transparency
	$("#op_background").change(function(){
		property.op_background = $(this).val();
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- titlebar transparency
	$("#color_background").change(function(){
		property.color_background = $(this).val();
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- click on reset button
	$("#resetbgcolor").click(function() {
		property.op_background = property.default_op_background;
		property.color_background = property.default_color_background;
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- font
	$("#font").change(function(){
		property.font = $(this).val();
		fcc._resetUI();
	});
	$("#fontsize").change(function(){
		property.fontsize = $(this).val();
		fcc._resetUI();
	});
	$("#fontcolor").change(function(){
		property.fontcolor = $(this).val();
		fcc._resetUI();
	});
	$("#isDPCircular").click(function(){
		if (document.getElementById('isDPCircular').checked) {
			property.isDPCircular = true;
		} else {
			property.isDPCircular = false;
		}

		fcc._resetUI();
	});
	$("#isInpageEnabled").click(function(){
		if (document.getElementById('isInpageEnabled').checked) {
			property.isInpageEnabled = true;
		} else {
			property.isInpageEnabled = false;
		}
		reloadRequired = true;
		fcc._resetUI();
	});
	$("#iielabel,#cpilabel").click(function(){
		$(this).prev('input[type="checkbox"').click();
	});
});


//===========================================================
// -- Message recieving and broadcasting
//===========================================================
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log(sender);
  	if (_getDomain(sender.tab.url).indexOf('facebook') !== -1
  		&& typeof request.signature != 'undefined'
  		&& request.signature == 'cryptofcc') {
  		property = request;
  		fcc._setProperties();
  		fcc._resetUI();
  		//-- inform this to others
  		applyChanges();

  		sendResponse({code: 200});
  	} else {
  		sendResponse({code: 403});
  	}     
 });