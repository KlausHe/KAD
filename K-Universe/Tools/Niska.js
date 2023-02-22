//https://schraube-mutter.de/bohrtabelle-fuer-zylinderschrauben/
const niskaOptions = {
	size: {
		val: 0,
		valOrig: 6,
	},
	pitch: {
		val: 1,
		valOrig: 1,
	},
	select: {
		index: 0,
		indexOrig: 8,
		type: "",
		typeOrig: "regel",
		get offset() {
			return this.type == "regel" ? 0 : niskaOptions.regel.length;
		},
		get size() {
			return niskaOptions[this.type][this.index][0];
		},
		get pitch() {
			return niskaOptions[this.type][this.index][1];
		},
	},
	headSize: {
		// Gewinde,  Kopfdurchmesser (innen),	Schlüsselweite (innen),Kopfdurchmesser (außen), Schlüsselweite (außen)
		"M1.4": [2.6, 1.3, 0.8, 2],
		"M1.6": [3, 1.5, 1.1, 3.2],
		M2: [3.8, 1.5, 1.4, 4],
		"M2.5": [4.5, 2, 1.7, 5],
		M3: [5.5, 2.5, 2, 5.5],
		M4: [7, 3, 2.8, 7],
		M5: [8.5, 4, 3.5, 8],
		M6: [10, 5, 4, 10],
		M7: [11.5, 6, 4.8, 11],
		M8: [13, 6, 5.3, 13],
		M10: [16, 8, 6.4, 17],
		M12: [18, 10, 7.5, 19],
		M14: [21, 12, 8.8, 22],
		M16: [24, 14, 10, 24],
		M18: [27, 14, 11.5, 27],
		M20: [30, 17, 12.5, 30],
		M22: [33, 17, 14, 32],
		M24: [36, 19, 15, 36],
		M27: [41, 19, 17, 41],
		M30: [45, 22, 18.7, 46],
		M33: [51, 22, 21, 50],
		M36: [54, 27, 22.5, 55],
		M42: [63, 32, 26, 65],
		M48: [72, 36, 30, 75],
		M56: [84, 41, 35, 85],
		M64: [96, 46, 40, 95],
	},
	regel: [
		[1, 0.25, "DIN13-1"],
		[1.2, 0.25, "DIN13-1"],
		[1.4, 0.3, "DIN13-1"],
		[1.6, 0.35, "DIN13-1"],
		[2, 0.4, "DIN13-1"],
		[2.5, 0.45, "DIN13-1"],
		[3, 0.5, "DIN13-1"],
		[4, 0.7, "DIN13-1"],
		[5, 0.8, "DIN13-1"],
		[6, 1, "DIN13-1"],
		[7, 1, "DIN13-1"],
		[8, 1.25, "DIN13-1"],
		[10, 1.5, "DIN13-1"],
		[12, 1.75, "DIN13-1"],
		[14, 2, "DIN13-1"],
		[16, 2, "DIN13-1"],
		[16, 2.5, "DIN13-1"],
		[20, 2.5, "DIN13-1"],
		[22, 2.5, "DIN13-1"],
		[24, 3, "DIN13-1"],
		[27, 3, "DIN13-1"],
		[30, 3.5, "DIN13-1"],
		[33, 3.5, "DIN13-1"],
		[36, 4, "DIN13-1"],
		[39, 4, "DIN13-1"],
		[42, 4.5, "DIN13-1"],
		[45, 4.5, "DIN13-1"],
		[48, 5, "DIN13-1"],
		[52, 5, "DIN13-1"],
		[56, 5.5, "DIN13-1"],
		[60, 5.5, "DIN13-1"],
		[64, 6, "DIN13-1"],
		[68, 6, "DIN13-1"],
	],
	fein: [
		[1, 0.2, "DIN13-2"],
		[1.1, 0.2, "DIN13-2"],
		[1.2, 0.2, "DIN13-2"],
		[1.4, 0.2, "DIN13-2"],
		[1.4, 0.25, "DIN13-2"],
		[1.6, 0.2, "DIN13-2"],
		[1.6, 0.25, "DIN13-2"],
		[1.8, 0.2, "DIN13-2"],
		[1.8, 0.25, "DIN13-2"],
		[2, 0.2, "DIN13-2"],
		[2, 0.25, "DIN13-2"],
		[2, 0.35, "DIN13-2"],
		[2.2, 0.2, "DIN13-2"],
		[2.2, 0.25, "DIN13-2"],
		[2.2, 0.35, "DIN13-2"],
		[2.5, 0.2, "DIN13-2"],
		[2.5, 0.25, "DIN13-2"],
		[2.5, 0.35, "DIN13-2"],
		[3, 0.2, "DIN13-2"],
		[3, 0.25, "DIN13-2"],
		[3, 0.35, "DIN13-2"],
		[3.5, 0.2, "DIN13-2"],
		[3.5, 0.25, "DIN13-2"],
		[3.5, 0.35, "DIN13-2"],
		[3.5, 0.5, "DIN13-3"],
		[4, 0.2, "DIN13-2"],
		[4, 0.25, "DIN13-2"],
		[4, 0.35, "DIN13-2"],
		[4, 0.5, "DIN13-3"],
		[4.5, 0.2, "DIN13-2"],
		[4.5, 0.25, "DIN13-2"],
		[4.5, 0.35, "DIN13-2"],
		[4.5, 0.5, "DIN13-3"],
		[5, 0.2, "DIN13-2"],
		[5, 0.25, "DIN13-2"],
		[5, 0.35, "DIN13-2"],
		[5, 0.5, "DIN13-3"],
		[5, 0.75, "DIN13-4"],
		[5.5, 0.2, "DIN13-2"],
		[5.5, 0.25, "DIN13-2"],
		[5.5, 0.35, "DIN13-2"],
		[5.5, 0.5, "DIN13-3"],
		[5.5, 0.75, "DIN13-4"],
		[6, 0.2, "DIN13-2"],
		[6, 0.25, "DIN13-2"],
		[6, 0.35, "DIN13-2"],
		[6, 0.5, "DIN13-3"],
		[6, 0.75, "DIN13-4"],
		[6.5, 0.2, "DIN13-2"],
		[6.5, 0.25, "DIN13-2"],
		[6.5, 0.35, "DIN13-2"],
		[6.5, 0.5, "DIN13-3"],
		[6.5, 0.75, "DIN13-4"],
		[7, 0.2, "DIN13-2"],
		[7, 0.25, "DIN13-2"],
		[7, 0.35, "DIN13-2"],
		[7, 0.5, "DIN13-3"],
		[7, 0.75, "DIN13-4"],
		[7.5, 0.2, "DIN13-2"],
		[7.5, 0.25, "DIN13-2"],
		[7.5, 0.35, "DIN13-2"],
		[7.5, 0.5, "DIN13-3"],
		[7.5, 0.75, "DIN13-4"],
		[7.5, 1, "DIN13-5"],
		[8, 0.2, "DIN13-2"],
		[8, 0.25, "DIN13-2"],
		[8, 0.35, "DIN13-2"],
		[8, 0.5, "DIN13-3"],
		[8, 0.75, "DIN13-4"],
		[8, 1, "DIN13-5"],
		[8.5, 0.2, "DIN13-2"],
		[8.5, 0.25, "DIN13-2"],
		[8.5, 0.35, "DIN13-2"],
		[8.5, 0.5, "DIN13-3"],
		[8.5, 0.75, "DIN13-4"],
		[8.5, 1, "DIN13-5"],
		[9, 0.2, "DIN13-2"],
		[9, 0.25, "DIN13-2"],
		[9, 0.35, "DIN13-2"],
		[9, 0.5, "DIN13-3"],
		[9, 0.75, "DIN13-4"],
		[9, 1, "DIN13-5"],
		[9.5, 0.2, "DIN13-2"],
		[9.5, 0.25, "DIN13-2"],
		[9.5, 0.35, "DIN13-2"],
		[9.5, 0.5, "DIN13-3"],
		[9.5, 0.75, "DIN13-4"],
		[9.5, 1, "DIN13-5"],
		[10, 0.2, "DIN13-2"],
		[10, 0.25, "DIN13-2"],
		[10, 0.35, "DIN13-2"],
		[10, 0.5, "DIN13-3"],
		[10, 0.75, "DIN13-4"],
		[10, 1, "DIN13-5"],
		[10, 1.25, "DIN13-5"],
		[10.5, 0.35, "DIN13-2"],
		[10.5, 0.5, "DIN13-3"],
		[10.5, 0.75, "DIN13-4"],
		[10.5, 1, "DIN13-5"],
		[11, 0.35, "DIN13-2"],
		[11, 0.5, "DIN13-3"],
		[11, 0.75, "DIN13-4"],
		[11, 1, "DIN13-5"],
		[11.5, 0.35, "DIN13-2"],
		[11.5, 0.5, "DIN13-3"],
		[11.5, 0.75, "DIN13-4"],
		[11.5, 1, "DIN13-5"],
		[12, 0.35, "DIN13-2"],
		[12, 0.5, "DIN13-3"],
		[12, 0.75, "DIN13-4"],
		[12, 1, "DIN13-5"],
		[12, 1.25, "DIN13-5"],
		[12, 1.5, "DIN13-6"],
		[12.5, 0.35, "DIN13-2"],
		[12.5, 0.5, "DIN13-3"],
		[12.5, 0.75, "DIN13-4"],
		[12.5, 1, "DIN13-5"],
		[13, 0.35, "DIN13-2"],
		[13, 0.5, "DIN13-3"],
		[13, 0.75, "DIN13-4"],
		[13, 1, "DIN13-5"],
		[13, 1.5, "DIN13-6"],
		[13.5, 0.35, "DIN13-2"],
		[13.5, 0.5, "DIN13-3"],
		[13.5, 0.75, "DIN13-4"],
		[13.5, 1, "DIN13-5"],
		[14, 0.35, "DIN13-2"],
		[14, 0.5, "DIN13-3"],
		[14, 0.75, "DIN13-4"],
		[14, 1, "DIN13-5"],
		[14, 1.5, "DIN13-6"],
		[14.5, 0.35, "DIN13-2"],
		[14.5, 0.5, "DIN13-3"],
		[14.5, 0.75, "DIN13-4"],
		[14.5, 1, "DIN13-5"],
		[15, 0.35, "DIN13-2"],
		[15, 0.5, "DIN13-3"],
		[15, 0.75, "DIN13-4"],
		[15, 1, "DIN13-5"],
		[15, 1.5, "DIN13-6"],
		[15.5, 0.35, "DIN13-2"],
		[15.5, 0.5, "DIN13-3"],
		[16, 0.35, "DIN13-2"],
		[16, 0.5, "DIN13-3"],
		[16, 0.75, "DIN13-4"],
		[16, 1, "DIN13-5"],
		[16, 1.5, "DIN13-6"],
		[16.5, 0.5, "DIN13-3"],
		[17, 0.35, "DIN13-2"],
		[17, 0.5, "DIN13-3"],
		[17, 0.75, "DIN13-4"],
		[17, 1, "DIN13-5"],
		[17, 1.5, "DIN13-6"],
		[17, 2, "DIN13-7"],
		[17.5, 0.5, "DIN13-3"],
		[18, 0.35, "DIN13-2"],
		[18, 0.5, "DIN13-3"],
		[18, 0.75, "DIN13-4"],
		[18, 1, "DIN13-5"],
		[18, 1.5, "DIN13-6"],
		[18, 2, "DIN13-7"],
		[18.5, 0.5, "DIN13-3"],
		[19, 0.35, "DIN13-2"],
		[19, 0.5, "DIN13-3"],
		[19, 0.75, "DIN13-4"],
		[19, 1, "DIN13-5"],
		[19, 1.5, "DIN13-6"],
		[19, 2, "DIN13-7"],
		[19.5, 0.5, "DIN13-3"],
		[20, 0.35, "DIN13-2"],
		[20, 0.5, "DIN13-3"],
		[20, 0.75, "DIN13-4"],
		[20, 1, "DIN13-5"],
		[20, 1.5, "DIN13-6"],
		[20, 2, "DIN13-7"],
		[20.5, 0.5, "DIN13-3"],
		[21, 0.35, "DIN13-2"],
		[21, 0.5, "DIN13-3"],
		[21, 0.75, "DIN13-4"],
		[21, 1, "DIN13-5"],
		[21, 1.5, "DIN13-6"],
		[21, 2, "DIN13-7"],
		[21.5, 0.5, "DIN13-3"],
		[22, 0.35, "DIN13-2"],
		[22, 0.5, "DIN13-3"],
		[22, 0.75, "DIN13-4"],
		[22, 1, "DIN13-5"],
		[22, 1.5, "DIN13-6"],
		[22, 2, "DIN13-7"],
		[22.5, 0.5, "DIN13-3"],
		[23, 0.35, "DIN13-2"],
		[23, 0.5, "DIN13-3"],
		[23, 0.75, "DIN13-4"],
		[23, 1, "DIN13-5"],
		[23, 1.5, "DIN13-6"],
		[23, 2, "DIN13-7"],
		[23.5, 0.5, "DIN13-3"],
		[24, 0.35, "DIN13-2"],
		[24, 0.5, "DIN13-3"],
		[24, 0.75, "DIN13-4"],
		[24, 1, "DIN13-5"],
		[24, 1.5, "DIN13-6"],
		[24, 2, "DIN13-7"],
		[24.5, 0.5, "DIN13-3"],
		[25, 0.35, "DIN13-2"],
		[25, 0.5, "DIN13-3"],
		[25, 0.75, "DIN13-4"],
		[25, 1, "DIN13-5"],
		[25, 1.5, "DIN13-6"],
		[25, 2, "DIN13-7"],
		[25.5, 0.5, "DIN13-3"],
		[26, 0.35, "DIN13-2"],
		[26, 0.5, "DIN13-3"],
		[26, 0.75, "DIN13-4"],
		[26, 1, "DIN13-5"],
		[26, 1.5, "DIN13-6"],
		[26, 2, "DIN13-7"],
		[26.5, 0.5, "DIN13-3"],
		[27, 0.35, "DIN13-2"],
		[27, 0.5, "DIN13-3"],
		[27, 0.75, "DIN13-4"],
		[27, 1, "DIN13-5"],
		[27, 1.5, "DIN13-6"],
		[27, 2, "DIN13-7"],
		[27.5, 0.5, "DIN13-3"],
		[28, 0.35, "DIN13-2"],
		[28, 0.5, "DIN13-3"],
		[28, 0.75, "DIN13-4"],
		[28, 1, "DIN13-5"],
		[28, 1.5, "DIN13-6"],
		[28, 2, "DIN13-7"],
		[28, 3, "DIN13-8"],
		[28.5, 0.5, "DIN13-3"],
		[29, 0.35, "DIN13-2"],
		[29, 0.5, "DIN13-3"],
		[29, 0.75, "DIN13-4"],
		[29, 1, "DIN13-5"],
		[29, 1.5, "DIN13-6"],
		[29.5, 0.5, "DIN13-3"],
		[30, 0.35, "DIN13-2"],
		[30, 0.5, "DIN13-3"],
		[30, 0.75, "DIN13-4"],
		[30, 1, "DIN13-5"],
		[30, 1.5, "DIN13-6"],
		[30, 2, "DIN13-7"],
		[30, 3, "DIN13-8"],
		[30.5, 0.5, "DIN13-3"],
		[31, 0.35, "DIN13-2"],
		[31, 0.5, "DIN13-3"],
		[31, 0.75, "DIN13-4"],
		[31, 1, "DIN13-5"],
		[31, 1.5, "DIN13-6"],
		[31.5, 0.5, "DIN13-3"],
		[32, 0.35, "DIN13-2"],
		[32, 0.5, "DIN13-3"],
		[32, 0.75, "DIN13-4"],
		[32, 1, "DIN13-5"],
		[32, 1.5, "DIN13-6"],
		[32, 2, "DIN13-7"],
		[32, 3, "DIN13-8"],
		[32.5, 0.5, "DIN13-3"],
		[33, 0.35, "DIN13-2"],
		[33, 0.5, "DIN13-3"],
		[33, 0.75, "DIN13-4"],
		[33, 1, "DIN13-5"],
		[33, 1.5, "DIN13-6"],
		[33, 2, "DIN13-7"],
		[33, 3, "DIN13-8"],
		[33.5, 0.5, "DIN13-3"],
		[34, 0.35, "DIN13-2"],
		[34, 0.5, "DIN13-3"],
		[34, 0.75, "DIN13-4"],
		[34, 1, "DIN13-5"],
		[34, 1.5, "DIN13-6"],
		[34, 2, "DIN13-7"],
		[34, 3, "DIN13-8"],
		[34.5, 0.5, "DIN13-3"],
		[35, 0.35, "DIN13-2"],
		[35, 0.5, "DIN13-3"],
		[35, 0.75, "DIN13-4"],
		[35, 1, "DIN13-5"],
		[35, 1.5, "DIN13-6"],
		[35, 2, "DIN13-7"],
		[35, 3, "DIN13-8"],
		[35.5, 0.5, "DIN13-3"],
		[36, 0.35, "DIN13-2"],
		[36, 0.5, "DIN13-3"],
		[36, 0.75, "DIN13-4"],
		[36, 1, "DIN13-5"],
		[36, 1.5, "DIN13-6"],
		[36, 2, "DIN13-7"],
		[36, 3, "DIN13-8"],
		[36.5, 0.5, "DIN13-3"],
		[37, 0.35, "DIN13-2"],
		[37, 0.5, "DIN13-3"],
		[37, 0.75, "DIN13-4"],
		[37, 1, "DIN13-5"],
		[37, 1.5, "DIN13-6"],
		[37.5, 0.5, "DIN13-3"],
		[38, 0.35, "DIN13-2"],
		[38, 0.5, "DIN13-3"],
		[38, 0.75, "DIN13-4"],
		[38, 1, "DIN13-5"],
		[38, 1.5, "DIN13-6"],
		[38, 2, "DIN13-7"],
		[38, 3, "DIN13-8"],
		[38.5, 0.5, "DIN13-3"],
		[39, 0.35, "DIN13-2"],
		[39, 0.5, "DIN13-3"],
		[39, 0.75, "DIN13-4"],
		[39, 1, "DIN13-5"],
		[39, 1.5, "DIN13-6"],
		[39, 2, "DIN13-7"],
		[39, 3, "DIN13-8"],
		[39.5, 0.5, "DIN13-3"],
		[40, 0.35, "DIN13-2"],
		[40, 0.5, "DIN13-3"],
		[40, 0.75, "DIN13-4"],
		[40, 1, "DIN13-5"],
		[40, 1.5, "DIN13-6"],
		[40, 2, "DIN13-7"],
		[40, 3, "DIN13-8"],
		[40, 4, "DIN13-9"],
		[40.5, 0.5, "DIN13-3"],
		[41, 0.5, "DIN13-3"],
		[41, 0.75, "DIN13-4"],
		[41.5, 0.5, "DIN13-3"],
		[42, 0.35, "DIN13-2"],
		[42, 0.5, "DIN13-3"],
		[42, 0.75, "DIN13-4"],
		[42, 1, "DIN13-5"],
		[42, 1.5, "DIN13-6"],
		[42, 2, "DIN13-7"],
		[42, 3, "DIN13-8"],
		[42, 4, "DIN13-9"],
		[42.5, 0.5, "DIN13-3"],
		[43, 0.5, "DIN13-3"],
		[43, 0.75, "DIN13-4"],
		[43.5, 0.5, "DIN13-3"],
		[44, 0.5, "DIN13-3"],
		[44, 0.75, "DIN13-4"],
		[44, 1, "DIN13-5"],
		[44.5, 0.5, "DIN13-3"],
		[45, 0.35, "DIN13-2"],
		[45, 0.5, "DIN13-3"],
		[45, 0.75, "DIN13-4"],
		[45, 1, "DIN13-5"],
		[45, 1.5, "DIN13-6"],
		[45, 2, "DIN13-7"],
		[45, 3, "DIN13-8"],
		[45, 4, "DIN13-9"],
		[45.5, 0.5, "DIN13-3"],
		[46, 0.5, "DIN13-3"],
		[46, 0.75, "DIN13-4"],
		[46.5, 0.5, "DIN13-3"],
		[47, 0.5, "DIN13-3"],
		[47, 0.75, "DIN13-4"],
		[47.5, 0.5, "DIN13-3"],
		[48, 0.35, "DIN13-2"],
		[48, 0.5, "DIN13-3"],
		[48, 0.75, "DIN13-4"],
		[48, 1, "DIN13-5"],
		[48, 1.5, "DIN13-6"],
		[48, 2, "DIN13-7"],
		[48, 3, "DIN13-8"],
		[48, 4, "DIN13-9"],
		[48.5, 0.5, "DIN13-3"],
		[49, 0.5, "DIN13-3"],
		[49, 0.75, "DIN13-4"],
		[49, 1, "DIN13-5"],
		[49.5, 0.5, "DIN13-3"],
		[50, 0.35, "DIN13-2"],
		[50, 0.5, "DIN13-3"],
		[50, 0.75, "DIN13-4"],
		[50, 1, "DIN13-5"],
		[50, 1.5, "DIN13-6"],
		[50, 2, "DIN13-7"],
		[50, 3, "DIN13-8"],
		[50, 4, "DIN13-9"],
		[51, 0.5, "DIN13-3"],
		[51, 0.75, "DIN13-4"],
		[52, 0.5, "DIN13-3"],
		[52, 0.75, "DIN13-4"],
		[52, 1, "DIN13-5"],
		[52, 1.5, "DIN13-6"],
		[52, 2, "DIN13-7"],
		[52, 3, "DIN13-8"],
		[52, 4, "DIN13-9"],
		[53, 0.5, "DIN13-3"],
		[53, 0.75, "DIN13-4"],
		[54, 0.5, "DIN13-3"],
		[54, 0.75, "DIN13-4"],
		[55, 0.5, "DIN13-3"],
		[55, 0.75, "DIN13-4"],
		[55, 1, "DIN13-5"],
		[55, 1.5, "DIN13-6"],
		[55, 2, "DIN13-7"],
		[55, 3, "DIN13-8"],
		[55, 4, "DIN13-9"],
		[56, 0.5, "DIN13-3"],
		[56, 0.75, "DIN13-4"],
		[56, 1, "DIN13-5"],
		[56, 1.5, "DIN13-6"],
		[56, 2, "DIN13-7"],
		[56, 3, "DIN13-8"],
		[56, 4, "DIN13-9"],
		[57, 0.5, "DIN13-3"],
		[57, 0.75, "DIN13-4"],
		[58, 0.5, "DIN13-3"],
		[58, 0.75, "DIN13-4"],
		[58, 1, "DIN13-5"],
		[58, 1.5, "DIN13-6"],
		[58, 2, "DIN13-7"],
		[58, 3, "DIN13-8"],
		[58, 4, "DIN13-9"],
		[59, 0.5, "DIN13-3"],
		[59, 0.75, "DIN13-4"],
		[60, 0.5, "DIN13-3"],
		[60, 0.75, "DIN13-4"],
		[60, 1, "DIN13-5"],
		[60, 1.5, "DIN13-6"],
		[60, 2, "DIN13-7"],
		[60, 3, "DIN13-8"],
		[60, 4, "DIN13-9"],
		[61, 0.5, "DIN13-3"],
		[61, 0.75, "DIN13-4"],
		[62, 0.5, "DIN13-3"],
		[62, 0.75, "DIN13-4"],
		[62, 1, "DIN13-5"],
		[62, 1.5, "DIN13-6"],
		[62, 2, "DIN13-7"],
		[62, 3, "DIN13-8"],
		[62, 4, "DIN13-9"],
		[63, 0.5, "DIN13-3"],
		[63, 0.75, "DIN13-4"],
		[64, 0.5, "DIN13-3"],
		[64, 0.75, "DIN13-4"],
		[64, 1, "DIN13-5"],
		[64, 1.5, "DIN13-6"],
		[64, 2, "DIN13-7"],
		[64, 3, "DIN13-8"],
		[64, 4, "DIN13-9"],
		[65, 0.5, "DIN13-3"],
		[65, 0.75, "DIN13-4"],
		[65, 1, "DIN13-5"],
		[65, 1.5, "DIN13-6"],
		[65, 2, "DIN13-7"],
		[65, 3, "DIN13-8"],
		[65, 4, "DIN13-9"],
		[66, 0.75, "DIN13-4"],
		[67, 0.75, "DIN13-4"],
		[68, 0.5, "DIN13-3"],
		[68, 0.75, "DIN13-4"],
		[68, 1, "DIN13-5"],
		[68, 1.5, "DIN13-6"],
		[68, 2, "DIN13-7"],
		[68, 3, "DIN13-8"],
		[68, 4, "DIN13-9"],
		[69, 0.75, "DIN13-4"],
		[70, 0.5, "DIN13-3"],
		[70, 0.75, "DIN13-4"],
		[70, 1, "DIN13-5"],
		[70, 1.5, "DIN13-6"],
		[70, 2, "DIN13-7"],
		[70, 3, "DIN13-8"],
		[70, 4, "DIN13-9"],
		[70, 6, "DIN13-10"],
		[72, 0.5, "DIN13-3"],
		[72, 0.75, "DIN13-4"],
		[72, 1, "DIN13-5"],
		[72, 1.5, "DIN13-6"],
		[72, 2, "DIN13-7"],
		[72, 3, "DIN13-8"],
		[72, 4, "DIN13-9"],
		[72, 6, "DIN13-10"],
		[75, 0.5, "DIN13-3"],
		[75, 0.75, "DIN13-4"],
		[75, 1, "DIN13-5"],
		[75, 1.5, "DIN13-6"],
		[75, 2, "DIN13-7"],
		[75, 3, "DIN13-8"],
		[75, 4, "DIN13-9"],
		[76, 0.75, "DIN13-4"],
		[76, 1, "DIN13-5"],
		[76, 1.5, "DIN13-6"],
		[76, 2, "DIN13-7"],
		[76, 3, "DIN13-8"],
		[76, 4, "DIN13-9"],
		[76, 6, "DIN13-10"],
		[78, 0.5, "DIN13-3"],
		[78, 0.75, "DIN13-4"],
		[78, 1, "DIN13-5"],
		[78, 1.5, "DIN13-6"],
		[78, 2, "DIN13-7"],
		[78, 3, "DIN13-8"],
		[78, 4, "DIN13-9"],
		[80, 0.5, "DIN13-3"],
		[80, 0.75, "DIN13-4"],
		[80, 1, "DIN13-5"],
		[80, 1.5, "DIN13-6"],
		[80, 2, "DIN13-7"],
		[80, 3, "DIN13-8"],
		[80, 4, "DIN13-9"],
		[80, 6, "DIN13-10"],
		[82, 0.5, "DIN13-3"],
		[82, 0.75, "DIN13-4"],
		[82, 1, "DIN13-5"],
		[82, 1.5, "DIN13-6"],
		[82, 2, "DIN13-7"],
		[82, 3, "DIN13-8"],
		[82, 4, "DIN13-9"],
		[85, 0.5, "DIN13-3"],
		[85, 0.75, "DIN13-4"],
		[85, 1, "DIN13-5"],
		[85, 1.5, "DIN13-6"],
		[85, 2, "DIN13-7"],
		[85, 3, "DIN13-8"],
		[85, 4, "DIN13-9"],
		[85, 6, "DIN13-10"],
		[88, 0.5, "DIN13-3"],
		[88, 0.75, "DIN13-4"],
		[88, 1, "DIN13-5"],
		[88, 1.5, "DIN13-6"],
		[88, 2, "DIN13-7"],
		[88, 3, "DIN13-8"],
		[88, 4, "DIN13-9"],
		[90, 0.5, "DIN13-3"],
		[90, 0.75, "DIN13-4"],
		[90, 1, "DIN13-5"],
		[90, 1.5, "DIN13-6"],
		[90, 2, "DIN13-7"],
		[90, 3, "DIN13-8"],
		[90, 4, "DIN13-9"],
		[90, 6, "DIN13-10"],
		[92, 0.75, "DIN13-4"],
		[92, 1, "DIN13-5"],
		[92, 1.5, "DIN13-6"],
		[92, 2, "DIN13-7"],
		[92, 3, "DIN13-8"],
		[92, 4, "DIN13-9"],
		[95, 0.75, "DIN13-4"],
		[95, 1, "DIN13-5"],
		[95, 1.5, "DIN13-6"],
		[95, 2, "DIN13-7"],
		[95, 3, "DIN13-8"],
		[95, 4, "DIN13-9"],
		[95, 6, "DIN13-10"],
		[98, 0.75, "DIN13-4"],
		[98, 1, "DIN13-5"],
		[98, 1.5, "DIN13-6"],
		[98, 2, "DIN13-7"],
		[98, 3, "DIN13-8"],
		[98, 4, "DIN13-9"],
		[100, 0.75, "DIN13-4"],
		[100, 1, "DIN13-5"],
		[100, 1.5, "DIN13-6"],
		[100, 2, "DIN13-7"],
		[100, 3, "DIN13-8"],
		[100, 4, "DIN13-9"],
		[100, 6, "DIN13-10"],
		[102, 0.75, "DIN13-4"],
		[102, 1, "DIN13-5"],
		[102, 1.5, "DIN13-6"],
		[102, 2, "DIN13-7"],
		[102, 3, "DIN13-8"],
		[102, 4, "DIN13-9"],
		[105, 0.75, "DIN13-4"],
		[105, 1, "DIN13-5"],
		[105, 1.5, "DIN13-6"],
		[105, 2, "DIN13-7"],
		[105, 3, "DIN13-8"],
		[105, 4, "DIN13-9"],
		[105, 6, "DIN13-10"],
		[108, 0.75, "DIN13-4"],
		[108, 1, "DIN13-5"],
		[108, 1.5, "DIN13-6"],
		[108, 2, "DIN13-7"],
		[108, 3, "DIN13-8"],
		[108, 4, "DIN13-9"],
		[110, 0.75, "DIN13-4"],
		[110, 1, "DIN13-5"],
		[110, 1.5, "DIN13-6"],
		[110, 2, "DIN13-7"],
		[110, 3, "DIN13-8"],
		[110, 4, "DIN13-9"],
		[110, 6, "DIN13-10"],
		[112, 1, "DIN13-5"],
		[112, 1.5, "DIN13-6"],
		[112, 2, "DIN13-7"],
		[112, 3, "DIN13-8"],
		[112, 4, "DIN13-9"],
		[115, 1, "DIN13-5"],
		[115, 1.5, "DIN13-6"],
		[115, 2, "DIN13-7"],
		[115, 3, "DIN13-8"],
		[115, 4, "DIN13-9"],
		[115, 6, "DIN13-10"],
		[118, 1, "DIN13-5"],
		[118, 1.5, "DIN13-6"],
		[118, 2, "DIN13-7"],
		[118, 3, "DIN13-8"],
		[118, 4, "DIN13-9"],
		[120, 1, "DIN13-5"],
		[120, 1.5, "DIN13-6"],
		[120, 2, "DIN13-7"],
		[120, 3, "DIN13-8"],
		[120, 4, "DIN13-9"],
		[120, 6, "DIN13-10"],
		[122, 1, "DIN13-5"],
		[122, 1.5, "DIN13-6"],
		[122, 2, "DIN13-7"],
		[122, 3, "DIN13-8"],
		[122, 4, "DIN13-9"],
		[125, 1, "DIN13-5"],
		[125, 1.5, "DIN13-6"],
		[125, 2, "DIN13-7"],
		[125, 3, "DIN13-8"],
		[125, 4, "DIN13-9"],
		[125, 6, "DIN13-10"],
		[128, 1, "DIN13-5"],
		[128, 1.5, "DIN13-6"],
		[128, 2, "DIN13-7"],
		[128, 3, "DIN13-8"],
		[128, 4, "DIN13-9"],
		[130, 1, "DIN13-5"],
		[130, 1.5, "DIN13-6"],
		[130, 2, "DIN13-7"],
		[130, 3, "DIN13-8"],
		[130, 4, "DIN13-9"],
		[130, 6, "DIN13-10"],
		[130, 8, "DIN13-11"],
		[132, 1, "DIN13-5"],
		[132, 1.5, "DIN13-6"],
		[132, 2, "DIN13-7"],
		[132, 3, "DIN13-8"],
		[132, 4, "DIN13-9"],
		[135, 1, "DIN13-5"],
		[135, 1.5, "DIN13-6"],
		[135, 2, "DIN13-7"],
		[135, 3, "DIN13-8"],
		[135, 4, "DIN13-9"],
		[135, 6, "DIN13-10"],
		[138, 1, "DIN13-5"],
		[138, 1.5, "DIN13-6"],
		[138, 2, "DIN13-7"],
		[138, 3, "DIN13-8"],
		[138, 4, "DIN13-9"],
		[140, 1, "DIN13-5"],
		[140, 1.5, "DIN13-6"],
		[140, 2, "DIN13-7"],
		[140, 3, "DIN13-8"],
		[140, 4, "DIN13-9"],
		[140, 6, "DIN13-10"],
		[140, 8, "DIN13-11"],
		[142, 1, "DIN13-5"],
		[142, 1.5, "DIN13-6"],
		[142, 2, "DIN13-7"],
		[142, 3, "DIN13-8"],
		[142, 4, "DIN13-9"],
		[145, 1, "DIN13-5"],
		[145, 1.5, "DIN13-6"],
		[145, 2, "DIN13-7"],
		[145, 3, "DIN13-8"],
		[145, 4, "DIN13-9"],
		[145, 6, "DIN13-10"],
		[148, 1, "DIN13-5"],
		[148, 1.5, "DIN13-6"],
		[148, 2, "DIN13-7"],
		[148, 3, "DIN13-8"],
		[148, 4, "DIN13-9"],
		[150, 1, "DIN13-5"],
		[150, 1.5, "DIN13-6"],
		[150, 2, "DIN13-7"],
		[150, 3, "DIN13-8"],
		[150, 4, "DIN13-9"],
		[150, 6, "DIN13-10"],
		[150, 8, "DIN13-11"],
		[152, 1, "DIN13-5"],
		[152, 1.5, "DIN13-6"],
		[152, 2, "DIN13-7"],
		[152, 3, "DIN13-8"],
		[152, 4, "DIN13-9"],
		[155, 1, "DIN13-5"],
		[155, 1.5, "DIN13-6"],
		[155, 2, "DIN13-7"],
		[155, 3, "DIN13-8"],
		[155, 4, "DIN13-9"],
		[155, 6, "DIN13-10"],
		[158, 1, "DIN13-5"],
		[158, 1.5, "DIN13-6"],
		[158, 2, "DIN13-7"],
		[158, 3, "DIN13-8"],
		[158, 4, "DIN13-9"],
		[160, 1, "DIN13-5"],
		[160, 1.5, "DIN13-6"],
		[160, 2, "DIN13-7"],
		[160, 3, "DIN13-8"],
		[160, 4, "DIN13-9"],
		[160, 6, "DIN13-10"],
		[160, 8, "DIN13-11"],
		[162, 1, "DIN13-5"],
		[162, 1.5, "DIN13-6"],
		[162, 2, "DIN13-7"],
		[162, 3, "DIN13-8"],
		[162, 4, "DIN13-9"],
		[165, 1, "DIN13-5"],
		[165, 1.5, "DIN13-6"],
		[165, 2, "DIN13-7"],
		[165, 3, "DIN13-8"],
		[165, 4, "DIN13-9"],
		[165, 6, "DIN13-10"],
		[168, 1, "DIN13-5"],
		[168, 1.5, "DIN13-6"],
		[168, 2, "DIN13-7"],
		[168, 3, "DIN13-8"],
		[168, 4, "DIN13-9"],
		[170, 1, "DIN13-5"],
		[170, 1.5, "DIN13-6"],
		[170, 2, "DIN13-7"],
		[170, 3, "DIN13-8"],
		[170, 4, "DIN13-9"],
		[170, 6, "DIN13-10"],
		[170, 8, "DIN13-11"],
		[172, 1, "DIN13-5"],
		[172, 1.5, "DIN13-6"],
		[172, 2, "DIN13-7"],
		[172, 3, "DIN13-8"],
		[172, 4, "DIN13-9"],
		[175, 1, "DIN13-5"],
		[175, 1.5, "DIN13-6"],
		[175, 2, "DIN13-7"],
		[175, 3, "DIN13-8"],
		[175, 4, "DIN13-9"],
		[175, 6, "DIN13-10"],
		[178, 1, "DIN13-5"],
		[178, 1.5, "DIN13-6"],
		[178, 2, "DIN13-7"],
		[178, 3, "DIN13-8"],
		[178, 4, "DIN13-9"],
		[180, 1, "DIN13-5"],
		[180, 1.5, "DIN13-6"],
		[180, 2, "DIN13-7"],
		[180, 3, "DIN13-8"],
		[180, 4, "DIN13-9"],
		[180, 6, "DIN13-10"],
		[180, 8, "DIN13-11"],
		[182, 1, "DIN13-5"],
		[182, 1.5, "DIN13-6"],
		[182, 2, "DIN13-7"],
		[182, 3, "DIN13-8"],
		[182, 4, "DIN13-9"],
		[185, 1, "DIN13-5"],
		[185, 1.5, "DIN13-6"],
		[185, 2, "DIN13-7"],
		[185, 3, "DIN13-8"],
		[185, 4, "DIN13-9"],
		[185, 6, "DIN13-10"],
		[188, 1, "DIN13-5"],
		[188, 1.5, "DIN13-6"],
		[188, 2, "DIN13-7"],
		[188, 3, "DIN13-8"],
		[188, 4, "DIN13-9"],
		[190, 1, "DIN13-5"],
		[190, 1.5, "DIN13-6"],
		[190, 2, "DIN13-7"],
		[190, 3, "DIN13-8"],
		[190, 4, "DIN13-9"],
		[190, 6, "DIN13-10"],
		[190, 8, "DIN13-11"],
		[192, 1, "DIN13-5"],
		[192, 1.5, "DIN13-6"],
		[192, 2, "DIN13-7"],
		[192, 3, "DIN13-8"],
		[192, 4, "DIN13-9"],
		[195, 1, "DIN13-5"],
		[195, 1.5, "DIN13-6"],
		[195, 2, "DIN13-7"],
		[195, 3, "DIN13-8"],
		[195, 4, "DIN13-9"],
		[195, 6, "DIN13-10"],
		[198, 1, "DIN13-5"],
		[198, 1.5, "DIN13-6"],
		[198, 2, "DIN13-7"],
		[198, 3, "DIN13-8"],
		[198, 4, "DIN13-9"],
		[200, 1, "DIN13-5"],
		[200, 1.5, "DIN13-6"],
		[200, 2, "DIN13-7"],
		[200, 3, "DIN13-8"],
		[200, 4, "DIN13-9"],
		[200, 6, "DIN13-10"],
		[200, 8, "DIN13-11"],
		[202, 1.5, "DIN13-6"],
		[202, 2, "DIN13-7"],
		[202, 3, "DIN13-8"],
		[202, 4, "DIN13-9"],
		[205, 1.5, "DIN13-6"],
		[205, 2, "DIN13-7"],
		[205, 3, "DIN13-8"],
		[205, 4, "DIN13-9"],
		[205, 6, "DIN13-10"],
		[208, 1.5, "DIN13-6"],
		[208, 2, "DIN13-7"],
		[208, 3, "DIN13-8"],
		[208, 4, "DIN13-9"],
		[210, 1.5, "DIN13-6"],
		[210, 2, "DIN13-7"],
		[210, 3, "DIN13-8"],
		[210, 4, "DIN13-9"],
		[210, 6, "DIN13-10"],
		[210, 8, "DIN13-11"],
		[212, 1.5, "DIN13-6"],
		[212, 2, "DIN13-7"],
		[212, 3, "DIN13-8"],
		[212, 4, "DIN13-9"],
		[215, 1.5, "DIN13-6"],
		[215, 2, "DIN13-7"],
		[215, 3, "DIN13-8"],
		[215, 4, "DIN13-9"],
		[215, 6, "DIN13-10"],
		[218, 1.5, "DIN13-6"],
		[218, 2, "DIN13-7"],
		[218, 3, "DIN13-8"],
		[218, 4, "DIN13-9"],
		[220, 1.5, "DIN13-6"],
		[220, 2, "DIN13-7"],
		[220, 3, "DIN13-8"],
		[220, 4, "DIN13-9"],
		[220, 6, "DIN13-10"],
		[220, 8, "DIN13-11"],
		[222, 1.5, "DIN13-6"],
		[222, 2, "DIN13-7"],
		[222, 3, "DIN13-8"],
		[222, 4, "DIN13-9"],
		[225, 1.5, "DIN13-6"],
		[225, 2, "DIN13-7"],
		[225, 3, "DIN13-8"],
		[225, 4, "DIN13-9"],
		[225, 6, "DIN13-10"],
		[228, 1.5, "DIN13-6"],
		[228, 2, "DIN13-7"],
		[228, 3, "DIN13-8"],
		[228, 4, "DIN13-9"],
		[230, 1.5, "DIN13-6"],
		[230, 2, "DIN13-7"],
		[230, 3, "DIN13-8"],
		[230, 4, "DIN13-9"],
		[230, 6, "DIN13-10"],
		[230, 8, "DIN13-11"],
		[232, 1.5, "DIN13-6"],
		[232, 2, "DIN13-7"],
		[232, 3, "DIN13-8"],
		[232, 4, "DIN13-9"],
		[235, 1.5, "DIN13-6"],
		[235, 2, "DIN13-7"],
		[235, 3, "DIN13-8"],
		[235, 4, "DIN13-9"],
		[235, 6, "DIN13-10"],
		[238, 1.5, "DIN13-6"],
		[238, 2, "DIN13-7"],
		[238, 3, "DIN13-8"],
		[238, 4, "DIN13-9"],
		[240, 1.5, "DIN13-6"],
		[240, 2, "DIN13-7"],
		[240, 3, "DIN13-8"],
		[240, 4, "DIN13-9"],
		[240, 6, "DIN13-10"],
		[240, 8, "DIN13-11"],
		[242, 1.5, "DIN13-6"],
		[242, 2, "DIN13-7"],
		[242, 3, "DIN13-8"],
		[242, 4, "DIN13-9"],
		[245, 1.5, "DIN13-6"],
		[245, 2, "DIN13-7"],
		[245, 3, "DIN13-8"],
		[245, 4, "DIN13-9"],
		[245, 6, "DIN13-10"],
		[248, 1.5, "DIN13-6"],
		[248, 2, "DIN13-7"],
		[248, 3, "DIN13-8"],
		[248, 4, "DIN13-9"],
		[250, 1.5, "DIN13-6"],
		[250, 2, "DIN13-7"],
		[250, 3, "DIN13-8"],
		[250, 4, "DIN13-9"],
		[250, 6, "DIN13-10"],
		[250, 8, "DIN13-11"],
		[252, 1.5, "DIN13-6"],
		[252, 2, "DIN13-7"],
		[252, 3, "DIN13-8"],
		[252, 4, "DIN13-9"],
		[255, 1.5, "DIN13-6"],
		[255, 2, "DIN13-7"],
		[255, 3, "DIN13-8"],
		[255, 4, "DIN13-9"],
		[255, 6, "DIN13-10"],
		[258, 1.5, "DIN13-6"],
		[258, 2, "DIN13-7"],
		[258, 3, "DIN13-8"],
		[258, 4, "DIN13-9"],
		[260, 1.5, "DIN13-6"],
		[260, 2, "DIN13-7"],
		[260, 3, "DIN13-8"],
		[260, 4, "DIN13-9"],
		[260, 6, "DIN13-10"],
		[260, 8, "DIN13-11"],
		[262, 1.5, "DIN13-6"],
		[262, 2, "DIN13-7"],
		[262, 3, "DIN13-8"],
		[262, 4, "DIN13-9"],
		[265, 1.5, "DIN13-6"],
		[265, 2, "DIN13-7"],
		[265, 3, "DIN13-8"],
		[265, 4, "DIN13-9"],
		[265, 6, "DIN13-10"],
		[268, 1.5, "DIN13-6"],
		[268, 2, "DIN13-7"],
		[268, 3, "DIN13-8"],
		[268, 4, "DIN13-9"],
		[270, 1.5, "DIN13-6"],
		[270, 2, "DIN13-7"],
		[270, 3, "DIN13-8"],
		[270, 4, "DIN13-9"],
		[270, 6, "DIN13-10"],
		[270, 8, "DIN13-11"],
		[272, 1.5, "DIN13-6"],
		[272, 2, "DIN13-7"],
		[272, 3, "DIN13-8"],
		[272, 4, "DIN13-9"],
		[275, 1.5, "DIN13-6"],
		[275, 2, "DIN13-7"],
		[275, 3, "DIN13-8"],
		[275, 4, "DIN13-9"],
		[275, 6, "DIN13-10"],
		[278, 1.5, "DIN13-6"],
		[278, 2, "DIN13-7"],
		[278, 3, "DIN13-8"],
		[278, 4, "DIN13-9"],
		[280, 1.5, "DIN13-6"],
		[280, 2, "DIN13-7"],
		[280, 3, "DIN13-8"],
		[280, 4, "DIN13-9"],
		[280, 6, "DIN13-10"],
		[280, 8, "DIN13-11"],
		[282, 1.5, "DIN13-6"],
		[282, 2, "DIN13-7"],
		[282, 3, "DIN13-8"],
		[282, 4, "DIN13-9"],
		[285, 1.5, "DIN13-6"],
		[285, 2, "DIN13-7"],
		[285, 3, "DIN13-8"],
		[285, 4, "DIN13-9"],
		[285, 6, "DIN13-10"],
		[288, 1.5, "DIN13-6"],
		[288, 2, "DIN13-7"],
		[288, 3, "DIN13-8"],
		[288, 4, "DIN13-9"],
		[290, 1.5, "DIN13-6"],
		[290, 2, "DIN13-7"],
		[290, 3, "DIN13-8"],
		[290, 4, "DIN13-9"],
		[290, 6, "DIN13-10"],
		[290, 8, "DIN13-11"],
		[292, 1.5, "DIN13-6"],
		[292, 2, "DIN13-7"],
		[292, 3, "DIN13-8"],
		[292, 4, "DIN13-9"],
		[295, 1.5, "DIN13-6"],
		[295, 2, "DIN13-7"],
		[295, 3, "DIN13-8"],
		[295, 4, "DIN13-9"],
		[295, 6, "DIN13-10"],
		[298, 1.5, "DIN13-6"],
		[298, 2, "DIN13-7"],
		[298, 3, "DIN13-8"],
		[298, 4, "DIN13-9"],
		[300, 1.5, "DIN13-6"],
		[300, 2, "DIN13-7"],
		[300, 3, "DIN13-8"],
		[300, 4, "DIN13-9"],
		[300, 6, "DIN13-10"],
		[300, 8, "DIN13-11"],
		[310, 6, "DIN13-10"],
		[320, 6, "DIN13-10"],
		[320, 8, "DIN13-11"],
		[330, 6, "DIN13-10"],
		[340, 6, "DIN13-10"],
		[340, 8, "DIN13-11"],
		[350, 6, "DIN13-10"],
		[360, 6, "DIN13-10"],
		[360, 8, "DIN13-11"],
		[370, 6, "DIN13-10"],
		[380, 6, "DIN13-10"],
		[380, 8, "DIN13-11"],
		[390, 6, "DIN13-10"],
		[400, 6, "DIN13-10"],
		[400, 8, "DIN13-11"],
		[410, 6, "DIN13-10"],
		[420, 6, "DIN13-10"],
		[420, 8, "DIN13-11"],
		[430, 6, "DIN13-10"],
		[440, 6, "DIN13-10"],
		[440, 8, "DIN13-11"],
		[450, 6, "DIN13-10"],
		[460, 6, "DIN13-10"],
		[460, 8, "DIN13-11"],
		[470, 6, "DIN13-10"],
		[480, 6, "DIN13-10"],
		[480, 8, "DIN13-11"],
		[490, 6, "DIN13-10"],
		[500, 6, "DIN13-10"],
		[500, 8, "DIN13-11"],
		[520, 8, "DIN13-11"],
		[540, 8, "DIN13-11"],
		[560, 8, "DIN13-11"],
		[580, 8, "DIN13-11"],
		[600, 8, "DIN13-11"],
		[620, 8, "DIN13-11"],
		[640, 8, "DIN13-11"],
		[660, 8, "DIN13-11"],
		[680, 8, "DIN13-11"],
		[700, 8, "DIN13-11"],
		[720, 8, "DIN13-11"],
		[740, 8, "DIN13-11"],
		[760, 8, "DIN13-11"],
		[780, 8, "DIN13-11"],
		[800, 8, "DIN13-11"],
		[820, 8, "DIN13-11"],
		[840, 8, "DIN13-11"],
		[860, 8, "DIN13-11"],
		[880, 8, "DIN13-11"],
		[900, 8, "DIN13-11"],
		[920, 8, "DIN13-11"],
		[940, 8, "DIN13-11"],
		[960, 8, "DIN13-11"],
		[980, 8, "DIN13-11"],
		[1000, 8, "DIN13-11"],
	],

	strengthClass: {
		val: [5.6, 6.8, 8.8, 10.9, 12.9],
		index: 0,
		indexOrig: 2,
		get re() {
			//Streckgrenze
			return Math.floor((this.val[this.index] % 1) * 10 * Math.floor(this.val[this.index]) * 10);
		},
		get rm() {
			return Math.floor(this.val[this.index]) * 100;
		},
	},
	safetyAxialStatic: 1.5,
	data: {
		safetyAxialDynamic: 2,
		safetyShearStatic: 1.5,
		safetyShearDynamic: 2.5,
		frictionCoefShear: 0.15,
		exploitRe: 0.8,
		get flankAngle() {
			return (60 * Math.PI) / 180;
		},
	},
	decimalOpts: {
		decimals: 3,
		expoThreashold: 7,
	},

	results: {
		headDiameter: {
			name: "Kopfdurchmesser (DIN 912)",
			unit: "mm",
			val: [],
		},
		headHeightInner: {
			name: "Kopfhöhe (DIN 912)",
			unit: "mm",
			val: [],
		},
		keyWidthInner: {
			name: "Schlüsselweite (DIN 912)",
			unit: "mm",
			val: [],
		},
		headHeightOuter: {
			name: "Kopfhöhe (DIN 933)",
			unit: "mm",
			val: [],
		},
		keyWidthOuter: {
			name: "Schlüsselweite (DIN 933)",
			unit: "mm",
			val: [],
		},
		boreDiameter: {
			name: "Bohrungsdurchmesser",
			unit: "mm",
			val: [],
		},
		innerCoreDiameterNut: {
			name: "Kernd. des Innengewindes",
			unit: "mm",
			val: [],
		},
		outerCoreDiameter: {
			name: "Kernd. des Aussengewindes",
			unit: "mm",
			val: [],
		},
		flankDiameter: {
			name: "Flankendurchmesser",
			unit: "mm",
			val: [],
		},
		stressCrosssection: {
			name: "Spannungsquerschnitt",
			unit: "mm\u00b2",
			val: [],
		},
		preloadMax: {
			name: "max. Vorspannkraft",
			unit: "N",
			val: [],
		},
		// strengthAxialStatic: {
		//   name: "max. Axialkraft statisch",
		//   unit: "N",
		//   val: []
		// },
		// strengthAxialDynamic: {
		//   name: "max. Axialkraft dynamisch",
		//   unit: "N",
		//   val: []
		// },
		// // strengthouterCoreDiameterNut
		// strengthShearStatic: {
		//   name: "max. Querkraft statisch",
		//   unit: "N",
		//   val: []
		// },
		// strengthShearDynamic: {
		//   name: "max. Querkraft dynamisch",
		//   unit: "N",
		//   val: []
		// },
	},
};

