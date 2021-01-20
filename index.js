//functions
let loadMainPage = () => {
    console.log("clicked_0");
    window.location = "index.html"
};
let loadVRexamples = () => {
    console.log("clicked_1");
    window.location = "_VR_index.html"
};
let loadARexamples = () => {
    console.log("clicked_2")
    window.location = "_AR_index.html"
};
let loadWGLexamples = () => {
    console.log("clicked_3")
    window.location = "_WebGL_index.html"
};

//navigation
let aboutElement, vrElement, arElement, wglElement;

aboutElement = document.getElementById("menu-wrapper-links-aboutProject");
aboutElement.addEventListener("click", loadMainPage);

vrElement = document.getElementById("menu-wrapper-links-WebVR");
vrElement.addEventListener("click", loadVRexamples);

arElement = document.getElementById("menu-wrapper-links-WebAR");
arElement.addEventListener("click", loadARexamples);

wglElement = document.getElementById("menu-wrapper-links-WebGL");
wglElement.addEventListener("click", loadWGLexamples);

//app version
let appVersion = document.getElementById("app-version");
appVersion.innerHTML = "0.0.7"

