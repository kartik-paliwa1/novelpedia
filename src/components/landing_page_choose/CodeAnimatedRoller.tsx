'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Loader, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import React, { Suspense, useMemo, useRef } from 'react';
import type { GLTF } from 'three-stdlib';

type Face = 'AUTHOR' | 'READER' | 'CHOOSE' | 'NONE';

type RollerProps = {
  /** Which face should look at the camera right now */
  target: Face;
  /** Optional scale & offsets */
  scale?: number;
  y?: number;
  x?: number;
  z?: number;

};

/**
 * Coordinate assumptions for your model:
 * - Rotation axis: X
 * - 0° (x=0)      => READER faces forward
 * - 90° (x=+90°)  => AUTHOR faces forward
 * - 180°          => NONE faces forward
 * - 270°          => CHOOSE faces forward (default)
 * We'll damp the group's rotation.x toward the target angle.
 */
function RollerModel({ target, scale = 1, x = 0, y = 0, z = 0 }: RollerProps) {
  const group = useRef<THREE.Group>(null!);

  // Properly typed GLTF (no "any")
  const gltf = useGLTF('/models/roller.glb') as GLTF;

  // Clone the scene so we can safely reuse & transform it
  const roller = useMemo(() => {
    const g = new THREE.Group();
    g.add(gltf.scene.clone());
    return g;
  }, [gltf]);

  // Face -> rotation.x (radians)
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pitchByFace: Record<Face, number> = {
    READER: rad(0),
    AUTHOR: rad(90),
    NONE: rad(180),
    CHOOSE: rad(270), // default
  };

  useFrame((_, dt) => {
    if (!group.current) return;
    const targetPitch = pitchByFace[target];
    const rot = group.current.rotation;
    // Smoothly damp the X rotation only
    easing.damp(rot, 'x', targetPitch, 0.35, dt);
  });

  return (
    <group ref={group} position={[x, y, z]} scale={scale}>
      <primitive object={roller} />
    </group>
  );
}

export default function Roller3D(props: RollerProps) {
  return (
    <div className="w-full">
      <Canvas
        orthographic // Add this prop
        camera={{ position: [0, 0, 8], zoom: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        {/* Lighting for metallic materials */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 5, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={1} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <RollerModel {...props} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}

useGLTF.preload('/models/roller.glb');