function clear_cl_Niska() {
	niskaOptions.size.val = niskaOptions.size.valOrig;
	niskaOptions.pitch.val = niskaOptions.pitch.valOrig;
	niskaOptions.select.index = niskaOptions.select.indexOrig;
	niskaOptions.select.type = niskaOptions.select.typeOrig;
	niskaOptions.strengthClass.index = niskaOptions.strengthClass.indexOrig;
	resetInput("idVin_niskaSize", niskaOptions.size.val, {
		min: 0,
	});
	resetInput("idVin_niskaPitch", niskaOptions.pitch.val, {
		min: 0,
	});

	clearFirstChild("idSel_niskaSelect");
	let selInput = dbID("idSel_niskaSelect");
	let optGroup = document.createElement("optgroup");
	optGroup.label = "Regelgewinde";
	for (const [index, val] of niskaOptions.regel.entries()) {
		const opt = document.createElement("OPTION");
		opt.textContent = `M${val[0]}x${val[1]}`;
		opt.value = index;
		opt.setAttribute("data-type", "regel");
		optGroup.appendChild(opt);
	}
	selInput.appendChild(optGroup);

	optGroup = document.createElement("optgroup");
	optGroup.label = "Feingewinde";
	for (const [index, val] of niskaOptions.fein.entries()) {
		const opt = document.createElement("OPTION");
		opt.textContent = `M${val[0]}x${val[1]} (${val[2]})`;
		opt.value = index;
		opt.setAttribute("data-type", "fein");
		optGroup.appendChild(opt);
	}
	selInput.appendChild(optGroup);
	selInput.options[niskaOptions.select.index].selected = true;

	clearFirstChild("idSel_niskaStrengthClass");
	let selStrength = dbID("idSel_niskaStrengthClass");
	for (const val of niskaOptions.strengthClass.val) {
		const opt = document.createElement("OPTION");
		opt.textContent = val;
		opt.value = val;
		selStrength.appendChild(opt);
	}
	selStrength.options[niskaOptions.strengthClass.index].selected = true;
	niskaCalc();
}

