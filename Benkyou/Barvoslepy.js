import { dbID, initEL, KadDOM, KadRandom } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

// barvoslepy
const barvoslepyOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w , h: globalValues.mediaSizes.canvasSize.h };
	},
	image: null,
	differenceEpsilon: 5,
	sRGBToLinearRGBLookup: [],
	Abstufungen: [
		["Rotsehschwäche", "Protanomalie"],
		["Rotblindheit", "Protanopie"],
		["Grünsehschwäche", "Deuteranomalie"],
		["Grünblindheit", "Deuteranopie"],
		["Blausehschwäche", "Tritanomalie"],
		["Blaublindheit", "Tritanopie"],
	],
	brettelFunctions: {
		Protanomalie(color) {
			return barvoslepyBrettel(color, "protan", barvoslepyOptions.severity);
		},
		Protanopie(color) {
			return barvoslepyBrettel(color, "protan", 1);
		},
		Deuteranomalie(color) {
			return barvoslepyBrettel(color, "deutan", barvoslepyOptions.severity);
		},
		Deuteranopie(color) {
			return barvoslepyBrettel(color, "deutan", 1);
		},
		Tritanomalie(color) {
			return barvoslepyBrettel(color, "tritan", barvoslepyOptions.severity);
		},
		Tritanopie(color) {
			return barvoslepyBrettel(color, "tritan", 1);
		},
	},
	brettelParams: {
		protan: {
			rgbCvdFromRgb_1: [0.1451, 1.20165, -0.34675, 0.10447, 0.85316, 0.04237, 0.00429, -0.00603, 1.00174],
			rgbCvdFromRgb_2: [0.14115, 1.16782, -0.30897, 0.10495, 0.8573, 0.03776, 0.00431, -0.00586, 1.00155],
			separationPlaneNormal: [0.00048, 0.00416, -0.00464],
		},
		deutan: {
			rgbCvdFromRgb_1: [0.36198, 0.86755, -0.22953, 0.26099, 0.64512, 0.09389, -0.01975, 0.02686, 0.99289],
			rgbCvdFromRgb_2: [0.37009, 0.8854, -0.25549, 0.25767, 0.63782, 0.10451, -0.0195, 0.02741, 0.99209],
			separationPlaneNormal: [-0.00293, -0.00645, 0.00938],
		},
		tritan: {
			rgbCvdFromRgb_1: [1.01354, 0.14268, -0.15622, -0.01181, 0.87561, 0.13619, 0.07707, 0.81208, 0.11085],
			rgbCvdFromRgb_2: [0.93337, 0.19999, -0.13336, 0.05809, 0.82565, 0.11626, -0.37923, 1.13825, 0.24098],
			separationPlaneNormal: [0.0396, -0.02831, -0.01129],
		},
	},
	severity: 0.5,
	previewImagesSelected: null,
	previewImages: [
		["Venedig", "./Benkyou/BarvoslepyAssets/Venice.JPG"],
		["Ishihara", "./Benkyou/BarvoslepyAssets/Ishihara.png"],
	],
	showState: null,
	showStates: {
		Original: false,
		Positive: false,
		Negative: false,
	},
};

initEL({ id: idFile_barvoslepyUpload, action: "change", fn: barvoslepyLoadFile });
initEL({
	id: idSel_barvoslepySelectImage,
	fn: barvoslepyImagePreview,
	selStartValue: KadRandom.randomObject(barvoslepyOptions.previewImages.map((v) => v[0])),
	selList: barvoslepyOptions.previewImages.map((v) => [v[0], v[1]]),
});
initEL({
	id: idSel_barvoslepySelectWeakness,
	fn: barvoslepySelectWeakness,
	selStartValue: KadRandom.randomObject(barvoslepyOptions.Abstufungen.map((v) => v[0])),
	selList: barvoslepyOptions.Abstufungen.map((v) => [v[0], v[1]]),
});
initEL({
	id: idVin_barvoslepySeverity,
	fn: barvoslepySeverity,
	resetValue: 50,
	domOpts: {
		min: 0,
		max: 95,
		step: 5,
	},
});
initEL({
	id: idVin_barvoslepyEpsilon,
	fn: barvoslepyEpsilon,
	resetValue: 5,
	domOpts: {
		min: 0,
		max: 15,
		step: 1,
	},
});
initEL({ id: idBtn_barvoslepyOriginal, fn: barvoslepyShow, resetValue: "Original" });
initEL({ id: idBtn_barvoslepyPositive, fn: barvoslepyShow, resetValue: "Positive" });
initEL({ id: idBtn_barvoslepyNegative, fn: barvoslepyShow, resetValue: "Negative" });
initEL({ id: idBtn_barvoslepyApply, fn: barvoslepyFilter, resetValue: "Anwenden" });

