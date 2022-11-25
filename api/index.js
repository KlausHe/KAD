const app = require('express')();
// const { v4 } = require('uuid');

const howaData = {
  URLGeocoding: `http://api.openweathermap.org/geo/1.0/direct?q=`,
  URLCurrent: 'https://api.openweathermap.org/data/2.5/weather?',
  URLForecast: 'https://api.openweathermap.org/data/2.5/forecast?'
};

const Admin = require("firebase-admin");
Admin.initializeapp({
  credential: Admin.credential.cert({
    "type": "service_account",
    "project_id": "kad-universe",
    "private_key_id": "3d196bf43855666f27a8ffa189798a89a9dc9e75",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC7acwMmLtpOzPd\nr3SmtbopNDB0NtYPRb9Xf+89JQeoKOJUacQBRQId+PqLyXmtBIBa1lgcaQq+HEQ3\nZ40/orS8oorYDwJFRnwoSI3Tb/VYRql9JXcnP9Bzftza3IENqkcOHjOQ0MWDjoZW\npiiO+8TdPJB4yZfSS/k4C6yrQX1mWsrNB21+Tyj/OaggEVpD1xyq0CStMLjgw4sF\nncL0egLLgtWVaiWALEPoRbgdLgrlqcYW5gx4ZHzh/qJYbikuw749uruNOY4Op5le\n9OdxjCldIsXgmxDrCrS3uGLQujPUmHCBS3JrBUc8QbPMY2zY2OdM7xv2QXkuP9NR\nt4MDDQn1AgMBAAECggEAFlRiMAQInF6l7N1pYC2Z2yvxM/+OnK46QJIpLpdZZLNO\nWDFr3ZzbxjdynrIoMbGuG2SbhfMMCR+0Dwfi//iCYVFaiqirJBbkVyZh45Xc3SI6\nMoOCwWXsj75HUTphk/+8TJXTngcJ6YVTQ0Kz5WlhCN0c949JbBCKRp+5eIQqjUXC\nvFmU7mVEzreKehe9kYgl2yns5xf/gyKyOAy70vDnWD/Wg3ahx5G1GZssYgpa6AyW\nUjJ0jkWS/C4qWp1maA5k7xJDOcudNeOO3jDnGF/Wjtwsy3ziByufIxuMPoLWynT8\neuudev4AvlLsZu+wCc53aNMW6q3ByRKNyltoKS+fUQKBgQDrW8ZjHsLAb+JH8Ssf\nVcZPKUvrTU2cxnLWAzCRhJD3nMFCDQF0FCilyd/2Yr4Uh4EEzt3vJhvghlZEILi3\n9pU5d0R7odElS3z1k2N+fq/gR9ermALqKHT9KVVj6+wQ9AYVf/AbPKkIAKI2y70J\npOVGpjgU7FvUbfqzPOFnpDzE/QKBgQDL2ZCZmCUUnW1mlpcqFgXwMsp/AkHOHqs2\n2HasC+jFpB6kyL6MZrx4GDEz/h0d8TL89O36Dc7wIZdFB5rrLif2Rvz8RClY9cLV\ns6zoMZirSJPY1v0+JnmkpfPxK+FBmm+bDa5F3gFgUYSMVYKrWJaowYQ8Z0uSmAgu\n0jHe9hsmWQKBgCY0GXnRbm9qOeLPpN5LQAtteqNRQv3lwJI4plOYnydyTHR6Q/gh\npY9zu2T1FkGi1TCAm8nL9850P+CDJzjFT+eqEnW3CInzPO9n40iPK+FOCBYUcLSt\nqH/Hi9LSYtlFow8uWz0wlYd1At++JotANu9G3+eVjjpnN8CMa1I1eJ/JAoGAB3sL\ncGeB7Ni+HAaos3WtcBwdDD4j9hFwDQoyiKvDNgWIzllDjNl0Tx/sJlFL9j5Uta2z\nUfrRvkQtTe4yhDDkbIg8XnGN5uLV7Iu0a6zuQlLeghWZo3879YvVgOMwV/z33YPK\nAmxcNpGnQJMewXT1ymmXlbPgtRd5LWavR9RWOLkCgYBqebmnmu6rRB30XR5ff38m\nYkAasMuW5GrY1AYGxmnX3TudOM0yU2BVuNeGO65hZ1wF8hy4Hs8jncqQVppt6ArY\nUI1FJ0j5iLL4ppEfBqBHQjo9vI0kW8x7W15MAE6scUCD+UE2O1SbggEYdDXbWLoR\ncXRQatCMgTf4WBm9kXkVDg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-mf5ra@kad-universe.iam.gserviceaccount.com",
    "client_id": "116420337746827807785",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mf5ra%40kad-universe.iam.gserviceaccount.com"
  }),
  databaseURL: "https://kad-universe.firebaseio.com"
});
let FBData = Admin.firestore();
const FBUserSettings = FBData.collection("User_Settings");
const FieldValue = Admin.firestore.FieldValue;

const {
  generateRequestUrl,
  normaliseResponse
} = require("google-translate-api-browser");

// -----------  Server/Client - Communication ---------------------

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.post(`/api/UserAccLogin/`, (req, res) => {
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

app.post(`/api/UserAccRegister/`, (req, res) => {
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

app.post(`/api/LoadDiscipuli/`, (req, res) => {
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

app.post(`/api/SaveDiscipuli/`, (req, res) => {
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
app.post(`/api/Howa/`, (req, res) => {
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

app.post(`/api/News/`, (req, res) => {
  const urlStart = "https://newsapi.org/v2/top-headlines?"
  const category = `category=${req.body.category}&`
  const country = `country=${req.body.country}&`
  const num = `pageSize=${req.body.num}&`
  async function NewsAsync() {
    try {
      let response = await Axios.get(`${urlStart}${country}${category}${num}apiKey=${process.env.API_NEWS_KEY}`);
      let data = response.data.articles
      res.send(JSON.stringify(data))
    } catch (error) {
      console.log("error: ", error)
      res.send(JSON.stringify({
        error
      }));
      return
    };
  }
  NewsAsync();
});

app.post(`/api/SpeechTranslate/`, (req, res) => {
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

module.exports = app;
