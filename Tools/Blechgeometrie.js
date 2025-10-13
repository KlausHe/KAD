import { dbID, initEL } from "../KadUtils/KadUtils.js";

const blechOptions = {
  dicke: 3,
  radius: 2,
  breite: 10,
  selectedGeo: "Langloch",
  d: null,
  r: null,
  b: null,
  geo: {
    Bohrung: {
      get func() {
        return blechOptions.r + 2 * blechOptions.s;
      },
      imgPath: "Data/Images/bl-rundloch.png",
      breite: true,
    },
    Langloch: {
      get func() {
        const f = blechOptions.b <= 25 || blechOptions.b === "" ? this.factorA : blechOptions.b <= 50 ? this.factorB : this.factorC;
        return blechOptions.r + f * blechOptions.s;
      },
      factorA: 3,
      factorB: 4,
      factorC: 5,
      imgPath: "Data/Images/bl-langloch.png",
      breite: false,
    },
    Rechteckloch: {
      get func() {
        const f = blechOptions.b <= 25 || blechOptions.b === "" ? this.factorA : blechOptions.b <= 50 ? this.factorB : this.factorC;
        return blechOptions.r + f * blechOptions.s;
      },
      factorA: 3,
      factorB: 3.5,
      factorC: 4,
      imgPath: "Data/Images/bl-rechteckloch.png",
      breite: false,
    },
  },
};

const Vin_blechgeoDicke = initEL({ id: "idVin_blechgeoDicke", fn: calcBlechGeo, resetValue: blechOptions.dicke });
const Vin_blechgeoRadius = initEL({ id: "idVin_blechgeoRadius", fn: calcBlechGeo, resetValue: blechOptions.radius });
const Vin_blechgeoBreite = initEL({ id: "idVin_blechgeoBreite", fn: calcBlechGeo, resetValue: blechOptions.breite });
const Lbl_blechgeoResult = initEL({ id: "idLbl_blechgeoResult", resetValue: `Mindestabstand: ...` });
const Sel_blechgeoForm = initEL({ id: "idSel_blechgeoForm", fn: blechgeoFormChange, selStartValue: blechOptions.selectedGeo, selList: Object.keys(blechOptions.geo).map((geo) => [geo, geo]) });

export function clear_cl_Blechgeometrie() {
  Vin_blechgeoDicke.KadReset();
  Vin_blechgeoRadius.KadReset();
  Vin_blechgeoBreite.KadReset();
  Sel_blechgeoForm.KadReset();
  Lbl_blechgeoResult.KadReset();
  blechgeoFormChange();
  calcBlechGeo();
}

function blechgeoFormChange() {
  blechOptions.selectedGeo = Sel_blechgeoForm.KadGet();
  Vin_blechgeoBreite.KadEnable(!blechOptions.geo[blechOptions.selectedGeo].breite);
  calcBlechGeo();
}

function calcBlechGeo() {
  blechOptions.s = Vin_blechgeoDicke.KadGet();
  blechOptions.r = Vin_blechgeoRadius.KadGet();
  blechOptions.b = Vin_blechgeoBreite.KadGet();
  let selBlechForm = blechOptions.geo[Sel_blechgeoForm.KadGet()];
  dbID("idImg_Blechgeometrie").src = blechOptions.geo[blechOptions.selectedGeo].imgPath;
  Lbl_blechgeoResult.KadSetText(`Mindestabstand: ${selBlechForm.func}`);
}
