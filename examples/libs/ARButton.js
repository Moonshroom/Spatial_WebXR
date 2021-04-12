/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author NikLever / http://niklever.com
 */

class ARButton {
	constructor(renderer, options) {
		this.renderer = renderer;

		if (options !== undefined) {
			this.onSessionStart = options.onSessionStart;
			this.onSessionEnd = options.onSessionEnd;
			this.sessionInit = options.sessionInit;
		}

		if ('xr' in navigator) {
			const button = document.createElement('button');
			button.style.display = 'none';
			const welcomeDM = document.createElement('a');
			this.stylizeElement(welcomeDM, false, '25px', false);
			welcomeDM.style.top = '1px';
			welcomeDM.style.textAlign = 'center';
			welcomeDM.style.fontSize = '25px';
			welcomeDM.style.width = '100vw';
			welcomeDM.style.height = '120px';
			const lastPath = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1);
			if (lastPath(window.location.pathname) == 'ex_06.html') {
				welcomeDM.innerHTML =
					'After doubleclick on camera icon, point floor until You see white circle, then tap your screen to start measuring';
			} else {
				welcomeDM.innerHTML = 'cokolwiek innego';
				console.log(lastPath(window.location.pathname));
			}

			navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
				supported ? this.showStartAR(button) : this.showARNotSupported(button);
			});

			document.body.appendChild(button);
			document.body.appendChild(welcomeDM);
		} else {
			const message = document.createElement('a');

			if (window.isSecureContext === false) {
				message.href = document.location.href.replace(/^http:/, 'https:');
				message.innerHTML = 'WEBXR NEEDS HTTPS';
			} else {
				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';
			}

			message.style.left = '0px';
			message.style.width = '100%';
			message.style.textDecoration = 'none';

			this.stylizeElement(message, false);
			message.style.bottom = '0px';
			message.style.opacity = '1';

			document.body.appendChild(message);
		}
	}

	showStartAR(button) {
		let currentSession = null;
		const self = this;

		this.stylizeElement(button, true, 75, true);

		function onSessionStarted(session) {
			session.addEventListener('end', onSessionEnded);

			self.renderer.xr.setReferenceSpaceType('local');
			self.renderer.xr.setSession(session);
			self.stylizeElement(button, false, 75, true);

			button.textContent = 'STOP AR';

			currentSession = session;

			if (self.onSessionStart !== undefined && self.onSessionStart !== null)
				self.onSessionStart();
		}

		function onSessionEnded() {
			currentSession.removeEventListener('end', onSessionEnded);

			self.stylizeElement(button, true, 75, true);
			button.textContent = 'START AR';

			currentSession = null;

			if (self.onSessionEnd !== undefined && self.onSessionEnd !== null) self.onSessionEnd();
		}

		//

		button.style.display = '';
		button.style.right = '20px';
		button.style.width = '250px';
		button.style.cursor = 'pointer';
		button.innerHTML = '<i class="fas fa-camera"></i>';

		button.onmouseenter = function () {
			button.style.fontSize = '25px';
			button.textContent = currentSession === null ? 'START AR' : 'STOP AR';
			button.style.opacity = '1.0';
		};

		button.onmouseleave = function () {
			button.style.fontSize = '75px';
			button.innerHTML = '<i class="fas fa-camera"></i>';
			button.style.opacity = '0.5';
		};

		button.onclick = function () {
			if (currentSession === null) {
				// WebXR's requestReferenceSpace only works if the corresponding feature
				// was requested at session creation time. For simplicity, just ask for
				// the interesting ones as optional features, but be aware that the
				// requestReferenceSpace call will fail if it turns out to be unavailable.
				// ('local' is always available for immersive sessions and doesn't need to
				// be requested separately.)

				navigator.xr
					.requestSession('immersive-ar', self.sessionInit)
					.then(onSessionStarted);
			} else {
				currentSession.end();
			}
		};
	}

	disableButton(button) {
		button.style.cursor = 'auto';
		button.style.opacity = '0.5';

		button.onmouseenter = null;
		button.onmouseleave = null;

		button.onclick = null;
	}

	showARNotSupported(button) {
		this.stylizeElement(button, false);

		this.disableButton(button);

		button.style.display = '';
		button.style.width = '100%';
		button.style.right = '10px';
		button.style.bottom = '10px';
		button.style.border = '';
		button.style.opacity = '1';
		button.style.fontSize = '75px';
		button.textContent = 'AR NOT SUPPORTED';
	}

	stylizeElement(element, active = true, fontSize = 75, ignorePadding = false) {
		element.style.position = 'absolute';
		element.style.bottom = '20px';
		if (!ignorePadding) element.style.padding = '12px 6px';
		element.style.border = '1px solid #fff';
		element.style.borderRadius = '4px';
		element.style.background = active ? 'rgba(20,150,80,1)' : 'rgba(180,20,20,1)';
		element.style.color = '#fff';
		element.style.font = `normal ${fontSize}px sans-serif`;
		element.style.textAlign = 'center';
		element.style.opacity = '0.5';
		element.style.outline = 'none';
		element.style.zIndex = '999';
	}
}

export { ARButton };
