chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	await chrome.alarms.create('alarm', {
		periodInMinutes: 30
	});
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
	const cityCheck = await chrome.storage.local.get(['currentCity']);
	let result = await setWeather(cityCheck.currentCity || 'New York');
	chrome.runtime.sendMessage({ data: result });
	chrome.alarms.create('alarm', {
		periodInMinutes: 30
	});
})

chrome.alarms.onAlarm.addListener(async() => {
	const cityCheck = await chrome.storage.local.get(['currentCity']);
	setWeather(cityCheck.currentCity || 'New York');
})


async function setWeather(address) {
	const data = await getWeather(address);
	if (data.error) {
		chrome.action.setBadgeText({ text: 'X' });
	} else {
		const iconLink = `https://openweathermap.org/img/wn/${data.icon}.png`;
		await chrome.storage.local.set({ currentCity: data.city });
		await chrome.storage.local.set({ main: data.main });
		chrome.action.setBadgeText({ text: Math.round(data.temp) + '°C' });
		chrome.action.setIcon({ path: iconLink });
	}
	return data;
}

async function getWeather(address) {
	return fetch(`https://yuron.dev/api/weather?address=${address}`)
	.then(res => res.json())
	.then(res => {
		if (res.error) return { error: res.error };
		return { 
			temp: res.temp,
			city: res.location,
			icon: res.icon,
			main: res.main
		};
	})
	.catch((e) => {
		console.log(e)
		return { error: 'Unable to connect to server' };
	});
}



