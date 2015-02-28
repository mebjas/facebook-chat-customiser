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
		bg: 'rgba(0, 128, 192, 0.75)'
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
		font: 'Calibri',
		bold: false,
		italics: false
	},
	message_s: {
		color: 'black',
		background: ['#c7defe', '#e7f1fe'],
		fontsize: 12,
		font: 'Calibri',
		bold: false,
		italics: false
	},
	height: 500,
	isInpageEnabled: true,
	signature: 'cryptofcc',
	timestamp: 0
};

default_property = property;

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

		$("#_font").val(property.message_s.font);
		$("#_fontsize").val(property.message_s.fontsize);
		$("#_fontcolor").val(property.message_s.color);

		$("#examplefont").css('font-family', property.message_r.font)
							.css('font-size', property.message_r.fontsize +'px')
							.css('color', property.message_r.color);
		$("#examplefont").css("background-image", "-webkit-linear-gradient(bottom, " +property.message_r.background[0] +", " +property.message_r.background[1] +")");

		// Set bold and italics
		if (property.message_r.bold) {
			$("#examplefont").css("font-weight", "bold");
			$("#msg_r_b").attr("state", "true");
			$("#msg_r_b").addClass("b_but_active");
		} else {
			$("#examplefont").css("font-weight", "none");
			$("#msg_r_b").attr("state", "false");
			$("#msg_r_b").removeClass("b_but_active");
		}

		if (property.message_r.italics) {
			$("#examplefont").css("font-style", "italic");
			$("#msg_r_i").attr("state", "true");
			$("#msg_r_i").addClass("b_but_active");
		} else {
			$("#examplefont").css("font-style", "none");
			$("#msg_r_i").attr("state", "false");
			$("#msg_r_i").removeClass("b_but_active");
		}
		$("#msg_r_1").val(property.message_r.background[0]);
		$("#msg_r_2").val(property.message_r.background[1]);


		// --------- message_s object --------------------------------------
		$("#_examplefont").css('font-family', property.message_s.font)
							.css('font-size', property.message_s.fontsize +'px')
							.css('color', property.message_s.color);

		$("#_examplefont").css("background-image", "-webkit-linear-gradient(bottom, " +property.message_s.background[0] +", " +property.message_s.background[1] +")");
		// Set bold and italics
		if (property.message_s.bold) {
			$("#_examplefont").css("font-weight", "bold");
			$("#msg_s_b").attr("state", "true");
			$("#msg_s_b").addClass("b_but_active");
		} else {
			$("#_examplefont").css("font-weight", "none");
			$("#msg_s_b").attr("state", "false");
			$("#msg_s_b").removeClass("b_but_active");
		}

		if (property.message_s.italics) {
			$("#_examplefont").css("font-style", "italic");
			$("#msg_s_i").attr("state", "true");
			$("#msg_s_i").addClass("b_but_active");
		} else {
			$("#_examplefont").css("font-style", "none");
			$("#msg_s_i").attr("state", "false");
			$("#msg_s_i").removeClass("b_but_active");
		}

		$("#msg_s_1").val(property.message_s.background[0]);
		$("#msg_s_2").val(property.message_s.background[1]);


		$("#op_titlebar").val(property.titlebar.opacity);
		$("#value_op_titlebar").html(property.titlebar.opacity +'%');
		
		$("#op_background").val(property.body.opacity);
		$("#value_op_background").html(property.body.opacity +'%');
		
		$("#color_background").val(property.body.background);
		$("#color_titlebar").val(property.titlebar.background);
		$("#color_titlebar_text").val(property.titlebar.color);

		document.getElementById('isDPCircular').checked = property.message_r.isDPCircular;
		if (property.message_r.isDPCircular) {
			$("#examplepic").css("border-radius","18px");
		} else {
			$("#examplepic").css("border-radius","none");
		}

		document.getElementById('isInpageEnabled').checked = property.isInpageEnabled;

		// Update values for other themes as well
		classy_property.count = property.count;
		classy_property.timestamp = property.timestamp;
		classy_property.isfirstTime = property.isfirstTime;
		classy_property.isInpageEnabled = property.isInpageEnabled;

		funky_property.count = property.count;
		funky_property.timestamp = property.timestamp;
		funky_property.isfirstTime = property.isfirstTime;
		funky_property.isInpageEnabled = property.isInpageEnabled;

		default_property.count = property.count;
		default_property.timestamp = property.timestamp;
		default_property.isfirstTime = property.isfirstTime;
		default_property.isInpageEnabled = property.isInpageEnabled;
	},

	_verify_json: function(jobj) {
		return (typeof jobj.isfirstTime == "boolean"
			&& typeof jobj.count == "number"
			&& typeof jobj.maxheight == "number"
			&& typeof jobj.titlebar.color == "string"
			&& typeof jobj.titlebar.background == "string"
			&& ( typeof jobj.titlebar.opacity == "number" || typeof jobj.titlebar.opacity == "string" )
			&& typeof jobj.titlebar.bg == "string"
			&& typeof jobj.body.background == "string"
			&& (typeof jobj.body.opacity == "number" || typeof jobj.body.opacity == "string")
			&& typeof jobj.body.bg == "string"
			&& typeof jobj.body.default.background == "string"
			&& (typeof jobj.body.default.opacity == "number" || typeof jobj.body.default.opacity == "string")
			&& typeof jobj.message_r.color == "string"
			&& typeof jobj.message_r.background[0] == "string"
			&& typeof jobj.message_r.background[1] == "string"
			&& typeof jobj.message_r.isDPCircular == "boolean"
			&& typeof jobj.message_r.bold == "boolean"
			&& typeof jobj.message_r.italics == "boolean"
			&& (typeof jobj.message_r.fontsize == "number" || typeof jobj.message_r.fontsize == "string")
			&& typeof jobj.message_r.font == "string"
			&& typeof jobj.message_s.color == "string"
			&& typeof jobj.message_s.background[0] == "string"
			&& typeof jobj.message_s.background[1] == "string"
			&& (typeof jobj.message_s.fontsize == "number" || typeof jobj.message_s.fontsize == "string")
			&& typeof jobj.message_s.font == "string"
			&& typeof jobj.message_s.bold == "boolean"
			&& typeof jobj.message_s.italics == "boolean"
			&& (typeof jobj.height == "number" || typeof jobj.height == "string")
			&& typeof jobj.isInpageEnabled == "boolean"
			&& typeof jobj.signature == "string"
			&& (typeof jobj.timestamp == "number" || typeof jobj.height == "string")
			);
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

			current_property = property;
			fcc._update_theme_view(current_property, 0);

			/**
			 * for reloading the page when extension runs for the first time
			 */
			if( property.count == 1 ) {
				property.isFirsttime = 'NO';
				fcc._setProperties();
				chrome.tabs.executeScript( { code: "location.reload();"});
			}
		});

		// Set theme view
		fcc._update_theme_view(classy_property, 1);
		fcc._update_theme_view(funky_property, 2);
		fcc._update_theme_view(default_property, 3);
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