function niskaCalc() {
	niskaOptions.size.val = numberFromInput("idVin_niskaSize");
	niskaOptions.pitch.val = numberFromInput("idVin_niskaPitch");
	niskaHelpCalculation(niskaOptions.size.val, niskaOptions.pitch.val, 0);
	niskaOptions.select.index = dbID("idSel_niskaSelect").selectedIndex;
	niskaOptions.select.type = dbID("idSel_niskaSelect").options[niskaOptions.select.index].dataset.type;
	niskaOptions.select.index -= niskaOptions.select.offset;
	dbID("idLbl_niskaRegelInfo").textContent = niskaOptions.select.type == niskaOptions.select.typeOrig ? "Regelgewinde" : "Feingewinde";
	niskaHelpCalculation(niskaOptions.select.size, niskaOptions.select.pitch, 1);
	niskaOptions.strengthClass.index = dbID("idSel_niskaStrengthClass").selectedIndex;
	niskaTable();
}

function niskaHelpCalculation(d, P, index) {
	//geometric
	const boreDiameter = d - P;
	const innerCoreDiameterNut = d - 1.0825 * P; //  Kerndurchmesser des Muttergewindes
	const innerCoreDiameterBolt = d - 1.22687 * P; // d3 Kerndurchmesser des Bolzengewindes
	const outerCoreDiameter = d - 1.2269 * P;
	const flankDiameter = d - 0.6495 * P; //d2 = Flankendurchmesser
	const threadDepthBolt = 0.6134 * P; // Gewindetiefe des Bolzengewindes	h3 = 0,6134 * P = H * 17 / 24
	const threadDepthNut = 0.5413 * P; // Gewindetiefe des Muttergewindes	H1 = 0,5413 * P
	const rounding = 0.1443 * P; // Rundung	R = 0,1443 * P
	const pitchAngle = Math.atan(P / (flankDiameter * Math.PI)); //  φ° = Steigungswinkel(Grad)
	const stressCrosssection = (Math.PI / 4) * ((flankDiameter + outerCoreDiameter) / 2) ** 2; //  AS = Spannungsquerschnitt
	const stressDiameter_ds = (flankDiameter + innerCoreDiameterBolt) / 2; //Spannungsdurchmesser
	const polarResistancemoment = (Math.PI * stressDiameter_ds ** 3) / 16; // pol.Widerstandsmoment(mm³)
	const tensionPermitted = niskaOptions.strengthClass.re * niskaOptions.data.exploitRe; //σ zul = zul.Spannung
	const threadFrictionAngle = Math.atan(niskaOptions.data.frictionCoefShear / Math.cos(niskaOptions.data.flankAngle / 2)); //  ρ '   = Gewindereibwinkel (Grad)

	const preloadNum = tensionPermitted;
	const preloadDen1 = 1 / stressCrosssection ** 2;
	const preloadDen2 = 0.75 * flankDiameter ** 2 * Math.tan(pitchAngle + threadFrictionAngle) ** 2;
	const preloadDen3 = polarResistancemoment ** 2;
	const preloadMax = preloadNum / Math.sqrt(preloadDen1 + preloadDen2 / preloadDen3); // Vorspannkraft(N)

	// F_erf                              (niskaOptions.strengthClass.re * stressCrosssection)
	// F Q = Querkraft(N)
	// S R = Rutschsicherheit(-)         //niskaOptions.data.safetyShearDynamic
	// μ T = Haftreibwert Trennfuge(-)   // niskaOptions.data.frictionCoefShear
	// i = Anzahl Trennfugen(-)
	const strengthShearStatic = (preloadMax * niskaOptions.data.frictionCoefShear * 1) / niskaOptions.data.safetyShearStatic; // 1 = Anzahl Trennfugen
	const strengthShearDynamic = (preloadMax * niskaOptions.data.frictionCoefShear * 1) / niskaOptions.data.safetyShearDynamic; // 1 = Anzahl Trennfugen

	const strengthAxialStatic = tensionPermitted / niskaOptions.data.safetyAxialStatic;
	const strengthAxialDynamic = tensionPermitted / niskaOptions.data.safetyAxialDynamic;

	headIndex = niskaOptions.headSize.hasOwnProperty(`M${d}`);
	niskaOptions.results.headDiameter.val[index] = headIndex ? niskaOptions.headSize[`M${d}`][0] : "-";
	niskaOptions.results.headHeightInner.val[index] = d;
	niskaOptions.results.keyWidthInner.val[index] = headIndex ? niskaOptions.headSize[`M${d}`][1] : "-";
	niskaOptions.results.headHeightOuter.val[index] = headIndex ? niskaOptions.headSize[`M${d}`][2] : "-";
	niskaOptions.results.keyWidthOuter.val[index] = headIndex ? niskaOptions.headSize[`M${d}`][3] : "-";

	niskaOptions.results.boreDiameter.val[index] = checkExponential(boreDiameter, niskaOptions.decimalOpts);
	niskaOptions.results.innerCoreDiameterNut.val[index] = checkExponential(innerCoreDiameterNut, niskaOptions.decimalOpts);
	niskaOptions.results.outerCoreDiameter.val[index] = checkExponential(outerCoreDiameter, niskaOptions.decimalOpts);
	niskaOptions.results.flankDiameter.val[index] = checkExponential(flankDiameter, niskaOptions.decimalOpts);
	niskaOptions.results.stressCrosssection.val[index] = checkExponential(stressCrosssection, niskaOptions.decimalOpts);
	niskaOptions.results.preloadMax.val[index] = checkExponential(preloadMax, {
		decimals: 0,
	});
	// niskaOptions.results.strengthAxialStatic.val[index] = checkExponential(strengthAxialStatic, niskaOptions.decimalOpts);
	// niskaOptions.results.strengthAxialDynamic.val[index] = checkExponential(strengthAxialDynamic, niskaOptions.decimalOpts);
	// niskaOptions.results.strengthShearStatic.val[index] = checkExponential(strengthShearStatic, niskaOptions.decimalOpts);
	// niskaOptions.results.strengthShearDynamic.val[index] = checkExponential(strengthShearDynamic, niskaOptions.decimalOpts);
}

