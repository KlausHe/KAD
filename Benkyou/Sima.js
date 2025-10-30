import { Data_Country_CodesIso3166 } from "../KadData/KadData_Countries.js";
import { initEL } from "../KadUtils/KadUtils.js";

const Vin_simaCountry = initEL({
  id: "idVin_simaCountry",
  action: "focus",
  resetValue: "Land eingeben",
  dbList: Data_Country_CodesIso3166.map((item) => item.nameDE).sort(),
});

const Vin_simaNumber = initEL({
  id: "idVin_simaNumber",
  action: "focus",
  resetValue: "Telefonvorwahl",
  dbList: Data_Country_CodesIso3166.map((item) => item.phone[0]).sort((a, b) => a - b),
});
initEL({ id: "idVin_simaCountry", fn: simaCountryInput });
initEL({ id: "idVin_simaNumber", fn: simaNumberInput });
const Lbl_simaResult = initEL({ id: "idLbl_simaResult", resetValue: "..." });

export function clear_cl_Sima() {
  Vin_simaCountry.KadReset();
  Vin_simaNumber.KadReset();
  Lbl_simaResult.KadReset();
  simaResult();
}

function simaCountryInput() {
  let country = Vin_simaCountry.KadGet();
  if (country == "") {
    simaResult();
    return;
  }
  let countryIndex = Data_Country_CodesIso3166.findIndex((item) => item.nameDE == country);
  if (countryIndex < 0) return;
  Vin_simaNumber.KadReset();
  const numbers = Data_Country_CodesIso3166[countryIndex].phone;
  simaResult(country, numbers);
}

function simaNumberInput() {
  let number = Vin_simaNumber.KadGet();
  number = Number(number.replace("+", ""));
  if (Number.isNaN(number)) return;
  Vin_simaCountry.KadReset();
  let numberIndex = Data_Country_CodesIso3166.findIndex((item) => item.phone.includes(number));
  if (numberIndex < 0) return;
  const country = Data_Country_CodesIso3166[numberIndex].nameDE;
  simaResult(country, [number]);
}

function simaResult(country = "Deutschland", numbers = [49]) {
  const numberText = numbers.map((num) => `+${num.toString().padStart(3, "0")}`).join("\n");
  Lbl_simaResult.KadSetText(`${country}: ${numberText}`);
}
