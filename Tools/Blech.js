import { daEL, dbID, KadDOM } from "../General/KadUtils.js";

const blechOptions = {
	dicke: 3,
	radius: 2,
	breite: 10,
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

daEL(idVin_blechgeoDicke, "input", calcBlechGeo);
daEL(idVin_blechgeoRadius, "input", calcBlechGeo);
daEL(idVin_blechgeoBreite, "input", calcBlechGeo);
daEL(idSel_blechgeoForm, "change", blechgeoFormChange);

export function clear_cl_Blech() {
	KadDOM.resetInput("idVin_blechgeoDicke", blechOptions.dicke);
	KadDOM.resetInput("idVin_blechgeoRadius", blechOptions.radius);
	KadDOM.resetInput("idVin_blechgeoBreite", blechOptions.breite);

	KadDOM.clearFirstChild("idSel_blechgeoForm");
	let selInput = dbID("idSel_blechgeoForm");
	for (const [i, key] of Object.keys(blechOptions.geo).entries()) {
		const opt = document.createElement("OPTION");
		opt.textContent = key;
		opt.value = key;
		selInput.appendChild(opt);
	}
	blechgeoFormChange();
	dbID("idLbl_blechgeoResult").innerHTML = `Mindestabstand: ...`;
}

function blechgeoFormChange() {
	let index = dbID("idSel_blechgeoForm").selectedIndex;
	let vinOption = dbID("idSel_blechgeoForm").options[index].text;
	let key = blechOptions.geo[vinOption].imgPath;
	dbID("idImg_Blechgeometrie").src = blechOptions.geo[vinOption].imgPath;
	KadDOM.enableBtn(idVin_blechgeoBreite, !blechOptions.geo[vinOption].breite);
}

function calcBlechGeo() {
	blechOptions.s = KadDOM.numberFromInput("idVin_blechgeoDicke", blechOptions.dicke);
	blechOptions.r = KadDOM.numberFromInput("idVin_blechgeoRadius", blechOptions.radius);
	blechOptions.b = KadDOM.numberFromInput("idVin_blechgeoBreite", blechOptions.breite);
	let selBlechForm = blechOptions.geo[dbID("idSel_blechgeoForm").value];

	dbID("idLbl_blechgeoResult").textContent = `Mindestabstand: ${selBlechForm.func}`;
}
