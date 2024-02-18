const redirectPath = "/K-Universe";
const newsData = {
	get interval() {
		return new Date().getTime() - 1000 * 60 * 60 * 2; // 2h
	},
	data: {},
};
const howaData = {
	URLGeocoding: `http://api.openweathermap.org/geo/1.0/direct?q=`,
	URLCurrent: "https://api.openweathermap.org/data/2.5/weather?",
	URLForecast: "https://api.openweathermap.org/data/2.5/forecast?",
};

import "dotenv/config";
import axios from "axios";
import https from "https";

//set up the Server
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.static("K-Universe"));

// app.get("/", (req, res) => {
// 	res.sendFile("index.html", { root: path.join(__dirname, "K-Universe") });
// });

app.listen(process.env.PORT);
console.log(`Started @ Port: ${process.env.PORT}`);

import { tabletojson } from "tabletojson";

// const { generateRequestUrl, normaliseResponse } = require("google-translate-api-browser");
import { generateRequestUrl, normaliseResponse } from "google-translate-api-browser";

//----------------------------------Data----------------------------
app.post(`${redirectPath}/Howa/`, (req, res) => {
	let data = req.body;
	function replaceUmlaute(word = null) {
		if (word == null || word.trim() == "") return;
		const umlaute = new Map([
			["ä", "ae"],
			["ö", "oe"],
			["ü", "ue"],
			["Ä", "Ae"],
			["Ö", "Oe"],
			["Ü", "Ue"],
		]);
		for (const [key, val] of umlaute) {
			word = word.replaceAll(key, val);
		}
		return word;
	}

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
			const currentReturn = await axios.get(`${howaData.URLCurrent}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`);
			data.currentData = currentReturn.data;
			const forecastReturn = await axios.get(`${howaData.URLForecast}lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.API_WEATHER_KEY}`);
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
	const country = req.body.country;
	const category = req.body.category;
	const url = `https://newsdata.io/api/1/news?apikey=${process.env.API_NEWS_KEY}&country=${country}&language=${country}&category=${category}`;
	function NewsAsync() {
		https
			.get(url, (resp) => {
				let httpsData = "";
				resp.on("data", (chunk) => {
					httpsData += chunk;
				});
				resp.on("end", () => {
					let newsReturn = JSON.parse(httpsData);
					newsData.data[category] = { data: newsReturn, timestamp: new Date().getTime() };
					res.send(JSON.stringify(newsData.data[category].data));
				});
			})
			.on("error", (err) => {
				res.send(JSON.stringify({ error: err.message }));
				return;
			});
	}
	if (newsData.data[category] == undefined || newsData.data[category].timestamp < newsData.interval) {
		NewsAsync();
	} else {
		res.send(JSON.stringify(newsData.data[category].data));
	}
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
			const data = await tabletojson.convertUrl(url, options);
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
		const from = data.langFrom == "ja" ? "jpn" : data.langFrom;
		const to = data.langTo == "ja" ? "jpn" : data.langTo;
		const url = generateRequestUrl(data.text, {
			from,
			to,
			raw: false,
		});
		https
			.get(url, (resp) => {
				let httpsData = "";
				resp.on("data", (chunk) => {
					httpsData += chunk;
				});
				resp.on("end", () => {
					let returnData = normaliseResponse(JSON.parse(httpsData));
					returnData.pronunciation = returnData.pronunciation == undefined || returnData.pronunciation == "" ? null : returnData.pronunciation;
					res.send(JSON.stringify(returnData));
				});
			})
			.on("error", (err) => {
				res.send(JSON.stringify({ error: err.message }));
				return;
			});
	}
	SpeechAsync();
});
