import { initEL, KadRandom, KadTable } from "../KadUtils/KadUtils.js";

const perlindunganOptions = {
  selected: 0,
  showLists: false,
  showListCallbacks: [
    ["Show Lists", perlindunganTable],
    ["Hide Lists", perlindunganTable],
  ],
  data: [
    {
      name: "IP (DIN-EN-60529)",
      info: "Die Schutzart gibt die Eignung von elektrischen Betriebsmitteln (zum Beispiel Geräten, Leuchten und Installationsmaterial) für verschiedene Umgebungsbedingungen an, zusätzlich den Schutz von Menschen gegen potentielle Gefährdung bei deren Benutzung.",
      selected: [0, 0, 0, 0],
      get text() {
        const Z0 = this.body[0][this.selected[0]][0];
        const Z1 = this.body[1][this.selected[1]][0];
        const Z2 = this.body[2][this.selected[2]][0];
        const Z3 = this.body[3][this.selected[3]][0];
        return `IP${Z0}${Z1}${Z2}${Z3}`;
      },
      header: [
        ["1. Ziffer", "Schutz gegen Fremdkörper"],
        ["2. Ziffer", "Schutz gegen Wasser"],
        ["3. Ziffer", "Schutz gegen Zugang zu gefährlichen aktiven Teilen mit"],
        ["4. Ziffer", "Zusätzliche Ziffer"],
      ],
      body: [
        [
          ["X", "Kein Angabe"],
          ["0", "kein Schutz", "kein Schutz"],
          ["1", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 50 mm, Geschützt gegen den Zugang mit dem Handrücken"],
          ["2", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 12,5 mm, Geschützt gegen den Zugang mit einem Finger"],
          ["3", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 2,5 mm, Geschützt gegen den Zugang mit einem Werkzeug"],
          ["4", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 1,0 mm, Geschützt gegen den Zugang mit einem Draht"],
          ["5", "Geschützt gegen Staub in schädigender Menge, vollständiger Schutz gegen Berührung"],
          ["6", "staubdicht, vollständiger Schutz gegen Berührung"],
        ],
        [
          ["X", "Kein Angabe"],
          ["0", "Kein Schutz"],
          ["1", "Tropfwasser"],
          ["2", "fallendes Tropfwasser, wenn das Gehäuse bis zu 15° geneigt ist"],
          ["3", "fallendes Sprühwasser bis 60° gegen die Senkrechte"],
          ["4", "allseitiges Spritzwasser"],
          ["5", "Strahlwasser (Strahldüse 6,3 mm Durchmesser) aus beliebigem Winkel mit 12,5 l/min ± 5 % aus einem Abstand von 2,5 m bis 3 m"],
          ["6", "starkes Strahlwasser (Strahldüse 12,5 mm Durchmesser) aus beliebigem Winkel mit 100 l/min ± 5 % aus einem Abstand 2,5 m bis 3 m"],
          ["7", "zeitweiliges Untertauchen"],
          ["8", "dauerndes Untertauchen. Soweit keine andere Angabe erfolgt, besteht ein Schutz bis 1 Meter Wassertiefe. Andere Wassertiefen müssen separat angegeben bzw. vereinbart werden"],
          ["9", "Wasser bei Hochdruck-/Dampfstrahlreinigung, speziell Landwirtschaft"],
        ],
        [
          ["", "optional"],
          ["A", "dem Handrücken"],
          ["B", "einem Finger"],
          ["C", "einem Werkzeug"],
          ["D", "einem Draht"],
        ],
        [
          ["", "optional"],
          ["H", "Hochspannungs-Betriebsmittel"],
          ["M", "Geprüft, wenn bewegliche Teile in Betrieb sind"],
          ["S", "Geprüft, wenn bewegliche Teile im Stillstand sind"],
          ["W", "Geprüft bei festgelegten Wetterbedingungen "],
        ],
      ],
    },
    {
      name: "IP (ISO-20653)",
      info: "Die Schutzart gibt die Eignung von elektrischen Betriebsmitteln (zum Beispiel Geräten, Leuchten und Installationsmaterial) für verschiedene Umgebungsbedingungen an, zusätzlich den Schutz von Menschen gegen potentielle Gefährdung bei deren Benutzung.",
      selected: [0, 0, 0, 0],
      get text() {
        const Z0 = this.body[0][this.selected[0]][0];
        const Z1 = this.body[1][this.selected[1]][0];
        return `IP${Z0}${Z1}`;
      },
      header: [
        ["IP Klassifikation", "Schutz gegen Fremdkörper", "Schutz gegen Berührung"],
        ["IP Klassifikation", "Schutz gegen Wasser"],
      ],
      body: [
        [
          ["X", "Kein Angabe"],
          ["0", "kein Schutz", "kein Schutz"],
          ["1", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 50 mm", "Geschützt gegen den Zugang mit dem Handrücken"],
          ["2", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 12,5 mm", "Geschützt gegen den Zugang mit einem Finger"],
          ["3", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 2,5 mm", "Geschützt gegen den Zugang mit einem Werkzeug"],
          ["4", "Geschützt gegen feste Fremdkörper mit Durchmesser ≥ 1,0 mm", "Geschützt gegen den Zugang mit einem Draht"],
          ["5K", "Geschützt gegen Staub in schädigender Menge", "vollständiger Schutz gegen Berührung"],
          ["6K", "staubdicht", "vollständiger Schutz gegen Berührung"],
        ],
        [
          ["X", "Kein Angabe"],
          ["0", "Kein Schutz"],
          ["1", "Tropfwasser"],
          ["2", "fallendes Tropfwasser, wenn das Gehäuse bis zu 15° geneigt ist"],
          ["3", "fallendes Sprühwasser bis 60° gegen die Senkrechte"],
          ["4K", "allseitiges Spritzwasser mit erhöhtem Druck"],
          ["5", "Strahlwasser (Strahldüse 6,3 mm Durchmesser) aus beliebigem Winkel mit 12,5 l/min ± 5 % aus einem Abstand von 2,5 m bis 3 m"],
          ["6K", "starkes Strahlwasser unter erhöhtem Druck, spezifisch für Straßenfahrzeuge"],
          ["7", "zeitweiliges Untertauchen"],
          ["8", "dauerndes Untertauchen. Soweit keine andere Angabe erfolgt, besteht ein Schutz bis 1 Meter Wassertiefe. Andere Wassertiefen müssen separat angegeben bzw. vereinbart werden"],
          ["9K", "Wasser bei Hochdruck-/Dampfstrahlreinigung, spezifisch für Straßenfahrzeuge"],
        ],
      ],
    },
    {
      name: "IK",
      info: "Mit der IK-Schutzart wird die Stoßfestigkeit beziffert.",
      selected: [0, 0, 0, 0],
      get text() {
        return `IK${this.body[0][this.selected[0]][0]}`;
      },
      header: [["IK Klassifikation", "Schutz gegen einen Schlag bis zu "]],
      body: [
        [
          ["00", "kein Schutz"],
          ["01", "0.14 Joule"],
          ["02", "0.2 Joule"],
          ["03", "0.35 Joule"],
          ["04", "0.5 Joule"],
          ["05", "0.7 Joule"],
          ["06", "1.0 Joule"],
          ["07", "2.0 Joule"],
          ["08", "5.0 Joule"],
          ["09", "10.0 Joule"],
          ["10", "20.0 Joule"],
        ],
      ],
    },
  ],
};

const Sel_perlindunganSelect = initEL({
  id: "idSel_perlindunganSelect",
  fn: perlindunganSelected,
  selList: perlindunganOptions.data.map((item, index) => [item.name, index]),
  selStartIndex: perlindunganOptions.selected,
});
const Btn_perlindunganHideLists = initEL({ id: "idBtn_perlindunganHideLists", fn: perlindunganHideLists, radioBtnCallbacks: perlindunganOptions.showListCallbacks });
const Lbl_perlindunganOutput = initEL({ id: "idLbl_perlindunganOutput", resetValue: "Schutzart" });

const idTab_perlindunganTables = ["idTab_perlindunganTable0", "idTab_perlindunganTable1", "idTab_perlindunganTable2", "idTab_perlindunganTable3"];

export function clear_cl_Perlindungan() {
  Lbl_perlindunganOutput.KadReset();
  perlindunganTable();
  for (let z = 0; z < perlindunganOptions.data[perlindunganOptions.selected].body.length; z++) {
    const index = KadRandom.randomInt({ max: perlindunganOptions.data[perlindunganOptions.selected].body[z].length });
    perlindunganAddValue(z, index);
  }
}

function perlindunganSelected() {
  perlindunganOptions.selected = Sel_perlindunganSelect.KadGet();
  perlindunganOptions.data[perlindunganOptions.selected].selected = [0, 0, 0, 0];
  if (!perlindunganOptions.showLists) {
    Btn_perlindunganHideLists.KadNext();
  }
  perlindunganOptions.showLists = true;
  perlindunganTable();
}

function perlindunganHideLists() {
  perlindunganOptions.showLists = !perlindunganOptions.showLists;
}

function perlindunganTable() {
  for (let table of idTab_perlindunganTables) {
    KadTable.createHTMLGrid({ id: table, header: null, body: null });
  }
  if (!perlindunganOptions.showLists) return;

  let selData = perlindunganOptions.data[perlindunganOptions.selected];

  for (let i = 0; i < selData.header.length; i++) {
    const header = selData.header[i].map((head) => ({ data: head }));
    const body = [];
    for (let h = 0; h < selData.header[i].length; h++) {
      const obj = { data: selData.body[i].map((item) => item[h]), settings: { onclick: [perlindunganAddValue, i], uiMaxSize: "width16" } };
      body.push(obj);
    }
    KadTable.createHTMLGrid({ id: idTab_perlindunganTables[i], header, body });
  }
}

function perlindunganAddValue(ziffer, index) {
  perlindunganOptions.data[perlindunganOptions.selected].selected[ziffer] = index;
  let text = perlindunganOptions.data[perlindunganOptions.selected].text;
  Lbl_perlindunganOutput.KadSetText(text);
}
