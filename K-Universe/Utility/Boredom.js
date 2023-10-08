const boredomOptions = {
  url: "https://www.boredapi.com/api/activity",
}

function clear_cl_Boredom() {
  KadUtils.dbID("idArea_boredomAnswer").value = "";
  KadUtils.dbID("idArea_boredomAnswer").placeholder = "Activitätengenerator...";
  boredomStart()
};

function boredomStart() {
  KadUtils.dbID("idArea_boredomAnswer").value = "searching..."
  globalP5.loadJSON(boredomOptions.url, boredomGetData, 'json');
};

function boredomGetData(data) {
  KadUtils.dbID("idArea_boredomAnswer").value = `${data.activity}.`
};