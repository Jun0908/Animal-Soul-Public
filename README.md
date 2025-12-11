# 🦜 Animal Voice Agent (Phase 0 Demo)

This project is a hackathon-ready prototype that generates **English speech in animal-inspired voices** (Dog / Parrot) using ElevenLabs TTS. Phase 0 focuses on a working UI + backend TTS pipeline while leaving real machine-learning-based parrot voice conversion for future phases.

---

## 🚀 Features

* 🎤 **English-to-animal-style voice** using ElevenLabs expressive TTS
* 🦜 **Parrot-inspired voice** (Phase 0 styling)
* 🐶 **Dog-inspired voice** option
* 🔈 Optional ambient SFX layering (parrot chirps, dog panting)
* ⚡ Real-time generation
* 🌐 Built with **Next.js (App Router)** + TypeScript + Tailwind CSS

---

## 📁 Project Structure

```
project-root/
  .env.local
  app/
    api/
      speak/
        route.ts
    page.tsx
  lib/
    elevenlabs.ts
  public/
    sfx/
      parrot-ambience.mp3
      dog-ambience.mp3
```

---

## 🔧 Setup

### 1. Install dependencies

```
npm install
```

### 2. Add API keys to `.env.local`

```
ELEVENLABS_API_KEY=your_key_here
```

---

## 🗣️ API Endpoint: `/api/speak`

Handles TTS generation via ElevenLabs.

### Request

```json
{
  "text": "Hello!",
  "voiceType": "dog" | "parrot"
}
```

### Response

```json
{
  "audioUrl": "data:audio/mpeg;base64,...",
  "transcript": "Hello!"
}
```

---

## 🖥️ Frontend Overview (`app/page.tsx`)

* Voice selector (Dog / Parrot)
* Textarea for prompt
* Generate button
* Playback area with audio player + transcript
* Optional ambient background SFX

---

## 🎶 Phase 0 Parrot Voice Strategy

Phase 0 focuses on **fast demo delivery**, so instead of training a VC model, we:

1. Use ElevenLabs TTS with expressive tuning
2. Add slight pitch adjustments (optional)
3. Add ambient parrot SFX for realism

Future phases will add:

* Real ML-based voice conversion (H2NH-VC, So-VITS-SVC)
* True parrot acoustic modeling
* Animal-to-human communication experiments

---

## 🧪 Future Work (Phase 1+)

* Train real parrot voice conversion with:

  * So-VITS-SVC 4.0
  * H2NH-VC architecture
  * Bird datasets (Xeno-canto, Macaulay Library)
* Build Python VC microservice behind `/api/speak`
* Add dolphin, crow, raven agents

---

## 📜 License

MIT

---

## 🙌 Acknowledgements

* ElevenLabs TTS
* Bird sound datasets (Xeno-Canto, Macaulay Library)
* Community SVC models

---

## 💡 Notes

This repository represents Phase 0 of the project: working prototype first, real ML pipeline later.

For issues or feature ideas, open a PR or contact the maintainer.

