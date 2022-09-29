/**
 * Determine if variable an object
 * @param {any} input object
 * @returns {bool} Returns true if object
 */
function isObject(input) {
	return typeof input === 'object' && input !== null;
}

/**
 * Determine if variable a jquery object
 * @param {object} input object
 * @returns {bool} Returns true if jQuery object
 */
function isJQueryObject(input) {
	return input instanceof jQuery;
}

/**
 * Determine if date passed is a date object
 * @param {any} date
 */
function isDateObject(date) {
	return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

/**
 * Determine if variable not set, undefined, null, or an empty jquery object
 * @param {any} input object
 * @returns {bool} Returns true if null
 */
function isNull(input) {
	return typeof input === undefined || input === undefined || input === null || (isJQueryObject(input) && input.length === 0);
}

/**
 * Determine if variable not set, undefined, null, empty jquery object, or empty string
 * @param {any} input object
 * @returns {bool} Returns true if null or empty
 */
function isNullOrEmpty(input) {
	return isNull(input)
		|| (typeof input === 'string' && input === "")
		|| (typeof input === 'object' && Object.keys(input).length === 0);
}

/**
 * Determine if two strings are equal
 * @param {string} input1 string 
 * @param {string} input2 string
 * @param {bool} isIgnoreCase if true, will ignore case when compare
 * @returns {bool} Returns true if equal
 */
function isEqual(input1, input2, isIgnoreCase) {
	return (isNullOrEmpty(isIgnoreCase) || isIgnoreCase === false)
		? input1 === input2
		: (input1 + "").toUpperCase() === (input2 + "").toUpperCase();
}

function isEqualIgnoreCase(input1, input2) {
	return isEqual(input1, input2, true);
}

/**
 * Determine if substring inside a string or array
 * @param {any} input string or string array to search in
 * @param {string} substring string to search for
 * @param {bool} isIgnoreCase if true, will ignore case when compare
 * @returns {bool} Returns true if contained
 */
function contains(input, substring, isIgnoreCase) {
	if (isNull(input)) { return false; }
	if (isNullOrEmpty(isIgnoreCase)) { isIgnoreCase = false; }

	if (Array.isArray(input)) {

		// array
		for (var i = 0; i < input.length; i++) {
			if (substring === null && input[i] === null) {
				return true;
			}
			else if (isIgnoreCase && input[i].toUpperCase() === substring.toUpperCase()) {
				return true;
			}
			else if (!isIgnoreCase && input[i] === substring) {
				return true;
			}
		}
		return false;
	}
	else if (isObject(input)) {

		// object
		console.error("contains() function will not work for an object");
		return false;
	}
	else {

		// string
		return isIgnoreCase
			? input.toUpperCase().indexOf(substring.toUpperCase()) !== -1
			: input.indexOf(substring) !== -1;
	}
}

/**
 * Is passed value a string?
 * @param {any} input
 */
function isString(input) {
	return typeof input === 'string' || input instanceof String;
}

function startsWith(stringToSearchIn, substring, isIgnoreCase) {
	if (isNullOrEmpty(substring)) {
		return true;
	}
	if (isNullOrEmpty(stringToSearchIn)) {
		return false;
	}
	if (isIgnoreCase) {
		substring = substring.toLowerCase();
		stringToSearchIn = stringToSearchIn.toLowerCase();
	}
	return stringToSearchIn.lastIndexOf(substring, 0) === 0
}

/**
 * Convert string to nullable boolean
 * @param {string} input string to convert
 * @returns {bool} nullable boolean
 */
function convertToBool(input) {
	if (isNullOrEmpty(input)) { return null; }
	if (input === true || input === 1 || input === "1" || isEqualIgnoreCase(input, "true")) {
		return true;
	}
	if (input === false || input === 0 || input === "0" || isEqualIgnoreCase(input, "false")) {
		return false;
	}
	return null;
}

function convertToInt(input) {
	if (isNullOrEmpty(input)) { return null; }
	var o = parseInt(input.replace("$", "").replace(/,/g, ""), 10);
	return isNaN(o) ? null : o;
}

function convertToFloat(input) {
	if (isNullOrEmpty(input)) { return null; }
	var o = parseFloat(input.replace("$", "").replace(/,/g, ""));
	return isNaN(o) ? null : o;
}

/**
 * Convert number to currency formatted string
 * If whole number, no decimal places displayed
 * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 * @param {Number} input number to convert
 * @returns {string} currency formatted number
 */
function formatMoney(input) {
	if (isNull(input) || isNaN(input)) {
		return null;
	}
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});
	return formatter.format(input).replace(".00", "");
}

