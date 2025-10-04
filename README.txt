Bear Paw Studio — Preview Website
---------------------------------

What's included:
- index.html        (main preview page)
- style.css         (styling)
- script.js         (audio + animation logic)
- assets/track.mp3  (placeholder path - you must add your own audio file here)

How to preview locally:
1. Unzip the package.
2. Put your chosen audio file at assets/track.mp3 (same filename) or adjust the <audio> src in index.html.
3. Open index.html in a modern desktop browser (Chrome, Edge, Firefox). Mobile browsers often restrict autoplay.
4. Click "Play / Resume" if the browser blocks autoplay.

Notes about autoplay:
- Many browsers block autoplay of audio. If the audio doesn't start automatically, click "Play / Resume".
- The VU meters are powered by the Web Audio API and will respond to the audio file when it plays.

Deployment:
- To publish online, push the folder to GitHub and enable GitHub Pages (or use Netlify/Vercel for easy deploy).
- If you'd like, I can provide step-by-step instructions for deploying to GitHub Pages.

Want adjustments?
- I can convert the header into a React component, hook the meters to a live microphone input, or swap in your exact SVG logo paths.
