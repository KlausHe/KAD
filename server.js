const howaData = {
  URLGeocoding: `http://api.openweathermap.org/geo/1.0/direct?q=`,
  URLCurrent: 'https://api.openweathermap.org/data/2.5/weather?',
  URLForecast: 'https://api.openweathermap.org/data/2.5/forecast?'
};

class User {
  constructor(id, mail) {
    this.id = id;
    this.nuncDiscipuli = {
      cred: {
        uid: id,
        email: mail
      }
    }
  };
};
let users = {};

// require('dotenv').config();
//set up the Server
const redirectPath = "/K-Universe";
const Compression = require('compression');
const Express = require('express');
const App = Express();
App.use(Express.json());

// compress all responses
App.use(Compression());
App.use(Express.static(__dirname));
App.get('/', (req, res) => res.redirect(redirectPath));

const {
  createServer
} = require("http");
const HttpServer = createServer(App);
HttpServer.listen(process.env.PORT);
console.log(`Port: ${HttpServer.address().port}`)

const ServiceAccount = require("./serviceAccountKey.json");
const Admin = require('firebase-admin');
Admin.initializeApp({
  credential: Admin.credential.cert(ServiceAccount),
  databaseURL: "https://kad-universe.firebaseio.com"
});
let FBData = Admin.firestore();
const FBUserSettings = FBData.collection("User_Settings");
const FieldValue = Admin.firestore.FieldValue;

const RequestPromise = require('request-promise');
const News_API = require('newsapi');
const NewsApi = new News_API(process.env.API_NEWS_KEY);
const TranslateAPI = require("google-translate-api-browser").translate;

// -----------  Server/Client - Communication ---------------------
App.post(`${redirectPath}/UserAcc/`, (req, res) => {
  const loginData = req.body;
  if (loginData.updateType == "login") {
    FBUserSettings.doc(loginData.uid).collection("cred").doc("cred").get()
      .then(doc => {
        // const returnData = doc.data();
        if (!users.hasOwnProperty(loginData.uid)) {
          users[loginData.uid] = new User(loginData.uid, loginData.email)
          return
        }
      })
      .then(() => {
        FBUserSettings.doc(loginData.uid).collection("saves").doc("saves").get()
          .then(doc => {
            let retData = {
              saves: doc.data(),
              cred: users[loginData.uid].cred,
              err: null
            }
            res.send(retData);
          })
      })
      .catch(error => {
        res.send(JSON.stringify({
          err: error
        }));
      });
  }
  if (loginData.updateType === "register") {
    FBUserSettings.doc(loginData.uid).collection("cred").doc("cred").set({
        uid: loginData.uid,
        email: loginData.email
      }).then(() => {
        if (!users.hasOwnProperty(loginData.uid)) {
          users[loginData.uid] = new User(loginData.uid, loginData.email)
          return
        }
        FBUserSettings.doc(loginData.uid).collection("saves").doc("saves").set( // crazy way to update with set - merge:true!
          loginData.saves).then(() => {
          let retData = {
            saves: doc.data(),
            cred: users[loginData.uid].cred,
            err: null
          }
          res.send(retData); // echo the result back
        })
      })
      .catch(error => {
        res.send(JSON.stringify({
          err: error
        }));
      });
  };
});

App.post(`${redirectPath}/LoadDiscipuli/`, (req, res) => {
  const uid = req.body.uid;
  const category = req.body.category;
  FBUserSettings.doc(uid).collection("saves").doc("saves").get()
    .then(doc => {
      const returnData = {
        [category]: doc.data()[category]
      };
      res.send(JSON.stringify(returnData));
    })
    .catch((error) => {
      res.send(JSON.stringify({
        err: error
      }));
    });
});


App.post(`${redirectPath}/SaveDiscipuli/`, (req, res) => {
  const uid = req.body.uid;
  const saveData = req.body.category;
  console.log(uid, saveData);
  const saveDoc = FBUserSettings.doc(uid).collection("saves").doc("saves");
  //delete this Dataset with its Values
  saveDoc.update({
      [Object.keys(saveData)[0]]: FieldValue.delete()
    }).then(() => {
      //set this Dataset with its Values
      saveDoc.set(
        saveData, {
          merge: true
        })
    }).then(() => {
      res.send(JSON.stringify(Object.keys(saveData)[0]));
    })
    .catch((error) => {
      res.send(JSON.stringify({
        err: error
      }));
    });
});

