// https://api.olympics.kevle.xyz/medals

import {  KadTable, initEL } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

const olympiaOptions = {
	URLMedals: `https://api.olympics.kevle.xyz/medals`,
	URLFlags: `https://restcountries.com/v3.1/all?fields=cca3,flags`,
};

initEL({ id: idBtn_olympiaUpdate, fn: olympaUpdate });

export function clear_cl_Olympia() {
	olympaUpdate();
}

async function olympaUpdate() {
	let dataTable = null;
	let dataFlags = null;
	try {
		let response = await fetch(olympiaOptions.URLMedals);
		dataTable = await response.json();
		response = await fetch(olympiaOptions.URLFlags);
		dataFlags = await response.json();
	} catch (err) {
		if (err.name == "TypeError") {
			return;
		}
	}
  let flagObj = {}
	for (let obj of dataFlags) {
		flagObj[obj.cca3] = obj.flags.svg;
	}
	for (let rang of dataTable.results) {
		rang.flag = flagObj[rang.country.iso_alpha_3];
	}
	olympiaTableReturn(dataTable.results);
}

function olympiaTableReturn(data) {
	if (data.length == 0) return;
	KadTable.clear("idTabBody_OlympiaTable");
	for (let i = 0; i < data.length; i++) {
		let row = KadTable.createRow("idTabBody_OlympiaTable");

		KadTable.addCell(row, {
			names: ["olympia", "place", i],
			type: "Lbl",
			text: i + 1,
			cellStyle: {
				textAlign: "center",
			},
		});

		// image
		KadTable.addCell(row, {
			names: ["olympia", "flag", i],
			type: "Img",
			subGroup: "url",
			img: data[i].flag,
			ui: {
				uiSize: "olympiaImg",
			},
      cellStyle: {
				textAlign: "center",
			},
		});

		//--  Land
		KadTable.addCell(row, {
			names: ["olympia", "country", i],
			type: "Lbl",
			text: data[i].country.name,
			title: data[i].country.name,
			cellStyle: {
				textAlign: "left",
			},
		});

		//--  Gold
		KadTable.addCell(row, {
			names: ["olympia", "gold", i],
			type: "Lbl",
			text: data[i].medals.gold,
			cellStyle: {
				textAlign: "left",
			},
		});
		//--  Silber
		KadTable.addCell(row, {
			names: ["olympia", "silver", i],
			type: "Lbl",
			text: data[i].medals.silver,
			cellStyle: {
				textAlign: "left",
			},
		});
		//--  bronce
		KadTable.addCell(row, {
			names: ["olympia", "bronze", i],
			type: "Lbl",
			text: data[i].medals.bronze,
			cellStyle: {
				textAlign: "left",
			},
		});
		//--  total
		KadTable.addCell(row, {
			names: ["olympia", "total", i],
			type: "Lbl",
			text: data[i].medals.total,
			cellStyle: {
				textAlign: "left",
			},
		});
	}
}

function sepakbolaCreateImage(url) {
	const size = globalValues.mediaSizes.imgSize;
	const img = new Image();
	//shrink URL-image-size
	let urlArr = url;
	if (urlArr.includes("px")) {
		urlArr = url.split("px");
		let index = urlArr[0].lastIndexOf("/");
		urlArr[0] = urlArr[0].slice(0, index + 1);
		urlArr = `${urlArr[0]}${size}px${urlArr[1]}`;
	}
	img.src = urlArr;
	img.setAttribute("referrerpolicy", "no-referrer");
	img.setAttribute("uiSize", "img");
	return img;
}
