# LinguaAI - Real-Time Conversational AI Avatar 🎙️

A professional, lifelike 3D AI avatar with advanced real-time conversation capabilities. Powered by OpenAI's GPT-4 and Text-to-Speech, featuring photorealistic rendering, advanced lip sync with phoneme-based viseme mapping, and a beautiful modern UI.

<div align="center">
  <img src="public/avatar.png" alt="LinguaAI Avatar Interface" width="800"/>
  <p><em>Interactive voice-to-voice conversation with a 3D AI avatar</em></p>
</div>

## ✨ Features

### Core Capabilities
- **🎤 Continuous Voice Conversation Mode**: Hands-free natural conversation with automatic Voice Activity Detection (VAD)
- **🤖 Auto Voice Detection**: Automatically detects when you start and stop speaking
- **⚡ Real-time Streaming**: GPT-4 responses stream word-by-word with sentence-level TTS generation
- **💬 Dual Input Modes**: Seamless switching between continuous voice mode and manual mode
- **🔊 Smart Audio Queue**: Multiple audio chunks play sequentially without gaps or interruptions
- **🔄 Auto-Restart Listening**: Automatically resumes listening after avatar finishes responding

### Avatar & Visuals
- **🎭 Photorealistic 3D Avatar**: High-quality Ready Player Me model with 2048px textures
- **👄 Advanced Lip Sync**: Phoneme-based viseme mapping with frequency analysis for natural mouth movements
- **💡 Professional Lighting**: Studio-quality 3-point lighting setup for realistic rendering
- **🎨 Smooth Animations**: Floating animations, smooth transitions, and responsive expressions
- **🔄 Interactive Controls**: Orbit controls for exploring the avatar from any angle

