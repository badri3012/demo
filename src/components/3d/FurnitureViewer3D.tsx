import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ConfigurationState } from '../../types/configurator';
import { COLOR_TONES } from '../../data/productData';
import {
  RotateCcw,
  Sun,
  Sparkles,
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Check,
  Compass,
} from 'lucide-react';

interface FurnitureViewer3DProps {
  config: ConfigurationState;
  onToggleDrawers?: () => void;
  isCompact?: boolean;
}

type LightingPreset = 'showroom' | 'daylight' | 'evening';
type CameraAngle = 'three_quarter' | 'front' | 'side' | 'top' | 'detail';

export const FurnitureViewer3D: React.FC<FurnitureViewer3DProps> = ({
  config,
  onToggleDrawers,
  isCompact = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Mesh & Group references for dynamic updates
  const bedRootGroupRef = useRef<THREE.Group | null>(null);
  const drawerLeftGroupRef = useRef<THREE.Group | null>(null);
  const drawerRightGroupRef = useRef<THREE.Group | null>(null);
  const headboardGroupRef = useRef<THREE.Group | null>(null);
  const frameMeshesRef = useRef<THREE.Mesh[]>([]);
  const legMeshesRef = useRef<THREE.Mesh[]>([]);
  const brassMeshesRef = useRef<THREE.Mesh[]>([]);

  // Lighting references
  const mainSpotRef = useRef<THREE.SpotLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const headboardLedRef = useRef<THREE.PointLight | null>(null);

  // Interactive controls state
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('showroom');
  const [currentCameraAngle, setCurrentCameraAngle] = useState<CameraAngle>('three_quarter');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Mobile Touch Trapping Prevention State
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);

  // Drawer slide animation target & current position
  const drawerAnimProgress = useRef(0);

  // Check mobile device on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update controls enabled state based on mobile interaction mode
  useEffect(() => {
    if (!controlsRef.current) return;
    if (isMobileDevice && !isFullscreen) {
      controlsRef.current.enabled = isTouchInteracting;
    } else {
      controlsRef.current.enabled = true;
    }
  }, [isMobileDevice, isFullscreen, isTouchInteracting]);

  // Helper to create procedural wood and lacquer canvas textures
  const createProceduralTextures = useCallback(() => {
    // 1. Dark Wood Texture (American Walnut)
    const walnutCanvas = document.createElement('canvas');
    walnutCanvas.width = 512;
    walnutCanvas.height = 512;
    const ctxWalnut = walnutCanvas.getContext('2d')!;
    ctxWalnut.fillStyle = '#5A3D28';
    ctxWalnut.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i += 4) {
      const alpha = 0.08 + Math.sin(i * 0.05) * 0.05;
      ctxWalnut.fillStyle = i % 8 === 0 ? `rgba(40, 24, 14, ${alpha})` : `rgba(110, 78, 50, ${alpha})`;
      ctxWalnut.fillRect(0, i, 512, 3);
    }
    for (let j = 0; j < 3000; j++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctxWalnut.fillStyle = 'rgba(25, 15, 8, 0.15)';
      ctxWalnut.fillRect(rx, ry, Math.random() * 4 + 1, 1);
    }
    const walnutTexture = new THREE.CanvasTexture(walnutCanvas);
    walnutTexture.wrapS = THREE.RepeatWrapping;
    walnutTexture.wrapT = THREE.RepeatWrapping;
    walnutTexture.repeat.set(2, 2);

    // 2. Light Wood Texture (Natural Oak)
    const oakCanvas = document.createElement('canvas');
    oakCanvas.width = 512;
    oakCanvas.height = 512;
    const ctxOak = oakCanvas.getContext('2d')!;
    ctxOak.fillStyle = '#C2A67E';
    ctxOak.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i += 3) {
      const alpha = 0.06 + Math.cos(i * 0.04) * 0.04;
      ctxOak.fillStyle = i % 6 === 0 ? `rgba(140, 115, 80, ${alpha})` : `rgba(225, 205, 175, ${alpha})`;
      ctxOak.fillRect(0, i, 512, 2);
    }
    const oakTexture = new THREE.CanvasTexture(oakCanvas);
    oakTexture.wrapS = THREE.RepeatWrapping;
    oakTexture.wrapT = THREE.RepeatWrapping;
    oakTexture.repeat.set(2, 2);

    // 3. Fabric Linen Weave Texture for Mattress & Cushions
    const fabricCanvas = document.createElement('canvas');
    fabricCanvas.width = 256;
    fabricCanvas.height = 256;
    const ctxFabric = fabricCanvas.getContext('2d')!;
    ctxFabric.fillStyle = '#F5F3EC';
    ctxFabric.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 4) {
      for (let y = 0; y < 256; y += 4) {
        if ((x + y) % 8 === 0) {
          ctxFabric.fillStyle = 'rgba(180, 170, 150, 0.18)';
          ctxFabric.fillRect(x, y, 2, 2);
        }
      }
    }
    const fabricTexture = new THREE.CanvasTexture(fabricCanvas);
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(4, 4);

    return { walnutTexture, oakTexture, fabricTexture };
  }, []);

  // Update physical material properties on live meshes
  const updateMaterials = useCallback(() => {
    if (!sceneRef.current) return;

    let roughness = 0.35;
    let metalness = 0.05;
    let clearcoat = 0.5;
    let clearcoatRoughness = 0.15;

    switch (config.finishType) {
      case 'pu_coating':
        roughness = 0.38;
        metalness = 0.05;
        clearcoat = 0.45;
        clearcoatRoughness = 0.12;
        break;
      case 'acrylic':
        roughness = 0.04;
        metalness = 0.12;
        clearcoat = 1.0;
        clearcoatRoughness = 0.02;
        break;
      case 'matte_laminate':
        roughness = 0.65;
        metalness = 0.01;
        clearcoat = 0.1;
        break;
    }

    const activeColor = COLOR_TONES.find((c) => c.id === config.colorTone)?.hex || '#5A3D28';

    frameMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.color = new THREE.Color(activeColor);
        mat.roughness = roughness;
        mat.metalness = metalness;
        mat.clearcoat = clearcoat;
        mat.clearcoatRoughness = clearcoatRoughness;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });

    legMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color = new THREE.Color(config.colorTone === 'natural_oak' ? '#8C6F48' : '#3D2817');
        mat.roughness = 0.6;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });

    brassMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color = new THREE.Color('#D4AF37');
        mat.metalness = 0.85;
        mat.roughness = 0.22;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });
  }, [config.colorTone, config.finishType, isWireframe]);

  // Responsive Mathematical Camera-Fitting System (Model Bounds Aware)
  const fitCameraToModel = useCallback(
    (preset: CameraAngle = currentCameraAngle) => {
      if (!cameraRef.current || !controlsRef.current || !bedRootGroupRef.current || !mountRef.current) return;
      const cam = cameraRef.current;
      const ctrl = controlsRef.current;
      const model = bedRootGroupRef.current;
      const container = mountRef.current;

      const width = container.clientWidth || 390;
      const height = container.clientHeight || 340;
      const aspect = width / height;

      // Compute actual bounding box of rendered bed geometry
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const fovVertical = (cam.fov * Math.PI) / 180;
      const fovHorizontal = 2 * Math.atan(Math.tan(fovVertical / 2) * aspect);

      // Model maximum diagonal extent
      const maxDim = Math.max(size.x, size.y, size.z);

      const distV = maxDim / (2 * Math.tan(fovVertical / 2));
      const distH = maxDim / (2 * Math.tan(fovHorizontal / 2));

      // Padding factor: Extra generous on narrow mobile screens to avoid any clipping
      const paddingFactor = aspect < 1.0 ? 1.48 : aspect < 1.3 ? 1.38 : 1.24;
      const targetDistance = Math.max(distV, distH) * paddingFactor;

      // Direction vector presets
      let dir = new THREE.Vector3(0.72, 0.58, 0.94).normalize();
      if (preset === 'front') {
        dir = new THREE.Vector3(0, 0.45, 1).normalize();
      } else if (preset === 'side') {
        dir = new THREE.Vector3(1, 0.38, 0).normalize();
      } else if (preset === 'top') {
        dir = new THREE.Vector3(0, 1, 0.05).normalize();
      } else if (preset === 'detail') {
        // Zoom on turned leg and brass ferrule
        cam.position.set(size.x / 2 + 0.38, 0.42, size.z / 2 + 0.48);
        ctrl.target.set(size.x / 2 - 0.07, 0.16, size.z / 2 - 0.07);
        ctrl.update();
        return;
      }

      // Slightly elevated focal center for optical balance
      const targetCenter = center.clone();
      targetCenter.y += 0.05;

      cam.position.copy(targetCenter).addScaledVector(dir, targetDistance);
      ctrl.target.copy(targetCenter);
      ctrl.update();
    },
    [currentCameraAngle]
  );

  // Apply camera angle preset
  const applyCameraPreset = (preset: CameraAngle) => {
    setCurrentCameraAngle(preset);
    fitCameraToModel(preset);
  };

  // Adjust lighting preset
  const applyLighting = (preset: LightingPreset) => {
    setLightingPreset(preset);
    if (!sceneRef.current || !mainSpotRef.current || !ambientLightRef.current || !fillLightRef.current) return;

    switch (preset) {
      case 'showroom':
        sceneRef.current.background = new THREE.Color('#F7F5F0');
        ambientLightRef.current.intensity = 1.3;
        ambientLightRef.current.color = new THREE.Color('#FFF8F0');
        mainSpotRef.current.intensity = 38;
        mainSpotRef.current.color = new THREE.Color('#FFF5E6');
        fillLightRef.current.intensity = 1.2;
        fillLightRef.current.color = new THREE.Color('#F0EAE1');
        if (headboardLedRef.current) headboardLedRef.current.intensity = 0.5;
        break;
      case 'daylight':
        sceneRef.current.background = new THREE.Color('#FFFFFF');
        ambientLightRef.current.intensity = 1.6;
        ambientLightRef.current.color = new THREE.Color('#FFFFFF');
        mainSpotRef.current.intensity = 48;
        mainSpotRef.current.color = new THREE.Color('#F8FAFC');
        fillLightRef.current.intensity = 2.0;
        fillLightRef.current.color = new THREE.Color('#EDF2F7');
        if (headboardLedRef.current) headboardLedRef.current.intensity = 0.2;
        break;
      case 'evening':
        sceneRef.current.background = new THREE.Color('#1F1E1B');
        ambientLightRef.current.intensity = 0.45;
        ambientLightRef.current.color = new THREE.Color('#D8C3A5');
        mainSpotRef.current.intensity = 24;
        mainSpotRef.current.color = new THREE.Color('#FFAA55');
        fillLightRef.current.intensity = 0.4;
        fillLightRef.current.color = new THREE.Color('#554433');
        if (headboardLedRef.current) headboardLedRef.current.intensity = 3.5;
        break;
    }
  };

  // Build the complete bed 3D geometry
  const buildBedModel = useCallback(
    (scene: THREE.Scene, textures: ReturnType<typeof createProceduralTextures>) => {
      if (bedRootGroupRef.current) {
        scene.remove(bedRootGroupRef.current);
      }

      frameMeshesRef.current = [];
      legMeshesRef.current = [];
      brassMeshesRef.current = [];

      const rootGroup = new THREE.Group();
      bedRootGroupRef.current = rootGroup;

      const isKing = config.size === 'king';
      const bedWidth = isKing ? 1.92 : 1.62;
      const bedLength = 2.1;
      const legHeight = 0.16;
      const legRadiusTop = 0.042;
      const legRadiusBottom = 0.024;
      const brassHeight = 0.045;

      const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(COLOR_TONES.find((c) => c.id === config.colorTone)?.hex || '#5A3D28'),
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
      });

      const legWoodMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3D2817'),
        roughness: 0.6,
      });

      const brassMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.88,
        roughness: 0.22,
      });

      // 1. Tapered Turned Legs with Brass Ferrules
      const legOffsets = [
        { x: bedWidth / 2 - 0.07, z: bedLength / 2 - 0.07 },
        { x: -(bedWidth / 2 - 0.07), z: bedLength / 2 - 0.07 },
        { x: bedWidth / 2 - 0.07, z: -(bedLength / 2 - 0.07) },
        { x: -(bedWidth / 2 - 0.07), z: -(bedLength / 2 - 0.07) },
      ];

      legOffsets.forEach((pos) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(pos.x, legHeight / 2, pos.z);

        const timberGeo = new THREE.CylinderGeometry(
          legRadiusTop,
          legRadiusBottom + 0.005,
          legHeight - brassHeight,
          24
        );
        const timberMesh = new THREE.Mesh(timberGeo, legWoodMaterial);
        timberMesh.position.y = brassHeight / 2;
        timberMesh.castShadow = true;
        legGroup.add(timberMesh);
        legMeshesRef.current.push(timberMesh);

        const brassGeo = new THREE.CylinderGeometry(
          legRadiusBottom + 0.005,
          legRadiusBottom,
          brassHeight,
          24
        );
        const brassMesh = new THREE.Mesh(brassGeo, brassMaterial);
        brassMesh.position.y = -(legHeight / 2) + brassHeight / 2;
        brassMesh.castShadow = true;
        legGroup.add(brassMesh);
        brassMeshesRef.current.push(brassMesh);

        rootGroup.add(legGroup);
      });

      // 2. Bed Platform Perimeter Rails
      const railThickness = 0.04;
      const railDepth = 0.22;
      const platformCenterY = legHeight + railDepth / 2;

      const sideRailGeo = new THREE.BoxGeometry(railThickness, railDepth, bedLength);
      const leftRail = new THREE.Mesh(sideRailGeo, frameMaterial);
      leftRail.position.set(-(bedWidth / 2 - railThickness / 2), platformCenterY, 0);
      leftRail.castShadow = true;
      leftRail.receiveShadow = true;
      rootGroup.add(leftRail);
      frameMeshesRef.current.push(leftRail);

      const rightRail = new THREE.Mesh(sideRailGeo, frameMaterial);
      rightRail.position.set(bedWidth / 2 - railThickness / 2, platformCenterY, 0);
      rightRail.castShadow = true;
      rightRail.receiveShadow = true;
      rootGroup.add(rightRail);
      frameMeshesRef.current.push(rightRail);

      const footRailGeo = new THREE.BoxGeometry(bedWidth, railDepth, railThickness);
      const footRail = new THREE.Mesh(footRailGeo, frameMaterial);
      footRail.position.set(0, platformCenterY, bedLength / 2 - railThickness / 2);
      footRail.castShadow = true;
      footRail.receiveShadow = true;
      rootGroup.add(footRail);
      frameMeshesRef.current.push(footRail);

      // 3. Structural Slat Mattress Base
      const slatCount = isKing ? 14 : 12;
      const slatSpacing = (bedLength - 0.2) / slatCount;
      const slatGeo = new THREE.BoxGeometry(bedWidth - 0.1, 0.02, 0.07);
      const slatMat = new THREE.MeshStandardMaterial({
        color: '#C2A67E',
        roughness: 0.7,
      });

      for (let i = 0; i < slatCount; i++) {
        const slat = new THREE.Mesh(slatGeo, slatMat);
        const slatZ = -(bedLength / 2 - 0.12) + i * slatSpacing;
        slat.position.set(0, platformCenterY + 0.05, slatZ);
        slat.castShadow = true;
        slat.receiveShadow = true;
        rootGroup.add(slat);
      }

      // 4. Animated Under-Bed Pull-Out Drawers
      const drawerW = bedWidth / 2 - 0.08;
      const drawerH = railDepth - 0.05;
      const drawerD = 0.8;

      const drawerMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(COLOR_TONES.find((c) => c.id === config.colorTone)?.hex || '#5A3D28'),
        roughness: 0.35,
        metalness: 0.05,
      });

      // Left Drawer
      const leftDrawerGroup = new THREE.Group();
      leftDrawerGroup.position.set(-bedWidth / 4, platformCenterY - 0.01, 0);

      const leftFrontGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.022);
      const leftFront = new THREE.Mesh(leftFrontGeo, drawerMat);
      leftFront.position.set(0, 0, drawerD / 2);
      leftFront.castShadow = true;
      leftDrawerGroup.add(leftFront);
      frameMeshesRef.current.push(leftFront);

      const leftBoxGeo = new THREE.BoxGeometry(drawerW - 0.04, drawerH - 0.02, drawerD - 0.04);
      const innerWoodMat = new THREE.MeshStandardMaterial({ color: '#D4C4A8', roughness: 0.6 });
      const leftBox = new THREE.Mesh(leftBoxGeo, innerWoodMat);
      leftBox.position.set(0, 0, 0);
      leftDrawerGroup.add(leftBox);

      drawerLeftGroupRef.current = leftDrawerGroup;
      rootGroup.add(leftDrawerGroup);

      // Right Drawer
      const rightDrawerGroup = new THREE.Group();
      rightDrawerGroup.position.set(bedWidth / 4, platformCenterY - 0.01, 0);

      const rightFrontGeo = new THREE.BoxGeometry(drawerW, drawerH, 0.022);
      const rightFront = new THREE.Mesh(rightFrontGeo, drawerMat);
      rightFront.position.set(0, 0, drawerD / 2);
      rightFront.castShadow = true;
      rightDrawerGroup.add(rightFront);
      frameMeshesRef.current.push(rightFront);

      const rightBox = new THREE.Mesh(leftBoxGeo, innerWoodMat);
      rightBox.position.set(0, 0, 0);
      rightDrawerGroup.add(rightBox);

      drawerRightGroupRef.current = rightDrawerGroup;
      rootGroup.add(rightDrawerGroup);

      // 5. Headboard Variations
      const hbHeight = 1.05;
      const hbThickness = 0.05;
      const hbCenterY = legHeight + hbHeight / 2;
      const hbZ = -(bedLength / 2 - hbThickness / 2);

      const headboardGroup = new THREE.Group();
      headboardGroup.position.set(0, hbCenterY, hbZ);

      if (config.headboardStyle === 'architectural_slats') {
        const slatPanelGeo = new THREE.BoxGeometry(bedWidth + 0.08, hbHeight, hbThickness);
        const slatPanel = new THREE.Mesh(slatPanelGeo, frameMaterial);
        slatPanel.castShadow = true;
        slatPanel.receiveShadow = true;
        headboardGroup.add(slatPanel);
        frameMeshesRef.current.push(slatPanel);

        const fluteCount = isKing ? 36 : 30;
        const fluteWidth = 0.022;
        const fluteDepth = 0.015;
        const fluteSpacing = (bedWidth - 0.04) / fluteCount;
        const fluteGeo = new THREE.BoxGeometry(fluteWidth, hbHeight - 0.08, fluteDepth);

        for (let f = 0; f < fluteCount; f++) {
          const fluteMesh = new THREE.Mesh(fluteGeo, frameMaterial);
          const fX = -(bedWidth / 2 - 0.03) + f * fluteSpacing;
          fluteMesh.position.set(fX, 0, hbThickness / 2 + fluteDepth / 2);
          fluteMesh.castShadow = true;
          headboardGroup.add(fluteMesh);
          frameMeshesRef.current.push(fluteMesh);
        }
      } else if (config.headboardStyle === 'upholstered_panel') {
        const frameBorderGeo = new THREE.BoxGeometry(bedWidth + 0.06, hbHeight, hbThickness);
        const frameBorder = new THREE.Mesh(frameBorderGeo, frameMaterial);
        frameBorder.castShadow = true;
        headboardGroup.add(frameBorder);
        frameMeshesRef.current.push(frameBorder);

        const cushionGeo = new THREE.BoxGeometry(bedWidth - 0.06, hbHeight - 0.12, 0.06);
        const cushionMat = new THREE.MeshStandardMaterial({
          map: textures.fabricTexture,
          color: '#EDE8DF',
          roughness: 0.85,
        });
        const cushion = new THREE.Mesh(cushionGeo, cushionMat);
        cushion.position.set(0, 0, 0.02);
        cushion.castShadow = true;
        headboardGroup.add(cushion);
      } else {
        const shelfBackGeo = new THREE.BoxGeometry(bedWidth + 0.08, hbHeight, 0.035);
        const shelfBack = new THREE.Mesh(shelfBackGeo, frameMaterial);
        shelfBack.castShadow = true;
        headboardGroup.add(shelfBack);
        frameMeshesRef.current.push(shelfBack);

        const topShelfGeo = new THREE.BoxGeometry(bedWidth + 0.14, 0.035, 0.14);
        const topShelf = new THREE.Mesh(topShelfGeo, frameMaterial);
        topShelf.position.set(0, hbHeight / 2, 0.05);
        topShelf.castShadow = true;
        headboardGroup.add(topShelf);
        frameMeshesRef.current.push(topShelf);
      }

      headboardGroupRef.current = headboardGroup;
      rootGroup.add(headboardGroup);

      const headLed = new THREE.PointLight('#FFAA44', 0.5, 4.5);
      headLed.position.set(0, hbCenterY + 0.2, hbZ - 0.08);
      rootGroup.add(headLed);
      headboardLedRef.current = headLed;

      // 6. Mattress & Linen Accessories
      const mattressWidth = bedWidth - 0.08;
      const mattressLength = bedLength - 0.1;
      const mattressThickness = 0.24;
      const mattressY = platformCenterY + railDepth / 2 + mattressThickness / 2 - 0.04;

      const mattressGeo = new THREE.BoxGeometry(mattressWidth, mattressThickness, mattressLength);
      const mattressMat = new THREE.MeshStandardMaterial({
        map: textures.fabricTexture,
        color: '#F8F6F0',
        roughness: 0.75,
        bumpScale: 0.02,
      });
      const mattress = new THREE.Mesh(mattressGeo, mattressMat);
      mattress.position.set(0, mattressY, 0.02);
      mattress.castShadow = true;
      mattress.receiveShadow = true;
      rootGroup.add(mattress);

      // Pillows
      const pillowGeo = new THREE.BoxGeometry(0.58, 0.12, 0.38);
      const pillowMat = new THREE.MeshStandardMaterial({
        color: '#FAF8F5',
        roughness: 0.7,
      });

      const pillowLeft = new THREE.Mesh(pillowGeo, pillowMat);
      pillowLeft.position.set(-(mattressWidth / 4), mattressY + mattressThickness / 2 + 0.06, -(mattressLength / 2 - 0.32));
      pillowLeft.rotation.x = 0.2;
      pillowLeft.castShadow = true;
      rootGroup.add(pillowLeft);

      const pillowRight = new THREE.Mesh(pillowGeo, pillowMat);
      pillowRight.position.set(mattressWidth / 4, mattressY + mattressThickness / 2 + 0.06, -(mattressLength / 2 - 0.32));
      pillowRight.rotation.x = 0.2;
      pillowRight.castShadow = true;
      rootGroup.add(pillowRight);

      // Linen Throw
      const runnerGeo = new THREE.BoxGeometry(mattressWidth + 0.04, 0.02, 0.65);
      const runnerMat = new THREE.MeshStandardMaterial({
        color: '#D8CEBE',
        roughness: 0.85,
      });
      const runner = new THREE.Mesh(runnerGeo, runnerMat);
      runner.position.set(0, mattressY + mattressThickness / 2 + 0.015, mattressLength / 2 - 0.38);
      runner.castShadow = true;
      rootGroup.add(runner);

      scene.add(rootGroup);
      updateMaterials();
    },
    [config.size, config.headboardStyle, config.colorTone, config.hasStorageDrawers, updateMaterials]
  );

  // Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 390;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7F5F0');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 0.45, 0);
    // On mobile, controls are enabled only in interactive mode
    controls.enabled = window.innerWidth >= 1024;
    controlsRef.current = controls;

    // Lighting
    const ambient = new THREE.AmbientLight('#FFF8F0', 1.3);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const spot = new THREE.SpotLight('#FFF5E6', 38);
    spot.position.set(4, 5.5, 4);
    spot.angle = Math.PI / 4.5;
    spot.penumbra = 0.8;
    spot.castShadow = true;
    spot.shadow.mapSize.width = 2048;
    spot.shadow.mapSize.height = 2048;
    spot.shadow.camera.near = 1;
    spot.shadow.camera.far = 15;
    spot.shadow.bias = -0.0001;
    scene.add(spot);
    mainSpotRef.current = spot;

    const fill = new THREE.DirectionalLight('#F0EAE1', 1.2);
    fill.position.set(-3.5, 3, -2);
    scene.add(fill);
    fillLightRef.current = fill;

    // Contact Floor Shadow
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Showroom Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.015, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#EDE8DF',
      roughness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.008;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const textures = createProceduralTextures();
    buildBedModel(scene, textures);
    setIsCanvasReady(true);

    // Initial camera fitting
    setTimeout(() => {
      fitCameraToModel('three_quarter');
    }, 50);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Smooth drawer slide
      const targetProgress = config.drawersOpen ? 1 : 0;
      drawerAnimProgress.current += (targetProgress - drawerAnimProgress.current) * Math.min(delta * 6, 1);

      if (drawerLeftGroupRef.current && drawerRightGroupRef.current && config.hasStorageDrawers) {
        const slideDistance = 0.38 * drawerAnimProgress.current;
        drawerLeftGroupRef.current.position.x = -(config.size === 'king' ? 1.92 : 1.62) / 4 - slideDistance;
        drawerRightGroupRef.current.position.x = (config.size === 'king' ? 1.92 : 1.62) / 4 + slideDistance;
      }

      if (isAutoRotating && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.2;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler with responsive fitting
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      fitCameraToModel(currentCameraAngle);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Rebuild bed geometry when size or structural style changes
  useEffect(() => {
    if (!sceneRef.current || !isCanvasReady) return;
    const textures = createProceduralTextures();
    buildBedModel(sceneRef.current, textures);
    // Refit camera to accommodate King (1.92m) vs Queen (1.62m)
    fitCameraToModel(currentCameraAngle);
  }, [config.size, config.headboardStyle, config.hasStorageDrawers, isCanvasReady, buildBedModel, createProceduralTextures, fitCameraToModel, currentCameraAngle]);

  // Update materials smoothly
  useEffect(() => {
    if (isCanvasReady) {
      updateMaterials();
    }
  }, [config.colorTone, config.finishType, isWireframe, isCanvasReady, updateMaterials]);

  // Update drawer visibility
  useEffect(() => {
    if (drawerLeftGroupRef.current && drawerRightGroupRef.current) {
      drawerLeftGroupRef.current.visible = config.hasStorageDrawers;
      drawerRightGroupRef.current.visible = config.hasStorageDrawers;
    }
  }, [config.hasStorageDrawers]);

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9F7F2] to-[#ECE7DE] border border-[#DDD8CF] shadow-sm select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
    >
      {/* 3D WebGL Canvas Container with pan-y touch behavior for natural page scroll */}
      <div
        ref={mountRef}
        style={{ touchAction: isTouchInteracting || !isMobileDevice ? 'none' : 'pan-y' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* TOP HUD: Minimalist, Architectural, No Overlap */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-[#FFFEFC]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#DDD8CF] shadow-sm flex items-center space-x-2 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1C1D1F]">
            Aura Bed Studio
          </span>
          <span className="text-[11px] text-[#A58A63] font-medium hidden sm:inline">
            • {config.size.toUpperCase()}
          </span>
        </div>

        {/* Viewport Action Badges */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {config.hasStorageDrawers && onToggleDrawers && (
            <button
              onClick={onToggleDrawers}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all flex items-center space-x-1 font-medium shadow-sm backdrop-blur-md ${
                config.drawersOpen
                  ? 'bg-[#A58A63] text-white border-[#A58A63]'
                  : 'bg-[#FFFEFC]/95 text-[#252522] border-[#DDD8CF] hover:border-[#A58A63]'
              }`}
            >
              <Box className="w-3 h-3" />
              <span>{config.drawersOpen ? 'Close' : 'Drawers'}</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-full bg-[#FFFEFC]/95 border border-[#DDD8CF] text-[#252522] hover:text-[#A58A63] transition shadow-sm backdrop-blur-md cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Inspection'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MOBILE INTERACTION OVERLAY: Tap to Rotate / Done Pill */}
      {isMobileDevice && !isFullscreen && (
        <div className="absolute top-12 right-3 pointer-events-auto z-10">
          {!isTouchInteracting ? (
            <button
              onClick={() => setIsTouchInteracting(true)}
              className="px-3 py-1.5 rounded-full bg-[#1C1D1F]/90 hover:bg-[#1C1D1F] text-white text-[11px] font-medium backdrop-blur-md shadow-md border border-white/20 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#C8A86B]" />
              <span>Touch to Rotate</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTouchInteracting(false)}
              className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-semibold shadow-lg border border-white/30 flex items-center space-x-1.5 active:scale-95 cursor-pointer"
            >
              <Check className="w-3 h-3 text-white" />
              <span>Done (Scroll Page)</span>
            </button>
          )}
        </div>
      )}

      {/* BOTTOM CONTROL HUD: Single Clean Row */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Camera Angle Presets */}
        <div className="bg-[#FFFEFC]/95 backdrop-blur-md p-1 rounded-xl border border-[#DDD8CF] shadow-sm flex items-center space-x-0.5 pointer-events-auto overflow-x-auto max-w-[80%] sm:max-w-none">
          <button
            onClick={() => applyCameraPreset('three_quarter')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
              currentCameraAngle === 'three_quarter'
                ? 'bg-[#1C1D1F] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            3/4 View
          </button>
          <button
            onClick={() => applyCameraPreset('front')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
              currentCameraAngle === 'front'
                ? 'bg-[#1C1D1F] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => applyCameraPreset('side')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
              currentCameraAngle === 'side'
                ? 'bg-[#1C1D1F] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => applyCameraPreset('top')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
              currentCameraAngle === 'top'
                ? 'bg-[#1C1D1F] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Plan
          </button>
        </div>

        {/* Lighting & Wireframe Controls (Desktop or Compact on Mobile) */}
        <div className="bg-[#FFFEFC]/95 backdrop-blur-md p-1 rounded-xl border border-[#DDD8CF] shadow-sm flex items-center space-x-1 pointer-events-auto">
          <button
            onClick={() => applyLighting(lightingPreset === 'showroom' ? 'daylight' : 'showroom')}
            className="p-1 rounded-lg text-[#252522]/70 hover:bg-[#ECE8E1] transition cursor-pointer"
            title="Toggle Studio Lighting"
          >
            {lightingPreset === 'showroom' ? (
              <Sparkles className="w-3.5 h-3.5 text-[#C8A86B]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </button>
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1 rounded-lg transition cursor-pointer ${
              isWireframe ? 'bg-[#1C1D1F] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
            }`}
            title="Wireframe CAD Mode"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
