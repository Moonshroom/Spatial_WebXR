import * as THREE from '../libs/three/three.module.js';
import { VRButton } from '../libs/VRButton.js';
import { XRControllerModelFactory } from '../libs/three/jsm/XRControllerModelFactory.js';
import { Stats } from '../libs/stats.module.js';
import { OrbitControls } from '../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../libs/three/jsm/GLTFLoader.js';
import { DRACOLoader } from '../libs/three/jsm/DRACOLoader.js';
import { LoadingBar } from '../libs/LoadingBar.js';
import { CanvasUI } from '../libs/CanvasUI/examples/jsm/CanvasUI.js';

class App {
	constructor() {
		const container = document.createElement('div');
		document.body.appendChild(container);

		this.clock = new THREE.Clock();

		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			200
		);
		this.camera.position.set(0, 1.6, 5);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x505050);
		this.scene.add(new THREE.HemisphereLight(0xffffff, 0x404040));

		const light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1).normalize();
		this.scene.add(light);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;

		container.appendChild(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 1.6, 0);
		this.controls.update();

		this.stats = new Stats();

		this.raycaster = new THREE.Raycaster();
		this.workingMatrix = new THREE.Matrix4();
		this.workingVector = new THREE.Vector3();
		this.origin = new THREE.Vector3();

		//loading models
		this.loadingBar = new LoadingBar();
		this.loadMPZP();

		this.initScene();
		this.setupVR();

		window.addEventListener('resize', this.resize.bind(this));

		this.renderer.setAnimationLoop(this.render.bind(this));
	}

	initScene() {
		this.scene.background = new THREE.Color(0xa0a0a0);

		const boxGeo = new THREE.BoxBufferGeometry(35, 10, 35);
		const boxMat = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0x8f8d8c),
			side: THREE.BackSide,
		});
		this.roomBox = new THREE.Mesh(boxGeo, boxMat);
		this.roomBox.position.y = 4.5;
		this.scene.add(this.roomBox);

		// ground
		const ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(35, 35),
			new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
		);
		ground.rotation.x = -Math.PI / 2;
		this.scene.add(ground);

		let grid = new THREE.GridHelper(35, 35, 0x000000, 0x000000);
		grid.material.opacity = 0.1;
		grid.material.transparent = true;
		this.scene.add(grid);

		let geoLegend = new THREE.PlaneBufferGeometry(8, 8, 64);
		let matLegend = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load('./assets/legenda.png'),
			side: THREE.DoubleSide,
		});
		let legend = new THREE.Mesh(geoLegend, matLegend);
		legend.position.set(0, 4, -10);
		this.scene.add(legend);

		const config = {
			panelSize: { width: 2, height: 2 },
			width: 512,
			height: 512,
			opacity: 0.9,
			body: {
				fontFamily: 'Arial',
				fontSize: 30,
				padding: 20,
				backgroundColor: '#000',
				fontColor: '#fff',
				borderRadius: 6,
			},
			header: {
				type: 'text',
				position: { top: 0 },
				paddingTop: 30,
				height: 70,
			},
			main: {
				type: 'text',
				position: { top: 70 },
				height: 342,
				fontSize: 30, // default height is 512 so this is 512 - header height:70 - footer height:70
				backgroundColor: '#bbb',
				fontColor: '#000',
			},
			footer: {
				type: 'text',
				position: { bottom: 0 },
				fontSize: 25,
				paddingTop: 30,
				height: 100,
			},
		};
		const content = {
			header: 'Zadanie 3',
			main:
				'Podejdź do legendy i sprawdź w jaki sposób na mapie zaznaczone są obszary o nazwie zabudowa poforteczna, następnie spróbuj zlokalizować na mapie największy z nich. ',
			footer: 'Testy możliwości zastosowania WebXR \nw planowaniu przestrzennym',
		};
		const ui = new CanvasUI(content, config);
		ui.mesh.position.set(0, 1.5, 3);
		this.scene.add(ui.mesh);

		this.colliders = [this.roomBox, legend];
	}

	setupVR() {
		this.renderer.xr.enabled = true;

		const button = new VRButton(this.renderer);

		const self = this;

		function onSelectStart() {
			this.userData.selectPressed = true;
		}

		function onSelectEnd() {
			this.userData.selectPressed = false;
		}

		this.controller = this.renderer.xr.getController(0);
		this.controller.addEventListener('selectstart', onSelectStart);
		this.controller.addEventListener('selectend', onSelectEnd);
		this.controller.addEventListener('connected', function (event) {
			const mesh = self.buildController.call(self, event.data);
			mesh.scale.z = 1.5;
			this.add(mesh);
		});
		this.controller.addEventListener('disconnected', function () {
			this.remove(this.children[0]);
			self.controller = null;
			self.controllerGrip = null;
		});

		const controllerModelFactory = new XRControllerModelFactory();

		this.controllerGrip = this.renderer.xr.getControllerGrip(0);
		this.controllerGrip.add(controllerModelFactory.createControllerModel(this.controllerGrip));

		this.controller1 = this.renderer.xr.getController(1);
		this.controller1.addEventListener('selectstart', onSelectStart);
		this.controller1.addEventListener('selectend', onSelectEnd);
		this.controller1.addEventListener('connected', function (event) {
			const mesh1 = self.buildController.call(self, event.data);
			mesh1.scale.z = 1.5;
			this.add(mesh1);
		});
		this.controller1.addEventListener('disconnected', function () {
			this.remove(this.children[1]);
			self.controller1 = null;
			self.controllerGrip1 = null;
		});

		this.controllerGrip1 = this.renderer.xr.getControllerGrip(1);
		this.controllerGrip1.add(
			controllerModelFactory.createControllerModel(this.controllerGrip1)
		);
		this.scene.add(this.controllerGrip1);

		this.dolly = new THREE.Object3D();
		this.dolly.position.z = 5;
		this.dolly.add(
			this.camera,
			this.controller,
			this.controller1,
			this.controllerGrip,
			this.controllerGrip1
		);
		this.scene.add(this.dolly);

		this.dummyCam = new THREE.Object3D();
		this.camera.add(this.dummyCam);
	}

	buildController(data) {
		let geometry, material;

		switch (data.targetRayMode) {
			case 'tracked-pointer':
				geometry = new THREE.BufferGeometry();
				geometry.setAttribute(
					'position',
					new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
				);
				geometry.setAttribute(
					'color',
					new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
				);

				material = new THREE.LineBasicMaterial({
					vertexColors: true,
					blending: THREE.AdditiveBlending,
				});

				return new THREE.Line(geometry, material);

			case 'gaze':
				geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, -1);
				material = new THREE.MeshBasicMaterial({
					opacity: 0.9,
					transparent: true,
				});
				return new THREE.Mesh(geometry, material);
		}
	}

	handleController(controller, dt) {
		if (controller.userData.selectPressed) {
			const wallLimit = 1.5;
			const speed = 2;
			let pos = this.dolly.position.clone();
			pos.y += 1;

			let dir = new THREE.Vector3();
			//Store original dolly rotation
			const quaternion = this.dolly.quaternion.clone();
			//Get rotation for movement from the headset pose
			this.dolly.quaternion.copy(this.dummyCam.getWorldQuaternion());
			this.dolly.getWorldDirection(dir);
			dir.negate();
			this.raycaster.set(pos, dir);

			let blocked = false;

			let intersect = this.raycaster.intersectObjects(this.colliders);
			if (intersect.length > 0) {
				if (intersect[0].distance < wallLimit) blocked = true;
			}

			if (!blocked) {
				this.dolly.translateZ(-dt * speed);
				pos = this.dolly.getWorldPosition(this.origin);
			}

			//cast left
			dir.set(-1, 0, 0);
			dir.applyMatrix4(this.dolly.matrix);
			dir.normalize();
			this.raycaster.set(pos, dir);

			intersect = this.raycaster.intersectObjects(this.colliders);
			if (intersect.length > 0) {
				if (intersect[0].distance < wallLimit)
					this.dolly.translateX(wallLimit - intersect[0].distance);
			}

			//cast right
			dir.set(1, 0, 0);
			dir.applyMatrix4(this.dolly.matrix);
			dir.normalize();
			this.raycaster.set(pos, dir);

			intersect = this.raycaster.intersectObjects(this.colliders);
			if (intersect.length > 0) {
				if (intersect[0].distance < wallLimit)
					this.dolly.translateX(intersect[0].distance - wallLimit);
			}

			this.dolly.position.y = 0;

			//Restore the original rotation
			this.dolly.quaternion.copy(quaternion);
		}
	}
	loadMPZP() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'MPZP_opa70_CRS.glb',
			// called when the resource is loaded
			function (gltf) {
				self.mymesh = gltf.scene;
				self.mymesh.position.set(0, 0.3, 0);
				self.mymesh.scale.set(0.3, 0.3, 0.3);
				self.scene.add(gltf.scene);
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

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	render() {
		const dt = this.clock.getDelta();
		this.stats.update();
		if (this.controller) this.handleController(this.controller, dt);
		if (this.controller1) this.handleController(this.controller1, dt);
		this.renderer.render(this.scene, this.camera);
	}
}

export { App };
