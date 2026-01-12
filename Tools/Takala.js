/*
movedMass	m	10	kg
spindleDiameter	D	11	mm
pitch	P	2	mm
angle	alpha 90 deg
threadType	Gew	Trapezgewinde	-
materialFriction	Mat_Mut	Polyamid PA6 (Fett)	-
bearingFriction Lagerreibwert	µ_L	0,1	-
holdingTorque	M_MH	120	Ncm
dynamicAcceleration  max	a_max	5	m/s2
dynamicEnabled
*/

import { initEL, KadTable, KadValue } from "../KadUtils/KadUtils.js";

const takalaOptions = {
  movedMass: 0,
  spindleDiameter: 0,
  pitch: 0,
  angle: 0,
  threadAngle: 0,
  threadAngleList: [
    ["Trapezgewinde", 30],
    ["Metrisch", 60],
    ["Sägengewinde", 33],
    ["ACME", 29],
  ],
  materialFriction: 0,
  materialFrictionList: [
    ["Bronze (gefettet)", 0.3, 0.14],
    ["Bronze (geölt)", 0.19, 0.08],
    ["Rotguss (gefettet)", 0.3, 0.14],
    ["Rotguss (geölt)", 0.19, 0.08],
    ["Polyamid PA6 (gefettet)", 0.2, 0.09],
  ],
  bearingFriction: 0.1,
  holdingTorque: 0,
  dynamicAcceleration: 0,
  tabelData: {
    symbol: ["F", "M_A", "M_R", "M_L", "phi", "pf", "SH", "MP"],
    name: ["Last", "Antriebsmoment", "Gewindereibmoment", "Lagerreibmoment", "Steigungswinkel", "Gewindereibwinkel", "Selbsthemmung", "Motorauslastung"],
    unit: ["N", "Nmm", "Nmm", "Nmm", "°", "°", "-", "%"],
    value_stat: [0, 0, 0, 0, 0, 0],
    value_dyn: [0, 0, 0, 0, 0, 0],
  },
  setValue(name, type, value) {
    const index = takalaOptions.tabelData.symbol.indexOf(name);
    if (type == "stat") {
      takalaOptions.tabelData.value_stat[index] = value;
    } else {
      takalaOptions.tabelData.value_dyn[index] = value;
    }
  },
};

const Vin_takalaMovedMass = initEL({ id: "idVin_takalaMovedMass", fn: [takalaInput, 0], resetValue: 5, settings: { min: 0 }, label: "bewegte Masse" });
const Vin_takalaSpindleDiameter = initEL({ id: "idVin_takalaSpindleDiameter", fn: [takalaInput, 1], resetValue: 11, settings: { min: 6, step: 1, max: 130 }, label: "Durchmesser" });
const Vin_takalaPitch = initEL({ id: "idVin_takalaPitch", fn: [takalaInput, 2], resetValue: 2, settings: { min: 0 }, label: "Steigung" });
const Vin_takalaAngle = initEL({ id: "idVin_takalaAngle", fn: [takalaInput, 3], resetValue: 90, settings: { min: 0, max: 90 }, label: "Spindellage" });
const Vin_takalaBearingFriction = initEL({ id: "idVin_takalaBearingFriction", fn: [takalaInput, 4], resetValue: 0.2, settings: { min: 0, max: 1, step: 0.01 }, label: "Lagerreibwert" });
const Vin_takalaHoldingTorque = initEL({ id: "idVin_takalaHoldingTorque", fn: [takalaInput, 5], resetValue: 1.2, settings: { min: 0 }, label: "Motorhaltemoment" });
const Vin_takalaDynamicAcceleration = initEL({ id: "idVin_takalaDynamicAcceleration", fn: [takalaInput, 6], resetValue: 0.5, settings: { min: 0 }, label: "Beschleunigung" });
const Sel_takalaThreadAngle = initEL({ id: "idSel_takalaThreadAngle", fn: takalaSelectThreadAngle, selStartIndex: 0, selList: takalaOptions.threadAngleList, label: "Gewindetyp" });
const Sel_takalaMaterialFriction = initEL({ id: "idSel_takalaMaterialFriction", fn: takalaSelectMaterialFriction, selStartIndex: 0, selList: takalaOptions.materialFrictionList.map((item, index) => [item[0], index]), label: "Mutterwerkstoff" });

export function clear_cl_Takala() {
  takalaOptions.movedMass = Vin_takalaMovedMass.KadReset();
  takalaOptions.spindleDiameter = Vin_takalaSpindleDiameter.KadReset();
  takalaOptions.pitch = Vin_takalaPitch.KadReset();
  takalaOptions.angle = Vin_takalaAngle.KadReset();
  takalaOptions.bearingFriction = Vin_takalaBearingFriction.KadReset();
  takalaOptions.holdingTorque = Vin_takalaHoldingTorque.KadReset();
  takalaOptions.dynamicAcceleration = Vin_takalaDynamicAcceleration.KadReset();
  takalaOptions.threadAngle = Sel_takalaThreadAngle.KadReset();
  takalaOptions.materialFriction = Sel_takalaMaterialFriction.KadReset();
  takalaCalc();
}