/**
 * Convert number into comma separated string
 * If whole number, no decimal places displayed
 * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 * @param {Number} input number to convert
 * @returns {string} formatted number
 */
function formatNumber(input) {
	if (isNull(input) || isNaN(input)) {
		return null;
	}
	return new Intl.NumberFormat('en-US').format(input).replace(".00", "");
}

/**
 * Get local timezone offset from UTC. For example, EST is -5 
 * @returns {number} timezone offset 
 */
function localTimezoneOffset() {
	return (new Date().getTimezoneOffset() / 60) * -1
}

/**
 * parse string into date
 * @param {any} input
 */
function parseDate(input) {
	if (isNullOrEmpty(input)) { return null; }
	if (isDateObject(input)) { return input; }
	var dateAsNumber = Date.parse(input);
	if (isNaN(dateAsNumber)) { return null; }
	return new Date(dateAsNumber);
}

/**
 * Number of days between two dates
 * https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
 * @param {any} first
 * @param {any} second
 * @returns {number} Number of days (rounded) between two dates
 */
function daysBetween(first, second) {
	// Take the difference between the dates and divide by milliseconds per day.
	// Round to nearest whole number to deal with DST.
	return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

/**
 * Number of days since epoch (1970-01-01)
 * @param {any} date
 * @returns {number} days
 */
function daysSinceEpoch(date) {
	return Math.floor(date / 8.64e7);
}


/**
* Port of strftime(). Compatibility notes:
*
* %c - formatted string is slightly different
* %D - not implemented (use "%m/%d/%y" or "%d/%m/%y")
* %e - space is not added
* %E - not implemented
* %h - not implemented (use "%b")
* %k - space is not added
* %n - not implemented (use "\n")
* %O - not implemented
* %r - not implemented (use "%I:%M:%S %p")
* %R - not implemented (use "%H:%M")
* %t - not implemented (use "\t")
* %T - not implemented (use "%H:%M:%S")
* %U - not implemented
* %W - not implemented
* %+ - not implemented
* %% - not implemented (use "%")
*
* strftime() reference:
* http://man7.org/linux/man-pages/man3/strftime.3.html
*
* Day of year (%j) code based on Joe Orost's answer:
* http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
*
* Week number (%V) code based on Taco van den Broek's prototype:
* http://techblog.procurios.nl/k/news/view/33796/14863/calculate-iso-8601-week-and-year-in-javascript.html
* @param {string} sFormat
* @param {date} date
*/
function formatDateTime(sFormat, date) {
	if (!(date instanceof Date)) date = new Date();
	var nDay = date.getDay(),
		nDate = date.getDate(),
		nMonth = date.getMonth(),
		nYear = date.getFullYear(),
		nHour = date.getHours(),
		aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
		isLeapYear = function () {
			return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
		},
		getThursday = function () {
			var target = new Date(date);
			target.setDate(nDate - ((nDay + 6) % 7) + 3);
			return target;
		},
		zeroPad = function (nNum, nPad) {
			return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
		};
	return sFormat.replace(/%[a-z]/gi, function (sMatch) {
		return {
			'%a': aDays[nDay].slice(0, 3),
			'%A': aDays[nDay],
			'%b': aMonths[nMonth].slice(0, 3),
			'%B': aMonths[nMonth],
			'%c': date.toUTCString(),
			'%C': Math.floor(nYear / 100),
			'%d': zeroPad(nDate, 2),
			'%e': nDate,
			'%F': date.toISOString().slice(0, 10),
			'%G': getThursday().getFullYear(),
			'%g': ('' + getThursday().getFullYear()).slice(2),
			'%H': zeroPad(nHour, 2),
			'%I': zeroPad((nHour + 11) % 12 + 1, 2),
			'%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
			'%k': '' + nHour,
			'%l': (nHour + 11) % 12 + 1,
			'%m': zeroPad(nMonth + 1, 2),
			'%M': zeroPad(date.getMinutes(), 2),
			'%p': (nHour < 12) ? 'AM' : 'PM',
			'%P': (nHour < 12) ? 'am' : 'pm',
			'%s': Math.round(date.getTime() / 1000),
			'%S': zeroPad(date.getSeconds(), 2),
			'%u': nDay || 7,
			'%V': (function () {
				var target = getThursday(),
					n1stThu = target.valueOf();
				target.setMonth(0, 1);
				var nJan1 = target.getDay();
				if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7);
				return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
			})(),
			'%w': '' + nDay,
			'%x': date.toLocaleDateString(),
			'%X': date.toLocaleTimeString(),
			'%y': ('' + nYear).slice(2),
			'%Y': nYear,
			'%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
			'%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
		}[sMatch] || sMatch;
	});
}

