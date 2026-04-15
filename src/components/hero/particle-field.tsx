"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Drifting ice particle field with parallax */
function FrostField({ count = 1800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = pointsRef.current;
    if (!p) return;
    p.rotation.y += delta * 0.03;
    p.rotation.x += delta * 0.01;
    const { x, y } = state.pointer;
    p.position.x += (x * 0.4 - p.position.x) * 0.04;
    p.position.y += (y * 0.3 - p.position.y) * 0.04;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += delta * 0.05 * Math.sin(i * 0.5 + state.clock.elapsedTime);
      if (arr[i] > viewport.height) arr[i] = -viewport.height;
    }
    pos.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        color="#9edcfb"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/** Spinning hockey puck that follows the mouse */
function HockeyPuck() {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      const target = {
        x: state.pointer.x * 0.6,
        y: state.pointer.y * 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2,
      };
      ref.current.position.x += (target.x - ref.current.position.x) * 0.04;
      ref.current.position.y += (target.y - ref.current.position.y) * 0.04;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.4;
      ringRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={ref} position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.32, 64]} />
          <meshStandardMaterial
            color="#0a121d"
            metalness={0.75}
            roughness={0.25}
            emissive="#99dffb"
            emissiveIntensity={0.08}
          />
        </mesh>
      </Float>
      {/* Glowing ice ring orbiting the puck */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.6, 0.015, 16, 120]} />
        <meshBasicMaterial
          color="#99dffb"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** Floating ice shards scattered through the scene */
function IceShards({ count = 14 }: { count?: number }) {
  const shards = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4 - 1,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.35,
        speed: 0.4 + Math.random() * 0.8,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
      });
    }
    return items;
  }, [count]);

  return (
    <>
      {shards.map((s, i) => (
        <Float
          key={i}
          speed={s.speed}
          rotationIntensity={1.2}
          floatIntensity={0.8}
        >
          <mesh position={s.position} rotation={s.rotation} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#cfeefc"
              emissive="#4b9bc7"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.7}
              transparent
              opacity={0.55}
              wireframe={i % 3 === 0}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Wireframe ico as soft background echo */
function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.22;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.35;
  });
  return (
    <mesh ref={ref} position={[0, 0, -2]} scale={2.4}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#4b9bc7"
        wireframe
        transparent
        opacity={0.18}
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
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050b14"]} />
        <fog attach="fog" args={["#050b14", 3.5, 11]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[2, 3, 2]}
          intensity={1.4}
          color="#99dffb"
        />
        <directionalLight
          position={[-3, -1, 1]}
          intensity={0.5}
          color="#4b9bc7"
        />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#99dffb" />
        <Environment preset="night" />
        <FrostField count={1800} />
        <FloatingIcosahedron />
        <IceShards count={16} />
        <HockeyPuck />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,11,20,0)_0%,rgba(5,11,20,0.85)_70%)]" />
    </div>
  );
}
