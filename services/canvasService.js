const { createCanvas, loadImage, registerFont } = require('canvas');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ======= Helper: download font =======
// Note: Fonts are now loaded dynamically from Google Fonts when needed


async function loadGoogleFont(url, family) {
    try {
        // Create safe filename by replacing spaces with dashes
        const safeFileName = family.replace(/\s+/g, '-');
        const fontPath = path.join(__dirname, `${safeFileName}.ttf`);
        
        // Skip if font already exists
        if (fs.existsSync(fontPath)) {
            registerFont(fontPath, { family });
            console.log(`✅ Font '${family}' already exists, registered from cache`);
            return;
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch font ${family} (HTTP ${res.status})`);
        const fontBuffer = await res.arrayBuffer();
        fs.writeFileSync(fontPath, Buffer.from(fontBuffer));
        registerFont(fontPath, { family });
        console.log(`✅ Font '${family}' downloaded and registered`);
    } catch (err) {
        console.error(`❌ Font '${family}' gagal diload:`, err.message);
    }
}

// ======= Helper: roundRect =======
function roundRect(ctx, x, y, width, height, radii) {
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    const [tl, tr, br, bl] = radii;
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + width - tr, y);
    if (tr > 0) ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
    ctx.lineTo(x + width, y + height - br);
    if (br > 0) ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    ctx.lineTo(x + bl, y + height);
    if (bl > 0) ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
    ctx.lineTo(x, y + tl);
    if (tl > 0) ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.closePath();
}

function drawStar(ctx, x, y, r1, r2, n) {
    const angle = Math.PI / n;
    ctx.beginPath();
    for (let i = 0; i < 2 * n; i++) {
        const r = i % 2 === 0 ? r2 : r1;
        const a = i * angle;
        const sx = x + Math.cos(a) * r;
        const sy = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
}

// ======= Main Function =======
async function generateSuccessCard(params, options = {}) {
    const {
        user = '@80775651303442',
        imageurl = 'https://files.catbox.moe/5lzdmq.png',
        datetime = 'Minggu, 12 Oktober 2025 18:19:14 WIB',
        status = 'Done',
        owner = 'https://wa.me/6285143569870'
    } = params;

    const { width = 800, height = 600, format = 'png', quality = 0.9 } = options;

    // === Load fonts dynamically ===
    await Promise.all([
        loadGoogleFont('https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf', 'Poppins'),
        loadGoogleFont('https://github.com/google/fonts/raw/main/ofl/quicksand/Quicksand-Bold.ttf', 'Quicksand'),
        loadGoogleFont('https://github.com/google/fonts/raw/main/ofl/caveatbrush/CaveatBrush-Regular.ttf', 'Caveat Brush'),
        loadGoogleFont('https://github.com/google/fonts/raw/main/ofl/bitcountgrid/BitcountGridSingle-Regular.ttf', 'Bitcount Grid Single')
    ]);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // === Background ===
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgb(59, 130, 246)');
    bgGradient.addColorStop(1, 'rgb(16, 185, 129)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // === Stars ===
    ctx.fillStyle = 'rgba(220,38,38,0.7)';
    drawStar(ctx, 45, 180, 12, 25, 4); ctx.fill();
    drawStar(ctx, 35, 350, 8, 18, 4); ctx.fill();
    drawStar(ctx, 750, 240, 14, 28, 4); ctx.fill();

    // === Card ===
    const cardX = 80;
    const cardY = 90;
    const cardWidth = 650;

    const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + 300);
    grad.addColorStop(0, 'rgb(250, 204, 21)');
    grad.addColorStop(1, 'rgb(34, 197, 94)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardWidth, 300, 50);
    ctx.fill();
    ctx.stroke();

    // === Header ===
    ctx.fillStyle = 'white';
    roundRect(ctx, cardX + 150, cardY - 30, 350, 70, 50);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = 'bold 34px "Bitcount Grid Single"';
    ctx.fillText('PESANAN SELESAI', cardX + 175, cardY + 20);

    // === Avatar ===
    try {
        const avatar = await loadImage(imageurl);
        const size = 140;
        const x = 110, y = 90;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, x - size / 2, y - size / 2, size, size);
        ctx.restore();
    } catch {
        console.warn("⚠️ Avatar gagal dimuat");
    }

    // === Texts ===
    ctx.fillStyle = 'rgb(220,38,38)';
    ctx.font = 'bold 22px "Caveat Brush"';
    ctx.fillText('USER', cardX + 100, cardY + 110);

    ctx.fillStyle = 'black';
    ctx.font = '20px "Caveat Brush"';
    ctx.fillText(user, cardX + 250, cardY + 110);

    ctx.fillStyle = 'rgb(220,38,38)';
    ctx.font = 'bold 22px "Caveat Brush"';
    ctx.fillText('TANGGAL', cardX + 100, cardY + 170);

    ctx.fillStyle = 'black';
    ctx.font = '20px "Caveat Brush"';
    ctx.fillText(datetime, cardX + 250, cardY + 170);

    // === Status ===
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.font = 'bold 56px "Bitcount Grid Single"';
    ctx.strokeText(status, cardX + cardWidth / 2 + 20, cardY + 280);
    ctx.fillStyle = 'rgb(34,197,94)';
    ctx.fillText(status, cardX + cardWidth / 2 + 20, cardY + 280);

    // === Owner box ===
    ctx.fillStyle = 'rgb(52,211,153)';
    ctx.strokeStyle = 'black';
    roundRect(ctx, 120, 480, 580, 70, 40);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = 'bold 25px "Quicksand"';
    ctx.textAlign = 'left';
    ctx.fillText('OWNER : ' + owner, 160, 520);

    // === Output ===
    if (format === 'jpeg') return canvas.toBuffer('image/jpeg', { quality });
    return canvas.toBuffer('image/png');
}

module.exports = { generateSuccessCard };