/**
 * Format ISO 8601 format date: 2021-08-19
 * @param {any} date
 * @returns {string} ISO 8601 format date. Example: 2021-08-19
 */
function formatDateIso8601(date) {
	return formatDateTime("%Y-%m-%d", date);
}

/**
 * Format standard 12 hour time. Example: 9:00 PM
 * @param {any} date
 * @returns {string} 12 hour time: 9:00 PM
 */
function formatTime(date) {
	return formatDateTime("%I:%M %p", date).replace(/^0+/, "");
}

/**
 * Format day of the week. Example: Wednesday
 * @param {any} date
 * @returns {string} Day of the Week (full name). Example: Wednesday
 */
function formatDayOfWeek(date) {
	return formatDateTime("%A", date);
}

/**
 * Appends an important style to jQuery object's existing styles
 * This is needed b/c the jQuery css function won't work with '!important' attribute
 * @param {any} element
 * @param {string} style
 */
function appendImportantStyle(element, style) {
	if (isNull(element) || !isJQueryObject(element)) {
		console.log("Element passed is null or not jQuery object");
		return;
	}
	if (isNullOrEmpty(style)) {
		console.log("No style passed");
		return;
	}
	element.attr('style', function (i, s) { return (s || '') + style });
}

function copyToClipboard(input) {
	if (isNull(input)) { return; }

	// string
	if (typeof input === 'string' || input instanceof String) {
		var textArea = document.createElement("textarea");
		textArea.value = input;
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		var isSuccess = privateCopyToClipboard(input);
		document.body.removeChild(textArea);
		return isSuccess;
	}

	// get input element
	var element;
	if (isJQueryObject(input)) {
		if (input.length === 0) { return; }
		element = input[0];
	}
	else {
		element = input;
	}

	// select element text
	input.select();
	input.focus();
	if (input.setSelectionRange) {
		input.setSelectionRange(0, 99999);
	}

	// copy to clipboard
	return privateCopyToClipboard(input.value);
}

function privateCopyToClipboard(text) {
	// internet explorer
	var isSuccess = false;
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(function () {
			isSuccess = true;
		}, function (err) {
			isSuccess = false;
		});
	}
	if (isSuccess) { return true; }

	// all other browsers
	try {
		if (document.execCommand("copy")) {
			isSuccess = true;
		}
		else {
			isSuccess = false;
		}
	}
	catch (err) {
		isSuccess = false;
	}
	return isSuccess;
}

/**
 * Determine if value exists in select dropdown list
 * @param {any} control Select dropdownlist element
 * @param {string} value select option value
 */
function isOptionValueExist(control, value) {
	if (isNull(control)) {
		return false;
	}
	if (!isJQueryObject(control)) {
		control = $(control);
	}
	return control.find("option[value='" + value + "']").length > 0;
}

/**
 * Get URL
 * @param {bool} isExcludeQueryString Exclude Query String?
 * @returns {string} URL
 */
function getUrl(isExcludeQueryString) {
	return isExcludeQueryString
		? window.location.href.split('?')[0]
		: window.location.href;
}

