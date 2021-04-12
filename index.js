// functions
let loadMainPage = () => {
	if (window.location.pathname !== '/Spatial_WebXR/index.html') {
		window.location = '/Spatial_WebXR/index.html'; //githubpages
	}
};
let loadVRexamples = () => {
	if (window.location.pathname !== '/Spatial_WebXR/VR_index.html') {
		window.location = '/Spatial_WebXR/VR_index.html'; //githubpages
	}
};
let loadARexamples = () => {
	if (window.location.pathname !== '/Spatial_WebXR/AR_index.html') {
		window.location = '/Spatial_WebXR/AR_index.html'; //githubpages
	}
};

//navigation
let aboutElement, vrElement, arElement, wglElement;

aboutElement = document.getElementById('menu-wrapper-links-aboutProject');
aboutElement.addEventListener('click', loadMainPage);

vrElement = document.getElementById('menu-wrapper-links-WebVR');
vrElement.addEventListener('click', loadVRexamples);

arElement = document.getElementById('menu-wrapper-links-WebAR');
arElement.addEventListener('click', loadARexamples);

//app version
let appVersion = document.getElementById('app-version');
appVersion.innerHTML = '0.9.2';
//VR examples navigation
let loadVrExOne = () => {
	if (window.location.pathname !== '/examples/example_01/ex_01.html') {
		window.location = '/Spatial_WebXR/examples/example_01/ex_01.html';
	}
};

let loadVrExTwo = () => {
	if (window.location.pathname !== '/examples/example_02/ex_02.html') {
		window.location = '/Spatial_WebXR/examples/example_02/ex_02.html';
	}
};

let loadVrExThree = () => {
	if (window.location.pathname !== '/examples/example_03/ex_03.html') {
		window.location = '/Spatial_WebXR/examples/example_03/ex_03.html';
	}
};

let loadVrExFour = () => {
	if (window.location.pathname !== '/examples/example_04/ex_04.html') {
		window.location = '/Spatial_WebXR/examples/example_04/ex_04.html';
	}
};

let loadArExOne = () => {
	if (window.location.pathname !== '/examples/example_05/ex_05.html') {
		window.location = '/Spatial_WebXR/examples/example_05/ex_05.html';
	}
};

let loadArExTwo = () => {
	if (window.location.pathname !== '/examples/example_06/ex_06.html') {
		window.location = '/Spatial_WebXR/examples/example_06/ex_06.html';
	}
};

if (
	window.location.pathname == '/VR_index.html' ||
	window.location.pathname == '/Spatial_WebXR/VR_index.html'
) {
	let btnVrOne;
	btnVrOne = document.getElementById('btn-enterVR-one');
	btnVrOne.addEventListener('click', loadVrExOne);

	let btnVrTwo;
	btnVrTwo = document.getElementById('btn-enterVR-two');
	btnVrTwo.addEventListener('click', loadVrExTwo);

	let btnVrThree;
	btnVrThree = document.getElementById('btn-enterVR-three');
	btnVrThree.addEventListener('click', loadVrExThree);

	let btnVrFour;
	btnVrFour = document.getElementById('btn-enterVR-four');
	btnVrFour.addEventListener('click', loadVrExFour);
}

if (
	window.location.pathname == '/AR_index.html' ||
	window.location.pathname == '/Spatial_WebXR/AR_index.html'
) {
	let btnArOne = document.getElementById('btn-enterAR-one');
	btnArOne.addEventListener('click', loadArExOne);

	let btnArTwo = document.getElementById('btn-enterAR-two');
	btnArTwo.addEventListener('click', loadArExTwo);
}
