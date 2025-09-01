import { Data_Country_CodesIso639 } from "../KadData/KadData_Countries.js";
import { dbID, KadFile, KadTable } from "../KadUtils/KadUtils.js";

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
        KadFile.loadUrlToJSON({ variable: "data", url: "https://api.ipify.org?format=json", callback: biktadaIPAdresse, errorCallback: biktadaIPError });
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
  biktadaOptions.data.IPAdresse.value = data.data.ip;
  biktadaPassValue("IPAdresse");
}

function biktadaIPError(data) {
  biktadaOptions.data.IPAdresse.value = data.error;
  biktadaPassValue("IPAdresse");
}

function biktadaPassValue(key) {
  const id = Object.keys(biktadaOptions.data).indexOf(key);
  dbID(`idLbl_biktadA_value_${id}`).innerHTML = biktadaOptions.data[key].value;
}

export function clear_cl_BiktadA() {
  createBiktadaTable();
  biktadaOptions.ieAlert = null;
  biktadaGetData();
}

function biktadaGetData() {
  for (let obj in biktadaOptions.data) {
    biktadaOptions.data[obj].data;
  }
}

function createBiktadaTable() {
  const header = [{ data: "Info" }, { data: "Wert" }];
  // prettier-ignore
  const body = [
    { data: Object.values(biktadaOptions.data).map((value) => value.description) }, { data: Object.keys(biktadaOptions.data).map((_) => "..."), settings: { names: ["biktadA", "value"] } }
  ];
  KadTable.createHTMLGrid({ id: dbID("idTab_biktadATable"), header, body });
}