/**
 * Get URL Query String
 * @param {bool} isPrependQuestionMark Include question mark if not empty
 * @returns {string} URL
 */
function getUrlQueryString(isPrependQuestionMark) {
	var o = window.location.href.indexOf("?") !== -1
		? window.location.href.split('?')[1]
		: "";
	return (isPrependQuestionMark && o !== "" ? "?" : "") + o;
}

function getUrlQueryStringFromUrl(url, isPrependQuestionMark) {
	if (isNullOrEmpty(url) || url.indexOf("?") === -1) { return ""; }
	var o = url.split("?")[1];
	return (isPrependQuestionMark && o !== "" ? "?" : "") + o;
}

/**
 * Get URL parameters as an object
 * https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
 * @param {string} url URL (optional)
 * @returns {object} URL parameters as an object
 */
function getUrlParameters(url) {
	url = isNullOrEmpty(url) ? getUrl() : url;
	var params = {};
	if (isNullOrEmpty(url) || isNullOrEmpty(getUrlQueryStringFromUrl(url, false))) {
		return params;
	}
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair.length === 0) { continue; }
		params[pair[0]] = decodeUrlValue(pair.length > 1 ? pair[1] : "");
	}
	return params;
}

/**
 * Returns URL parameter value
 * @param {any} parameterName The parameter name, can pass a string or array of strings
 * @returns {string} parameter value
 */
function getUrlParameterValue(parameterName) {
	if (isNull(parameterName)) { return null; }

	// create an array of parameters to find
	var parameterNames = Array.isArray(parameterName)
		? parameterName
		: (parameterName.indexOf(",") !== -1
			? parameterName.split(',')
			: new Array(parameterName)
		);
	if (parameterNames.length === 0) { return null; }

	// get current url parameters
	var parameters = getUrlParameters();
	if (isNull(parameters) || parameters.length === 0) { return null; }

	// find match
	for (var i = 0; i < parameterNames.length; i++) {
		for (var p in parameters) {
			if (!parameters.hasOwnProperty(p)
				|| (parameterNames[i] + "").toUpperCase().trim() !== (p + "").toUpperCase()) {
				continue;
			}
			return parameters[p];
		}
	}
	return null;
}

/**
 * Convert url parameters object into querystring
 * @param {object} parameters Parameters object
 * @param {bool} isPrependQuestionMark If true, will start query string with a question mark (if any parameters passed)
 * @returns {string} Query string
 */
function convertUrlParametersToQueryString(parameters, isPrependQuestionMark) {
	if (isNull(parameters) || parameters.length === 0) { return null; }
	var queryString = "";
	for (var p in parameters) {
		if (!parameters.hasOwnProperty(p)) { continue; }
		var value = isNullOrEmpty(parameters[p]) ? "" : parameters[p];
		queryString += "&" + p + "=" + encodeURIComponent(value);
	}
	return queryString.length > 0
		? (isPrependQuestionMark ? "?" : "") + queryString.substr(1)
		: queryString;
}

/**
 * Add or update parameter and return URL
 * @param {string} name Parameter Name
 * @param {string} value Parameter Value
 * @param {string} url URL (optional)
 * @returns {string} url
 */
function addUrlParameter(name, value, url) {
	if (isNullOrEmpty(url)) { url = getUrl(); }
	var key = (name + "").toUpperCase();
	if (key === "[OBJECT OBJECT]") {
		return addUrlParameters(name, url);
	}
	var path = url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;

	// get existing parameters
	var parameters = getUrlParameters(url);

	// update parameter
	var isParameterAlreadyExist = false;
	for (var p in parameters) {
		if (!parameters.hasOwnProperty(p)) { continue; }
		if ((p + "").toUpperCase() === key) {
			isParameterAlreadyExist = true;
			parameters[p] = value;
			break;
		}
	}

	// add parameter
	if (!isParameterAlreadyExist) {
		parameters[name] = value;
	}

	// return path + querystring
	return path + convertUrlParametersToQueryString(parameters, true);
}

