"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Float, Lightformer, Stage } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Suspense } from "react";

export const Experience = ({ 
    audioRef, 
    showLanding 
}: { 
    audioRef: React.RefObject<HTMLAudioElement | null>;
    showLanding: boolean;
}) => {
    return (
        <Canvas 
            shadows 
            camera={{ 
                position: showLanding ? [0, 0, 3] : [0, 0, 5], 
                fov: showLanding ? 35 : 30 
            }}
            className={showLanding ? "opacity-30" : "opacity-100"}
            style={{ transition: "opacity 0.5s ease" }}
            gl={{ 
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            }}
        >
            {/* Professional studio lighting setup */}
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight
                position={[5, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <spotLight
                position={[-5, 5, -5]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                castShadow
            />
            {/* Fill light from below for softer shadows */}
            <pointLight position={[0, -2, 0]} intensity={0.3} color="#9333ea" />
            
            {!showLanding && <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />}
            
            <Suspense fallback={null}>
                {showLanding ? (
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <group position={[0, -0.5, 0]}>
                            <ContactShadows 
                                opacity={0.4} 
                                scale={10} 
                                blur={2.5} 
                                far={10} 
                                resolution={512} 
                                color="#000000" 
                            />
                            <Avatar audioRef={audioRef} />
                        </group>
                    </Float>
                ) : (
                    <group position={[0, -1, 0]}>
                        <ContactShadows 
                            opacity={0.5} 
                            scale={10} 
                            blur={2} 
                            far={10} 
                            resolution={512} 
                            color="#000000" 
                        />
                        <Avatar audioRef={audioRef} />
                    </group>
                )}
            </Suspense>
        </Canvas>
    );
};
