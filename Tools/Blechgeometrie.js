import { initEL, KadDOM } from "../KadUtils/KadUtils.js";

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

initEL({ id: idVin_blechgeoDicke, fn: calcBlechGeo, resetValue: blechOptions.dicke });
initEL({ id: idVin_blechgeoRadius, fn: calcBlechGeo, resetValue: blechOptions.radius });
initEL({ id: idVin_blechgeoBreite, fn: calcBlechGeo, resetValue: blechOptions.breite });
initEL({ id: idLbl_blechgeoResult, resetValue: `Mindestabstand: ...` });
initEL({ id: idSel_blechgeoForm, fn: blechgeoFormChange, selStartValue: blechOptions.selectedGeo, selList: Object.keys(blechOptions.geo).map((geo) => [geo, geo]) });

export function clear_cl_Blechgeometrie() {
	idVin_blechgeoDicke.KadReset();
	idVin_blechgeoRadius.KadReset();
	idVin_blechgeoBreite.KadReset();
	idSel_blechgeoForm.KadReset();
	idLbl_blechgeoResult.KadReset();
	blechgeoFormChange();
	calcBlechGeo();
}

function blechgeoFormChange() {
	blechOptions.selectedGeo = idSel_blechgeoForm.KadGet();
	KadDOM.enableBtn(idVin_blechgeoBreite, !blechOptions.geo[blechOptions.selectedGeo].breite);
	calcBlechGeo();
}

function calcBlechGeo() {
	blechOptions.s = idVin_blechgeoDicke.KadGet({ failSafe: blechOptions.dicke });
	blechOptions.r = idVin_blechgeoRadius.KadGet({ failSafe: blechOptions.radius });
	blechOptions.b = idVin_blechgeoBreite.KadGet({ failSafe: blechOptions.breite });
	let selBlechForm = blechOptions.geo[idSel_blechgeoForm.KadGet()];
	idImg_Blechgeometrie.src = blechOptions.geo[blechOptions.selectedGeo].imgPath;
	idLbl_blechgeoResult.KadSetText(`Mindestabstand: ${selBlechForm.func}`);
}
