// functions
let loadMainPage = () => {
	if (window.location.pathname !== '/Spatial_WebXR/index.html') {
		window.location = '/Spatial_WebXR/index.html'; //githubpages
	}
};
let loadVRexamples = () => {
	if (window.location.pathname !== '/Spatial_WebXR/transition/VR_index.html') {
		window.location = '/Spatial_WebXR/transition/VR_index.html'; //githubpages
	}
};
let loadARexamples = () => {
	if (window.location.pathname !== '/Spatial_WebXR/transition/AR_index.html') {
		window.location = '/Spatial_WebXR/transition/AR_index.html'; //githubpages
	}
};

// let loadMainPage = () => {
//     if (window.location.pathname !== "/index.html"){
//         window.location = "/index.html"
//     };
// };
// let loadVRexamples = () => {
//     if (window.location.pathname !== "/VR_index.html"){
//         window.location = "/transition/VR_index.html"
//     };
// };
// let loadARexamples = () => {
//     if (window.location.pathname !== "/transition/AR_index.html"){
//         window.location = "/transition/AR_index.html"
//     };
// };

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
appVersion.innerHTML = '0.2.0';

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

let btnVrOne;
btnVrOne = document.getElementById('btn-enterVR-one');
btnVrOne.addEventListener('click', loadVrExOne);

let btnVrTwo;
btnVrTwo = document.getElementById('btn-enterVR-two');
btnVrTwo.addEventListener('click', loadVrExTwo);

let btnVrThree;
btnVrThree = document.getElementById('btn-enterVR-three');
btnVrThree.addEventListener('click', loadVrExThree);