/**
 * Add or update parameters and return URL
 * @param {object} parameters Parameters to add { name1: "value", name2: "value" }
 * @param {string} url URL (optional)
 * @returns {string} url
 */
function addUrlParameters(parameters, url) {
	if (isNull(parameters)) { parameters = {}; }
	if (isNullOrEmpty(url)) { url = getUrl(); }
	var path = url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;

	// get existing parameters
	var existingParameters = getUrlParameters(url);

	// merge new parameters with existing
	parameters = mergeUrlParameters(parameters, existingParameters);

	// return path + querystring
	return path + convertUrlParametersToQueryString(parameters, true);
}

/**
 * Ad url parameters to a query string
 * @param {object} parameters new url parameters. Example: { year: "2018", month: "1" }
 * @param {any} queryString query string to update
 * @returns {string} querystring
 */
function addUrlParametersToQueryString(parameters, queryString) {
	if (isNullOrEmpty(queryString)) { queryString = ""; }
	if (isNullOrEmpty(parameters) || !isObject(parameters)) { return queryString; }
	var existingParameters = getUrlParameters(queryString);
	var merged = mergeUrlParameters(parameters, existingParameters);
	var o = convertUrlParametersToQueryString(merged, false);
	return isNullOrEmpty(o)
		? ""
		: (isNullOrEmpty(queryString) || queryString.length > 0 && queryString.substr(0, 1) === "?" ? "?" : "") + o;
}

/**
 * Merge URL Parameters
 * @param {object} newParameters These are the new parameters that will be added
 * @param {object} existingParameters These are the existing parameters that will be overwritten
 * @returns {object} Returns a merged parameters object
 */
function mergeUrlParameters(newParameters, existingParameters) {
	if (isNull(existingParameters) || existingParameters.length === 0) {
		return isNull(newParameters) ? {} : newParameters;
	}
	if (isNull(newParameters) || newParameters.length === 0) {
		return isNull(existingParameters) ? {} : existingParameters;
	}
	var o = {};

	// add existing parameters to new object
	for (existingParameter in existingParameters) {
		o[existingParameter] = existingParameters[existingParameter];
	}

	// update existing parameter values with new values
	for (newParameter in newParameters) {
		var key = (newParameter + "").toUpperCase();
		for (p in o) {
			if ((p + "").toUpperCase() === key) {
				o[p] = newParameters[newParameter];
				break;
			}
		}
	}

	// add new parameters
	for (newParameter in newParameters) {
		var key = (newParameter + "").toUpperCase();
		var isNew = true;
		for (p in o) {
			if ((p + "").toUpperCase() === key) {
				isNew = false;
				break;
			}
		}
		if (isNew) {
			o[newParameter] = newParameters[newParameter];
		}
	}
	return o;
}

/**
 * Update the URL displayed in the browser address bar. Does not refresh browser.
 * @param {any} url
 * @param {bool} isUpdateHistory
 */
function setAddressbarUrl(url, isUpdateHistory) {
	if (convertToBool(isUpdateHistory) === true) {
		window.history.pushState({}, "", url);
	}
	else {
		window.history.replaceState({}, "", url);
	}
}

function GetAnchor() {
	return $(location).attr('hash');
}

/**
 * Determine if email address is valid
 * \S = [^ \t\r\n\f]
 * @param {string} email
 */
function isValidEmail(email) {
	if (isNullOrEmpty(email)) { return false; }
	var regEx = /^\S+@\S+\.\S+$/;
	return regEx.test(email);
}

function isValidCurrencyAmount(amount) {
	if (isNullOrEmpty(amount)) { return false; }
	var parsed = amount.replace("$", "").replace(/,/g, "").trim();
	return parsed != null && !isNaN(+parsed);
}

/**
 * Disable Button: Adds disabled="disabled" attribute and adds "disabled" css class
 * Works for both input buttons and anchor buttons
 * @param {object} button button/anchor object or element ID
 */
function disableButton(button) {
	if (typeof button === 'string') {
		if (button.length > 0 && button.substr(0, 1) !== "#") {
			button = "#" + button;
		}
	}
	$(button).attr("disabled", "disabled");
	if (!$(button).hasClass("disabled")) {
		$(button).addClass("disabled");
	}
}

