import { Data_Country_CodesIso3166 } from "../General/MainData.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

initEL({ id: idVin_simaCountry, action: "focus", dbList: Data_Country_CodesIso3166.map((item) => item.name) });
initEL({ id: idVin_simaNumber, action: "focus", dbList: Data_Country_CodesIso3166.map((item) => item.phone) });
initEL({ id: idVin_simaCountry, fn: simaCountryInput, resetValue: "Land eingeben" });
initEL({ id: idVin_simaNumber, fn: simaNumberInput, resetValue: "Telefonvorwahl" });

export function clear_cl_Sima() {
	idVin_simaCountry.KadReset();
	idVin_simaNumber.KadReset();
	simaResult();
}

function simaCountryInput() {
	let country = idVin_simaCountry.KadGet();
	if (country == "") {
		simaResult();
		return;
	}
	let countryIndex = Data_Country_CodesIso3166.findIndex((item) => item.name == country);
	if (countryIndex < 0) return;
	idVin_simaNumber.KadReset();
	const number = Data_Country_CodesIso3166[countryIndex].phone;
	simaResult(country, number);
}

function simaNumberInput() {
	let number = idVin_simaNumber.KadGet();
	if (Number.isNaN(Number(number))) {
		simaResult();
		return;
	}
	let numberIndex = Data_Country_CodesIso3166.findIndex((item) => item.phone == number);
	if (numberIndex < 0) return;
	idVin_simaCountry.KadReset();
	const country = Data_Country_CodesIso3166[numberIndex].name;
	simaResult(country, number);
}

function simaResult(country = "Germany", phone = 49) {
	dbID("idLbl_simaResult").textContent = `${country}: +${phone.toString().padStart(3, "0")}`;
}
