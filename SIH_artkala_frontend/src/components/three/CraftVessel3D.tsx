"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Image from "next/image";
import { Sparkles, RotateCw } from "lucide-react";

interface CraftVessel3DProps {
  fallbackImageUrl?: string;
  className?: string;
}

export function CraftVessel3D({
  fallbackImageUrl = "/images/artisan-potter-hero.png",
  className = "",
}: CraftVessel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for reduced motion or mobile screen width < 768
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      if (prefersReduced || isMobile) {
        setIs3DSupported(false);
        return;
      }
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setIs3DSupported(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 520;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.2);
    camera.lookAt(0, 0, 0);

    // Warm artisanal lighting rig
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc85a32, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xedd9c8, 1.0);
    softFill.position.set(0, -3, 3);
    scene.add(softFill);

    // Craft Vessel Lathe Profile (Handcrafted Terracotta Matka/Vase silhouette)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.5));
    points.push(new THREE.Vector2(0.55, -1.5));
    points.push(new THREE.Vector2(0.9, -1.2));
    points.push(new THREE.Vector2(1.25, -0.6));
    points.push(new THREE.Vector2(1.35, 0.0));
    points.push(new THREE.Vector2(1.15, 0.6));
    points.push(new THREE.Vector2(0.65, 1.1));
    points.push(new THREE.Vector2(0.55, 1.3));
    points.push(new THREE.Vector2(0.75, 1.45));
    points.push(new THREE.Vector2(0.68, 1.55));
    points.push(new THREE.Vector2(0.48, 1.52));
    points.push(new THREE.Vector2(0.42, 1.35));

    const latheGeometry = new THREE.LatheGeometry(points, 48);

    // Material with warm artisanal clay sheen & tactile feel
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb8542b), // Rich Indian Terracotta
      roughness: 0.68,
      metalness: 0.08,
      flatShading: false,
    });

    const vesselMesh = new THREE.Mesh(latheGeometry, material);
    vesselMesh.position.y = -0.1;
    scene.add(vesselMesh);

    // Subtle decorative craft rim bands
    const rimGeom = new THREE.TorusGeometry(0.73, 0.035, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x8a3818,
      roughness: 0.5,
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.45;
    scene.add(rim);

    // Subtle subtle pedestal shadow disk
    const shadowGeom = new THREE.CircleGeometry(1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1c1917,
      transparent: true,
      opacity: 0.08,
    });
    const shadow = new THREE.Mesh(shadowGeom, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.55;
    scene.add(shadow);

    setIsLoaded(true);

    // Interaction handling
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;
    let autoRotate = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      setIsInteracting(true);
      previousMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      targetRotationY += deltaX * 0.008;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
      setTimeout(() => {
        autoRotate = true;
      }, 2500);
    };

    const canvasEl = canvas;
    canvasEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation loop with pause on off-screen
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (autoRotate) {
        targetRotationY += 0.004;
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      vesselMesh.rotation.y = currentRotationY;
      rim.rotation.z = currentRotationY;

      // Gentle subtle breathing float
      const time = Date.now() * 0.0015;
      vesselMesh.position.y = -0.1 + Math.sin(time) * 0.04;
      rim.position.y = 1.45 + Math.sin(time) * 0.04;

      renderer?.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      canvasEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      latheGeometry.dispose();
      material.dispose();
      rimGeom.dispose();
      rimMat.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
      renderer?.dispose();
    };
  }, []);

  if (!is3DSupported) {
    return (
      <div className={`relative overflow-hidden rounded-3xl bg-[#F4EFEA] ${className}`}>
        <Image
          src={fallbackImageUrl}
          alt="Handcrafted Indian Terracotta Vessel"
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
          <span className="font-medium">Handcrafted Terracotta</span>
          <span>Bankura Heritage</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#E8DFD5]/40 select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Interactive Micro Indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-[#1C1917] shadow-sm pointer-events-none">
        <RotateCw className="h-3 w-3 text-[#C85A32] animate-spin" style={{ animationDuration: "6s" }} />
        <span>Drag to inspect 3D terracotta craft form</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-[#1C1917]/70 backdrop-blur-md px-2.5 py-1 text-[10px] text-white pointer-events-none">
        <Sparkles className="h-3 w-3 text-[#F7EAE5]" />
        <span>Living Clay Heritage</span>
      </div>
    </div>
  );
}
