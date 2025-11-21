# Voice Conversation Mode

## Overview
The application now supports a **Continuous Voice Conversation Mode** that enables natural, hands-free conversations with the AI avatar. This mode uses Voice Activity Detection (VAD) to automatically detect when you're speaking and when you've finished.

## Features

### 1. **Automatic Voice Activity Detection (VAD)**
- Automatically detects when you start speaking
- Detects when you stop speaking (1.5 seconds of silence)
- Auto-sends your message when you finish speaking
- No need to manually click buttons during conversation

### 2. **Continuous Conversation Loop**
- After the avatar finishes responding, the system automatically starts listening again
- Creates a natural back-and-forth conversation flow
- Similar to talking to a real person

### 3. **Visual Feedback**
The UI provides clear visual indicators:
- **Green pulsing indicator**: Conversation mode is active
- **"Listening..."**: System detected your voice
- **"Waiting for speech..."**: System is listening but hasn't detected voice yet
- **"Avatar is speaking..."**: Avatar is currently responding

## How to Use

### Conversation Mode (Default)
**Conversation mode is now ON by default!** When you start the app, the system automatically begins in voice conversation mode.

### During Conversation Mode
1. Simply start speaking - the system will automatically detect your voice
2. When you finish speaking, wait 1.5 seconds - your message will auto-send
3. The avatar will respond with voice
4. After the avatar finishes, the system automatically starts listening again
5. Continue the conversation naturally

### Switching to Manual Mode
If you prefer to manually control recording:
1. Click the **"Conversation Mode"** button in the top-right corner (below header), OR
2. Click the microphone button in the input area

This will switch to manual mode where you need to click to start/stop recording.

## Technical Details

### Voice Activity Detection Settings
- **Silence Threshold**: -50 dB (adjustable in `useAudioRecording` hook)
- **Silence Duration**: 1500ms (1.5 seconds before auto-send)
- **Audio Analysis**: Uses Web Audio API with frequency analysis

### How It Works
1. **Microphone Access**: Requests microphone permission when conversation mode starts
2. **Audio Analysis**: Continuously analyzes audio frequency data
3. **Voice Detection**: Compares audio levels against threshold to detect speech
4. **Auto-Stop**: After 1.5 seconds of silence (after detecting voice), recording stops
5. **Auto-Transcribe**: Audio is automatically sent to Whisper API for transcription
6. **Auto-Respond**: Avatar generates and speaks response
7. **Auto-Restart**: System automatically restarts listening after avatar finishes speaking

### Key Components Modified
- **`useAudioRecording.ts`**: Enhanced with VAD capabilities
- **`useChat.ts`**: Added callback support for speech end events
- **`UI.tsx`**: Added conversation mode toggle and visual indicators

## Configuration

You can adjust the VAD sensitivity by modifying the parameters in `UI.tsx`:

```typescript
const { 
    isRecording, 
    audioBlob, 
    isListening,
    startRecording, 
    stopRecording, 
    clearRecording 
} = useAudioRecording({
    autoStopOnSilence: conversationMode,
    silenceThreshold: -50,      // Adjust for sensitivity (lower = more sensitive)
    silenceDuration: 1500,      // Adjust for pause duration (ms)
});
```

## Browser Compatibility
- Works in all modern browsers with Web Audio API support
- Requires microphone permissions
- Uses WebM or MP4 audio format depending on browser support

## Tips for Best Experience
1. **Speak clearly**: VAD works best with clear speech
2. **Minimize background noise**: High background noise may interfere with silence detection
3. **Natural pauses**: The 1.5-second silence detection allows for natural pauses in speech
4. **Adjust sensitivity**: If the system is too sensitive or not sensitive enough, adjust the `silenceThreshold` parameter

## Troubleshooting

### System not detecting my voice
- Check microphone permissions
- Try adjusting `silenceThreshold` to a higher value (e.g., -40)
- Ensure microphone is working properly

### System stops recording too early
- Increase `silenceDuration` (e.g., 2000ms)
- Check for background noise

### System doesn't stop recording
- Decrease `silenceThreshold` (e.g., -60)
- Ensure you're pausing long enough (1.5 seconds)

