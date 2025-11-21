"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Suspense } from "react";

export const Experience = ({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) => {
    return (
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
            <Environment preset="sunset" />
            <OrbitControls />
            <Suspense fallback={null}>
                <group position={[0, -1, 0]}>
                    <ContactShadows opacity={0.42} scale={10} blur={1} far={10} resolution={256} color="#000000" />
                    <Avatar audioRef={audioRef} />
                </group>
            </Suspense>
        </Canvas>
    );
};
