import { Data_Country_CodesIso3166 } from "../KadData/KadData_Countries.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

initEL({
  id: dbID("idVin_simaCountry"),
  action: "focus",
  dbList: Data_Country_CodesIso3166.map((item) => item.nameDE).sort(),
});
initEL({
  id: dbID("idVin_simaNumber"),
  action: "focus",
  dbList: Data_Country_CodesIso3166.map((item) => item.phone[0]).sort((a, b) => a - b),
});
initEL({ id: dbID("idVin_simaCountry"), fn: simaCountryInput, resetValue: "Land eingeben" });
initEL({ id: dbID("idVin_simaNumber"), fn: simaNumberInput, resetValue: "Telefonvorwahl" });
initEL({ id: dbID("idLbl_simaResult"), resetValue: "..." });

export function clear_cl_Sima() {
  dbID("idVin_simaCountry").KadReset();
  dbID("idVin_simaNumber").KadReset();
  dbID("idLbl_simaResult").KadReset();
  simaResult();
}

function simaCountryInput() {
  let country = dbID("idVin_simaCountry").KadGet();
  if (country == "") {
    simaResult();
    return;
  }
  let countryIndex = Data_Country_CodesIso3166.findIndex((item) => item.nameDE == country);
  if (countryIndex < 0) return;
  dbID("idVin_simaNumber").KadReset();
  const numbers = Data_Country_CodesIso3166[countryIndex].phone;
  simaResult(country, numbers);
}

function simaNumberInput() {
  let number = dbID("idVin_simaNumber").KadGet();
  number = Number(number.replace("+", ""));
  if (Number.isNaN(number)) return;
  dbID("idVin_simaCountry").KadReset();
  let numberIndex = Data_Country_CodesIso3166.findIndex((item) => item.phone.includes(number));
  if (numberIndex < 0) return;
  const country = Data_Country_CodesIso3166[numberIndex].nameDE;
  simaResult(country, [number]);
}

function simaResult(country = "Deutschland", numbers = [49]) {
  const numberText = numbers.map((num) => `+${num.toString().padStart(3, "0")}`).join("\n");
  dbID("idLbl_simaResult").KadSetText(`${country}: ${numberText}`);
}
