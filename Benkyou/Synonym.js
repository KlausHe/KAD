import { KadFile, KadTable, dbID, errorChecked, initEL, objectLength } from "../KadUtils/KadUtils.js";
const synonymOptions = {
	get URL() {
		return `https://www.openthesaurus.de/synonyme/search?q=${this.input}&format=application/json&similar=true&baseform=true`;
	},
	input: "",
	data: {},
};

initEL({ id: idVin_synonymEntry, fn: newSynonym, resetValue: "Search for synonyms" });
initEL({ id: idBtn_synonymEntry, fn: newSynonym });

export function clear_cl_Synonym() {
	idVin_synonymEntry.KadReset();
	KadTable.clear("idTabHeader_synonym_baseform");
	KadTable.clear("idTabHeader_synonym1");
	KadTable.clear("idTabHeader_synonym2");
	KadTable.clear("idTabBody_synonym1");
	KadTable.clear("idTabBody_synonym2");
}

function newSynonym() {
	synonymOptions.input = idVin_synonymEntry.KadGet();
	if (!synonymOptions.input) return;
	synonymGetData();
}

async function synonymGetData() {
	const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url: synonymOptions.URL });
	if (errorChecked(error, "Could not receive data for 'Synonym'.", error)) {
		dbID("idLbl_synonymSearchWord").textContent = "---";
	} else {
		synonymOptions.data = data;
		dbID("idLbl_synonymSearchWord").textContent = synonymOptions.input;
		synonymCreateTable();
	}
}

function synonymCreateTable() {
	KadTable.clear("idTabHeader_synonym_baseform");
	KadTable.clear("idTabHeader_synonym1");
	KadTable.clear("idTabHeader_synonym2");
	KadTable.clear("idTabBody_synonym1");
	KadTable.clear("idTabBody_synonym2");

	if (synonymOptions.data.hasOwnProperty("baseforms")) {
		let row = KadTable.createRow("idTabHeader_synonym_baseform");
		KadTable.addHeaderCell(row, {
			names: ["synonym", "BaseformTitle"],
			type: "Lbl",
			text: "Grundform",
			cellStyle: {
				textAlign: "left",
			},
		});
		KadTable.addHeaderCell(row, {
			names: ["synonym", "BaseformWord"],
			type: "Lbl",
			text: synonymOptions.data.baseforms[0],
			colSpan: 2,
			cellStyle: {
				textAlign: "left",
			},
		});
	}
	let sets = [];
	for (let i = 0; i < objectLength(synonymOptions.data.synsets); i++) {
		sets = [...sets, ...synonymOptions.data.synsets[i].terms.map((index) => index.term)];
	}
	if (sets.length > 0) {
		let row = KadTable.createRow("idTabHeader_synonym1");
		KadTable.addHeaderCell(row, {
			names: ["synonym", "synonymTitle"],
			type: "Lbl",
			text: "Synonyme",
			colSpan: 3,
			cellStyle: {
				textAlign: "left",
			},
		});
		for (let i = 0; i < sets.length; i++) {
			row = KadTable.createRow("idTabBody_synonym1");
			KadTable.addCell(row, {
				names: ["synonym", "synset", i],
				type: "Lbl",
				text: sets[i],
				cellStyle: {
					textAlign: "left",
				},
				cellOnclick: () => {
					synonymOptions.input = sets[i];
					synonymGetData();
				},
			});
			if (i < sets.length - 1) {
				i++;
				KadTable.addCell(row, {
					names: ["synonym", "synset", i],
					type: "Lbl",
					text: sets[i],
					cellStyle: {
						textAlign: "left",
					},
					cellOnclick: () => {
						synonymOptions.input = sets[i];
						synonymGetData();
					},
				});
			}
			if (i < sets.length - 1) {
				i++;
				KadTable.addCell(row, {
					names: ["synonym", "synset", i],
					type: "Lbl",
					text: sets[i],
					cellStyle: {
						textAlign: "left",
					},
					cellOnclick: () => {
						synonymOptions.input = sets[i];
						synonymGetData();
					},
				});
			}
		}
	}

	if (synonymOptions.data.hasOwnProperty("similarterms")) {
		let row = KadTable.createRow("idTabHeader_synonym2");
		KadTable.addHeaderCell(row, {
			names: ["synonym", "similar", "title"],
			type: "Lbl",
			text: `Ähnliche Befriffe:`,
			colSpan: 3,
			cellStyle: {
				textAlign: "left",
			},
		});
		for (let i = 0; i < objectLength(synonymOptions.data.similarterms); i++) {
			row = KadTable.createRow("idTabBody_synonym2");
			KadTable.addCell(row, {
				names: ["synonym", "similarterms", i],
				type: "Lbl",
				text: synonymOptions.data.similarterms[i].term,
				cellStyle: {
					textAlign: "left",
				},
				alias: true,
				cellOnclick: () => {
					synonymOptions.input = synonymOptions.data.similarterms[i].term;
					synonymGetData();
				},
			});
			if (i < objectLength(synonymOptions.data.similarterms) - 1) {
				i++;
				KadTable.addCell(row, {
					names: ["synonym", "similarterms", i],
					type: "Lbl",
					text: synonymOptions.data.similarterms[i].term,
					cellStyle: {
						textAlign: "left",
					},
					alias: true,
					cellOnclick: () => {
						synonymOptions.input = synonymOptions.data.similarterms[i].term;
						synonymGetData();
					},
				});
			}
			if (i < objectLength(synonymOptions.data.similarterms) - 1) {
				i++;
				KadTable.addCell(row, {
					names: ["synonym", "similarterms", i],
					type: "Lbl",
					text: synonymOptions.data.similarterms[i].term,
					cellStyle: {
						textAlign: "left",
					},
					alias: true,
					cellOnclick: () => {
						synonymOptions.input = synonymOptions.data.similarterms[i].term;
						synonymGetData();
					},
				});
			}
		}
	}
}