// For themes
fcc._update_theme_view = function(obj, id) {
	$(".__theme_view").eq(id).html("");
	for(i = 0; i < 8; i++) {
		$(".__theme_view").eq(id).append("<span></span>");
	}
	$(".__theme_view").eq(id).children("span").eq(0).css("background", obj.titlebar.bg);
	$(".__theme_view").eq(id).children("span").eq(1).css("background", obj.titlebar.color);
	$(".__theme_view").eq(id).children("span").eq(2).css("background", obj.body.bg);
	$(".__theme_view").eq(id).children("span").eq(3).css("background", "-webkit-linear-gradient(bottom, " +obj.message_r.background[0] +", " +obj.message_r.background[1] +")");
	$(".__theme_view").eq(id).children("span").eq(4).css("background", obj.message_r.color);
	$(".__theme_view").eq(id).children("span").eq(5).css("background", "-webkit-linear-gradient(bottom, " +obj.message_s.background[0] +", " +obj.message_s.background[1] +")");
	$(".__theme_view").eq(id).children("span").eq(6).css("background", obj.message_s.color);
}


// init the process
fcc._init();
	
function applyChanges() {
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

	current_property = property;
	fcc._update_theme_view(current_property, 0);
	$(".s.__themes .s_section .option").eq(0).click();
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

	$("#_theme_import_button").on('click', function() {
		$("#_theme_import_status").html("");
		$("#_theme_import_status").removeClass("error").removeClass("success");

		var json_string = $("#_theme_import textarea").val().trim();
		if (!json_string.length) {
			$("#_theme_import_status").html("Enter the theme code first!");
			$("#_theme_import_status").removeClass("success").addClass("error");
			return;
		} else {
			var jobj;
			try {
				jobj = JSON.parse(json_string);
			} catch(err) {
				$("#_theme_import_status").html("invalid theme file!");
				$("#_theme_import_status").removeClass("success").addClass("error");
				return;
			}
			if (fcc._verify_json(jobj)) {
				property = jobj;
				fcc._setTitleBarProperties();
				fcc._setBackgroundProperties();
				fcc._resetUI();
				$("#_theme_import_status").html("theme applied, click apply to set!");
				$("#_theme_import_status").removeClass("error").addClass("success");
			} else {
				$("#_theme_import_status").html("incorrect theme file!");
				$("#_theme_import_status").removeClass("success").addClass("error");
			}
		}
	});

	$("#_theme_export textarea").on('click', function() {$(this).select();});
	$("#_theme_export_button").on('click', function() {
		var json_string = JSON.stringify(property);
		$("#_theme_export textarea").val(json_string);
		$("#_theme_export").slideDown();
		$("#_theme_export_status").html("copy this theme code!");
		$("#_theme_export_status").removeClass("error").addClass("success");
	});

	$(".s.__themes .s_section .option").on('click', function() {
		$(".s.__themes .s_section .option").attr("checked", "false");
		var new_selection = parseInt($(this).attr("val"));
		// Change the theme

		if (new_selection == 0) {
			current_property.timestamp = property.timestamp;
			property = current_property;
			fcc._setTitleBarProperties();
			fcc._setBackgroundProperties();
			fcc._resetUI();
		} else if (new_selection == 1) {
			classy_property.timestamp = property.timestamp;
			property = classy_property;
			fcc._setTitleBarProperties();
			fcc._setBackgroundProperties();
			fcc._resetUI();
		} else if (new_selection == 2) {
			funky_property.timestamp = property.timestamp;
			property = funky_property;
			fcc._setTitleBarProperties();
			fcc._setBackgroundProperties();
			fcc._resetUI();
		} else if (new_selection == 3) {
			default_property.timestamp = property.timestamp;
			property = default_property;
			fcc._setTitleBarProperties();
			fcc._setBackgroundProperties();
			fcc._resetUI();
		}

		$(".s.__themes .s_section .option.selected").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#_theme_export_button_close").on('click', function() {
		$("#_theme_export:visible").slideUp();
	});

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

	$("#_font").change(function(){
		property.message_s.font = $(this).val();
		fcc._resetUI();
	});
	$("#_fontsize").change(function(){
		property.message_s.fontsize = $(this).val();
		fcc._resetUI();
	});
	$("#_fontcolor").change(function(){
		property.message_s.color = $(this).val();
		fcc._resetUI();
	});
	$("#msg_s_1").change(function() {
		property.message_s.background[0] = $(this).val();
		fcc._resetUI();
	});
	$("#msg_s_2").change(function() {
		property.message_s.background[1] = $(this).val();
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

	// -- bold italics change object
	$("#msg_r_b").on('click', function() {
		var state = $(this).attr("state");
		if (state == "false") {
			$(this).attr("state", "true");
			property.message_r.bold = true;
		} else {
			$(this).attr("state", "false");
			property.message_r.bold = false;
		}
		fcc._resetUI();
	});
	$("#msg_r_i").on('click', function() {
		var state = $(this).attr("state");
		if (state == "false") {
			$(this).attr("state", "true");
			property.message_r.italics = true;
		} else {
			$(this).attr("state", "false");
			property.message_r.italics = false;
		}
		fcc._resetUI();
	});
	$("#msg_s_b").on('click', function() {
		var state = $(this).attr("state");
		if (state == "false") {
			$(this).attr("state", "true");
			property.message_s.bold = true;
		} else {
			$(this).attr("state", "false");
			property.message_s.bold = false;
		}
		fcc._resetUI();
	});
	$("#msg_s_i").on('click', function() {
		var state = $(this).attr("state");
		if (state == "false") {
			$(this).attr("state", "true");
			property.message_s.italics = true;
		} else {
			$(this).attr("state", "false");
			property.message_s.italics = false;
		}
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