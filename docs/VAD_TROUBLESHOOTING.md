# Voice Activity Detection (VAD) Troubleshooting

## If Voice Detection is Not Working

### Step 1: Check Browser Console
Open your browser's developer console (F12 or right-click → Inspect → Console) and look for these messages:

**Good signs:**
```
✅ Recording started with VAD
👂 Starting audio level monitoring with threshold: -60 dB
🚀 Initiating voice activity detection...
📊 Audio level: -45.23 dB (threshold: -60 dB) | Average: 12.34
🎤 Voice detected! Level: -42.15 dB
```

**Problem signs:**
```
⚠️ Cannot start monitoring - analyser not ready or VAD disabled
⚠️ Analyser lost, stopping monitoring
Audio level consistently showing -100 dB or very low values
```

### Step 2: Check Microphone Permissions
1. Look for a microphone icon in your browser's address bar
2. Click it and ensure microphone access is **Allowed**
3. If blocked, allow it and refresh the page

### Step 3: Check Audio Levels in Console
When speaking, you should see audio levels in the console like:
```
📊 Audio level: -45.23 dB (threshold: -60 dB) | Average: 12.34
```

**If levels are too low (below -60 dB):**
- Your microphone volume might be too low
- Check system microphone settings
- Try speaking louder or closer to the microphone
- Check if the correct microphone is selected in system settings

### Step 4: Use Manual Override
If VAD is not detecting your voice automatically:
1. **Orange send button**: While recording in conversation mode, the send button (paper plane icon) turns orange and pulses
2. **Click send button**: Manually stop recording and send your message by clicking the orange send button
3. This gives you a fallback while we debug VAD sensitivity

### Step 5: Adjust Sensitivity
The current settings in `components/UI.tsx`:

```typescript
silenceThreshold: -60,  // dB (lower = more sensitive)
silenceDuration: 2000,  // ms (time to wait before auto-send)
```

**To make MORE sensitive (detects quieter speech):**
- Change `-60` to `-70` or `-80`
- This will detect even quieter sounds

**To make LESS sensitive (requires louder speech):**
- Change `-60` to `-50` or `-40`
- This will require louder/clearer speech

### Step 6: Check Microphone in System Settings

**macOS:**
1. System Preferences → Sound → Input
2. Select correct microphone
3. Check input level bar moves when speaking
4. Adjust input volume

**Windows:**
1. Settings → System → Sound → Input
2. Select correct microphone device
3. Test microphone and check levels
4. Adjust input volume

**Browser Microphone:**
1. In Chrome: chrome://settings/content/microphone
2. In Firefox: about:preferences#privacy → Permissions → Microphone
3. Ensure correct microphone is default

### Step 7: Test Microphone Independently
Visit: https://mictests.com/
- Test if your microphone is working
- Check the audio levels
- If not working here, it's a system/hardware issue

## Common Issues & Solutions

### Issue: "Waiting for speech..." but voice not detected

**Solution:**
1. Check console for audio level readings
2. If levels are below -60 dB when speaking, increase microphone volume
3. Use manual send button (orange, pulsing) as backup

### Issue: Recording stops too early

**Solution:**
Increase `silenceDuration` in `components/UI.tsx`:
```typescript
silenceDuration: 3000,  // Wait 3 seconds instead of 2
```

### Issue: Recording doesn't stop automatically

**Solution:**
1. Check if you're pausing long enough (2 seconds)
2. Use manual send button to stop recording
3. Lower `silenceThreshold` to be less sensitive:
   ```typescript
   silenceThreshold: -50,  // Less sensitive
   ```

### Issue: No microphone permission prompt

**Solution:**
1. Check browser console for errors
2. Ensure you're using HTTPS (or localhost for development)
3. Try a different browser
4. Clear browser cache and try again

## Debug Mode

To see detailed audio levels, check the console. Every ~500ms you'll see:
```
📊 Audio level: -45.23 dB (threshold: -60 dB) | Average: 12.34
```

- **Audio level**: Current loudness in decibels
- **Threshold**: Minimum level needed to detect speech
- **Average**: Raw audio data average (0-255)

**Normal speaking levels:** -30 to -50 dB
**Quiet environment:** -60 to -80 dB
**Loud speech:** -20 to -30 dB

## Still Not Working?

If after all these steps VAD is still not working:

1. **Switch to Manual Mode**
   - Click "Conversation Mode" button (top-right) to switch to manual mode
   - Click microphone to start/stop recording manually

2. **Check Environment**
   - Ensure you're in a relatively quiet environment
   - Background noise can interfere with detection

3. **Browser Compatibility**
   - Try Chrome/Edge (best support)
   - Firefox should work but may have different sensitivity
   - Safari may have limitations

4. **Report the Issue**
   - Note your browser and version
   - Note the audio levels shown in console
   - Check if manual send button works

## Quick Test Procedure

1. **Open console** (F12)
2. **Start speaking** clearly
3. **Look for**: `📊 Audio level: -XX dB`
4. **If level is above -60 dB** when speaking → should detect voice
5. **If level stays below -60 dB** → microphone too quiet or VAD too sensitive
6. **Adjust settings** or use manual send button

## Tips for Best Experience

1. **Speak clearly** at normal volume
2. **Reduce background noise** when possible
3. **Ensure good microphone** quality
4. **Keep browser tab active** (some browsers throttle inactive tabs)
5. **Use headset** if laptop mic is poor quality

