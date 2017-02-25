var baseUrl = 'https://api.darksky.net/forecast/f72d13baea6286b48272a7990f28d4a4/',
	containerNode = document.querySelector('.weatherData')

var handleCoords = function(coordsObj) {
	var lat = coordsObj.coords.latitude,
		lng = coordsObj.coords.longitude,
		hashString = lat + '/' + lng + '/current'
	
	location.hash = hashString
}

var handleError = function(err) {
	console.log('error!', err)
}

var handleCurrent = function(apiResponse) {
	var currentWeather = apiResponse.currently.temperature
	currentWeather = Math.floor(currentWeather)
	containerNode.innerHTML = '<p>' + currentWeather + '</p>'
}

var handleHours = function(dataObj) {
	var getString = '',
		date = new Date(dataObj.time*1000),
		hours = date.getHours(),
		temp = Math.floor(dataObj.temperature)

	if (hours > 12) {
	   hours -= 12;
	} else if (hours === 0) {
	   hours = 12;
	}

	getString += '<p>' + hours + '</p>'
	getString += '<p>' + temp + '</p>'
	return getString
}

var handleHourly = function(apiResponse) {
	var hourlyWeather = apiResponse.hourly.data
	var hourlyHTML = ''
	for (var i = 0; i < 6; i++) { //only gets first 6 values of array [0-5]
		hourlyHTML += handleHours(hourlyWeather[i])
	} containerNode.innerHTML = hourlyHTML
}

var handleDays = function(dataObj) {
	var getString = '',
		date = new Date(dataObj.time*1000),
		day = date.getDay(),
		dayList = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
		d = dayList[day],
		tempMax = Math.floor(dataObj.temperatureMax),
		tempMin = Math.floor(dataObj.temperatureMin)
	getString += '<p>' + d + '<p>'
	getString += '<p>' + 'High: ' + tempMax + '<p>'
	getString += '<p>' + 'Low: ' + tempMin + '<p>'
	return getString
}

var handleDaily = function(apiResponse) {
	var dailyWeather = apiResponse.daily.data
	var dailyHTML = ''
	for (var i = 0; i < 5; i++) {
		dailyHTML += handleDays(dailyWeather[i])
	} containerNode.innerHTML = dailyHTML
}

var controller = function() {
	var hashStr = location.hash.substr(1),
		hashParts = hashStr.split('/'),
		latitude = hashParts[0],
		longitude = hashParts[1],
		viewType = hashParts[2],
		buttonCurrent = document.querySelector('.current'),
		buttonHourly = document.querySelector('.hourly'),
		buttonDaily = document.querySelector('.daily')

	var requestUrl = baseUrl + latitude + ',' + longitude + '?callback=?',
		weatherPromise = $.getJSON(requestUrl)

	if (hashParts.length < 3) {
		navigator.geolocation.getCurrentPosition(handleCoords, handleError)
		return
	}

	buttonCurrent.addEventListener('click', function() {
	location.hash = latitude + '/' + longitude + '/current'
	})
	buttonHourly.addEventListener('click', function() {
	location.hash = latitude + '/' + longitude + '/hourly'
	})
	buttonDaily.addEventListener('click', function() {
	location.hash = latitude + '/' + longitude + '/daily'
	})

	if (viewType === 'current') {
		weatherPromise.then(handleCurrent)
	}
	else if (viewType === 'hourly') {
		weatherPromise.then(handleHourly)
	}
	else if (viewType === 'daily') {
		weatherPromise.then(handleDaily)
	}
}

window.addEventListener('hashchange', controller)

controller()