function niskaTable() {
	clearTable("idTabHeader_niskaList");

	const rowTh = insertTableRow("idTabHeader_niskaList");
	tableAddCellHeader(rowTh, {
		names: ["niska", "Header"],
		type: "Lbl",
		text: "",
	});
	tableAddCellHeader(rowTh, {
		names: ["niska", "Header", "Handeingabe"],
		type: "Lbl",
		text: `M${niskaOptions.size.val}x${niskaOptions.pitch.val}`,
		colSpan: 2,
		cellStyle: {
			textAlign: "center",
		},
	});
	tableAddCellHeader(rowTh, {
		names: ["niska", "Header", "Normgewinde"],
		type: "Lbl",
		text: `M${niskaOptions.select.size}x${niskaOptions.select.pitch}`,
		colSpan: 2,
		cellStyle: {
			textAlign: "center",
		},
	});

	clearTable("idTabBody_niskaList");
	for (let [key, value] of Object.entries(niskaOptions.results)) {
		const row = insertTableRow("idTabBody_niskaList");
		tableAddCell(row, {
			names: ["niska", "name", key],
			type: "Lbl",
			text: value.name,
			createCellClass: ["clTab_borderThinRight"],
			cellStyle: {
				textAlign: "left",
			},
		});
		tableAddCell(row, {
			names: ["niska", "val", key],
			type: "Lbl",
			text: value.val[0],
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});
		tableAddCell(row, {
			names: ["niska", "unit", key],
			type: "Lbl",
			text: value.unit,
			createCellClass: ["clTab_borderThinRight"],
			cellStyle: {
				textAlign: "left",
			},
		});
		tableAddCell(row, {
			names: ["niska", "val", key],
			type: "Lbl",
			text: value.val[1],
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});
		tableAddCell(row, {
			names: ["niska", "unit", key],
			type: "Lbl",
			text: value.unit,
			cellStyle: {
				textAlign: "left",
			},
		});
	}
}