/**
 * Enable Button: Removed "disable" attribute css class
 * Works for both input buttons and anchor buttons
 * @param {object} button button/anchor object or element ID
 */
function enableButton(button) {
	if (typeof button === 'string') {
		if (button.length > 0 && button.substr(0, 1) !== "#") {
			button = "#" + button;
		}
	}
	$(button).removeAttr("disabled");
	$(button).removeClass("disabled");
}

function enableButtons() {
	$("input[type='button']").removeAttr("disabled");
	$("input[type='button']").removeClass("disabled");

	$("input[type='submit']").removeAttr("disabled");
	$("input[type='submit']").removeClass("disabled");

	$("button").removeAttr("disabled");
	$("button").removeClass("disabled");
}

/**
 * Decode URL parameter value
 * @param {string} input URL encoded value to decode
 * @returns {string} URL decoded value
 */
function decodeUrlValue(input) {
	if (isNull(input)) { return null; }
	// replace plus symbol (+) with %20
	input = input.replace(/\+/g, '%20')
	return decodeURIComponent(input);
}

/**
 * Decode HTML
 * @param {string} text HTML encoded text to decode
 * @returns {string} HTML decoded text
 */
function decodeHtml(text) {
	if (isNull(text)) { return null; }
	var textArea = document.createElement('textarea');
	textArea.innerHTML = text;
	return textArea.value;
}

/**
 * Encode HTML
 * @param {string} text text to encode for HTML
 * @returns {string} HTML encoded text
 */
function encodeHtml(text) {
	if (isNull(text)) { return null; }
	var textArea = document.createElement('textarea');
	textArea.innerText = text;
	return textArea.innerHTML;
}

/**
 * Get browser scroll bar width/height
 * @returns {int} scrollbar width/height
 * */
function getScrollbarSize() {
	var scrollDiv = document.createElement("div");
	scrollDiv.style.width = "100px";
	scrollDiv.style.height = "100px";
	scrollDiv.style.overflow = "scroll";
	scrollDiv.style.position = "absolute";
	scrollDiv.style.top = "-9999px";
	document.body.appendChild(scrollDiv);

	// get the scrollbar width
	var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

	// delete the DIV 
	document.body.removeChild(scrollDiv);

	return scrollbarWidth;
}

function scrollToElement(element, speed) {
	if (!isJQueryObject(element)) {
		if (!contains(element, "#") && !contains(element, ".") && !contains(element, " ")) {
			element = "#" + element;
		}
		var element = $(element);
	}
	if (isNull(element)) {
		console.log("Failed to get element to scroll to: " + element);
		return;
	}
	if (isNullOrEmpty(speed)) { speed = "slow"; }
	$("body,html").animate({ scrollTop: element.offset().top }, speed);
}

// determine if current page is a popup  (isPopUp=1)
// IMPORTANT! Masterpage call this function, don't break it
function isPopUp() {
	return convertToBool(getUrlParameterValue("isPopUp")) === true;
}

function isPrint() {
	return convertToBool(getUrlParameterValue("isPrint")) === true;
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=None; Secure;";
}

function getUsernameByCookie() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookiePair = cookies[i].split("=");
		if (cookiePair[0].trim() === "username") {
			return decodeUrlValue(cookiePair[1]);
		}
	}

	return "";
}

function getEmailByCookie() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookiePair = cookies[i].split("=");
		if (cookiePair[0].trim() === "email") {
			return decodeUrlValue(cookiePair[1]);
		}
	}

	return "";
}

function getUsername() {

	// use cookie
	var username = getUsernameByCookie();
	if (!isNullOrEmpty(username)) {
		return username;
    }

	// use api
	$.ajax({
		type: "GET",
		url: "/RestAPI/NemaServices/NemaUserService/GetUsername",
		datatype: "text",
		cache: true,
		success: function (data) {
			username = isNullOrEmpty(data) ? "" : data;
		},
		async: false
	});

	// set cookie
	if (!isNullOrEmpty(username)) {
		setCookie("username", username, 90);
	}

	return username;
}

