import * as THREE from '../libs/three/three.module.js';
import { GLTFLoader } from '../libs/three/jsm/GLTFLoader.js';
import { DRACOLoader } from '../libs/three/jsm/DRACOLoader.js';
import { RGBELoader } from '../libs/three/jsm/RGBELoader.js';
import { LoadingBar } from '../libs/LoadingBar.js';
import { ARButton } from '../libs/ARButton.js';

class App {
	constructor() {
		const container = document.createElement('div');
		document.body.appendChild(container);

		this.clock = new THREE.Clock();

		this.loadingBar = new LoadingBar();

		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.01,
			20
		);
		this.camera.position.set(0, 0, 0);

		this.scene = new THREE.Scene();

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
		ambient.position.set(0.5, 1, 0.25);
		this.scene.add(ambient);

		const light = new THREE.DirectionalLight();
		light.position.set(0.2, 1, 1);
		this.scene.add(light);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild(this.renderer.domElement);
		this.setEnvironment();

		this.workingVec3 = new THREE.Vector3();

		this.initScene();
		this.setupXR();

		window.addEventListener('resize', this.resize.bind(this));
	}

	setEnvironment() {
		const loader = new RGBELoader().setDataType(THREE.UnsignedByteType);
		const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
		pmremGenerator.compileEquirectangularShader();

		const self = this;

		loader.load(
			'./assets/venice_sunset_1k.hdr',
			(texture) => {
				const envMap = pmremGenerator.fromEquirectangular(texture).texture;
				pmremGenerator.dispose();

				self.scene.environment = envMap;
			},
			undefined,
			(err) => {
				console.error('An error occurred setting the environment');
			}
		);
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	loadWngig() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'wngig_google.glb',
			// called when the resource is loaded
			function (gltf) {
				self.mymesh = gltf.scene;
				self.mymesh.position.set(0, -0.25, -1);
				self.mymesh.scale.set(0.25, 0.25, 0.25);
				self.scene.add(gltf.scene);
				self.mymesh.name = 'srg';
				self.loadingBar.visible = false;
				self.renderer.setAnimationLoop(self.render.bind(self));
			},
			// called while loading is progressing
			function (xhr) {
				self.loadingBar.progress = xhr.loaded / xhr.total;
			},
			// called when loading has errors
			function (error) {
				console.log('An error happened');
			}
		);
	}

	initScene() {
		this.mixers = [];
		this.collisionObjects = [];
		this.loadWngig();
	}

	setupXR() {
		this.renderer.xr.enabled = true;

		const btn = new ARButton(this.renderer, {
			sessionInit: { optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } },
		});

		const self = this;

		function onSelect() {
			if (!self.action.isRunning()) {
				self.action.time = 0;
				self.action.enabled = true;
				self.action.play();
			}
		}

		this.controller = this.renderer.xr.getController(0);
		this.controller.addEventListener('select', onSelect);

		this.scene.add(this.controller);
	}

	render(timestamp, frame) {
		const dt = this.clock.getDelta();
		this.renderer.render(this.scene, this.camera);
	}
}

export { App };