export function clear_cl_Barvoslepy() {
	idSel_barvoslepySelectImage.KadReset();
  idSel_barvoslepySelectWeakness.KadReset({selStartValue: KadRandom.randomObject(barvoslepyOptions.Abstufungen.map((v) => v[0]))})
	barvoslepyOptions.differenceEpsilon = idVin_barvoslepyEpsilon.KadReset();
  let typeIndex = idSel_barvoslepySelectWeakness.KadGet({ index: true });
	KadDOM.enableBtn(idVin_barvoslepySeverity, typeIndex % 2 == 0);
	barvoslepyImagePreview();
	barvoslepyOptions.sRGBToLinearRGBLookup = [];
	for (let i = 0; i < 256; i++) {
		const fv = i / 255.0;
		barvoslepyOptions.sRGBToLinearRGBLookup[i] = fv < 0.04045 ? fv / 12.92 : Math.pow((fv + 0.055) / 1.055, 2.4);
	}
}

function barvoslepyImagePreview() {
	barvoslepyOptions.previewImagesSelected = idSel_barvoslepySelectImage.KadGet();
	barvoslepyOptions.image = new Image();
	barvoslepyOptions.image.src = barvoslepyOptions.previewImagesSelected;
	barvoslepyOptions.image.onload = barvoslepyImageLoaded;
}

function barvoslepySeverity() {
	barvoslepyOptions.severity = idVin_barvoslepySeverity.KadGet() / 100;
	barvoslepyFilter();
}

function barvoslepySelectWeakness() {
	let typeIndex = idSel_barvoslepySelectWeakness.KadGet({ index: true });
	KadDOM.enableBtn(idVin_barvoslepySeverity, typeIndex % 2 == 0);
	barvoslepyFilter();
}

function barvoslepyEpsilon() {
	barvoslepyOptions.differenceEpsilon = idVin_barvoslepyEpsilon.KadGet();
	barvoslepyFilter();
}

function barvoslepyShow(btn) {
	const thisType = btn.target.textContent;
	const thisState = !barvoslepyOptions.showStates[thisType];
	barvoslepyOptions.showState = thisState ? thisType : null;
	for (let type of Object.keys(barvoslepyOptions.showStates)) {
		if (type == thisType) {
			barvoslepyOptions.showStates[type] = thisState;
			KadDOM.btnColor(`idBtn_barvoslepy${type}`, thisState ? "colored" : null);
		} else {
			barvoslepyOptions.showStates[type] = false;
			KadDOM.btnColor(`idBtn_barvoslepy${type}`, null);
		}
	}
	barvoslepyFilter();
}

function barvoslepyImageLoaded(source) {
	barvoslepyOptions.image = source.target;
	barvoslepyFilter();
}

function barvoslepyLoadFile(file) {
	let selectedFile = file.target.files[0];
	let fileReader = new FileReader();
	fileReader.onload = (file) => {
		const img = new Image();
		img.onload = barvoslepyImageLoaded;
		img.src = file.target.result;
	};
	fileReader.readAsDataURL(selectedFile);
}

