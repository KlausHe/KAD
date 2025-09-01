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

initEL({ id: dbID("idVin_blechgeoDicke"), fn: calcBlechGeo, resetValue: blechOptions.dicke });
initEL({ id: dbID("idVin_blechgeoRadius"), fn: calcBlechGeo, resetValue: blechOptions.radius });
initEL({ id: dbID("idVin_blechgeoBreite"), fn: calcBlechGeo, resetValue: blechOptions.breite });
initEL({ id: dbID("idLbl_blechgeoResult"), resetValue: `Mindestabstand: ...` });
initEL({ id: dbID("idSel_blechgeoForm"), fn: blechgeoFormChange, selStartValue: blechOptions.selectedGeo, selList: Object.keys(blechOptions.geo).map((geo) => [geo, geo]) });

export function clear_cl_Blechgeometrie() {
  dbID("idVin_blechgeoDicke").KadReset();
  dbID("idVin_blechgeoRadius").KadReset();
  dbID("idVin_blechgeoBreite").KadReset();
  dbID("idSel_blechgeoForm").KadReset();
  dbID("idLbl_blechgeoResult").KadReset();
  blechgeoFormChange();
  calcBlechGeo();
}

function blechgeoFormChange() {
  blechOptions.selectedGeo = dbID("idSel_blechgeoForm").KadGet();
  dbID("idVin_blechgeoBreite").KadEnable(!blechOptions.geo[blechOptions.selectedGeo].breite);
  calcBlechGeo();
}

function calcBlechGeo() {
  blechOptions.s = dbID("idVin_blechgeoDicke").KadGet({ failSafe: blechOptions.dicke });
  blechOptions.r = dbID("idVin_blechgeoRadius").KadGet({ failSafe: blechOptions.radius });
  blechOptions.b = dbID("idVin_blechgeoBreite").KadGet({ failSafe: blechOptions.breite });
  let selBlechForm = blechOptions.geo[dbID("idSel_blechgeoForm").KadGet()];
  dbID("idImg_Blechgeometrie").src = blechOptions.geo[blechOptions.selectedGeo].imgPath;
  dbID("idLbl_blechgeoResult").KadSetText(`Mindestabstand: ${selBlechForm.func}`);
}
