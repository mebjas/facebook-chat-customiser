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

		$("#font").val(property.message_r.font);
		$("#fontsize").val(property.message_r.fontsize);
		$("#fontcolor").val(property.message_r.color);

		$("#examplefont").css('font-family', property.message_r.font)
							.css('font-size', property.message_r.fontsize +'px')
							.css('color', property.message_r.color);
		$("#examplefont").css("background-image", "-webkit-linear-gradient(bottom, " +property.message_r.background[0] +", " +property.message_r.background[1] +")");

		$("#op_titlebar").val(property.titlebar.opacity);
		$("#value_op_titlebar").html(property.titlebar.opacity +'%');
		
		$("#op_background").val(property.body.opacity);
		$("#value_op_background").html(property.body.opacity +'%');
		
		$("#color_background").val(property.body.background);
		$("#color_titlebar").val(property.titlebar.background);
		$("#color_titlebar_text").val(property.titlebar.color);

		// -- set the titlebar and background demo
		// @todo - change this to demo titlebar
		// $("#demo_titlebar").css('background-color', property.titlebar);

		document.getElementById('isDPCircular').checked = property.message_r.isDPCircular;
		if (property.message_r.isDPCircular) {
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
			fcc._setTitleBarProperties();
			fcc._setProperties();	// Refresh properties to localStorage
		});
		
	}
};

//==========================================================================
// Main API ends here
//==========================================================================

// -- Level - 2, custom APIs starts here
fcc._setTitleBarProperties = function() {
	var hex = hexToRgb(property.titlebar.background);
	property.titlebar.bg = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.titlebar.opacity/100) +')';
	// Update demo for this
	$("#exampletitlebar").css("background-color", property.titlebar.bg)
				.css("color", property.titlebar.color);
};

fcc._setBackgroundProperties = function() {
	var hex = hexToRgb(property.body.background);
	property.body.bg = 'rgba(' +hex.r +',' +hex.g +',' +hex.b +',' 
									+(property.body.opacity/100) +')';
	$("#examplebody").css("background-color", property.body.bg);
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
	// Provide functionality to UI menu panels
	$(".s .s_header").on('click', function() {
		var astatus = $(this).parent(".s").attr("class");
		if (typeof astatus != "undefined" && astatus.indexOf('active') != -1) {
			$(this).parent(".s").removeClass("active");
			return false;
		} else {
			$(".s.active").removeClass("active");
			$(this).parent(".s").addClass("active");
		}
	});
	$(".s_demo").prepend("<span class='demotext'>demo</span>");
	$(".message_s .s_section .s_demo .demotext").css("width", "32px").css("left", "-10px");
	// ^^ Placing DEMO in case of message sent by me demo

	// -- pick up random names from my friends name and put it in chat customiser
	var frnames = ['minhaz', 'abhinav', 'ashutosh', 'ayush', 'bhavuk', 'aditya', 'aditi', 'arushi', 'dhruv', 'hitesh', 'arshad', 'sharvari', 'richa', 'nida', 'divyanshu'];
	var r = (Math.round(Math.random()*1000) % frnames.length);
	$("#exampletitlebar").html(frnames[r]);

	// -- main submit button
	$("#apply").click(function() {
		applyChanges();
	});

	// -- titlebar transparency
	$("#color_titlebar").change(function(){
		property.titlebar.background = $(this).val();
		// Calculate titlebar and background value
		fcc._setTitleBarProperties();
		fcc._resetUI();
	});

	$("#color_titlebar_text").change(function() {
		property.titlebar.color = $(this).val();
		// Calculate titlebar and background value
		fcc._setTitleBarProperties();
		fcc._resetUI();
	});

	// -- titlebar transparency
	$("#op_titlebar").change(function(){
		property.titlebar.opacity = $(this).val();
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
		property.body.opacity = $(this).val();
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- titlebar transparency
	$("#color_background").change(function(){
		property.body.background = $(this).val();
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- click on reset button
	$("#resetbgcolor").click(function() {
		property.body.opacity = property.body.default.opacity;
		property.body.background = property.body.default.background;
		fcc._setBackgroundProperties();
		fcc._resetUI();
	});

	// -- font
	$("#font").change(function(){
		property.message_r.font = $(this).val();
		fcc._resetUI();
	});
	$("#fontsize").change(function(){
		property.message_r.fontsize = $(this).val();
		fcc._resetUI();
	});
	$("#fontcolor").change(function(){
		property.message_r.color = $(this).val();
		fcc._resetUI();
	});
	$("#isDPCircular").click(function(){
		if (document.getElementById('isDPCircular').checked) {
			property.message_r.isDPCircular = true;
		} else {
			property.message_r.isDPCircular = false;
		}

		fcc._resetUI();
	});
	$("#msg_r_1").change(function() {
		property.message_r.background[0] = $(this).val();
		fcc._resetUI();
	});
	$("#msg_r_2").change(function() {
		property.message_r.background[1] = $(this).val();
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