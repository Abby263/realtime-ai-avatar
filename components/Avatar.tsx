"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";

// Viseme mapping for different mouth shapes based on frequency analysis
interface VisemeWeight {
    name: string;
    weight: number;
}

export function Avatar({ audioRef, ...props }: { audioRef: React.RefObject<HTMLAudioElement | null> } & any) {
    // Using a high-quality Ready Player Me avatar with enhanced textures
    // You can create your own at: https://readyplayer.me/
    // Settings used: morphTargets=ARKit, textureAtlas=2048 (higher quality)
    const { scene } = useGLTF("https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit&textureAtlas=2048");
    const group = useRef<THREE.Group>(null);
    
    // Enhance materials for more realistic rendering
    React.useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    // Enable better lighting
                    child.material.envMapIntensity = 1.5;
                    child.material.needsUpdate = true;
                }
            }
        });
    }, [scene]);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const smoothedVisemes = useRef<Map<string, number>>(new Map());

    // Store all available morph targets once the model is loaded
    const availableTargets = useMemo(() => {
        const targets = new Set<string>();
        scene.traverse((child: any) => {
            if (child.isMesh && child.morphTargetDictionary) {
                Object.keys(child.morphTargetDictionary).forEach(key => targets.add(key));
            }
        });
        console.log("Available morph targets:", Array.from(targets));
        return targets;
    }, [scene]);

    React.useEffect(() => {
        if (!audioRef.current) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Increased for better frequency resolution
        analyser.smoothingTimeConstant = 0.3; // Reduce for more responsive analysis
        analyserRef.current = analyser;

        let source: MediaElementAudioSourceNode | null = null;
        
        const setupAudioConnection = () => {
            if (!audioRef.current || source) return;
            
            try {
                console.log("Setting up audio connection for advanced lip sync...");
                source = audioContext.createMediaElementSource(audioRef.current);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                console.log("✅ Advanced audio routing connected");
            } catch (e) {
                console.error("Error connecting audio source:", e);
            }
        };

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

    // Advanced frequency analysis to determine viseme weights
    const analyzeFrequencies = (dataArray: Uint8Array): VisemeWeight[] => {
        const binCount = dataArray.length;
        const sampleRate = 48000; // Typical browser sample rate
        const nyquist = sampleRate / 2;
        const freqPerBin = nyquist / binCount;

        // Helper to get average amplitude in frequency range
        const getFrequencyRange = (minFreq: number, maxFreq: number): number => {
            const minBin = Math.floor(minFreq / freqPerBin);
            const maxBin = Math.ceil(maxFreq / freqPerBin);
            let sum = 0;
            for (let i = minBin; i < maxBin && i < binCount; i++) {
                sum += dataArray[i];
            }
            return sum / (maxBin - minBin) / 255; // Normalize to 0-1
        };

        // Voice frequency analysis for different phonemes
        const lowFreq = getFrequencyRange(80, 300);     // Vowels like "o", "u"
        const midLowFreq = getFrequencyRange(300, 800);  // Vowels like "a", "e"
        const midFreq = getFrequencyRange(800, 2000);    // Consonants and vowels
        const highFreq = getFrequencyRange(2000, 4000);  // "s", "sh", "f" sounds

        // Calculate overall volume
        const totalVolume = (lowFreq + midLowFreq + midFreq + highFreq) / 4;

        // Determine viseme weights based on frequency distribution
        const visemes: VisemeWeight[] = [];

        if (totalVolume > 0.05) {
            // Jaw open based on overall volume
            visemes.push({ name: "jawOpen", weight: Math.min(1, totalVolume * 2) });
            
            // Open mouth shapes
            if (midLowFreq > 0.15) {
                visemes.push({ name: "mouthOpen", weight: Math.min(1, midLowFreq * 1.5) });
                visemes.push({ name: "viseme_aa", weight: Math.min(1, midLowFreq * 1.3) });
            }
            
            // E and I sounds (mid-frequency dominant)
            if (midFreq > 0.15) {
                visemes.push({ name: "viseme_E", weight: Math.min(1, midFreq * 1.2) });
                visemes.push({ name: "viseme_I", weight: Math.min(1, midFreq * 1.1) });
            }
            
            // O and U sounds (low-frequency dominant)
            if (lowFreq > 0.15) {
                visemes.push({ name: "viseme_O", weight: Math.min(1, lowFreq * 1.3) });
                visemes.push({ name: "viseme_U", weight: Math.min(1, lowFreq * 1.2) });
                visemes.push({ name: "mouthPucker", weight: Math.min(1, lowFreq * 1.1) });
            }
            
            // Smile shapes for high-frequency content
            if (highFreq > 0.1) {
                visemes.push({ name: "mouthSmile", weight: Math.min(0.5, highFreq * 2) });
                visemes.push({ name: "viseme_SS", weight: Math.min(1, highFreq * 1.5) });
            }

            // Additional vowel shapes
            if (totalVolume > 0.2) {
                visemes.push({ name: "viseme_CH", weight: Math.min(1, midFreq * 0.8) });
                visemes.push({ name: "viseme_DD", weight: Math.min(1, midLowFreq * 0.7) });
                visemes.push({ name: "viseme_FF", weight: Math.min(1, highFreq * 1.2) });
                visemes.push({ name: "viseme_kk", weight: Math.min(1, midFreq * 0.6) });
                visemes.push({ name: "viseme_PP", weight: Math.min(1, lowFreq * 0.8) });
                visemes.push({ name: "viseme_RR", weight: Math.min(1, midLowFreq * 0.9) });
                visemes.push({ name: "viseme_TH", weight: Math.min(1, highFreq * 0.9) });
            }
        }

        return visemes;
    };

    useFrame(() => {
        if (!analyserRef.current || !group.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Get viseme weights from frequency analysis
        const targetVisemes = analyzeFrequencies(dataArray);

        // Apply smoothed viseme weights to morph targets
        scene.traverse((child: any) => {
            if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
                // Reset all visemes with smooth decay
                Object.keys(child.morphTargetDictionary).forEach(key => {
                    const currentValue = smoothedVisemes.current.get(key) || 0;
                    smoothedVisemes.current.set(key, currentValue * 0.7); // Decay
                });

                // Apply new viseme weights
                targetVisemes.forEach(({ name, weight }) => {
                    const targetIndex = child.morphTargetDictionary[name];
                    if (targetIndex !== undefined) {
                        const currentValue = smoothedVisemes.current.get(name) || 0;
                        const smoothWeight = THREE.MathUtils.lerp(currentValue, weight, 0.4);
                        smoothedVisemes.current.set(name, smoothWeight);
                        child.morphTargetInfluences[targetIndex] = smoothWeight;
                    }
                });
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
    useGLTF.preload("https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit&textureAtlas=2048");
}
