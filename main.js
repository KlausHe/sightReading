// Colors for the niceness of the page
const ColorScheme = {
	lightmode: {
		txtMain: [0, 100, 0], // Akzentfarbe light:'#c2bebc'
		bgcBackground: [0, 0, 99], //light:'#e6e6e6'
		txtBackground: [0, 100, 0],
	},
	darkmode: {
		txtMain: [0, 100, 100], // Akzentfarbe dark: '#c2bebc'
		bgcBackground: [60, 0, 10], // General Background dark: '#1a1a1a'
		txtBackground: [0, 100, 100],
	},
	darkmodeOn: false,
};

window.onload = mainSetup;

function mainSetup() {
	//add the Grid-Area-Names to all divs inside the sections
	colToggleColormode();
	htmlAltTag();
	ocjeneGridAreas();
	createOcjene(true);
}

function htmlAltTag() {
	setAlt("trash");
	setAlt("oAdd");
	setAlt("oSub");
	function setAlt(name) {
		const obj = dbCL(`img_${name}`, null);
		for (let imgObj of obj) {
			imgObj.alt = `${name}.svg`;
		}
	}
}

//------------ Helperfunctions --------------
function getCssRoot(object, number = false, toPX = false) {
	//  getCssRoot("navbarHeight", return only number=true)
	const obj = `--${object}`;
	let valToConvert = getComputedStyle(document.body)
		.getPropertyValue(obj)
		.replace(/s|px|rem/g, "");
	//toPX = false
	if (toPX == true && object != "fs-Base") {
		const size = getComputedStyle(document.body).getPropertyValue("--fs-Base").replace(/px/g, "");
		return Number(size * valToConvert);
	}
	//number = false
	if (number == true) {
		return Number(valToConvert);
	}
	return getComputedStyle(document.body).getPropertyValue(obj).trim();
}

function setCssRoot(object, value, dim = "") {
	//  setCssRoot("navbarHeight", 100, "px")
	document.styleSheets[0].cssRules[0].style.setProperty(`--${object}`, `${value}${dim}`);
}

function dbID(id) {
	if (id instanceof Object) return id;
	return document.getElementById(id);
}

function dbIDStyle(id) {
	if (id instanceof Object) return id.style;
	return document.getElementById(id).style;
}

function dbCL(id, loc = 0) {
	if (loc === null) {
		return document.getElementsByClassName(id);
	}
	return document.getElementsByClassName(id)[loc];
}

function dbCLStyle(id, loc = 0) {
	if (loc === null) {
		let ret = [];
		for (const s of document.getElementsByClassName(id)) {
			ret.push(s.style);
		}
		return ret;
	}
	return document.getElementsByClassName(id)[loc].style;
}
function deepClone(data) {
	if (data === null || data === undefined) return data;
	return JSON.parse(JSON.stringify(data));
}
// function convertDate(date, fourDigitYear = false) {
// 	const day = date.getDate().toString().padStart(2, 0);
// 	const month = (date.getMonth() + 1).toString().padStart(2, 0);
// 	const year = fourDigitYear ? date.getFullYear() : parseInt(date.getFullYear().toString().substr(2, 2), 10);
// 	return `${day}.${month}.${year}`;
// }

function sortArrayByKey(arr, key, inverse = false) {
	let array = Array.from(arr);
	return array.sort(function (a, b) {
		if (typeof a[key] == "number" && typeof b[key] == "number") {
			if (inverse) {
				return b[key] - a[key];
			} else {
				return a[key] - b[key];
			}
		} else {
			const x = a[key];
			const y = b[key];
			if (inverse) {
				return x < y ? 1 : x > y ? -1 : 0;
			} else {
				return x < y ? -1 : x > y ? 1 : 0;
			}
		}
	});
}

// function ocjeneOpenSettings() {
// 	dbID(Settings).showModal();
// }
// function ocjeneCloseSettings() {
// 	dbID(Settings).close();
// }

function ocjeneGridAreas() {
	for (const content of ocjeneSubgrid) {
		dbCLStyle(content[0]).gridArea = content[0];
		if (content[1]) dbCLStyle(content[0]).justifySelf = content[1];
		if (content[2]) dbCLStyle(content[0]).alignSelf = content[2];
	}
}