function barvoslepyFilter() {
	const type = idSel_barvoslepySelectWeakness.KadGet();
	const typeText = idSel_barvoslepySelectWeakness.KadGet({ textContent: true });
	const typeIndex = idSel_barvoslepySelectWeakness.KadGet({ index: true });
	let severity = typeIndex % 2 == 0 ? ` ${Math.floor(barvoslepyOptions.severity * 100)}%` : "";
	idLbl_barvoslepyApply.textContent = `${typeText}${severity}`;

	const w = barvoslepyOptions.image.width;
	const h = barvoslepyOptions.image.height;
	const ratio = w / h;
	const canvasFiltered = dbID(idCanv_barvoslepyCanvas);
	const canvasWidth = Math.min(barvoslepyOptions.image.width, barvoslepyOptions.canvas.w);
	const canvasHeight = Math.round(canvasWidth / ratio);
	canvasFiltered.width = canvasWidth;
	canvasFiltered.height = canvasHeight;
	const ctxFiltered = canvasFiltered.getContext("2d");
	ctxFiltered.drawImage(barvoslepyOptions.image, 0, 0, w, h, 0, 0, canvasWidth, canvasHeight);
	let pixelsFiltered = ctxFiltered.getImageData(0, 0, w, h);

	for (let i = 0; i < pixelsFiltered.data.length; i += 4) {
		const pixelFiltered = [pixelsFiltered.data[i], pixelsFiltered.data[i + 1], pixelsFiltered.data[i + 2]];
		const filteredRGB = barvoslepyOptions.brettelFunctions[type](pixelFiltered);
		if (barvoslepyOptions.showState == null) {
			pixelsFiltered.data[i + 0] = filteredRGB[0];
			pixelsFiltered.data[i + 1] = filteredRGB[1];
			pixelsFiltered.data[i + 2] = filteredRGB[2];
		}
		if (barvoslepyOptions.showState == "Positive") {
			const diff = barvoslepyDifferencePixel(pixelFiltered, filteredRGB);
			pixelsFiltered.data[i + 0] = diff ? filteredRGB[0] : 0;
			pixelsFiltered.data[i + 1] = diff ? filteredRGB[1] : 0;
			pixelsFiltered.data[i + 2] = diff ? filteredRGB[2] : 0;
		}
		if (barvoslepyOptions.showState == "Negative") {
			const diff = barvoslepyDifferencePixel(pixelFiltered, filteredRGB);
			pixelsFiltered.data[i + 0] = diff ? 0 : filteredRGB[0];
			pixelsFiltered.data[i + 1] = diff ? 0 : filteredRGB[1];
			pixelsFiltered.data[i + 2] = diff ? 0 : filteredRGB[2];
		}
	}
	ctxFiltered.putImageData(pixelsFiltered, 0, 0);
}

function barvoslepyDifferencePixel(pixOrig, pixFiltered) {
	let count = 0;
	for (let n = 0; n < 3; n++) {
		if (Math.abs(pixOrig[n] - pixFiltered[n]) > barvoslepyOptions.differenceEpsilon) count++;
	}
	return count == 0;
}

function barvoslepyBrettel(color, type, severity) {
	let rgb = [0, 0, 0];
	rgb[0] = barvoslepyOptions.sRGBToLinearRGBLookup[color[0]];
	rgb[1] = barvoslepyOptions.sRGBToLinearRGBLookup[color[1]];
	rgb[2] = barvoslepyOptions.sRGBToLinearRGBLookup[color[2]];
	const rgbCvdFromRgb_1 = barvoslepyOptions.brettelParams[type]["rgbCvdFromRgb_1"];
	const rgbCvdFromRgb_2 = barvoslepyOptions.brettelParams[type]["rgbCvdFromRgb_2"];
	const separationPlaneNormal = barvoslepyOptions.brettelParams[type]["separationPlaneNormal"];

	// Check on which plane we should project by comparing wih the separation plane normal.
	const dotWithSepPlane = rgb[0] * separationPlaneNormal[0] + rgb[1] * separationPlaneNormal[1] + rgb[2] * separationPlaneNormal[2];
	const rgbCvdFromRgb = dotWithSepPlane >= 0 ? rgbCvdFromRgb_1 : rgbCvdFromRgb_2;

	// Transform to the full dichromat projection plane.
	let cvd = [0, 0, 0];
	cvd[0] = rgbCvdFromRgb[0] * rgb[0] + rgbCvdFromRgb[1] * rgb[1] + rgbCvdFromRgb[2] * rgb[2];
	cvd[1] = rgbCvdFromRgb[3] * rgb[0] + rgbCvdFromRgb[4] * rgb[1] + rgbCvdFromRgb[5] * rgb[2];
	cvd[2] = rgbCvdFromRgb[6] * rgb[0] + rgbCvdFromRgb[7] * rgb[1] + rgbCvdFromRgb[8] * rgb[2];

	// Apply the severity factor as a linear interpolation. It's the same to do it in the RGB space or in the LMS space since it's a linear transform.
	cvd[0] = cvd[0] * severity + rgb[0] * (1.0 - severity);
	cvd[1] = cvd[1] * severity + rgb[1] * (1.0 - severity);
	cvd[2] = cvd[2] * severity + rgb[2] * (1.0 - severity);

	// Go back to sRGB
	const sRGB = [];
	for (let c of cvd) {
		if (c <= 0) sRGB.push(0);
		else if (c >= 1) sRGB.push(255);
		else if (c < 0.0031308) sRGB.push(0.5 + c * 12.92 * 255);
		else sRGB.push(0 + 255 * (Math.pow(c, 1 / 2.4) * 1.055 - 0.055));
	}
	return sRGB;
}