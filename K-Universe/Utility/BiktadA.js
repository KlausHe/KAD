const biktadaOptions = {
	ieAlert: null,
	dataCount: 0,
	data: {
		Sprache: {
			value: null,
			description: "Browser Sprache",
			get data() {
				const lang = navigator.language.split("-")[0];
				this.value = `${Data_Country_CodesIso639.get(lang)} (${lang})`;
				biktadaPassValue("Sprache");
			},
		},
		Sprachen: {
			value: null,
			description: "verfügbare Sprachen",
			get data() {
				let arr = [];
				for (const lang of navigator.languages) {
					arr.push(Data_Country_CodesIso639.get(lang.split("-")[0]));
				}
				this.value = [...new Set(arr)].toString().replace(/,/g, " / ");
				biktadaPassValue("Sprachen");
			},
		},
		Cookies: {
			value: null,
			description: "Cookies erlaubt",
			get data() {
				this.value = navigator.cookieEnabled ? "ja" : "nein";
				biktadaPassValue("Cookies");
			},
		},
		Browser: {
			value: null,
			description: "Browserarchitektur",
			get data() {
				let ua = navigator.userAgent;
				let tem;
				let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
				if (/trident/i.test(M[1])) {
					tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
					this.value = "IE " + (tem[1] || "");
				}
				if (M[1] === "Chrome") {
					tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
					if (tem != null) this.value = tem.slice(1).join(" ").replace("OPR", "Opera");
				}
				M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
				if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
				this.value = M.join(" ");
				biktadaPassValue("Browser");
				if (new RegExp(["Trident", "trident", "IE", "msie"].join("|")).test(this.value)) {
					biktadaOptions.ieAlert = `This website does not support ${this.value}.\nPlease visit with another Browser.`;
				}
			},
		},
		Location: {
			value: null,
			description: "Geografische Position",
			get data() {
				if ("geolocation" in navigator) {
					navigator.geolocation.getCurrentPosition(biktadaGeoPos, biktadaGeoErr);
				} else {
					biktadaGeoErr("No locating allowed!");
				}
			},
		},
		IPAdresse: {
			value: null,
			description: "IP-Adresss",
			get data() {
				globalP5.loadJSON("https://api.ipify.org?format=json", "json", biktadaIPAdresse, biktadaIPError);
			},
		},
		Platform: {
			value: null,
			description: "Computer Platform",
			get data() {
				this.value = navigator.platform ? navigator.platform : "---";
				biktadaPassValue("Platform");
			},
		},
		OS: {
			value: null,
			description: "Betriebssystem",
			get data() {
				this.value = navigator.oscpu ? navigator.oscpu : "---";
				biktadaPassValue("OS");
			},
		},
	},
};

function biktadaGeoPos(data) {
	biktadaOptions.data.Location.value = `lat: ${data.coords.latitude.toFixed(6)}<br>lon: ${data.coords.longitude.toFixed(6)}`;
	biktadaPassValue("Location");
}

function biktadaGeoErr(err) {
	biktadaOptions.data.Location.value = `${err.message}`;
	biktadaPassValue("Location");
}

function biktadaIPAdresse(data) {
	biktadaOptions.data.IPAdresse.value = data.ip;
	biktadaPassValue("IPAdresse");
}

function biktadaIPError(data) {
	biktadaOptions.data.IPAdresse.value = data;
	biktadaPassValue("IPAdresse");
}

function biktadaPassValue(id) {
	KadUtils.dbID(`idLbl_child_biktada_value_${id}`).innerHTML = biktadaOptions.data[id].value;
}

function clear_cl_BiktadA() {
	createBiktadaTable();
	biktadaIe = null;
	biktadaGetData();
}

function biktadaGetData() {
	for (let obj in biktadaOptions.data) {
		biktadaOptions.data[obj].data;
	}
}

function createBiktadaTable() {
	//header
	KadUtils.Table.clear("idTabHeader_BiktadA");
	const rowTh = KadUtils.Table.insertRow("idTabHeader_BiktadA");
	KadUtils.Table.addHeaderCell(rowTh, {
		names: ["biktadaHeader", "Description"],
		type: "Lbl",
		text: "Info",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.Table.addHeaderCell(rowTh, {
		names: ["biktadaHeader", "Value"],
		type: "Lbl",
		text: "Wert",
		cellStyle: {
			textAlign: "left",
		},
	});

	// body
	KadUtils.Table.clear("idTabBody_BiktadA");
	for (const objName in biktadaOptions.data) {
		const row = KadUtils.Table.insertRow("idTabBody_BiktadA");
		KadUtils.Table.addCell(row, {
			names: ["biktada", "description", objName],
			type: "Lbl",
			text: biktadaOptions.data[objName].description,
			copy: true,
			cellStyle: {
				textAlign: "left",
			},
		});
		KadUtils.Table.addCell(row, {
			names: ["biktada", "value", objName],
			type: "Lbl",
			text: "...",
			copy: true,
			cellStyle: {
				textAlign: "left",
			},
		});
	}
	if (biktadaOptions.ieAlert != null) {
		alert(biktadaOptions.ieAlert);
	}
}
