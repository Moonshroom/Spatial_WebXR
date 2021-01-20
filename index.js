//functions
let loadMainPage = () => {
    if (window.location.pathname !== "/index.html"){
        window.location = "index.html"
    };  
};
let loadVRexamples = () => {
    if (window.location.pathname !== "/_VR_index.html"){
        window.location = "_VR_index.html"
    };  
};
let loadARexamples = () => {
    if (window.location.pathname !== "/_AR_index.html"){
        window.location = "_AR_index.html"
    };  
};
let loadWGLexamples = () => {
    if (window.location.pathname !== "/_WebGL_index.html"){
        window.location = "_WebGL_index.html"
    };  
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
appVersion.innerHTML = "0.0.8"

