"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FrostField({ count = 1400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = pointsRef.current;
    if (!p) return;
    p.rotation.y += delta * 0.035;
    p.rotation.x += delta * 0.012;
    const { x, y } = state.pointer;
    p.position.x += (x * 0.25 - p.position.x) * 0.04;
    p.position.y += (y * 0.2 - p.position.y) * 0.04;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += delta * 0.04 * Math.sin(i * 0.5 + state.clock.elapsedTime);
      if (arr[i] > viewport.height) arr[i] = -viewport.height;
    }
    pos.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        color="#9edcfb"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.25;
    ref.current.rotation.y += delta * 0.35;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.25, 1]} />
      <meshStandardMaterial
        color="#99dffb"
        emissive="#4b9bc7"
        emissiveIntensity={0.35}
        roughness={0.25}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

export function ParticleField() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 pointer-events-none"
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 4.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#050b14"]} />
        <fog attach="fog" args={["#050b14", 3.5, 10]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} color="#99dffb" />
        <directionalLight position={[-3, -1, 1]} intensity={0.4} color="#4b9bc7" />
        <FrostField count={1400} />
        <FloatingIcosahedron />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,11,20,0)_0%,rgba(5,11,20,0.85)_70%)]" />
    </div>
  );
}
