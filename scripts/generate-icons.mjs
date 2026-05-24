import { Jimp } from 'jimp'

async function createIcon(size, filename) {
  const img = new Jimp({ width: size, height: size, color: 0x0F0F0FFF })
  const accentColor = 0xE91E8CFF
  const borderSize = Math.floor(size * 0.04)

  // Border
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (x < borderSize || x >= size - borderSize || y < borderSize || y >= size - borderSize) {
        img.setPixelColor(accentColor, x, y)
      }
    }
  }

  // Filled center square in pink
  const pad = Math.floor(size * 0.2)
  const inner = size - pad * 2
  for (let x = pad; x < pad + inner; x++) {
    for (let y = pad; y < pad + inner; y++) {
      img.setPixelColor(accentColor, x, y)
    }
  }

  // Dark inner
  const pad2 = Math.floor(size * 0.25)
  const inner2 = size - pad2 * 2
  for (let x = pad2; x < pad2 + inner2; x++) {
    for (let y = pad2; y < pad2 + inner2; y++) {
      img.setPixelColor(0x0F0F0FFF, x, y)
    }
  }

  // Horizontal bar for "T"
  const barH = Math.floor(size * 0.08)
  const midY = Math.floor(size * 0.38)
  const leftX = Math.floor(size * 0.28)
  const rightX = Math.floor(size * 0.55)
  for (let x = leftX; x < rightX; x++) {
    for (let y = midY; y < midY + barH; y++) {
      img.setPixelColor(accentColor, x, y)
    }
  }
  // Vertical bar of T
  const vx = Math.floor((leftX + rightX) / 2) - Math.floor(barH / 2)
  for (let x = vx; x < vx + barH; x++) {
    for (let y = midY; y < Math.floor(size * 0.62); y++) {
      img.setPixelColor(accentColor, x, y)
    }
  }

  // F letter (right side)
  const fx = Math.floor(size * 0.58)
  const fTopY = Math.floor(size * 0.38)
  const fBotY = Math.floor(size * 0.62)
  // Vertical
  for (let x = fx; x < fx + barH; x++) {
    for (let y = fTopY; y < fBotY; y++) {
      img.setPixelColor(0xFFFFFFFF, x, y)
    }
  }
  // Top horizontal
  for (let x = fx; x < Math.floor(size * 0.72); x++) {
    for (let y = fTopY; y < fTopY + barH; y++) {
      img.setPixelColor(0xFFFFFFFF, x, y)
    }
  }
  // Mid horizontal
  const fMidY = Math.floor((fTopY + fBotY) / 2) - Math.floor(barH / 2)
  for (let x = fx; x < Math.floor(size * 0.70); x++) {
    for (let y = fMidY; y < fMidY + barH; y++) {
      img.setPixelColor(0xFFFFFFFF, x, y)
    }
  }

  await img.write(filename)
  console.log(`Created ${filename}`)
}

await createIcon(192, 'public/icon-192.png')
await createIcon(512, 'public/icon-512.png')
console.log('Done!')
