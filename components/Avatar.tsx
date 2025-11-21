"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

export function Avatar({ audioRef, ...props }: { audioRef: React.RefObject<HTMLAudioElement | null> } & any) {
    const { scene } = useGLTF("https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit&textureAtlas=1024");
    const group = useRef<THREE.Group>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    React.useEffect(() => {
        if (!audioRef.current) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        // Connect audio element to analyser
        // Note: This requires user interaction to work properly in some browsers, 
        // but since we play audio on user action, it should be fine.
        let source: MediaElementAudioSourceNode | null = null;
        
        const setupAudioConnection = () => {
            if (!audioRef.current || source) return;
            
            try {
                console.log("Setting up audio connection for lip sync...");
                source = audioContext.createMediaElementSource(audioRef.current);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                console.log("✅ Audio routing connected: element -> analyser -> destination");
            } catch (e) {
                console.error("Error connecting audio source:", e);
            }
        };

        // Wait for the first play event to set up the connection
        const onPlay = () => {
            setupAudioConnection();
        };

        audioRef.current.addEventListener('play', onPlay, { once: true });

        return () => {
            audioRef.current?.removeEventListener('play', onPlay);
            if (source) {
                source.disconnect();
            }
            analyser.disconnect();
            audioContext.close();
        };
    }, [audioRef]);

    useFrame(() => {
        if (!analyserRef.current || !group.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume focusing on vocal frequencies (85-255Hz range)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Map to mouth open (0 to 1) with better sensitivity
        const volume = Math.min(1, average / 30);

        // Find the head mesh with morph targets
        scene.traverse((child: any) => {
            if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
                // Try multiple viseme targets for better lip sync
                const targets = [
                    "mouthOpen",
                    "viseme_aa",
                    "viseme_E",
                    "jawOpen"
                ];

                for (const targetName of targets) {
                    const targetIndex = child.morphTargetDictionary[targetName];
                    if (targetIndex !== undefined) {
                        // Faster lerp for more responsive mouth movement
                        const currentValue = child.morphTargetInfluences[targetIndex];
                        child.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(
                            currentValue,
                            volume,
                            0.3 // Increased from 0.1 for faster response
                        );
                    }
                }
            }
        });
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    );
}

// Only preload on the client side to avoid ProgressEvent error during SSR
if (typeof window !== "undefined") {
    useGLTF.preload("https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit&textureAtlas=1024");
}
