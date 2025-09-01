import { dbID, initEL, KadArray, KadColor, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
const ranjeOptions = {
  value: 36,
  results: [],
  selected: 2,
};

const ranjeChart = {
  config: {
    type: "scatter",
    data: {
      datasets: [
        {
          data: null,
        },
      ],
    },
    options: {
      animation: {
        duration: 1500,
        easing: "easeInOutCubic",
      },
      plugins: {
        title: {
          display: true,
          text: "Ranje",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          min: 0,
        },
        y: {
          min: 0,
        },
      },
    },
  },
  canvas: null,
};

initEL({ id: dbID("idVin_ranjeVal"), fn: ranjeCalc, resetValue: 36 });

export function clear_cl_Ranje() {
  dbID("idVin_ranjeVal").KadReset();
  if (ranjeChart.canvas != null) {
    ranjeChart.canvas.destroy();
  }
  ranjeChart.canvas = new Chart(dbID("idCanv_ranje"), ranjeChart.config);
  ranjeChart.config.data.datasets[0].backgroundColor = KadColor.colAsCSS({ colorArray: globalColors.elements.baseColor, from: "HSL", to: "RGB" });
  ranjeChart.config.data.datasets[0].borderColor = KadColor.colAsCSS({ colorArray: globalColors.elements.baseColor, from: "HSL", to: "RGB" });
  ranjeCalc();
}

function ranjeCalc() {
  ranjeOptions.results = [];
  ranjeOptions.value = dbID("idVin_ranjeVal").KadGet();
  for (let i = 2; i < ranjeOptions.value; i++) {
    if (ranjeOptions.value % i === 0) {
      ranjeOptions.results.push([i, Math.floor(ranjeOptions.value / i)]);
    }
  }
  if (ranjeOptions.results.length == 0) {
    ranjeOptions.results.push([ranjeOptions.value, 1]);
  }
  ranjeOptions.selected = Math.floor(ranjeOptions.results.length / 2);
  ranjeCreateTable();
  ranjeUpdateChart();
}

function ranjeCreateTable() {
  const body = [
    //
    { data: ranjeOptions.value, settings: { align: "right", noBorder: "right", onclick: ranjeSelect } },
    { data: "=", settings: { align: "center", noBorder: "right", onclick: ranjeSelect } },
    { data: ranjeOptions.results.map((item) => `${item[0]} x ${item[1]}`), settings: { align: "left", onclick: ranjeSelect } },
  ];
  KadTable.createHTMLGrid({ id: dbID("idTab_ranjeTable"), body });
}

function ranjeSelect(index) {
  ranjeOptions.selected = index;
  ranjeUpdateChart();
}

function ranjeUpdateChart() {
  if (ranjeChart.canvas == null) return;
  const selectedSet = ranjeOptions.results[ranjeOptions.selected];
  const resolution = 20;
  const stepX = selectedSet[0] / resolution;
  const maxX = Math.ceil(selectedSet[0] + 2 * stepX);
  ranjeChart.canvas.options.scales.x.max = maxX;
  const stepY = selectedSet[1] / resolution;
  const maxY = Math.ceil(selectedSet[1] + 2 * stepY);
  ranjeChart.canvas.options.scales.y.max = maxY;
  ranjeChart.config.data.datasets[0].data = KadArray.createIndexedArray(selectedSet[0], selectedSet[1], 1);
  ranjeChart.config.options.plugins.title.text = `${ranjeOptions.value} = ${selectedSet[0]} x ${selectedSet[1]}`;
  ranjeChart.canvas.update();
}

export function canvas_cl_Ranje() {
  ranjeChart.config.data.datasets[0].backgroundColor = KadColor.colAsCSS({ colorArray: globalColors.elements.baseColor, from: "HSL", to: "RGB" });
  ranjeChart.config.data.datasets[0].borderColor = KadColor.colAsCSS({ colorArray: globalColors.elements.baseColor, from: "HSL", to: "RGB" });
  ranjeChart.canvas.update();
}
