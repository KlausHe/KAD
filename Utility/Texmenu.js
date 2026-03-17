import { dbID, initEL, KadDate } from "../KadUtils/KadUtils.js";

initEL({ id: "idBtn_texmenuPage1", fn: () => texmenuOpen(1), resetValue: "Menu Seite 1" });
initEL({ id: "idBtn_texmenuPage2", fn: () => texmenuOpen(2), resetValue: "Menu Seite 2" });

const texmenuOptions = {
  currentPage: 0,
};

export function clear_cl_Texmenu() {
  texmenuOptions.currentPage = 0;
  dbID("idImg_texmenuImage").src = "";
  dbID("idImg_texmenuImage").onclick = null;
}

function texmenuOpen(page) {
  if (texmenuOptions.currentPage == page) {
    clear_cl_Texmenu();
    return;
  }
  texmenuOptions.currentPage = page;
  const KW = KadDate.getWeekNumber();
  const Month = KadDate.getDate(null, { format: "MM", leadingDigit: true });
  const Year = KadDate.getDate(null, { format: "YYYY" });
  const url = `https://texeria.de/wp-content/uploads/${Year}/${Month}/Texeria-Speisekarte-KW-${KW}_Seite_${page}.jpg`;
  dbID("idImg_texmenuImage").src = url;
  dbID("idImg_texmenuImage").onclick = () => {
    window.open(url);
  };
}
