import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ConfigurationState } from '../../types/configurator';
import { COLOR_TONES } from '../../data/productData';
import {
  RotateCcw,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Minimize2,
  Box,
  Layers,
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

  // Mesh & Group references for dynamic updates without scene reconstruction
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

  // Drawer slide animation target & current position
  const drawerAnimProgress = useRef(0);

  // Helper to create procedural wood and lacquer canvas textures
  const createProceduralTextures = useCallback(() => {
    // 1. Dark Wood Texture (American Walnut)
    const walnutCanvas = document.createElement('canvas');
    walnutCanvas.width = 512;
    walnutCanvas.height = 512;
    const ctxWalnut = walnutCanvas.getContext('2d')!;
    ctxWalnut.fillStyle = '#5A3D28';
    ctxWalnut.fillRect(0, 0, 512, 512);
    // Draw wood grain bands
    for (let i = 0; i < 512; i += 4) {
      const alpha = 0.08 + Math.sin(i * 0.05) * 0.05;
      ctxWalnut.fillStyle = i % 8 === 0 ? `rgba(40, 24, 14, ${alpha})` : `rgba(110, 78, 50, ${alpha})`;
      ctxWalnut.fillRect(0, i, 512, 3);
    }
    // Add fine pores
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
    fabricTexture.repeat.set(6, 6);

    return { walnutTexture, oakTexture, fabricTexture };
  }, []);

  // Update Materials when config color / finish changes
  const updateMaterials = useCallback(() => {
    const colorObj = COLOR_TONES.find((c) => c.id === config.colorTone) || COLOR_TONES[0];
    const isAcrylic = config.finishType === 'acrylic';
    const isPU = config.finishType === 'pu_coating';

    // Calculate PBR values based on finish
    const roughness = isAcrylic ? 0.08 : isPU ? 0.35 : colorObj.roughness;
    const metalness = isAcrylic ? 0.15 : colorObj.metalness;
    const clearcoat = isAcrylic ? 1.0 : isPU ? 0.6 : 0.0;
    const clearcoatRoughness = isAcrylic ? 0.05 : 0.2;

    const baseColor = new THREE.Color(colorObj.hex);

    frameMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.color = baseColor;
        mat.roughness = roughness;
        mat.metalness = metalness;
        mat.clearcoat = clearcoat;
        mat.clearcoatRoughness = clearcoatRoughness;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });

    // Update leg materials (solid natural tone)
    legMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color = new THREE.Color(config.colorTone === 'natural_oak' ? '#8C6F48' : '#3D2817');
        mat.roughness = 0.6;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });

    // Update brass ferrule materials
    brassMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color = new THREE.Color('#D4AF37'); // Classic warm brass
        mat.metalness = 0.85;
        mat.roughness = 0.22;
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      }
    });
  }, [config.colorTone, config.finishType, isWireframe]);

  // Adjust camera to preset smoothly
  const applyCameraPreset = (preset: CameraAngle) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    setCurrentCameraAngle(preset);

    const isKing = config.size === 'king';
    const distFactor = isKing ? 1.08 : 1.0;

    switch (preset) {
      case 'three_quarter':
        cam.position.set(2.8 * distFactor, 2.1 * distFactor, 3.4 * distFactor);
        ctrl.target.set(0, 0.45, 0);
        break;
      case 'front':
        cam.position.set(0, 1.6 * distFactor, 3.8 * distFactor);
        ctrl.target.set(0, 0.55, 0);
        break;
      case 'side':
        cam.position.set(4.0 * distFactor, 1.2 * distFactor, 0);
        ctrl.target.set(0, 0.45, 0);
        break;
      case 'top':
        cam.position.set(0, 4.6 * distFactor, 0.1);
        ctrl.target.set(0, 0.3, 0);
        break;
      case 'detail':
        cam.position.set(1.4, 0.65, 1.6);
        ctrl.target.set(0.9, 0.35, 0.9);
        break;
    }
    ctrl.update();
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
        ambientLightRef.current.intensity = 1.8;
        ambientLightRef.current.color = new THREE.Color('#F5F8FA');
        mainSpotRef.current.intensity = 44;
        mainSpotRef.current.color = new THREE.Color('#FFFFFF');
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
      // Remove old model if present
      if (bedRootGroupRef.current) {
        scene.remove(bedRootGroupRef.current);
      }

      frameMeshesRef.current = [];
      legMeshesRef.current = [];
      brassMeshesRef.current = [];

      const rootGroup = new THREE.Group();
      bedRootGroupRef.current = rootGroup;

      const isKing = config.size === 'king';
      // Proportions: Queen = 1.62m wide, King = 1.92m wide, Length = 2.1m
      const bedWidth = isKing ? 1.92 : 1.62;
      const bedLength = 2.1;
      const legHeight = 0.16;
      const legRadiusTop = 0.042;
      const legRadiusBottom = 0.024;
      const brassHeight = 0.045;

      // Base shared Physical Material for bed frame
      const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(COLOR_TONES.find((c) => c.id === config.colorTone)?.hex || '#5A3D28'),
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
      });

      // Leg Wood Material
      const legWoodMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3D2817'),
        roughness: 0.6,
      });

      // Brass Ferrule Material
      const brassMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.88,
        roughness: 0.22,
      });

      // 1. Four Tapered Teakwood-style Legs with Brass Ferrules
      const legOffsets = [
        { x: bedWidth / 2 - 0.07, z: bedLength / 2 - 0.07 },
        { x: -(bedWidth / 2 - 0.07), z: bedLength / 2 - 0.07 },
        { x: bedWidth / 2 - 0.07, z: -(bedLength / 2 - 0.07) },
        { x: -(bedWidth / 2 - 0.07), z: -(bedLength / 2 - 0.07) },
      ];

      legOffsets.forEach((pos) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(pos.x, legHeight / 2, pos.z);

        // Tapered timber body
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

        // Brass ferrule sleeve at base
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

      // 2. Bed Platform Perimeter Rails (Side Aprons & Footboard)
      const railThickness = 0.04;
      const railDepth = 0.22;
      const platformCenterY = legHeight + railDepth / 2;

      // Left Rail
      const sideRailGeo = new THREE.BoxGeometry(railThickness, railDepth, bedLength);
      const leftRail = new THREE.Mesh(sideRailGeo, frameMaterial);
      leftRail.position.set(-(bedWidth / 2 - railThickness / 2), platformCenterY, 0);
      leftRail.castShadow = true;
      leftRail.receiveShadow = true;
      rootGroup.add(leftRail);
      frameMeshesRef.current.push(leftRail);

      // Right Rail
      const rightRail = new THREE.Mesh(sideRailGeo, frameMaterial);
      rightRail.position.set(bedWidth / 2 - railThickness / 2, platformCenterY, 0);
      rightRail.castShadow = true;
      rightRail.receiveShadow = true;
      rootGroup.add(rightRail);
      frameMeshesRef.current.push(rightRail);

      // Footboard Front Rail (with subtle 45-degree mitred joint aesthetic)
      const footRailGeo = new THREE.BoxGeometry(bedWidth, railDepth, railThickness);
      const footRail = new THREE.Mesh(footRailGeo, frameMaterial);
      footRail.position.set(0, platformCenterY, bedLength / 2 - railThickness / 2);
      footRail.castShadow = true;
      footRail.receiveShadow = true;
      rootGroup.add(footRail);
      frameMeshesRef.current.push(footRail);

      // Headboard Bottom Rail
      const headBottomRail = new THREE.Mesh(footRailGeo, frameMaterial);
      headBottomRail.position.set(0, platformCenterY, -(bedLength / 2 - railThickness / 2));
      headBottomRail.castShadow = true;
      rootGroup.add(headBottomRail);
      frameMeshesRef.current.push(headBottomRail);

      // Center Structural Spine Beam (Powder-coated steel)
      const centerBeamGeo = new THREE.BoxGeometry(0.06, 0.08, bedLength - 0.1);
      const centerBeamMat = new THREE.MeshStandardMaterial({
        color: '#252525',
        metalness: 0.7,
        roughness: 0.4,
      });
      const centerBeam = new THREE.Mesh(centerBeamGeo, centerBeamMat);
      centerBeam.position.set(0, platformCenterY - 0.04, 0);
      rootGroup.add(centerBeam);

      // 3. Wooden Bed Slats Base
      const slatCount = 14;
      const slatMat = new THREE.MeshStandardMaterial({
        color: '#D8C6A5',
        roughness: 0.7,
      });
      const slatSpacing = (bedLength - 0.2) / slatCount;
      for (let i = 0; i < slatCount; i++) {
        const slatGeo = new THREE.BoxGeometry(bedWidth - 0.1, 0.015, 0.06);
        const slat = new THREE.Mesh(slatGeo, slatMat);
        slat.position.set(0, platformCenterY + 0.05, -bedLength / 2 + 0.1 + i * slatSpacing);
        slat.receiveShadow = true;
        rootGroup.add(slat);
      }

      // 4. Under-Bed Storage Drawers (Left and Right Modules)
      const drawerWidth = bedWidth / 2 - 0.06;
      const drawerLength = 0.82;
      const drawerDepth = 0.17;
      const drawerY = legHeight + drawerDepth / 2 + 0.01;

      // Left Drawer Group
      const leftDrawerGroup = new THREE.Group();
      leftDrawerGroup.position.set(-bedWidth / 4, drawerY, 0.15);
      const drawerFaciaMat = frameMaterial.clone();

      const drawerBoxGeo = new THREE.BoxGeometry(drawerWidth, drawerDepth, drawerLength);
      const leftDrawerBox = new THREE.Mesh(drawerBoxGeo, drawerFaciaMat);
      leftDrawerBox.castShadow = true;
      leftDrawerBox.receiveShadow = true;
      leftDrawerGroup.add(leftDrawerBox);
      frameMeshesRef.current.push(leftDrawerBox);

      // Drawer Pull Handle (brushed metal recessed finger groove)
      const handleGeo = new THREE.BoxGeometry(0.02, 0.02, 0.18);
      const handleMat = new THREE.MeshStandardMaterial({
        color: '#333333',
        metalness: 0.9,
        roughness: 0.3,
      });
      const leftHandle = new THREE.Mesh(handleGeo, handleMat);
      leftHandle.position.set(-(drawerWidth / 2 + 0.012), 0, 0);
      leftDrawerGroup.add(leftHandle);

      drawerLeftGroupRef.current = leftDrawerGroup;
      rootGroup.add(leftDrawerGroup);

      // Right Drawer Group
      const rightDrawerGroup = new THREE.Group();
      rightDrawerGroup.position.set(bedWidth / 4, drawerY, 0.15);
      const rightDrawerBox = new THREE.Mesh(drawerBoxGeo, drawerFaciaMat);
      rightDrawerBox.castShadow = true;
      rightDrawerBox.receiveShadow = true;
      rightDrawerGroup.add(rightDrawerBox);
      frameMeshesRef.current.push(rightDrawerBox);

      const rightHandle = new THREE.Mesh(handleGeo, handleMat);
      rightHandle.position.set(drawerWidth / 2 + 0.012, 0, 0);
      rightDrawerGroup.add(rightHandle);

      drawerRightGroupRef.current = rightDrawerGroup;
      rootGroup.add(rightDrawerGroup);

      // Set visibility according to configuration
      leftDrawerGroup.visible = config.hasStorageDrawers;
      rightDrawerGroup.visible = config.hasStorageDrawers;

      // 5. Headboard Variations
      const headboardGroup = new THREE.Group();
      const hbZ = -(bedLength / 2 + 0.03);
      const hbHeight = 0.76;
      const hbCenterY = legHeight + railDepth + hbHeight / 2 - 0.04;
      headboardGroup.position.set(0, hbCenterY, hbZ);

      if (config.headboardStyle === 'architectural_slats') {
        // Vertical Slats Design
        const backboardGeo = new THREE.BoxGeometry(bedWidth + 0.08, hbHeight, 0.03);
        const backboard = new THREE.Mesh(backboardGeo, frameMaterial);
        backboard.castShadow = true;
        headboardGroup.add(backboard);
        frameMeshesRef.current.push(backboard);

        // Fluted vertical slats with subtle depth
        const slatNum = isKing ? 28 : 24;
        const slatW = (bedWidth + 0.04) / slatNum - 0.012;
        const slatDepth = 0.022;
        for (let s = 0; s < slatNum; s++) {
          const sx = -(bedWidth / 2) + 0.02 + s * (slatW + 0.012);
          const flutedGeo = new THREE.BoxGeometry(slatW, hbHeight - 0.04, slatDepth);
          const flutedMesh = new THREE.Mesh(flutedGeo, frameMaterial);
          flutedMesh.position.set(sx, 0, 0.025);
          flutedMesh.castShadow = true;
          headboardGroup.add(flutedMesh);
          frameMeshesRef.current.push(flutedMesh);
        }
      } else if (config.headboardStyle === 'upholstered_panel') {
        // Upholstered Belgian Linen Cushion Inset
        const outerFrameGeo = new THREE.BoxGeometry(bedWidth + 0.08, hbHeight, 0.05);
        const outerFrame = new THREE.Mesh(outerFrameGeo, frameMaterial);
        outerFrame.castShadow = true;
        headboardGroup.add(outerFrame);
        frameMeshesRef.current.push(outerFrame);

        // Padded fabric cushion with subtle bevel
        const cushionGeo = new THREE.BoxGeometry(bedWidth - 0.12, hbHeight - 0.12, 0.06);
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
        // Floating Horizon Ledge Shelf
        const shelfBackGeo = new THREE.BoxGeometry(bedWidth + 0.08, hbHeight, 0.035);
        const shelfBack = new THREE.Mesh(shelfBackGeo, frameMaterial);
        shelfBack.castShadow = true;
        headboardGroup.add(shelfBack);
        frameMeshesRef.current.push(shelfBack);

        // Floating Top Horizon Shelf
        const topShelfGeo = new THREE.BoxGeometry(bedWidth + 0.14, 0.035, 0.14);
        const topShelf = new THREE.Mesh(topShelfGeo, frameMaterial);
        topShelf.position.set(0, hbHeight / 2, 0.05);
        topShelf.castShadow = true;
        headboardGroup.add(topShelf);
        frameMeshesRef.current.push(topShelf);
      }

      headboardGroupRef.current = headboardGroup;
      rootGroup.add(headboardGroup);

      // Headboard Warm LED Halo Light (concealed behind headboard)
      const headLed = new THREE.PointLight('#FFAA44', 0.5, 4.5);
      headLed.position.set(0, hbCenterY + 0.2, hbZ - 0.08);
      rootGroup.add(headLed);
      headboardLedRef.current = headLed;

      // 6. Premium Mattress & Linen Accessories
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

      // Pillow Duo at headboard
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

      // Draped Foot Runner / Linen Blanket Fold
      const runnerGeo = new THREE.BoxGeometry(mattressWidth + 0.04, 0.02, 0.65);
      const runnerMat = new THREE.MeshStandardMaterial({
        color: '#D8CEBE',
        roughness: 0.85,
      });
      const runner = new THREE.Mesh(runnerGeo, runnerMat);
      runner.position.set(0, mattressY + mattressThickness / 2 + 0.015, mattressLength / 2 - 0.38);
      runner.castShadow = true;
      rootGroup.add(runner);

      // Add to scene
      scene.add(rootGroup);

      // Apply initial materials
      updateMaterials();
    },
    [config.size, config.headboardStyle, config.colorTone, config.hasStorageDrawers, updateMaterials]
  );

  // Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F7F5F0');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(2.8, 2.1, 3.4);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 0.45, 0);
    controlsRef.current = controls;

    // Lighting Setup
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

    // Ground Plane with Soft Architectural Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle showroom pedestal disk
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.015, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#EDE8DF',
      roughness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.008;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Procedural textures
    const textures = createProceduralTextures();

    // Initial bed build
    buildBedModel(scene, textures);
    setIsCanvasReady(true);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Handle drawer smooth slide in/out
      const targetProgress = config.drawersOpen ? 1 : 0;
      drawerAnimProgress.current += (targetProgress - drawerAnimProgress.current) * Math.min(delta * 6, 1);

      if (drawerLeftGroupRef.current && drawerRightGroupRef.current && config.hasStorageDrawers) {
        const slideDistance = 0.38 * drawerAnimProgress.current;
        drawerLeftGroupRef.current.position.x = -(config.size === 'king' ? 1.92 : 1.62) / 4 - slideDistance;
        drawerRightGroupRef.current.position.x = (config.size === 'king' ? 1.92 : 1.62) / 4 + slideDistance;
      }

      // Auto-rotation when enabled
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

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
  }, []); // Run once on mount

  // Rebuild bed geometry when size, headboard, or storage option changes
  useEffect(() => {
    if (!sceneRef.current || !isCanvasReady) return;
    const textures = createProceduralTextures();
    buildBedModel(sceneRef.current, textures);
  }, [config.size, config.headboardStyle, config.hasStorageDrawers, isCanvasReady, buildBedModel, createProceduralTextures]);

  // Update materials smoothly when colors or finish changes
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
      className={`relative w-full h-full min-h-[440px] md:min-h-[560px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9F7F2] to-[#ECE7DE] border border-[#DDD8CF] shadow-inner select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none min-h-screen' : ''
      } ${isCompact ? 'min-h-[380px]' : ''}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#FFFEFC]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DDD8CF] shadow-sm flex items-center space-x-2.5 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-[#252522]">
            Interactive 3D Engine
          </span>
          <span className="text-xs text-[#252522]/40">•</span>
          <span className="text-xs text-[#A58A63] font-medium">
            {config.size.toUpperCase()} | {config.colorTone.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Viewport Action Badges */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {config.hasStorageDrawers && onToggleDrawers && (
            <button
              onClick={onToggleDrawers}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 font-medium shadow-sm backdrop-blur-md ${
                config.drawersOpen
                  ? 'bg-[#A58A63] text-white border-[#A58A63]'
                  : 'bg-[#FFFEFC]/90 text-[#252522] border-[#DDD8CF] hover:border-[#A58A63]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{config.drawersOpen ? 'Close Drawers' : 'Open Drawers (Pull-Out)'}</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-[#FFFEFC]/90 border border-[#DDD8CF] text-[#252522] hover:text-[#A58A63] transition shadow-sm backdrop-blur-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Inspection'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Control HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Preset Quick Buttons */}
        <div className="bg-[#FFFEFC]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#DDD8CF] shadow-sm flex items-center space-x-1 pointer-events-auto">
          <button
            onClick={() => applyCameraPreset('three_quarter')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              currentCameraAngle === 'three_quarter'
                ? 'bg-[#252522] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            3/4 Studio
          </button>
          <button
            onClick={() => applyCameraPreset('front')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              currentCameraAngle === 'front'
                ? 'bg-[#252522] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => applyCameraPreset('side')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              currentCameraAngle === 'side'
                ? 'bg-[#252522] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => applyCameraPreset('top')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              currentCameraAngle === 'top'
                ? 'bg-[#252522] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Plan View
          </button>
          <button
            onClick={() => applyCameraPreset('detail')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
              currentCameraAngle === 'detail'
                ? 'bg-[#252522] text-white'
                : 'text-[#252522]/70 hover:text-[#252522] hover:bg-[#ECE8E1]'
            }`}
          >
            Ferrule Joint
          </button>
        </div>

        {/* Lighting & Display Mode Controls */}
        <div className="bg-[#FFFEFC]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#DDD8CF] shadow-sm flex items-center space-x-1.5 pointer-events-auto">
          {/* Lighting Mode Selector */}
          <div className="flex items-center space-x-1 border-r border-[#DDD8CF] pr-2">
            <button
              onClick={() => applyLighting('showroom')}
              className={`p-1.5 rounded-lg transition ${
                lightingPreset === 'showroom' ? 'bg-[#A58A63] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
              }`}
              title="Showroom Warm Lighting (3200K)"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => applyLighting('daylight')}
              className={`p-1.5 rounded-lg transition ${
                lightingPreset === 'daylight' ? 'bg-[#A58A63] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
              }`}
              title="Daylight Studio Light (5500K)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => applyLighting('evening')}
              className={`p-1.5 rounded-lg transition ${
                lightingPreset === 'evening' ? 'bg-[#A58A63] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
              }`}
              title="Evening Ambient + Headboard LED Strip"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
              isAutoRotating ? 'bg-[#A58A63] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
            }`}
            title="Toggle 360 Turntable Rotation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          {/* Wireframe / CAD Mode Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
              isWireframe ? 'bg-[#252522] text-white' : 'text-[#252522]/70 hover:bg-[#ECE8E1]'
            }`}
            title="Toggle Engineering CAD Wireframe"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={() => applyCameraPreset('three_quarter')}
            className="p-1.5 rounded-lg text-[#252522]/70 hover:bg-[#ECE8E1] transition"
            title="Reset Camera View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interaction tip */}
      <div className="absolute top-16 left-4 pointer-events-none opacity-60 hover:opacity-100 transition hidden sm:block">
        <p className="text-[11px] text-[#252522] bg-[#FFFEFC]/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#DDD8CF]">
          Click + Drag to Orbit • Scroll to Zoom • Right-click to Pan
        </p>
      </div>
    </div>
  );
};
