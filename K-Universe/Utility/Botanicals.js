function clear_cl_Botanicals() {
  KadUtils.DOM.clearFirstChild("idSel_botanicalsPlant");
  KadUtils.DOM.clearFirstChild("idSel_botanicalsDiscomfort");
  KadUtils.dbID("idSel_botanicalsPlant").options[0] = new Option("Pflanze wählen");
  KadUtils.dbID("idSel_botanicalsDiscomfort").options[0] = new Option("Beschwerde wählen");
  KadUtils.Table.clear("idTabBody_botanicalsResultDiscomfort");
  KadUtils.dbID("idTabHeader_BotanicalPlants").innerHTML = "Gewürze / Kräuter";
  KadUtils.Table.clear("idTabBody_botanicalsResultPlant");
  KadUtils.dbID("idTabHeader_BotanicalPlantDiscomfort").innerHTML = "Beschwerden";
  KadUtils.dbID("idTabHeader_BotanicalPlantEffect").innerHTML = "Wirkung";
}

function botanicalsPopulateOptions(type) {
  if (KadUtils.dbID(type.id).options.length > 1) return
  if (type.id == "idSel_botanicalsPlant") {
    Data_Botanicals.forEach((obj, index) => {
      KadUtils.dbID("idSel_botanicalsPlant").options[index] = new Option(obj.plant);
    })
  } else {
    let discomfortSet = new Set();
    for (let dis of Data_Botanicals) {
      dis.discomfort.forEach(item => discomfortSet.add(item))
    }
    discomfortSet = Array.from(discomfortSet).sort();
    discomfortSet.forEach((d, index) => {
      KadUtils.dbID("idSel_botanicalsDiscomfort").options[index] = new Option(d);
    });
  }
}

function botanicalsPlantChange(sel) {
  if (sel.selectedIndex > 0) {
    const plant = Data_Botanicals[sel.selectedIndex - 1];
    botanicalsPlantTable(plant);
  };
};

function botanicalsPlantTable(plant) {
  KadUtils.Table.clear("idTabBody_botanicalsResultPlant");
  let maxA = plant.discomfort ? plant.discomfort.length : 0;
  let maxB = plant.effect ? plant.effect.length : 0;
  let maxLength = Math.max(maxA, maxB);
  for (let i = 0; i < maxLength; i++) {
    const row = KadUtils.Table.insertRow("idTabBody_botanicalsResultPlant");
    if (plant.discomfort && plant.discomfort[i]) {
      KadUtils.Table.addCell(row, {
        names: ["botanicalsDiscomfort", i],
        type: "Lbl",
        text: plant.discomfort[i],
        createCellClass: [(plant.effect && plant.effect[i]) ? "clTab_borderThinRight" : null],
        copy: true
      });
    };
    if (plant.effect && plant.effect[i]) {
      KadUtils.Table.addCell(row, {
        names: ["botanicalsEffect", i],
        type: "Lbl",
        text: plant.effect[i],
        copy: true
      });
    };
  };
};

function botanicalsDiscomfortChange(sel) {
  if (sel.selectedIndex > 0) {
    let plantsArray = [];
    Data_Botanicals.forEach((obj) => {
      if (obj.discomfort.includes(sel.value)) {
        plantsArray.push(obj.plant);
      };
    })
    botanicalsDiscomfortTable(plantsArray);
  };
};

function botanicalsDiscomfortTable(plants) {
  KadUtils.Table.clear("idTabBody_botanicalsResultDiscomfort");
  for (let i = 0; i < plants.length; i++) {
    const row = KadUtils.Table.insertRow("idTabBody_botanicalsResultDiscomfort");
    KadUtils.Table.addCell(row, {
      names: ["botanicalsPlants", i],
      type: "Lbl",
      text: plants[i],
      createCellClass: [(plants[i + 1] !== undefined) ? "clTab_borderThinRight" : null],
      copy: true
    });

    if (plants[i + 1] !== undefined) {
      i++;
      KadUtils.Table.addCell(row, {
        names: ["botanicalsPlants", i],
        type: "Lbl",
        text: plants[i],
        copy: true
      });
    };
  };
};
