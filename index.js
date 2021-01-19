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

let aboutElement, vrElement, arElement, wglElement;

aboutElement = document.getElementsByClassName("menu-wrapper-links-aboutProject");
aboutElement[0].addEventListener("click", loadMainPage);

vrElement = document.getElementsByClassName("menu-wrapper-links-WebVR");
vrElement[0].addEventListener("click", loadVRexamples);

arElement = document.getElementsByClassName("menu-wrapper-links-WebAR");
arElement[0].addEventListener("click", loadARexamples);

wglElement = document.getElementsByClassName("menu-wrapper-links-WebGL");
wglElement[0].addEventListener("click", loadWGLexamples);