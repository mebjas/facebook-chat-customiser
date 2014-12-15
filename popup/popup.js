/**
 * pop.js script
 * Written by minhaz aka hector09 (or mebjas) <minhazav@gmail.com>
 */

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
	 * Sets properties -> chromeStorage
	 * @param: void
	 * @return: void
	 */
	_setProperties: function() {
		chrome.storage.local.set(property, function() {
			console.log('chrome property set!!');
			console.log(property);
		})
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
	},

	/**
	 * function that initialises the fcc
	 * @param: void
	 * @return: void
	 */
	_init: function() {
		chrome.storage.local.get(function(obj) {
			if (typeof obj.count != "undefined") {
				property = obj;
			}

			fcc._resetUI();			// Modify UI accodingly
			property.count++;
			fcc._setProperties();	// Refresh properties to localStorage
		});
		
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


/**
 * for reloading the page when extension runs for the first time
 */
if( property.count == 1 ) {
	property.isFirsttime = 'NO';
	fcc._setProperties();
	chrome.tabs.executeScript( { code: "document.location.reload();"});
}

	
function applyChanges()
{
	$("#loader").fadeIn();
	// -- set properties to chromeStorage
	property.timestamp = fcc._getTimeStamp();
	fcc._setProperties();

	// -- pass these info to all active tabs
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
		    chrome.tabs.sendMessage(tabs[i].id, property);
		}
	});
	chrome.tabs.executeScript( { code: "clicked(true);"});
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
		// Calculate titlebar and background value
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

	$('.sharebutton').on('click', function() {
		var cat = $(this).attr('data');
		if (cat == 'fb') {
			chrome.tabs.create({ url: "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fcistoner.org%2Fprojects%2Ffacebook-chat-customiser%2F" });
		} else if (cat == 'tw') {
			chrome.tabs.create({ url: "https://twitter.com/home?status=Customise+facebook+chatbox+on+the+go%2C+try+facebok+chat+customiser+http%3A%2F%2Fcistoner.org%2Fprojects%2Ffacebook-chat-customiser%2F"});
		} else if (cat == 'g+') {
			chrome.tabs.create({ url: "https://plus.google.com/share?url=cistoner.org/projects/facebook-chat-customiser/"});
		}
	});
});