function htmlAltTag() {
	setAlt("trash");
	setAlt("oAdd");
	setAlt("oSub");
	function setAlt(name) {
		const t = dbCL(`img_${name}`, null);
		for (let e of t) {
			e.alt = `${name}.svg`;
		}
	}
}
function utilsVinChange(id, v) {
	let obj = null;
	let siblingList = Array.from(id.parentNode.children);
	for (let i = siblingList.indexOf(id) - 1; i >= 0; i--) {
		if (siblingList[i].type != "button") {
			obj = siblingList[i];
			break;
		}
	}
	if (obj == null) {
		console.log("not found");
		return;
	}
	if (obj.disabled) return;
	const dir = Number(v);
  if (dir == 0) {
    if (Number(obj.value) === 0 || Number(obj.value) === Number(obj.min)) {
      obj.value = "";
      return;
    }
    obj.value = obj.min || 0;
    return;
  }
  const actual = obj.value == "" && obj.placeholder != "" ? Number(obj.placeholder) : Number(obj.value);
  const num = actual + dir;
  const min = obj.hasAttribute("min") && dir < 1 ? Number(obj.min) : null;
  const max = obj.hasAttribute("max") && dir > 0 ? Number(obj.max) : null;
  obj.value = valueConstrain(num, min, max);

	obj.dispatchEvent(new Event("input"));
	obj.focus();
}

function valueConstrain(val, min = null, max = null) {
	if (min == null && max == null) return val;
	if (min != null && max != null) return Math.max(Math.min(val, max), min);
	if (min == null && max != null) return Math.min(val, max);
	if (min != null && max == null) return Math.max(val, min);
}
function resetInput(id, ph, opts = null) {
	const obj = dbID(id);
	if (obj.type == "checkbox") {
		obj.checked = ph;
		return ph;
	}
	obj.value = "";
	obj.placeholder = ph;
	if (opts != null) {
		for (let [key, val] of Object.entries(opts)) {
			obj[key] = val;
		}
	}
	return Number(obj.placeholder);
}
function clearFirstChild(id) {
	const obj = typeof id == "string" ? dbID(id) : id;
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	}
	return obj;
}
function btnColor(id, opt = null) {
	const obj = dbID(id);
	if (opt === null) obj.removeAttribute("data-btnstatus");
	else if (opt === "positive") obj.dataset.btnstatus = "btnPositive";
	else if (opt === "negative") obj.dataset.btnstatus = "btnNegative";
	else if (opt === "colored") obj.dataset.btnstatus = "btnBasecolor";
}
function arrayFromNumber(obj, num = null) {
	if (num == null && typeof obj == "number") return [...Array(obj).keys()];
	if (typeof obj == "number" && typeof num == "number") {
		let min = Math.min(obj, num);
		let max = Math.max(obj, num);
		let arr = [];
		for (let i = min; i <= max; i++) {
			arr.push(i);
		}
		return arr;
	}
}
function randomIndex(obj) {
	if (typeof obj == "string") return Math.floor(Math.random() * obj.length);
	if (Array.isArray(obj)) return Math.floor(Math.random() * obj.length);
	return Math.floor(Math.random() * Object.keys(obj).length);
}
function randomObject(obj, top = null) {
	// takes a single Number, an Array or an Object
	if (typeof obj == "number") return randomObject(arrayFromNumber(obj, top));
	if (typeof obj == "string") return obj[randomIndex(obj)];
	if (Array.isArray(obj) && obj.length <= 0) return null;
	if (Array.isArray(obj)) return obj[randomIndex(obj)];
	const objKeys = Object.keys(obj);
	return obj[objKeys[randomIndex(objKeys)]];
}
function firstLetterCap(s) {
	if (s == "") return s;
	if (typeof s != "string") return s;
	return s[0].toUpperCase() + s.slice(1);
}
function utilsNumberFromInput(id, failSafeVal = null, noPlaceholder = null) {
	const obj = dbID(id);
	if (!isNaN(obj.valueAsNumber)) return obj.valueAsNumber;
	if (failSafeVal != null) return failSafeVal;
	if (noPlaceholder != null) return null;
	return Number(obj.placeholder);
}

ColorScheme.darkmodeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addListener((e) => {
	ColorScheme.darkmodeOn = e.matches;
	colToggleColormode();
});

