const redirectPath = "/K-Universe";
const howaData = {
	URLGeocoding: `http://api.openweathermap.org/geo/1.0/direct?q=`,
	URLCurrent: "https://api.openweathermap.org/data/2.5/weather?",
	URLForecast: "https://api.openweathermap.org/data/2.5/forecast?",
};

if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
const axios = require("axios");
//set up the Server
const Compression = require("compression");
const express = require("express");
const app = express();
app.use(Compression());
app.use(express.json());
app.use(express.static("K-Universe"));

// app.get("/", (req, res) => {
// 	res.sendFile("index.html", { root: path.join(__dirname, "K-Universe") });
// });

app.listen(process.env.PORT);
console.log(`Started @ Port: ${process.env.PORT}`);

const news = require("newsapi");
const newsAPI = new news(process.env.API_NEWS_KEY);
const tableToJson = require("tabletojson").Tabletojson;

const { generateRequestUrl, normaliseResponse } = require("google-translate-api-browser");

//----------------------------------Data----------------------------
app.post(`${redirectPath}/Howa/`, (req, res) => {
	let data = req.body; // your JSON
	if (data.location != null) data.location = replaceUmlaute(data.location);
	async function HowaAsync() {
		if (data.location != null) {
			try {
				const axiosReturn = await axios.get(`${howaData.URLGeocoding}${data.location}&limit=1&appid=${process.env.API_WEATHER_KEY}`);
				data.lat = axiosReturn.data[0].lat;
				data.lon = axiosReturn.data[0].lon;
			} catch (error) {
				res.send(JSON.stringify({ error }));
				return;
			}
		}
		try {
			const currentReturn = await axios.get(
				`${howaData.URLCurrent}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`
			);
			data.currentData = currentReturn.data;
			const forecastReturn = await axios.get(
				`${howaData.URLForecast}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`
			);
			data.forecastData = forecastReturn.data;
			data.currentData.pop = data.currentData.rain == undefined ? 0 : 1;
		} catch (error) {
			res.send(JSON.stringify({ error }));
			return;
		}
		res.send(JSON.stringify(data));
	}
	HowaAsync();
});

app.post(`${redirectPath}/News/`, (req, res) => {
	let options = {
		category: req.body.category,
		country: req.body.country,
		pageSize: req.body.num,
	};

	newsAPI.v2
		.topHeadlines(options)
		.then((response) => {
			res.send(JSON.stringify(response)); // echo the result back
		})
		.catch((error) => {
			res.send(JSON.stringify({ error }));
		});
});

app.post(`${redirectPath}/Lions/`, (req, res) => {
	const url = "https://hirsau.lions.de/";
	const options = {
		useFirstRowForHeadings: true,
		// forceIndexAsNumber: true,
		ignoreColumns: [3],
	};
	async function lionsAsync() {
		try {
			const data = await tableToJson.convertUrl(url, options);
			res.send(JSON.stringify(data[0]));
		} catch (error) {
			res.send(JSON.stringify({ error }));
		}
	}
	lionsAsync();
});

app.post(`${redirectPath}/SpeechTranslate/`, (req, res) => {
	const data = req.body;
	async function SpeechAsync() {
		try {
			const from = data.langFrom == "ja" ? "jpn" : data.langFrom;
			const to = data.langTo == "ja" ? "jpn" : data.langTo;
			const url = generateRequestUrl(data.text, {
				from,
				to,
				raw: false,
			});
			const response = await axios.get(url);
			let returnData = normaliseResponse(response.data);
			returnData.pronunciation = returnData.pronunciation == undefined || returnData.pronunciation == "" ? null : returnData.pronunciation;
			res.send(JSON.stringify(returnData));
		} catch (error) {
			res.send(JSON.stringify({ error }));
			return;
		}
	}
	SpeechAsync();
});

// --------------allgemeine Funktionen---------------------------------------------------
function replaceUmlaute(word = null, language = "de") {
	if (word == null || word.trim() == "") return;
	const umlaute = {
		de: new Map([
			["ä", "ae"],
			["ö", "oe"],
			["ü", "ue"],
			["Ä", "Ae"],
			["Ö", "Oe"],
			["Ü", "Ue"],
		]),
		ja: new Map([
			["oo", "ō"],
			["uu", "ū"],
		]),
	};
	for (const [key, val] of umlaute[language]) {
		word = word.replaceAll(key, val);
	}
	return word;
}
