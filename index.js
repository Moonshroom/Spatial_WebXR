//functions
let loadMainPage = () => {
    if (window.location.pathname !== "/index.html"){
        // window.location = "/index.html"
        window.location = "/Spatial_WebXR/index.html" //githubpages
    };  
};
let loadVRexamples = () => {
    if (window.location.pathname !== "/VR_index.html"){
        // window.location = "/transition/VR_index.html"        
        window.location = "/Spatial_WebXR/transition/VR_index.html" //githubpages
    };  
};
let loadARexamples = () => {
    if (window.location.pathname !== "/transition/AR_index.html"){
        // window.location = "/transition/AR_index.html"
        window.location = "/Spatial_WebXR/transition/AR_index.html" //githubpages
    };  
};
let loadWGLexamples = () => {
    if (window.location.pathname !== "/transition/WebGL_index.html"){
        // window.location = "/transition/WebGL_index.html"
        window.location = "/Spatial_WebXR/transition/WebGL_index.html" //githubpages
        
    };  
};

let loadVrExOne = () => {
    if (window.location.pathname !== "/examples/example_01/ex_01.html"){
        // window.location = "/examples/example_01/ex_01.html"
        window.location = "/Spatial_WebXR/examples/example_01/ex_01.html" //githubpages
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

//VR examples navigation
let btnVrOne;
btnVrOne = document.getElementById("btn-enterVR-one");
btnVrOne.addEventListener("click", loadVrExOne);
//app version
let appVersion = document.getElementById("app-version");
appVersion.innerHTML = "0.0.8"

