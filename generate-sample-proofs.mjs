import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('public/sample-proofs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Generating realistic sample specimen proof images for testing...');

const samples = [
  {
    filename: '01-rough-tree-bark.jpg',
    label: 'Rough Tree Bark',
    description: 'Textured brown tree bark on a living tree trunk',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="barkGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#4a2e18"/>
            <stop offset="20%" stop-color="#654321"/>
            <stop offset="40%" stop-color="#3d2314"/>
            <stop offset="60%" stop-color="#5a3820"/>
            <stop offset="80%" stop-color="#654321"/>
            <stop offset="100%" stop-color="#4a2e18"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#barkGradient)"/>
        <!-- Organic wooden ridges and fissures -->
        <g stroke="#2c180b" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.85">
          <path d="M 30 -10 C 50 120, 20 250, 40 410" />
          <path d="M 90 -10 C 70 100, 110 230, 85 410" />
          <path d="M 150 -10 C 170 130, 130 260, 160 410" />
          <path d="M 210 -10 C 190 90, 230 220, 200 410" />
          <path d="M 270 -10 C 290 140, 260 270, 280 410" />
          <path d="M 330 -10 C 310 110, 350 240, 320 410" />
          <path d="M 380 -10 C 360 80, 390 220, 370 410" />
        </g>
        <g stroke="#7c5335" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.75">
          <path d="M 40 -10 C 60 130, 30 240, 50 410" />
          <path d="M 100 -10 C 80 110, 120 220, 95 410" />
          <path d="M 160 -10 C 180 120, 140 250, 170 410" />
          <path d="M 220 -10 C 200 100, 240 210, 210 410" />
          <path d="M 280 -10 C 300 130, 270 260, 290 410" />
          <path d="M 340 -10 C 320 120, 360 230, 330 410" />
        </g>
        <!-- Horizontal bark knots and textured cross fissures -->
        <g stroke="#1e0f07" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8">
          <path d="M 20 70 Q 60 80 90 70" />
          <path d="M 140 100 Q 180 110 220 95" />
          <path d="M 260 80 Q 300 90 340 75" />
          <path d="M 50 200 Q 90 210 130 195" />
          <path d="M 180 230 Q 220 240 260 225" />
          <path d="M 290 210 Q 330 220 370 205" />
          <path d="M 30 330 Q 70 340 110 325" />
          <path d="M 150 350 Q 190 360 230 345" />
          <path d="M 270 340 Q 310 350 350 335" />
        </g>
      </svg>
    `
  },
  {
    filename: '02-green-leaf-veins.jpg',
    label: 'Green Leaf with Visible Veins',
    description: 'Close up photo of a fresh green plant leaf showing rib veins',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#43a047"/>
            <stop offset="50%" stop-color="#2e7d32"/>
            <stop offset="100%" stop-color="#1b5e20"/>
          </linearGradient>
        </defs>
        <!-- Background nature blur -->
        <rect width="400" height="400" fill="#254d28"/>
        <!-- Large Leaf Body -->
        <path d="M 200 30 C 330 100 360 270 200 380 C 40 270 70 100 200 30 Z" fill="url(#leafGrad)" stroke="#1b5e20" stroke-width="4"/>
        <!-- Central Primary Vein (Midrib) -->
        <path d="M 200 30 Q 198 200 200 380" stroke="#a5d6a7" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- Secondary Lateral Branching Veins -->
        <g stroke="#a5d6a7" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9">
          <!-- Left branch veins -->
          <path d="M 199 80 Q 140 100 110 115"/>
          <path d="M 199 130 Q 130 150 90 170"/>
          <path d="M 199 180 Q 120 200 80 225"/>
          <path d="M 199 230 Q 125 250 85 275"/>
          <path d="M 199 280 Q 135 300 110 325"/>
          <path d="M 200 330 Q 160 345 140 360"/>
          <!-- Right branch veins -->
          <path d="M 201 80 Q 260 100 290 115"/>
          <path d="M 201 130 Q 270 150 310 170"/>
          <path d="M 201 180 Q 280 200 320 225"/>
          <path d="M 201 230 Q 275 250 315 275"/>
          <path d="M 201 280 Q 265 300 290 325"/>
          <path d="M 200 330 Q 240 345 260 360"/>
        </g>
      </svg>
    `
  },
  {
    filename: '03-smooth-river-stone.jpg',
    label: 'Smooth River Pebble',
    description: 'Smooth rounded grey stone or river pebble resting outdoors',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sandGround" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#b09b82"/>
            <stop offset="100%" stop-color="#8c775f"/>
          </radialGradient>
          <radialGradient id="pebbleGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#b0bec5"/>
            <stop offset="45%" stop-color="#78909c"/>
            <stop offset="85%" stop-color="#455a64"/>
            <stop offset="100%" stop-color="#263238"/>
          </radialGradient>
        </defs>
        <!-- Riverbank sandy soil background -->
        <rect width="400" height="400" fill="url(#sandGround)"/>
        <!-- Ground texture dots -->
        <g fill="#6d5c48" opacity="0.4">
          <circle cx="50" cy="80" r="4"/>
          <circle cx="340" cy="110" r="5"/>
          <circle cx="80" cy="330" r="6"/>
          <circle cx="310" cy="320" r="5"/>
          <circle cx="280" cy="60" r="3"/>
        </g>
        <!-- Pebble Cast Shadow -->
        <ellipse cx="205" cy="245" rx="135" ry="95" fill="#30241b" opacity="0.6"/>
        <!-- Main Smooth Oval River Pebble -->
        <ellipse cx="200" cy="210" rx="130" ry="90" fill="url(#pebbleGrad)"/>
        <!-- Soft Specular Reflection Rim on Top Edge -->
        <path d="M 110 180 C 130 140 250 140 280 175 C 240 160 150 160 110 180 Z" fill="#cfd8dc" opacity="0.6"/>
      </svg>
    `
  },
  {
    filename: '04-fallen-y-twig.jpg',
    label: 'Fallen Y-Branch Twig',
    description: 'Fallen wooden tree twig with two branches forming a Y shape',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="twigBark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#8d6e63"/>
            <stop offset="50%" stop-color="#5d4037"/>
            <stop offset="100%" stop-color="#3e2723"/>
          </linearGradient>
        </defs>
        <!-- Earthy forest soil background -->
        <rect width="400" height="400" fill="#423326"/>
        <g fill="#2e2117" opacity="0.5">
          <circle cx="80" cy="70" r="12"/>
          <circle cx="320" cy="120" r="16"/>
          <circle cx="90" cy="310" r="15"/>
        </g>
        <!-- Twig Shadow -->
        <path d="M 205 385 L 205 225 L 95 85 M 205 225 L 315 75" stroke="#1f1610" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        <!-- Main Stem of the Y-Branch -->
        <path d="M 200 380 L 200 220" stroke="url(#twigBark)" stroke-width="20" stroke-linecap="round"/>
        <!-- Left Arm of the Y -->
        <path d="M 200 220 L 90 80" stroke="url(#twigBark)" stroke-width="16" stroke-linecap="round"/>
        <!-- Right Arm of the Y -->
        <path d="M 200 220 L 310 70" stroke="url(#twigBark)" stroke-width="16" stroke-linecap="round"/>
        <!-- Branch knots and wooden texture rings -->
        <circle cx="200" cy="220" r="12" fill="#3e2723"/>
        <circle cx="145" cy="150" r="8" fill="#4e342e"/>
        <circle cx="255" cy="145" r="8" fill="#4e342e"/>
      </svg>
    `
  },
  {
    filename: '05-yellow-dandelion.jpg',
    label: 'Wild Yellow Dandelion Blossom',
    description: 'Bright yellow dandelion flower blossom outdoors in green grass',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="flowerPetals" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff176"/>
            <stop offset="40%" stop-color="#fdd835"/>
            <stop offset="85%" stop-color="#fbc02d"/>
            <stop offset="100%" stop-color="#f57f17"/>
          </radialGradient>
        </defs>
        <!-- Green Lawn Grass Background -->
        <rect width="400" height="400" fill="#2e7d32"/>
        <g stroke="#1b5e20" stroke-width="4" opacity="0.6">
          <line x1="30" y1="400" x2="50" y2="280"/>
          <line x1="80" y1="400" x2="70" y2="250"/>
          <line x1="320" y1="400" x2="310" y2="270"/>
          <line x1="360" y1="400" x2="380" y2="260"/>
          <line x1="120" y1="400" x2="140" y2="300"/>
        </g>
        <!-- Flower Stem -->
        <path d="M 200 200 Q 195 290 190 400" stroke="#7cb342" stroke-width="12" stroke-linecap="round" fill="none"/>
        <!-- Radiating Yellow Dandelion Petals -->
        <g fill="url(#flowerPetals)" stroke="#f57f17" stroke-width="1.5">
          <!-- Outer circle of petals -->
          ${Array.from({ length: 24 })
            .map((_, i) => {
              const angle = (i * 360) / 24;
              return `<ellipse cx="200" cy="200" rx="20" ry="90" transform="rotate(${angle} 200 200)"/>`;
            })
            .join('\n')}
          <!-- Middle circle of petals -->
          ${Array.from({ length: 18 })
            .map((_, i) => {
              const angle = (i * 360) / 18 + 10;
              return `<ellipse cx="200" cy="200" rx="16" ry="65" transform="rotate(${angle} 200 200)"/>`;
            })
            .join('\n')}
        </g>
        <!-- Golden Center -->
        <circle cx="200" cy="200" r="32" fill="#f57f17" stroke="#e65100" stroke-width="2"/>
        <circle cx="200" cy="200" r="22" fill="#fff59d"/>
      </svg>
    `
  },
  {
    filename: '06-distractor-indoor-laptop.jpg',
    label: 'Indoor Office Laptop (Distractor)',
    description: 'A modern laptop computer on an indoor wooden office desk',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Modern Indoor Office Wall & Desk -->
        <rect width="400" height="240" fill="#eceff1"/>
        <rect y="240" width="400" height="160" fill="#cfd8dc"/>
        <!-- Laptop Screen Body -->
        <rect x="70" y="50" width="260" height="170" rx="8" fill="#37474f"/>
        <!-- Glowing Display Screen with Code/Windows -->
        <rect x="82" y="62" width="236" height="146" rx="4" fill="#1e1e1e"/>
        <!-- Screen Content Lines -->
        <g fill="#4fc3f7" opacity="0.8">
          <rect x="95" y="75" width="80" height="8" rx="2"/>
          <rect x="95" y="92" width="120" height="8" rx="2"/>
          <rect x="110" y="108" width="100" height="8" rx="2"/>
          <rect x="110" y="124" width="70" height="8" rx="2"/>
          <rect x="95" y="140" width="140" height="8" rx="2"/>
        </g>
        <!-- Laptop Keyboard Base (Perspective) -->
        <path d="M 50 240 L 350 240 L 380 290 L 20 290 Z" fill="#78909c" stroke="#546e7a" stroke-width="2"/>
        <!-- Keyboard Keys Island -->
        <path d="M 70 245 L 330 245 L 350 275 L 50 275 Z" fill="#263238"/>
        <!-- Trackpad -->
        <rect x="160" y="278" width="80" height="10" rx="2" fill="#90a4ae"/>
      </svg>
    `
  },
  {
    filename: '07-distractor-red-car.jpg',
    label: 'Red Automobile Vehicle (Distractor)',
    description: 'A shiny red car motor vehicle parked on grey asphalt',
    svg: `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Sky and Asphalt Road -->
        <rect width="400" height="250" fill="#90caf9"/>
        <rect y="250" width="400" height="150" fill="#37474f"/>
        <!-- Car Cabin / Roof -->
        <path d="M 120 180 L 160 110 L 250 110 L 290 180 Z" fill="#b71c1c"/>
        <!-- Car Windshield & Windows -->
        <path d="M 165 118 L 198 118 L 198 172 L 132 172 Z" fill="#e1f5fe"/>
        <path d="M 204 118 L 245 118 L 278 172 L 204 172 Z" fill="#e1f5fe"/>
        <!-- Car Main Body -->
        <rect x="50" y="175" width="300" height="75" rx="15" fill="#d32f2f"/>
        <!-- Headlights -->
        <rect x="330" y="190" width="18" height="15" rx="4" fill="#fff59d"/>
        <rect x="52" y="190" width="15" height="15" rx="4" fill="#ff7043"/>
        <!-- Car Wheels -->
        <circle cx="120" cy="250" r="32" fill="#212121"/>
        <circle cx="120" cy="250" r="16" fill="#9e9e9e"/>
        <circle cx="280" cy="250" r="32" fill="#212121"/>
        <circle cx="280" cy="250" r="16" fill="#9e9e9e"/>
      </svg>
    `
  }
];

async function generate() {
  for (const s of samples) {
    const targetFile = path.join(OUTPUT_DIR, s.filename);
    const svgBuffer = Buffer.from(s.svg.trim());
    await sharp(svgBuffer)
      .jpeg({ quality: 92 })
      .toFile(targetFile);
    console.log(`✓ Generated ${s.filename} (${s.label})`);
  }
  console.log(`\nSuccessfully created all ${samples.length} specimen images in ${OUTPUT_DIR}!`);
}

generate();
