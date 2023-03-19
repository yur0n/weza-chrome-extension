
let coords = { lat: chrome.storage.local.get(["lat"]), lon: chrome.storage.local.get(["lon"])}

chrome.runtime.onStartup.addListener(async () => {
	const cityCheck = await chrome.storage.local.get(["currentCity"])
	if (cityCheck) setWeather(cityCheck.currentCity)
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
	console.log(request.data+1)
	let result = await setWeather(request.data)
	chrome.runtime.sendMessage({ data: result })
});

function createAlarm() {
	chrome.alarms.create(
		'weatherUpdate',
		{periodInMinutes: 60}
	);
}

chrome.alarms.onAlarm.addListener(() => {
	weatherUpdate(coords);
})

async function setWeather(city) {
	coords = await getCoords(city);
	if (coords.error) return coords.error;
	chrome.storage.local.set({ currentCity: coords.name, lat: coords.lat, lon: coords.lon });

	weatherUpdate(coords);
	createAlarm();

	return `Your city: ${coords.name}`;
}

async function weatherUpdate(coords) {
	console.log('called ')
	const temp = await getWeather(coords.lat, coords.lon);
	if (temp.error) return chrome.action.setBadgeText({ text: 'X' });
	chrome.action.setBadgeText({ text: Math.round(temp.temp) + '°C' });
}

function getCoords(address) {
	return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${address}&limit=1&appid=103d93c647edd7f039de760db67b57f7`)
	.then(res => res.json())
	.then(res => { 
    	if (!res.length) return { error: 'Unable to find location' };
		return {
			lat: res[0].lat,
			lon: res[0].lon,
			name: res[0].name,
		}
    })
	.catch((e) => {
		console.log(e)
		return { error: 'Unable to connect to location services' };
	});
}

function getWeather(lat, lon) {
	return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=103d93c647edd7f039de760db67b57f7&units=metric`)
	.then(res => res.json())
	.then(res => {
		if (res.cod) {
			console.log(res.cod);
			return { error: 'Unable to find location' }
		}
		return { temp: `${res.current.temp}` };
	})
	.catch((e) => {
		console.log(e);
		return { error: 'Unable to connect to weather services' }
	});
}
