# Avatar Customization Guide

This guide will help you replace the default avatar with your own custom realistic 3D model.

## Option 1: Create a Custom Ready Player Me Avatar (Recommended)

Ready Player Me provides high-quality, customizable 3D avatars with built-in facial animation support.

### Steps:

1. **Visit Ready Player Me**: Go to [https://readyplayer.me/](https://readyplayer.me/)

2. **Create Your Avatar**: 
   - Take a selfie or upload a photo for automatic avatar generation
   - Or start from scratch and customize features manually
   - Choose realistic skin textures and features
   - Customize hair, facial features, clothing, etc.

3. **Get Your Avatar URL**:
   - After creating your avatar, you'll receive a unique URL like:
     ```
     https://models.readyplayer.me/[YOUR-AVATAR-ID].glb
     ```

4. **Configure for Lip Sync**:
   - Add these URL parameters for optimal performance:
     ```
     ?morphTargets=ARKit&textureAtlas=2048
     ```
   - Final URL example:
     ```
     https://models.readyplayer.me/[YOUR-AVATAR-ID].glb?morphTargets=ARKit&textureAtlas=2048
     ```

5. **Update the Code**:
   - Open `components/Avatar.tsx`
   - Replace the model URL in both places (useGLTF and preload)
   - Example:
   ```typescript
   const { scene } = useGLTF("https://models.readyplayer.me/[YOUR-AVATAR-ID].glb?morphTargets=ARKit&textureAtlas=2048");
   ```

### URL Parameters Explained:

- `morphTargets=ARKit` - Enables facial animation blend shapes compatible with Apple's ARKit (required for lip sync)
- `textureAtlas=2048` - Sets texture resolution (512, 1024, or 2048). Higher = better quality but larger file size

## Option 2: Use a Custom 3D Model

You can use any GLB/GLTF model with proper morph targets for facial animation.

### Requirements:

1. **Format**: GLB or GLTF format
2. **Morph Targets**: Must include ARKit-compatible blend shapes for facial animation
3. **Size**: Keep under 10MB for good loading performance
4. **Rigging**: Properly rigged with bones (optional but recommended for body animation)

### Recommended Morph Targets for Lip Sync:

The avatar should include these morph targets for optimal lip sync:
- `jawOpen` - Basic jaw movement
- `mouthOpen` - Mouth opening
- `viseme_aa` - "ah" sound
- `viseme_E` - "eh" sound  
- `viseme_I` - "ee" sound
- `viseme_O` - "oh" sound
- `viseme_U` - "oo" sound
- `viseme_PP` - "p/b/m" sounds
- `viseme_FF` - "f/v" sounds
- `viseme_TH` - "th" sounds
- `viseme_DD` - "d/t/n" sounds
- `viseme_kk` - "k/g" sounds
- `viseme_CH` - "ch/j" sounds
- `viseme_SS` - "s/z" sounds
- `viseme_RR` - "r" sound

### Where to Find 3D Models:

1. **Mixamo** (https://www.mixamo.com/)
   - Free rigged characters
   - Good for body animation but may need custom facial morph targets

2. **Sketchfab** (https://sketchfab.com/)
   - Filter by: "Downloadable", "GLB/GLTF", "Rigged"
   - Search for: "avatar", "human character", "realistic character"

3. **TurboSquid** (https://www.turbosquid.com/)
   - Professional models (some free, some paid)
   - Look for models with facial blend shapes

## Option 3: Enhanced Lighting & Materials

Even with the default avatar, you can make it look more realistic by adjusting lighting and materials.

### In `components/Experience.tsx`:

```typescript
// Add more dramatic lighting
<spotLight
  position={[5, 5, 5]}
  angle={0.3}
  penumbra={1}
  intensity={2}  // Increase for brighter key light
  castShadow
/>

// Add rim light for depth
<spotLight
  position={[0, 5, -5]}
  angle={0.5}
  penumbra={1}
  intensity={0.8}
  color="#7c3aed"  // Purple accent
/>
```

### In `components/Avatar.tsx`:

```typescript
// Enhance material properties
scene.traverse((child: any) => {
  if (child.isMesh && child.material) {
    child.material.roughness = 0.8;      // Skin-like roughness
    child.material.metalness = 0;        // Non-metallic
    child.material.envMapIntensity = 2;  // More environment reflection
    child.material.needsUpdate = true;
  }
});
```

## Tips for Best Results:

1. **Resolution**: Use 2048x2048 textures for best quality
2. **Optimization**: Keep polygon count under 50K triangles
3. **Testing**: Test in multiple browsers (Chrome, Safari, Firefox)
4. **Lighting**: Adjust lighting based on your avatar's skin tone
5. **Performance**: Monitor FPS in DevTools - aim for 60fps

## Troubleshooting:

### Avatar not loading
- Check browser console for errors
- Verify the URL is accessible (test in browser)
- Ensure CORS is enabled on the hosting server

### Lip sync not working
- Verify model has ARKit morph targets
- Check console for "Available morph targets" log
- Ensure audio is playing (check volume)

### Performance issues
- Reduce texture resolution (1024 instead of 2048)
- Lower polygon count
- Disable shadows in Experience.tsx

### Avatar looks flat/unrealistic
- Adjust lighting in Experience.tsx
- Enable shadows on meshes
- Increase environment map intensity
- Add more light sources

## Current Avatar:

The default avatar is from Ready Player Me with these settings:
- Model ID: `64bfa15f0e72c63d7c3934a6`
- Texture Atlas: 2048 (high quality)
- Morph Targets: ARKit (52 blend shapes)

Feel free to experiment with different avatars and settings to find what works best for your use case!

