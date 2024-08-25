import { dbID, dbIDStyle, initEL } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

// barvoslepy
const barvoslepyOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h };
	},
	imgWidth() {
		return;
	},
	image: null,
	differenceEpsilon: 10,
	sRGBToLinearRGBLookup: [],
	brettelFunctions: {
		Normal(color) {
			return color;
		},
		Protanopia(color) {
			return barvoslepyBrettel(color, "protan", 1.0);
		},
		Protanomaly(color) {
			return barvoslepyBrettel(color, "protan", 0.6);
		},
		Deuteranopia(color) {
			return barvoslepyBrettel(color, "deutan", 1.0);
		},
		Deuteranomaly(color) {
			return barvoslepyBrettel(color, "deutan", 0.6);
		},
		Tritanopia(color) {
			return barvoslepyBrettel(color, "tritan", 1.0);
		},
		Tritanomaly(color) {
			return barvoslepyBrettel(color, "tritan", 0.6);
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
};

initEL({ id: idFile_barvoslepyUpload, action: "change", fn: barvoslepyLoadFile });
initEL({ id: idSel_barvoslepySelect, fn: barvoslepyFilter, selStartValue: "Tritanopia", selList: Object.keys(barvoslepyOptions.brettelFunctions).map((v) => [v, v]) });

export function clear_cl_Barvoslepy() {
	idSel_barvoslepySelect.KadReset();
	dbIDStyle(idImg_barvoslepy).transitionDuration = "0s";
	barvoslepyOptions.image = new Image();
	barvoslepyOptions.image.src = `./Benkyou/DSC_1275.JPG`;
	barvoslepyOptions.image.onload = barvoslepyImageLoaded;

	barvoslepyOptions.sRGBToLinearRGBLookup = [];
	for (let i = 0; i < 256; i++) {
		const fv = i / 255.0;
		barvoslepyOptions.sRGBToLinearRGBLookup[i] = fv < 0.04045 ? fv / 12.92 : Math.pow((fv + 0.055) / 1.055, 2.4);
	}
}
function barvoslepyImageLoaded(source) {
	barvoslepyOptions.image = source.target;
	dbID(idImg_barvoslepy).src = barvoslepyOptions.image.src;
	dbIDStyle(idImg_barvoslepy).width = `${Math.min(barvoslepyOptions.image.width, barvoslepyOptions.canvas.w)}px`;
	barvoslepyFilter();
}
function barvoslepyLoadFile(file) {
	let selectedFile = file.target.files[0];
	let fileReader = new FileReader();
	fileReader.onload = (file) => {
		const img = new Image();
		img.onload = barvoslepyImageLoaded;
		img.src = file.target.result;
		// dbID(idImg_barvoslepy).src = file.target.result;
	};
	fileReader.readAsDataURL(selectedFile);
}

function barvoslepyFilter() {
	let type = idSel_barvoslepySelect.KadGet();
	const w = barvoslepyOptions.image.width;
	const h = barvoslepyOptions.image.height;
	const ratio = w / h;

	const canvasFiltered = dbID(idCanv_barvoslepyCanvas);
	const canvasDifferencePositive = dbID(idCanv_barvoslepyDifferencePositive);
	const canvasDifferenceNegative = dbID(idCanv_barvoslepyDifferenceNegative);

	const canvasWidth = Math.min(barvoslepyOptions.image.width, barvoslepyOptions.canvas.w);
	const canvasHeight = Math.round(canvasWidth / ratio);
	canvasFiltered.width = canvasWidth;
	canvasFiltered.height = canvasHeight;
	canvasDifferencePositive.width = canvasWidth;
	canvasDifferencePositive.height = canvasHeight;
	canvasDifferenceNegative.width = canvasWidth;
	canvasDifferenceNegative.height = canvasHeight;

	const ctxFiltered = canvasFiltered.getContext("2d");
	const ctxDifferencePositive = canvasDifferencePositive.getContext("2d");
	const ctxDifferenceNegative = canvasDifferenceNegative.getContext("2d");
	ctxFiltered.drawImage(barvoslepyOptions.image, 0, 0, w, h, 0, 0, canvasWidth, canvasHeight);
	ctxDifferencePositive.drawImage(barvoslepyOptions.image, 0, 0, w, h, 0, 0, canvasWidth, canvasHeight);
	ctxDifferenceNegative.drawImage(barvoslepyOptions.image, 0, 0, w, h, 0, 0, canvasWidth, canvasHeight);
	let pixelsFiltered = ctxFiltered.getImageData(0, 0, w, h);
	let pixelsDifferencePositive = ctxDifferencePositive.getImageData(0, 0, w, h);
	let pixelsDifferenceNegative = ctxDifferenceNegative.getImageData(0, 0, w, h);

	for (let i = 0; i < pixelsFiltered.data.length; i += 4) {
		const pixelFiltered = [pixelsFiltered.data[i], pixelsFiltered.data[i + 1], pixelsFiltered.data[i + 2]];
		const filteredRGB = barvoslepyOptions.brettelFunctions[type](pixelFiltered);
		pixelsFiltered.data[i + 0] = filteredRGB[0];
		pixelsFiltered.data[i + 1] = filteredRGB[1];
		pixelsFiltered.data[i + 2] = filteredRGB[2];

		const diff = barvoslepyDifferencePixel(i, pixelsDifferencePositive.data, pixelsFiltered.data);
		pixelsDifferencePositive.data[i + 0] = diff ? filteredRGB[0] : 0;
		pixelsDifferencePositive.data[i + 1] = diff ? filteredRGB[1] : 0;
		pixelsDifferencePositive.data[i + 2] = diff ? filteredRGB[2] : 0;

    pixelsDifferenceNegative.data[i + 0] = diff ? 0:filteredRGB[0] ;
    pixelsDifferenceNegative.data[i + 1] = diff ? 0:filteredRGB[1] ;
    pixelsDifferenceNegative.data[i + 2] = diff ? 0:filteredRGB[2] ;

		// pixelsDifferenceNegative.data[i + 0] = !barvoslepyDifference(pixelsDifferenceNegative.data[i + 0], pixelsFiltered.data[i + 0]) ? 255 : 0;
		// pixelsDifferenceNegative.data[i + 1] = !barvoslepyDifference(pixelsDifferenceNegative.data[i + 1], pixelsFiltered.data[i + 1]) ? 255 : 0;
		// pixelsDifferenceNegative.data[i + 2] = !barvoslepyDifference(pixelsDifferenceNegative.data[i + 2], pixelsFiltered.data[i + 2]) ? 255 : 0;
	}
	ctxFiltered.putImageData(pixelsFiltered, 0, 0);
	ctxDifferencePositive.putImageData(pixelsDifferencePositive, 0, 0);
	ctxDifferenceNegative.putImageData(pixelsDifferenceNegative, 0, 0);
}

function barvoslepyDifferencePixel(i, pixOrig, pixFiltered) {
	let count = 0;
	for (let n = 0; n < 3; n++) {
		if (Math.abs(pixOrig[i + n] - pixFiltered[i + n]) > barvoslepyOptions.differenceEpsilon) count++;
	}
	return count == 0;
}
function barvoslepyDifference(pixOrig, pixFiltered) {
	return Math.abs(pixOrig - pixFiltered) > barvoslepyOptions.differenceEpsilon;
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