function takalaInput() {
  takalaCalc();
}

function takalaSelectThreadAngle() {
  takalaOptions.threadAngle = Sel_takalaThreadAngle.KadGet();
  takalaCalc();
}
function takalaSelectMaterialFriction() {
  takalaOptions.materialFriction = Sel_takalaMaterialFriction.KadGet();
  takalaCalc();
}

function takalaCalc() {
  takalaOptions.movedMass = Vin_takalaMovedMass.KadGet();
  takalaOptions.spindleDiameter = Vin_takalaSpindleDiameter.KadGet();
  takalaOptions.pitch = Vin_takalaPitch.KadGet();
  takalaOptions.angle = Vin_takalaAngle.KadGet();
  takalaOptions.bearingFriction = Vin_takalaBearingFriction.KadGet();
  takalaOptions.holdingTorque = Vin_takalaHoldingTorque.KadGet() * 1000;
  takalaOptions.dynamicAcceleration = Vin_takalaDynamicAcceleration.KadGet();

  if (takalaOptions.pitch == 0) return;

  const d_2 = takalaOptions.spindleDiameter - 0.5 * takalaOptions.pitch;
  const radius = d_2 * 0.5;
  const phi = Math.atan(takalaOptions.pitch / (d_2 * Math.PI));
  const Flankenwinkel = Number(takalaOptions.threadAngleList[takalaOptions.threadAngle][1]);
  const mu_G_stat = Number(takalaOptions.materialFrictionList[takalaOptions.materialFriction][1]);
  const mu_G_dyn = Number(takalaOptions.materialFrictionList[takalaOptions.materialFriction][2]);
  const pf_stat = Math.atan(mu_G_stat / Math.cos((Flankenwinkel * (Math.PI / 180)) / 2));
  const pf_dyn = Math.atan(mu_G_dyn / Math.cos((Flankenwinkel * (Math.PI / 180)) / 2));

  const acc = 9.81 * Math.sin(takalaOptions.angle * (Math.PI / 180));
  const F_stat = takalaOptions.movedMass * acc;
  const F_dyn = takalaOptions.movedMass * (acc + takalaOptions.dynamicAcceleration);
  const M_L_stat = F_stat * radius * takalaOptions.bearingFriction;
  const M_L_dyn = F_dyn * radius * takalaOptions.bearingFriction;
  const M_R_stat = F_stat * radius * Math.tan(phi + pf_stat);
  const M_R_dyn = F_dyn * radius * Math.tan(phi + pf_dyn);

  takalaOptions.setValue("F", "stat", F_stat);
  takalaOptions.setValue("F", "dyn", F_dyn);
  takalaOptions.setValue("M_A", "stat", M_L_stat + M_R_stat);
  takalaOptions.setValue("M_A", "dyn", M_L_dyn + M_R_dyn);
  takalaOptions.setValue("M_R", "stat", M_R_stat);
  takalaOptions.setValue("M_R", "dyn", M_R_dyn);
  takalaOptions.setValue("M_L", "stat", M_L_stat);
  takalaOptions.setValue("M_L", "dyn", M_L_dyn);
  takalaOptions.setValue("phi", "stat", phi * (180 / Math.PI));
  takalaOptions.setValue("phi", "dyn", phi * (180 / Math.PI));
  takalaOptions.setValue("pf", "stat", pf_stat * (180 / Math.PI));
  takalaOptions.setValue("pf", "dyn", pf_dyn * (180 / Math.PI));
  takalaOptions.setValue("SH", "stat", pf_stat > phi ? "Ja" : "Nein");
  takalaOptions.setValue("SH", "dyn", pf_dyn > phi ? "Ja" : "Nein");
  takalaOptions.setValue("MP", "stat", ((M_L_stat + M_R_stat) / takalaOptions.holdingTorque) * 100);
  takalaOptions.setValue("MP", "dyn", ((M_L_dyn + M_R_dyn) / takalaOptions.holdingTorque) * 100);
  takalaCreateTable();
}

function takalaCreateTable() {
  const header = [{ data: "Name" }, { data: "Symbol" }, { data: "statisch" }, { data: "dynamisch" }, { data: "Einheit" }];
  const body = [
    {
      data: takalaOptions.tabelData.name,
    },
    {
      data: takalaOptions.tabelData.symbol,
    },
    {
      data: takalaOptions.tabelData.value_stat.map((item) => (isNaN(item) ? item : KadValue.number(item, { decimals: 2 }))),
      settings: { align: "right" },
    },
    {
      data: takalaOptions.tabelData.value_dyn.map((item) => (isNaN(item) ? item : KadValue.number(item, { decimals: 2 }))),
      settings: { align: "right" },
    },
    {
      data: takalaOptions.tabelData.unit,
    },
  ];
  KadTable.createHTMLGrid({ id: "idTab_takalaTable", header, body });
}
