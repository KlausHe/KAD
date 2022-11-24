const redirectPath = "/K-Universe";
const howaData = {
  URLGeocoding: `http://api.openweathermap.org/geo/1.0/direct?q=`,
  URLCurrent: 'https://api.openweathermap.org/data/2.5/weather?',
  URLForecast: 'https://api.openweathermap.org/data/2.5/forecast?'
};

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const Axios = require('axios');
//set up the Server
const Compression = require('compression');
const Express = require('express');
const App = Express();
App.use(Express.json());

// compress all responses
App.use(Compression());
App.use(Express.static(__dirname));
App.listen(process.env.PORT);
App.get('/', (req, res) => res.redirect(redirectPath));
console.log(`Started @ Port: ${process.env.PORT}`)

const ServiceAccount = require("./serviceAccountKey.json");
const Admin = require("firebase-admin");
Admin.initializeApp({
  credential: Admin.credential.cert(ServiceAccount),
  databaseURL: "https://kad-universe.firebaseio.com"
});
let FBData = Admin.firestore();
const FBUserSettings = FBData.collection("User_Settings");
const FieldValue = Admin.firestore.FieldValue;

const News_API = require("newsapi");
const NewsApi = new News_API(process.env.API_NEWS_KEY);
const {
  generateRequestUrl,
  normaliseResponse
} = require("google-translate-api-browser");

// -----------  Server/Client - Communication ---------------------
App.post(`${redirectPath}/UserAccLogin/`, (req, res) => {
  const loginData = req.body;
  FBUserSettings.doc(loginData.uid).get()
    .then((doc) => {
      let data = {
        saves: doc.data(),
        error: null
      }
      delete data.saves.email
      delete data.saves.uid
      res.send(JSON.stringify(data))
    })
    .catch(error => {
      res.send(JSON.stringify({
        error
      }))
    })
});

App.post(`${redirectPath}/UserAccRegister/`, (req, res) => {
  let saves = loginData.saves;
  saves.uid = loginData.uid;
  saves.email = loginData.email;
  FBUserSettings.doc(loginData.uid).set(
      saves).then(() => {
      let data = {
        saves: doc.data(),
        error: null
      }
      delete data.saves.email
      delete data.saves.uid
      res.send(JSON.stringify(data))
    })
    .catch(error => {
      res.send(JSON.stringify({
        err: error
      }))
    })
});

App.post(`${redirectPath}/LoadDiscipuli/`, (req, res) => {
  const uid = req.body.uid;
  const category = req.body.category;
  FBUserSettings.doc(uid).get()
    .then(doc => {
      const returnData = {
        [category]: doc.data()[category]
      };
      res.send(JSON.stringify(returnData));
    })
    .catch((error) => {
      res.send(JSON.stringify({
        error
      }));
    });
});

App.post(`${redirectPath}/SaveDiscipuli/`, (req, res) => {
  const data = req.body;
  const uid = data.uid;
  delete data.uid
  const key = Object.keys(data)[0];
  const saveDoc = FBUserSettings.doc(uid);
  //delete this Dataset with its Values
  saveDoc.update({
      [key]: FieldValue.delete()
    }).then(() => {
      //set this Dataset with its Values
      saveDoc.set(
        data, {
          merge: true
        })
    }).then(() => {
      res.send(JSON.stringify({
        key: key,
        error: null
      }));
    })
    .catch((error) => {
      res.send(JSON.stringify({
        error
      }));
    });
});

//----------------------------------Data----------------------------
App.post(`${redirectPath}/Howa/`, (req, res) => {
  let data = req.body; // your JSON
  if (data.location != null) data.location = replaceUmlaute(data.location)
  async function HowaAsync() {
    //get coordinates from location through API
    if (data.location != null) {
      try {
        const axiosReturn = await Axios.get(`${howaData.URLGeocoding}${data.location}&limit=1&appid=${process.env.API_WEATHER_KEY}`);
        data.lat = axiosReturn.data[0].lat
        data.lon = axiosReturn.data[0].lon
      } catch (error) {
        res.send(JSON.stringify({
          error
        }));
        return
      };
    }

    try {
      const currentReturn = await Axios.get(`${howaData.URLCurrent}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`);
      data.currentData = currentReturn.data;
      const forecastReturn = await Axios.get(`${howaData.URLForecast}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`);
      data.forecastData = forecastReturn.data
      data.currentData.pop = (data.currentData.rain == undefined) ? 0 : 1;
    } catch (error) {
      res.send(JSON.stringify({
        error
      }));
      return
    };
    res.send(JSON.stringify(data))
  }
  HowaAsync();
});

App.post(`${redirectPath}/News/`, (req, res) => {
  const data = req.body;
  let options = {
    q: replaceUmlaute(data.q, data.language),
    category: data.category,
    language: data.language,
    country: data.country,
    pageSize: (data.q === "") ? 20 : 40,
  }

  NewsApi.v2.topHeadlines(options)
    .then(response => {
      res.send(JSON.stringify(response)); // echo the result back
    })
    .catch(error => {
      res.send(JSON.stringify({
        error
      }));
    });
});



App.post(`${redirectPath}/SpeechTranslate/`, (req, res) => {
  const data = req.body;
  async function SpeechAsync() {
    try {
      const url = generateRequestUrl(data.text, {
        from: (data.langFrom == "ja") ? "jpn" : data.langFrom,
        to: (data.langTo == "ja") ? "jpn" : data.langTo,
        raw: false
      });
      const response = await Axios.get(url);
      let returnData = normaliseResponse(response.data)
      returnData.pronunciation = (returnData.pronunciation == undefined || returnData.pronunciation == "") ? null : returnData.pronunciation
      res.send(JSON.stringify(returnData));
    } catch (error) {
      res.send(JSON.stringify({
        error
      }));
      return
    };
  }
  SpeechAsync();
});

// --------------allgemeine Funktionen---------------------------------------------------
function replaceUmlaute(word, language = "de") {
  if (word) {
    const umlaute = {
      de: [
        ["ä", "ae"],
        ["ö", "oe"],
        ["ü", "ue"],
        ["Ä", "Ae"],
        ["Ö", "Oe"],
        ["Ü", "Ue"]
      ],
      ja: [
        ["oo", "ō"],
        ["uu", "ū"]
      ]
    };
    for (let i = 0; i < umlaute[language].length; i++) {
      const umlaut = umlaute[language][i];
      if (word.includes(umlaut[0])) {
        word = word.replace(umlaut[0], umlaut[1]);
      };
    };
  };
  return word;
};