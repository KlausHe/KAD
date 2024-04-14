export async function socketPost(app = null, data, callback) {
	if (app == null) return;
	if (typeof data != "object") {
		error("NO OBJECT'", data);
	}
	const path = "K-Universe/";
	const request = new Request(`${path}${app}/`, {
		method: "POST",
		body: data == null ? "" : JSON.stringify(data),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	const response = await fetch(request);
	const obj = await response.json();
	callback(obj);
}