### User Experience
- **🌟 Modern Landing Page**: Professional hero section with feature highlights and compelling pitch
- **🎨 Beautiful UI**: Gradient designs, glassmorphism effects, and smooth animations
- **📱 Responsive Design**: Works beautifully on desktop and mobile devices
- **🎯 Real-time Feedback**: Visual indicators for speaking, recording, and loading states
- **✨ Polished Interactions**: Hover effects, scale transforms, and micro-interactions

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **3D Rendering**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **AI**: [OpenAI API](https://platform.openai.com/) (GPT-4o-mini, Whisper, TTS-1)
- **Audio**: Web Audio API, MediaRecorder API
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- OpenAI API Key

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-avatar-for-learning
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open the application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage

### Continuous Voice Conversation Mode (Default & Recommended) 🌟

**The app starts in continuous voice conversation mode by default** - just start speaking!

1. **Grant Permission**: Allow microphone access when prompted
2. **Start Speaking**: Simply begin talking naturally - no buttons to press!
3. **Visual Feedback**: 
   - 🟢 "Listening..." = Voice detected
   - 🟡 "Waiting for speech..." = Ready but no voice yet
   - 🔵 "Avatar is speaking..." = Avatar is responding
4. **Auto-Send**: Stop speaking for 1.5 seconds and your message auto-sends
5. **Continuous Loop**: After the avatar responds, it automatically starts listening again

**Manual Override**: If auto-detection doesn't work:
- Click the 🟠 **orange pulsing send button** to manually stop and send your recording

**Switch Modes**: Click the green **"Conversation Mode"** button (top-right) to switch to manual mode

### Manual Mode

Perfect for noisy environments or when you prefer manual control:

1. **Voice**: Click 🎤 microphone → speak → click again to stop → auto-sends
2. **Text**: Type message → press Enter or click 💌 send button

### Tips for Best Experience

- 🎧 **Use headphones** to prevent echo
- 🗣️ **Speak clearly** at normal volume
- 📍 **Allow microphone** access when prompted
- 🔊 **Turn up volume** to hear the avatar
- 🤫 **Quiet environment** works best for voice detection
- 🎛️ **Adjust mic volume** if detection is too sensitive/insensitive
- 💬 **Try both modes** - switch anytime with the top-right button!

## 📁 Project Structure

```
ai-avatar-for-learning/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Streaming GPT-4 chat endpoint
│   │   ├── tts/
│   │   │   └── route.ts          # Text-to-speech endpoint
│   │   └── stt/
│   │       └── route.ts          # Speech-to-text endpoint (Whisper)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── Avatar.tsx                # 3D avatar with advanced lip sync
│   ├── Experience.tsx            # Three.js scene with professional lighting
│   ├── Header.tsx                # App header with navigation
│   ├── LandingHero.tsx           # Landing page hero section
│   └── UI.tsx                    # Enhanced chat interface with voice input
├── hooks/
│   ├── useChat.ts                # Chat logic with streaming and TTS queue
│   └── useAudioRecording.ts     # Audio recording with Voice Activity Detection (VAD)
├── public/
│   └── avatar.png                # App screenshot
└── README.md
```

## 🎯 How It Works

### Voice Input Flow (Speech-to-Speech)

#### Conversation Mode (Automatic)
1. **🎤 Auto-Start**: Recording starts automatically when app loads
2. **🎙️ Voice Activity Detection**: Real-time audio analysis using Web Audio API
3. **🟢 Voice Detected**: System recognizes when you start speaking (threshold: -45 dB)
4. **🟡 Silence Detected**: System detects when you stop speaking (1.5s silence)
5. **⏹️ Auto-Stop**: Recording stops automatically after silence period
6. **📝 Transcription**: Audio sent to `/api/stt` using Whisper API
7. **🤖 AI Response**: Message sent to GPT-4 via `/api/chat`
8. **📡 Streaming**: Response streams word-by-word to UI
9. **🔊 Text-to-Speech**: Complete sentences converted to audio via `/api/tts`
10. **🎭 Lip Sync**: Avatar's mouth moves naturally with speech
11. **🔄 Auto-Restart**: After avatar finishes, automatically starts listening again

#### Manual Mode
1. **🎤 Click Mic**: User clicks microphone button
2. **🔴 Recording**: Button turns red and pulses while recording
3. **✋ Stop Recording**: User clicks again to stop
4. **📝 Continue**: Same as steps 6-10 above

### Text Input Flow (Traditional Chat)

1. **⌨️ Type Message**: User types in the input field
2. **📤 Send**: User presses Enter or clicks send button
3. **🤖 AI Response**: Same as steps 6-9 above

### API Routes

#### `POST /api/chat`
- Accepts: `{ messages: Message[] }`
- Returns: Streaming text response
- Uses: OpenAI GPT-4o-mini with streaming enabled

#### `POST /api/tts`
- Accepts: `{ text: string }`
- Returns: Audio MP3 buffer
- Uses: OpenAI TTS-1 model with "alloy" voice

#### `POST /api/stt`
- Accepts: FormData with audio file
- Returns: `{ text: string }`
- Uses: OpenAI Whisper-1 model for transcription

## 🎨 Customization

### Change Avatar Model

The application uses a high-quality Ready Player Me avatar with advanced features. To customize:

Edit `components/Avatar.tsx`:

```typescript
const { scene } = useGLTF("YOUR_MODEL_URL.glb?morphTargets=ARKit&textureAtlas=2048&quality=high");
```

**Important Parameters:**
- `morphTargets=ARKit` - Enables 52 facial blend shapes for lip sync (required)
- `textureAtlas=2048` - Texture resolution (512/1024/2048)
- `quality=high` - Requests highest quality model

For detailed instructions on creating your own avatar, see [AVATAR_CUSTOMIZATION.md](AVATAR_CUSTOMIZATION.md)

### Change AI Voice

Edit `app/api/tts/route.ts`:

```typescript
const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
    input: text,
});
```

### Change AI Model

Edit `app/api/chat/route.ts`:

```typescript
const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Current model. Can change to gpt-4o, gpt-4-turbo, etc.
    // ...
});
```

### Advanced Lip Sync System

The application features a sophisticated lip sync system that analyzes audio frequencies in real-time:

**How It Works:**
1. **Frequency Analysis**: Analyzes audio in multiple frequency ranges (80-4000Hz)
2. **Phoneme Detection**: Maps frequency patterns to phoneme categories
3. **Viseme Mapping**: Applies appropriate mouth shapes (visemes) based on detected phonemes
4. **Smooth Transitions**: Lerp interpolation for natural movements between shapes

**Frequency Ranges:**
- Low (80-300Hz): "o", "u" vowels → mouthPucker, viseme_O
- Mid-Low (300-800Hz): "a", "e" vowels → mouthOpen, viseme_aa
- Mid (800-2000Hz): Mixed sounds → viseme_E, viseme_I
- High (2000-4000Hz): "s", "f" sounds → viseme_SS, viseme_FF

**Customization:**
Edit `components/Avatar.tsx` to adjust sensitivity or frequency ranges:

```typescript
// Adjust frequency ranges in analyzeFrequencies()
const lowFreq = getFrequencyRange(80, 300);     // Modify range
const midLowFreq = getFrequencyRange(300, 800); // Modify range

// Adjust lerp speed for transitions
child.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(
    currentValue,
    weight,
    0.4 // Increase for faster response, decrease for smoother
);
```

## 🐛 Debugging

### Opening Browser Console

**Windows/Linux**: Press `F12`  
**Mac**: 
- Chrome/Edge: `Cmd + Option + J`
- Safari: `Cmd + Option + C` (enable Developer menu first in Settings)
- Firefox: `Cmd + Option + K`
- Or **Right-click** → **Inspect** → **Console** tab

### Console Logs

The console provides detailed real-time information:

#### Voice Activity Detection (VAD)
```
✅ Recording started with VAD
👂 Starting audio level monitoring with threshold: -45 dB
📊 Audio level: -25.34 dB (threshold: -45 dB) | Average: 18.56
🎤 Voice detected! Level: -28.15 dB
🤫 Silence detected (-52.30 dB), starting countdown...
⏹️ Silence timeout fired! Stopping recording...
✅ Calling stop on mediaRecorder
📹 MediaRecorder onstop event fired
✅ Recording stopped successfully. Blob will be sent.
```

#### Chat & TTS
- **Voice Input**: "Transcription successful: ...", "Audio blob ready, sending message..."
- **TTS**: "Generating speech for: ...", "✅ Audio playing successfully"
- **Lip Sync**: "Audio routing connected: element -> analyser → destination"

## 🔧 Common Issues

### Voice Detection Not Working (Conversation Mode)

#### Issue: "Waiting for speech..." but voice not detected

**Diagnosis**: Check console for audio levels
```
📊 Audio level: -XX dB (threshold: -45 dB)
```

**Solutions**:
1. **Levels too low** (below -45 dB when speaking):
   - Increase your system microphone volume
   - Speak louder or closer to microphone
   - Check correct microphone is selected in system settings

2. **Levels too high** (above -45 dB when silent):
   - Background noise is interfering
   - Move to quieter environment
   - Adjust threshold in `components/UI.tsx`:
   ```typescript
   silenceThreshold: -40, // Less sensitive (requires louder speech)
   ```

3. **Use Manual Override**: Click the 🟠 **orange send button** to manually stop recording

#### Issue: Recording doesn't auto-stop

**Solutions**:
- Pause longer (need 1.5 seconds of silence)
- Use manual send button as backup
- Adjust `silenceDuration` in `components/UI.tsx`:
```typescript
silenceDuration: 2500, // Wait 2.5 seconds instead
```

#### Issue: Recording stops too early

**Solution**: Increase silence duration in `components/UI.tsx`:
```typescript
silenceDuration: 3000, // Wait 3 seconds before auto-sending
```

### Microphone Not Working
- **Permission Denied**: Check browser settings and allow microphone access
- **No Recording**: Ensure you're using HTTPS or localhost (required for MediaRecorder API)
- **Silent Recording**: Check your system microphone settings and select the correct input device
- **Browser Compatibility**: Use Chrome, Edge, or Firefox (Safari may have limitations)
- **No Prompt**: Clear browser cache and reload

### Voice Transcription Fails
- Verify OpenAI API key is valid and has Whisper API access
- Check that audio blob size is > 0 in console logs
- Ensure you speak for at least 1-2 seconds before stopping
- Check network tab for `/api/stt` request/response

### No Audio Playing (TTS)
- Check that your browser allows autoplay with user interaction
- Verify OpenAI API key is valid
- Check browser console for errors
- Ensure audio element is properly connected to Web Audio API
- Try turning up your device volume

### Lip Sync Not Working
- Verify audio is playing first (check console for "✅ Audio playing successfully")
- Check that Web Audio API connection is established
- Try adjusting sensitivity in `Avatar.tsx` (lower value = more sensitive)

### Streaming Not Working
- Verify API route is returning streaming response
- Check network tab in DevTools for chunked transfer encoding
- Ensure `/api/chat` route has `stream: true` enabled

## 🔧 Configuration

### Adjusting Voice Activity Detection (VAD)

Edit `components/UI.tsx` to customize VAD sensitivity:

```typescript
useAudioRecording({
    autoStopOnSilence: conversationMode,
    silenceThreshold: -45,  // dB level (lower = more sensitive)
                            // -40: Less sensitive (louder speech required)
                            // -50: More sensitive (quieter speech detected)
                            // -60: Very sensitive (may pick up background noise)
    silenceDuration: 1500,  // Milliseconds of silence before auto-send
                            // 1000: Quick response (1 second)
                            // 2000: Normal (2 seconds)
                            // 3000: Patient (3 seconds)
})
```

**Finding Your Optimal Settings:**

1. Open browser console (`Cmd + Option + J` on Mac)
2. Watch the audio level logs: `📊 Audio level: -XX dB`
3. Note your levels when:
   - Speaking normally: (example: -25 to -35 dB)
   - Silent/background noise: (example: -48 to -55 dB)
4. Set `silenceThreshold` between these values
5. Adjust `silenceDuration` based on your speaking pace

**Example Scenarios:**

- **Quiet office**: `silenceThreshold: -50, silenceDuration: 1500`
- **Noisy environment**: `silenceThreshold: -35, silenceDuration: 2000`
- **Soft speaker**: `silenceThreshold: -55, silenceDuration: 2500`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (`OPENAI_API_KEY`)
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆕 What's New

### Version 3.0 - Continuous Voice Conversation 🎙️

**Revolutionary Voice Experience:**
- 🎤 **Conversation Mode**: Hands-free, continuous voice interaction (enabled by default)
- 🤖 **Voice Activity Detection (VAD)**: Automatic detection of speech start/stop using Web Audio API
- 🔄 **Auto-Restart Listening**: Seamlessly continues conversation after avatar responds
- 📊 **Real-time Audio Analysis**: Frequency analysis with configurable sensitivity (-45 dB threshold)
- 🟠 **Manual Override**: Orange send button for manual control when needed
- 🎚️ **Adaptive Thresholds**: Automatically adjusts to your environment and voice level
- 🔍 **Debug Logging**: Comprehensive console logs for troubleshooting VAD
- 💚 **Mode Indicator**: Visual feedback showing conversation mode status
- ⚡ **Smart Silence Detection**: 1.5-second pause triggers auto-send

**Technical Implementation:**
- Web Audio API integration with AnalyserNode
- Frequency analysis (2048 FFT size) for voice detection
- Real-time dB calculation from frequency data
- Configurable silence threshold and duration
- Automatic cleanup and resource management
- Callback system for speech end events

### Version 2.0 - Major Improvements

**Landing Page:**
- ✨ Professional hero section with compelling pitch
- 📊 Feature cards highlighting key capabilities
- 📈 Stats section showing platform benefits
- 🎨 Gradient designs and modern glassmorphism UI
- 🔄 Smooth animations and transitions

**Avatar Enhancements:**
- 👤 Upgraded to higher quality Ready Player Me model (2048px textures)
- 💡 Professional 3-point lighting setup
- 🎭 Enhanced materials with better reflections
- 🌊 Floating animation on landing page
- 👁️ Improved shadows and depth

**Lip Sync Improvements:**
- 🎵 Advanced frequency analysis (2048 FFT size)
- 🗣️ Phoneme-based viseme mapping
- 📊 Multi-range frequency detection (4 bands)
- 🎯 16+ viseme targets for realistic mouth shapes
- ⚡ Smoother transitions with decay system
- 🔊 Better audio responsiveness

**UI/UX Polish:**
- 🎨 Gradient backgrounds throughout
- 💎 Enhanced glassmorphism effects
- ⚡ Smooth animations and hover effects
- 📱 Better responsive design
- 🎯 Improved visual feedback
- 🎪 Custom scrollbar styling
- ✨ Transform effects on interactions

## 🙏 Acknowledgments

- [Ready Player Me](https://readyplayer.me/) for the 3D avatar model
- [OpenAI](https://openai.com/) for GPT-4 and TTS APIs
- [Pmndrs](https://pmnd.rs/) for React Three Fiber ecosystem
