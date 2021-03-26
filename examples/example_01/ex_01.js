import * as THREE from '../libs/three/three.module.js';
import { VRButton } from '../libs/VRButton.js';
import { XRControllerModelFactory } from '../libs/three/jsm/XRControllerModelFactory.js';
import { Stats } from '../libs/stats.module.js';
import { OrbitControls } from '../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../libs/three/jsm/GLTFLoader.js';
import { DRACOLoader } from '../libs/three/jsm/DRACOLoader.js';
import { LoadingBar } from '../libs/LoadingBar.js';

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
		this.loadSR();
		this.loadGoogleSR();
		this.loadSB();
		this.loadGoogleSB();

		this.initScene();
		this.setupVR();

		window.addEventListener('resize', this.resize.bind(this));

		this.renderer.setAnimationLoop(this.render.bind(this));
	}

	initScene() {
		this.scene.background = new THREE.Color(0xa0a0a0);

		const boxGeo = new THREE.BoxBufferGeometry(30, 10, 30);
		const boxMat = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0x8f8d8c),
			side: THREE.BackSide,
		});
		this.roomBox = new THREE.Mesh(boxGeo, boxMat);
		this.roomBox.position.y = 4.5;
		this.scene.add(this.roomBox);

		const tableGeo = new THREE.BoxBufferGeometry(6, 1.2, 15);
		const tableMat = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0x8f8d8c),
			side: THREE.FrontSide,
		});

		this.tableSR = new THREE.Mesh(tableGeo, tableMat);
		this.tableSR.position.set(5.9, 0, 0);

		this.tableSB = new THREE.Mesh(tableGeo, tableMat);
		this.tableSB.position.set(-7, 0, 0);

		this.scene.add(this.tableSB, this.tableSR);

		let uiMainGeo = new THREE.PlaneBufferGeometry(5, 4, 32);
		let uiMainMat = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load('./assets/low.png'),
			side: THREE.DoubleSide,
		});

		let mainUi = new THREE.Mesh(uiMainGeo, uiMainMat);
		mainUi.position.set(-0.5, 2, -7);

		let uiSmallGeo = new THREE.PlaneBufferGeometry(4, 3, 32);

		let srUI = new THREE.Mesh(
			uiSmallGeo,
			new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load('./assets/low.png'),
				side: THREE.FrontSide,
			})
		);
		srUI.rotation.y = Math.PI / -2;
		srUI.position.set(8.5, 3, -3);

		let srgoogleUI = new THREE.Mesh(
			uiSmallGeo,
			new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load('./assets/low.png'),
				side: THREE.FrontSide,
			})
		);
		srgoogleUI.rotation.y = Math.PI / -2;
		srgoogleUI.position.set(8.5, 3, 5);

		let sbUI = new THREE.Mesh(
			uiSmallGeo,
			new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load('./assets/low.png'),
				side: THREE.FrontSide,
			})
		);
		sbUI.rotation.y = Math.PI / 2;
		sbUI.position.set(-10, 3, 4);

		let sbgoogleUI = new THREE.Mesh(
			uiSmallGeo,
			new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load('./assets/low.png'),
				side: THREE.FrontSide,
			})
		);
		sbgoogleUI.rotation.y = Math.PI / 2;
		sbgoogleUI.position.set(-10, 3, -3);

		this.scene.add(mainUi, srUI, srgoogleUI, sbUI, sbgoogleUI);

		// ground
		const ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(30, 30),
			new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
		);
		ground.rotation.x = -Math.PI / 2;
		this.scene.add(ground);

		let grid = new THREE.GridHelper(30, 30, 0x000000, 0x000000);
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		this.scene.add(grid);

		this.colliders = [this.roomBox, mainUi];
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
			mesh.scale.z = 5;
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
			mesh1.scale.z = 0;
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
					opacity: 0.5,
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
	loadSR() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'Rynek_opt.glb',
			// called when the resource is loaded
			function (gltf) {
				const bbox = new THREE.Box3().setFromObject(gltf.scene);
				console.log(
					`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(
						2
					)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(
						2
					)},${bbox.max.z.toFixed(2)}`
				);

				self.mymesh = gltf.scene;
				self.mymesh.position.set(5.5, -0.5, 5.5);
				self.scene.add(gltf.scene);

				self.loadingBar.visible = false;
				self.colliders.push(self.mymesh);
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

	loadGoogleSR() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'Stary_rynek__google.glb',
			// called when the resource is loaded
			function (gltf) {
				const bbox = new THREE.Box3().setFromObject(gltf.scene);
				console.log(
					`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(
						2
					)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(
						2
					)},${bbox.max.z.toFixed(2)}`
				);

				self.mymesh = gltf.scene;
				self.mymesh.position.set(5, 0.7, -2.5);
				self.scene.add(gltf.scene);

				self.loadingBar.visible = false;
				self.colliders.push(self.mymesh);
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

	loadSB() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'Stary_browar.glb',
			// called when the resource is loaded
			function (gltf) {
				const bbox = new THREE.Box3().setFromObject(gltf.scene);
				console.log(
					`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(
						2
					)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(
						2
					)},${bbox.max.z.toFixed(2)}`
				);

				self.mymesh = gltf.scene;
				self.mymesh.position.set(-5, 1, 4);
				self.mymesh.scale.set(0.01, 0.01, 0.01);
				self.scene.add(gltf.scene);

				self.loadingBar.visible = false;
				self.colliders.push(self.mymesh);
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

	loadGoogleSB() {
		const loader = new GLTFLoader().setPath('./assets/');
		const self = this;
		let dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('../libs/three/js/draco/');
		loader.setDRACOLoader(dracoLoader);
		// Load a glTF resource
		loader.load(
			// resource URL
			'Stary_browar_google.glb',
			// called when the resource is loaded
			function (gltf) {
				const bbox = new THREE.Box3().setFromObject(gltf.scene);
				console.log(
					`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(
						2
					)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(
						2
					)},${bbox.max.z.toFixed(2)}`
				);

				self.mymesh = gltf.scene;
				self.mymesh.position.set(-6.5, 0.5, -3);
				self.scene.add(gltf.scene);

				self.loadingBar.visible = false;
				self.colliders.push(self.mymesh);
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
		this.renderer.render(this.scene, this.camera);
	}
}

export { App };