//----------Data TICKER----------------------------
App.post(`${redirectPath}/Howa/`, (req, res) => {
  let data = req.body; // your JSON
  if (data.location != null) data.location = replaceUmlaute(data.location)
  async function HowaAsync() {
    //get coordinates from location through API
    if (data.location != null) {
      try {
        const promiseReturn = await RequestPromise({
          url: `${howaData.URLGeocoding}${data.location}&limit=1&appid=${process.env.API_WEATHER_KEY}`,
          json: true
        });
        data.lat = promiseReturn[0].lat
        data.lon = promiseReturn[0].lon
        data.err = null
      } catch (error) {
        res.send(JSON.stringify({
          statusCode: 402,
          err: error
        }));
        return
      };
    }

    try {
      const currentReturn = await RequestPromise({
        url: `${howaData.URLCurrent}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`,
        json: true
      });
      data["currentData"] = currentReturn
      const forecastReturn = await RequestPromise({
        url: `${howaData.URLForecast}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`,
        json: true
      });
      data["forecastData"] = forecastReturn
      data.currentData.pop = (data.currentData.rain == undefined) ? 0 : 1;
      data["err"] = null
    } catch (error) {
      res.send(JSON.stringify({
        err: error
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
        err: error
      }));
    });
});
App.post(`${redirectPath}/SpeechTranslate/`, (req, res) => {
  const data = req.body;
  let options = {
    from: (data.langFrom == "ja") ? "jpn" : data.langFrom,
    to: (data.langTo == "ja") ? "jpn" : data.langTo,
    raw: false
  };
  TranslateAPI(data.text, options)
    .then(response => {
      res.send(JSON.stringify(response)); // echo the result back
    })
    .catch(error => {
      res.send(JSON.stringify({
        err: error
      }));
    });
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
/*
IO.on('connection', (socket) => {
    // console.log("User connected:", socket.id);
    const thisUser = new User(socket.id)

    //---------nuncDiscipuli LOGIN FIREBASE---------
    socket.on('UserAccRequest', (loginData) => {
      if (thisUser != null) {
        if (loginData.updateType == "login") {
          FBUserSettings.doc(loginData.uid).collection("cred").doc("cred").get()
            .then(doc => {
              const returnData = doc.data();
              thisUser.nuncDiscipuli.cred.uid = loginData.uid;
              thisUser.nuncDiscipuli.cred.email = returnData.email;
            })
            .then(() => {
              FBUserSettings.doc(thisUser.nuncDiscipuli.cred.uid).collection("saves").doc("saves").get()
                .then(doc => {
                  const retData = doc.data();
                  IO.to(socket.id).emit('LoadDiscipuliReturn', retData);
                  IO.to(socket.id).emit('UserAccReturn', null); //this comes after Returned data!
                })
            })
            .catch(error => {
              IO.to(socket.id).emit('UserAccReturn', error);
            });
        } else if (loginData.updateType === "register") {
          FBUserSettings.doc(loginData.uid).collection("cred").doc("cred").set({
              uid: loginData.uid,
              email: loginData.email
            }).then(() => {
              const saves = loginData.saves;
              thisUser.nuncDiscipuli.cred.uid = loginData.uid;
              thisUser.nuncDiscipuli.cred.email = loginData.email;
              FBUserSettings.doc(loginData.uid).collection("saves").doc("saves").set( // crazy way to update with set - merge:true!
                saves).then(() => {
                IO.to(socket.id).emit('LoadDiscipuliReturn', saves);
                IO.to(socket.id).emit('UserAccReturn', null); //this comes after Returned data!
              })
            })
            .catch(error => {
              IO.to(socket.id).emit('UserAccReturn', error);
            });
        };
      };
    });
    //---------nuncDiscipuli UPDATE STUFF---------
    socket.on('LoadDiscipuliRequest', (category) => {
      FBUserSettings.doc(thisUser.nuncDiscipuli.cred.uid).collection("saves").doc("saves").get()
        .then(doc => {
          const returnData = {
            [category]: doc.data()[category]
          };
          IO.to(socket.id).emit('LoadDiscipuliReturn', returnData);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    //---------nuncDiscipuli UPDATE FIREBASE---------
    socket.on('SaveDiscipuliRequest', (saveData) => {
      const saveDoc = FBUserSettings.doc(thisUser.nuncDiscipuli.cred.uid).collection("saves").doc("saves");
      //delete this Dataset with its Values
      saveDoc.update({
          [Object.keys(saveData)[0]]: FieldValue.delete()
        }).then(() => {
          //set this Dataset with its Values
          saveDoc.set(
            saveData, {
              merge: true
            })
        }).then(() => {
          IO.to(socket.id).emit('SaveDiscipuliReturn', Object.keys(saveData)[0]);
        })
        .catch((error) => {
          // console.log("not saved", error)
          IO.to(socket.id).emit('SaveDiscipuliReturn', error);
        });
    });
  }
}
//--------nuncDiscipuli LOGOUT FIREBASE---------
// socket.on('UserLogoutRequest', (data) => {});  --> delete this User?!
*/
/*
 //----------NEWS TICKER----------------------------
 socket.on('NewsRequest', (data) => {
   thisUser.news.q = replaceUmlaute(data.q, data.language);
   thisUser.news.category = data.category;
   thisUser.news.language = data.language;
   thisUser.news.country = data.country;
   thisUser.news.pageSize = (data.q === "") ? 20 : 40;
   NewsApi.v2.topHeadlines(thisUser.news)
     .then(response => {
       thisUser.news.body = response;
       // console.log(thisUser.news.body, thisUser.news);
       IO.to(socket.id).emit('NewsReturn', thisUser.news.body);
     })
     .catch(error => {
       let data = {
         err: error
       };
       IO.to(socket.id).emit('NewsReturn', data);
     });
 });
 */
/*
 //----------WEATHER TICKER----------------------------
 socket.on('HowaRequest', (reqData) => {
   let data = reqData;
   if (data.location != null) data.location = replaceUmlaute(data.location)
   requestHowaAPI({
     userID: socket.id,
     data: data
   });
 });
 */
/*
  socket.on('SpeechTranslateRequest', (data) => {
    let text = data.text;
    let options = {
      from: (data.langFrom == "ja") ? "jpn" : data.langFrom,
      to: (data.langTo == "ja") ? "jpn" : data.langTo,
      raw: false
    };
    TranslateAPI(text, options)
      .then(res => {
        IO.to(socket.id).emit('SpeechTranslateReturn', res);
      })
      .catch(err => {
        IO.to(socket.id).emit('SpeechTranslateReturn', err);
        console.error("error:", err);
      });
  });
  // on Dicsonnect------------
  socket.on('disconnect', (reason) => {
    // console.log("Disconnected because: ", reason);
  });
});
*/