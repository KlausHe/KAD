import { layoutCheckCORSandDisableModule } from "../General/Layout.js";
import { KadArray, KadDate, KadFile, KadTable, initEL } from "../KadUtils/KadUtils.js";

const pafadojOptions = {
  get URL() {
    const table = pafadojOptions.headers[pafadojOptions.date][0];
    return `https://www.wikitable2json.com/api/List_of_mass_shootings_in_the_United_States_in_${pafadojOptions.date}?lang=en&cleanRef=true&table=${table}&keyRows=1`;
  },
  headers: {
    2025: [1, ["2025 date", "Dead", "Injured", "Total", "State orterritory", "Location"]],
    2024: [1, ["2024 date", "Dead", "Injured", "Total", "State orterritory", "Location"]],
    2023: [0, ["2023 date", "Dead", "Injured", "Total", "State or territory", "Location"]],
    2022: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
    2021: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
    2020: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
    // 2019: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
    2018: [0, ["Date", "Dead", "Injured", "Total", "Community"]],
    2017: [0, ["Date", "Dead", "Injured", "Total", "Location"]],
  },
  date: null,
  data: [],
  dataTotal: {},
  sumHeader: ["Dead", "Injured", "Total"],
  sort: {},
};

initEL({ id: idSel_pafadojSelect, fn: pafadojUpdate, selStartValue: 2025, selList: Object.keys(pafadojOptions.headers).map((year) => [year, year]) });

export function clear_cl_Pafadoj() {
  pafadojOptions.date = idSel_pafadojSelect.KadGet();
  pafadojUpdate();
}

async function pafadojUpdate() {
  pafadojOptions.date = idSel_pafadojSelect.KadGet();
  KadTable.createHTMLGrid({ id: idTab_pafadojTable, header: pafadojGetHeader() });
  const { dataTable, error } = await KadFile.loadUrlToJSON({ variable: "dataTable", url: pafadojOptions.URL });
  if (layoutCheckCORSandDisableModule(error, "Pafadoj")) return;
  pafadojOptions.data = [];
  pafadojOptions.dataTotal = { Dead: 0, Injured: 0, Total: 0 };
  for (let row of dataTable[0]) {
    let dataObj = {};
    for (let i = 0; i < pafadojOptions.headers[pafadojOptions.date][1].length; i++) {
      const head = pafadojOptions.headers[pafadojOptions.date][1][i];
      if (i == 0) {
        let d = row[head].split(/[\–\,\s]/g);
        row[head] = KadDate.getDate(`${pafadojOptions.date}-${d[0]}-${d[1]}`, { format: "YYYY/MM/DD" });
      } else {
        row[head] = Number.isNaN(Number(row[head])) ? row[head] : Number(row[head]);
      }
      dataObj[head] = Number(row[head]) || row[head];
      if (pafadojOptions.sumHeader.includes(head)) {
        pafadojOptions.dataTotal[head] += Number(row[head]);
      }
    }
    pafadojOptions.data.push(dataObj);
  }
  pafadojTableReturn();
}

function pafadojSort(type) {
  pafadojOptions.sort[type] = !pafadojOptions.sort[type];
  pafadojOptions.data = KadArray.sortArrayByKey({ array: pafadojOptions.data, keys: type, inverse: pafadojOptions.sort[type] });
  pafadojTableReturn();
}

function pafadojGetHeader(data = null) {
  if (data == null) {
    return [
      ...pafadojOptions.headers[pafadojOptions.date][1].map((head, index) => {
        let headText = head;
        if (index == 0 && (head == "2024 date" || head == "2023 date")) headText = "Date";
        return {
          data: pafadojOptions.sumHeader.includes(headText) ? `${headText}` : headText,
          settings: {
            onclick: [pafadojSort, head],
          },
        };
      }),
    ];
  }
  return [
    ...pafadojOptions.headers[pafadojOptions.date][1].map((head, index) => {
      let headText = head;
      if (index == 0 && (head == "2024 date" || head == "2023 date")) headText = "Date";
      return {
        data: pafadojOptions.sumHeader.includes(headText) ? `${headText}<br> (${data[headText]})` : headText,
        settings: {
          onclick: [pafadojSort, head],
        },
      };
    }),
  ];
}

function pafadojTableReturn() {
  if (pafadojOptions.data.length == 0) return;
  const header = pafadojGetHeader(pafadojOptions.dataTotal);

  const body = [...pafadojOptions.headers[pafadojOptions.date][1].map((head) => ({ data: pafadojOptions.data.map((item) => item[head]) }))];
  KadTable.createHTMLGrid({ id: idTab_pafadojTable, header, body });
}