function getEmail() {

	// use cookie
	var email = getEmailByCookie();
	if (!isNullOrEmpty(email) && contains(email, "@")) {
		return email;
	}
	var username = getUsernameByCookie();
	if (!isNullOrEmpty(username)) {
		if (contains(username, "@")) {
			return username;
		}
		else {
			$.ajax({
				type: "GET",
				url: "/RestAPI/NemaServices/NemaUserService/GetEmail?username=" + username,
				datatype: "text",
				cache: true,
				success: function (data) {
					email = isNullOrEmpty(data) ? "" : data;
				},
				async: false
			});

			// set cookie
			if (!isNullOrEmpty(email)) {
				setCookie("email", email, 90);
			}

			return email;
        }
	}

	// use api
	email = "";
	$.ajax({
		type: "GET",
		url: "/RestAPI/NemaServices/NemaUserService/GetEmail",
		datatype: "text",
		cache: true,
		success: function (data) {
			email = isNullOrEmpty(data) ? "" : data;
		},
		async: false
	});

	// set cookie
	if (!isNullOrEmpty(email)) {
		setCookie("email", email, 90);
	}

	return email;
}

function isNemaStaff(username) {
	var username = isNullOrEmpty(username)
		? getUsername()
		: username;
	if (isNullOrEmpty(username)) { return false; }
	username = username.toLowerCase().trim();
	if (username.indexOf("@") === -1) {
		return true;
	}
	var nemaDomains = [ "nema.org", "medicalimaging.org", "dicomstandard.org", "esfi.org" ];
	for (var i = 0; i < nemaDomains.length; i++) {
		if (username.length > nemaDomains[i].length
			&& username.substring(username.length - nemaDomains[i].length - 1) === "@" + nemaDomains[i]) {
			return true;
		}
	}

	return false;
}

function isNemaMember(username) {

	// user username
	var username = isNullOrEmpty(username)
		? getUsername()
		: username;
	if (isNullOrEmpty(username)) { return false; }
	username = username.toLowerCase().trim();
	if (username.indexOf("@") === -1) {
		return false;
	}

	// use api
	var result = "";
	$.ajax({
		type: "GET",
		url: "/RestAPI/NemaServices/NemaUserService/IsNemaMember",
		datatype: "text",
		cache: true,
		success: function (data) {
			result = isNullOrEmpty(data) ? "" : data; 
		},
		async: false
	});

	return isEqualIgnoreCase(result, "true");
}

/**
 * Get error message returned from ajax request
 * @returns {int} scrollbar width/height
 * */
function getWebServiceErrorMessage(jqXHR)
{
	if (isNull(jqXHR)) {
		return "";
	}
	if (!isNull(jqXHR.responseJSON)
		&& jqXHR.responseJSON.hasOwnProperty("ResponseStatus")
		&& jqXHR.responseJSON["ResponseStatus"].hasOwnProperty("Message")) {
		return jqXHR.responseJSON["ResponseStatus"]["Message"];
	}
	if (jqXHR.hasOwnProperty("responseText")
		&& !isNullOrEmpty(jqXHR["responseText"])) {
		return jqXHR["responseText"];
    }
	return "";
}






/**
Google Analytics Tag
**/
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'UA-25027700-1', {
    'custom_map': { 'dimension1': 'IsUserNemaStaff' }
});
//gtag('event', 'session_start', { 'IsUserNemaStaff': 'yes' });
//gtag('event', 'page_view', { 'IsUserNemaStaff': 'yes' });


//Code for tracking outbound links
document.addEventListener('click', function (event) {
  var link = event.target;
  while(link && (typeof link.tagName == 'undefined' || link.tagName.toLowerCase() != 'a' || !link.href)) {
    link = link.parentNode
  }

  if (link && link.href && link.host && link.host !== location.host) {
    gtag('event', 'Click', {
      event_category: 'Outbound Link',
      event_label : link.href
    });

    // Allow event to be sent before the page is unloaded
    if(!link.target || link.target.match(/^_(self|parent|top)$/i)) {
      setTimeout(function() { location.href = link.href; }, 150);
      event.preventDefault();
    }
  }
})