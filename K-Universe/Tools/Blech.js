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
      utilsGetImgPath: "Data/Images/bl-rundloch.png",
      breite: true
    },
    Langloch: {
      get func() {
        const f = (blechOptions.b <= 25 || blechOptions.b === "") ? this.factorA : (blechOptions.b <= 50) ? this.factorB : this.factorC;
        return blechOptions.r + f * blechOptions.s;
      },
      factorA: 3,
      factorB: 4,
      factorC: 5,
      utilsGetImgPath: "Data/Images/bl-langloch.png",
      breite: false
    },
    Rechteckloch: {
      get func() {
        const f = (blechOptions.b <= 25 || blechOptions.b === "") ? this.factorA : (blechOptions.b <= 50) ? this.factorB : this.factorC;
        return blechOptions.r + f * blechOptions.s;
      },
      factorA: 3,
      factorB: 3.5,
      factorC: 4,
      utilsGetImgPath: "Data/Images/bl-rechteckloch.png",
      breite: false
    }
  }
};

function clear_cl_Blechgeometrie() {
  utilsResetInput("idVin_blechgeoDicke", blechOptions.dicke)
  utilsResetInput("idVin_blechgeoRadius", blechOptions.radius)
  utilsResetInput("idVin_blechgeoBreite", blechOptions.breite)

  clearFirstChild("idSel_blechgeoForm");
  let selInput = dbID("idSel_blechgeoForm")
  for (const [i, key] of Object.keys(blechOptions.geo).entries()) {
    const opt = document.createElement("OPTION");
    opt.textContent = key;
    opt.value = key;
    selInput.appendChild(opt);
  };
  blechgeoFormChange()
  dbID("idLbl_blechgeoResult").innerHTML = `Mindestabstand: ...`;
};

function blechgeoFormChange() {
  let index = dbID("idSel_blechgeoForm").selectedIndex;
  let vinOption = dbID("idSel_blechgeoForm").options[index].text
  let key = blechOptions.geo[vinOption].utilsGetImgPath;
  dbID('idImg_Blechgeometrie').src = blechOptions.geo[vinOption].utilsGetImgPath;
  utilsEnableBtn(idVin_blechgeoBreite, !blechOptions.geo[vinOption].breite);
};

function calcBlechGeo() {
  blechOptions.s = utilsNumberFromInput("idVin_blechgeoDicke", blechOptions.dicke);
  blechOptions.r = utilsNumberFromInput("idVin_blechgeoRadius", blechOptions.radius);
  blechOptions.b = utilsNumberFromInput("idVin_blechgeoBreite", blechOptions.breite);
  let selBlechForm = blechOptions.geo[dbID("idSel_blechgeoForm").value];

  dbID("idLbl_blechgeoResult").textContent = `Mindestabstand: ${selBlechForm.func}`;
};