function colToggleColormode(btn = null) {
	if (btn != null) ColorScheme.darkmodeOn = !ColorScheme.darkmodeOn;
	let colBG, colTxt, mainTxt;
	if (ColorScheme.darkmodeOn) {
		const bg = ColorScheme.darkmode.bgcBackground;
		const txt = ColorScheme.darkmode.txtBackground;
		const mTxt = ColorScheme.darkmode.txtMain;
		colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`;
		colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`;
		mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`;
		if (dbID("idImg_footer_Spacer")) {
			dbID("idImg_footer_Spacer").src = "Images/Icons/opt-sun.svg";
			dbIDStyle("idImg_footer_Spacer").filter = "invert(100%)";
		}
	} else {
		const bg = ColorScheme.lightmode.bgcBackground;
		const txt = ColorScheme.lightmode.txtBackground;
		const mTxt = ColorScheme.lightmode.txtMain;
		colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`;
		colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`;
		mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`;
		if (dbID("idImg_footer_Spacer")) {
			dbID("idImg_footer_Spacer").src = "Images/Icons/opt-moon.svg";
			dbIDStyle("idImg_footer_Spacer").filter = "invert(0%)";
		}
	}

	setCssRoot(`bgcBackground`, colBG);
	setCssRoot(`txtBackground`, colTxt);
	setCssRoot(`txtMain`, mainTxt);
	setCssRoot(`filter`, ColorScheme.darkmodeOn ? 1 : 0);
}

//----- Toggle Navbar Dropdown -----------s
function navbarDropdownClick() {
	dbID("idNav_navElements").classList.add("navbarDropActive");
}

const Data_Country_CodesIso639 = new Map([
	["auto", "Automatic"],
	["af", "Afrikaans"],
	["sq", "Albanian"],
	["am", "Amharic"],
	["ar", "Arabic"],
	["hy", "Armenian"],
	["az", "Azerbaijani"],
	["eu", "Basque"],
	["be", "Belarusian"],
	["bn", "Bengali"],
	["bs", "Bosnian"],
	["bg", "Bulgarian"],
	["ca", "Catalan"],
	["ceb", "Cebuano"],
	["ny", "Chichewa"],
	["zh-cn", "Chinese s."],
	["zh-tw", "Taiwan t."],
	["zh-hk", "Hongkong t."],
	["co", "Corsican"],
	["hr", "Croatian"],
	["cs", "Czech"],
	["da", "Danish"],
	["nl", "Dutch"],
	["en", "English"],
	["eo", "Esperanto"],
	["et", "Estonian"],
	["tl", "Filipino"],
	["fi", "Finnish"],
	["fr", "French"],
	["fy", "Frisian"],
	["gl", "Galician"],
	["ka", "Georgian"],
	["de", "German"],
	["el", "Greek"],
	["gu", "Gujarati"],
	["ht", "Haitian Creole"],
	["ha", "Hausa"],
	["haw", "Hawaiian"],
	["he", "Hebrew"],
	["hi", "Hindi"],
	["hmn", "Hmong"],
	["hu", "Hungarian"],
	["is", "Icelandic"],
	["ig", "Igbo"],
	["id", "Indonesian"],
	["ga", "Irish"],
	["it", "Italian"],
	["ja", "Japanese"],
	["jw", "Javanese"],
	["kn", "Kannada"],
	["kk", "Kazakh"],
	["km", "Khmer"],
	["ko", "Korean"],
	["ku", "Kurdish (Kurmanji)"],
	["ky", "Kyrgyz"],
	["lo", "Lao"],
	["la", "Latin"],
	["lv", "Latvian"],
	["lt", "Lithuanian"],
	["lb", "Luxembourgish"],
	["mk", "Macedonian"],
	["mg", "Malagasy"],
	["ms", "Malay"],
	["ml", "Malayalam"],
	["mt", "Maltese"],
	["mi", "Maori"],
	["mr", "Marathi"],
	["mn", "Mongolian"],
	["my", "Myanmar (Burmese)"],
	["ne", "Nepali"],
	["nb", "Norwegian"],
	["ps", "Pashto"],
	["fa", "Persian"],
	["pl", "Polish"],
	["pt", "Portuguese"],
	["ma", "Punjabi"],
	["ro", "Romanian"],
	["ru", "Russian"],
	["sm", "Samoan"],
	["gd", "Scots Gaelic"],
	["sr", "Serbian"],
	["st", "Sesotho"],
	["sn", "Shona"],
	["sd", "Sindhi"],
	["si", "Sinhala"],
	["sk", "Slovak"],
	["sl", "Slovenian"],
	["so", "Somali"],
	["es", "Spanish"],
	["su", "Sundanese"],
	["sw", "Swahili"],
	["sv", "Swedish"],
	["tg", "Tajik"],
	["ta", "Tamil"],
	["te", "Telugu"],
	["th", "Thai"],
	["tr", "Turkish"],
	["uk", "Ukrainian"],
	["ur", "Urdu"],
	["uz", "Uzbek"],
	["vi", "Vietnamese"],
	["cy", "Welsh"],
	["xh", "Xhosa"],
	["yi", "Yiddish"],
	["yo", "Yoruba"],
	["zu", "Zulu]"],
]);
