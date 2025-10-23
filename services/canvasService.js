const { createCanvas, loadImage, registerFont } = require('canvas');
const fetch = require('node-fetch');

// Helper function to draw rounded rectangle
function roundRect(ctx, x, y, width, height, radii) {
    if (typeof radii === 'number') {
        radii = [radii, radii, radii, radii];
    }
    
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

// Helper function to draw star
function drawStar(ctx, x, y, radius1, radius2, npoints) {
    const angle = (Math.PI * 2) / npoints;
    const halfAngle = angle / 2.0;
    
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += angle) {
        let sx = x + Math.cos(a) * radius2;
        let sy = y + Math.sin(a) * radius2;
        ctx.lineTo(sx, sy);
        sx = x + Math.cos(a + halfAngle) * radius1;
        sy = y + Math.sin(a + halfAngle) * radius1;
        ctx.lineTo(sx, sy);
    }
    ctx.closePath();
}

// Generate success card image
async function generateSuccessCard(params, options = {}) {
    const {
        user = '@80775651303442',
        imageurl = 'https://files.catbox.moe/5lzdmq.png',
        datetime = 'Minggu, 12 Oktober 2025    18:19:14 WIB',
        status = 'Done',
        owner = 'https://wa.me/6285143569870'
    } = params;

    const {
        width = 800,
        height = 600,
        format = 'png',
        quality = 0.9
    } = options;

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    try {
        // Draw background gradient (blue to green)
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, 'rgb(59, 130, 246)');
        bgGradient.addColorStop(1, 'rgb(16, 185, 129)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw stars
        drawStars(ctx);

        // Draw main card
        await drawMainCard(ctx, { user, imageurl, datetime, status });

        // Draw owner section
        drawOwnerSection(ctx, owner);

        // Return buffer
        if (format === 'jpeg') {
            return canvas.toBuffer('image/jpeg', { quality });
        } else {
            return canvas.toBuffer('image/png');
        }
    } catch (error) {
        console.error('Canvas generation error:', error);
        throw new Error(`Failed to generate card: ${error.message}`);
    }
}

function drawStars(ctx) {
    ctx.fillStyle = 'rgba(220, 38, 38, 0.78)';
    
    // Left side stars
    drawStar(ctx, 45, 180, 12, 25, 4);
    ctx.fill();
    
    drawStar(ctx, 35, 350, 8, 18, 4);
    ctx.fill();
    
    // Right side stars
    ctx.fillStyle = 'rgba(220, 38, 38, 0.71)';
    drawStar(ctx, 735, 80, 10, 22, 4);
    ctx.fill();
    
    drawStar(ctx, 750, 240, 14, 28, 4);
    ctx.fill();
    
    drawStar(ctx, 740, 450, 9, 20, 4);
    ctx.fill();
    
    // Additional decorative stars
    ctx.fillStyle = 'rgba(220, 38, 38, 0.47)';
    drawStar(ctx, 760, 350, 6, 14, 4);
    ctx.fill();
}

async function drawMainCard(ctx, params) {
    const { user, imageurl, datetime, status } = params;
    
    const cardX = 80;
    const cardY = 90;
    const cardWidth = 650;
    const avatarSize = 140;

    // Create gradient for card (55 degrees, yellow to green)
    const angle = 55 * (Math.PI / 180);
    const gradientLength = Math.sqrt(cardWidth * cardWidth + 300 * 300);
    const x1 = cardX + cardWidth / 2 - Math.cos(angle) * gradientLength / 2;
    const y1 = cardY + 150 - Math.sin(angle) * gradientLength / 2;
    const x2 = cardX + cardWidth / 2 + Math.cos(angle) * gradientLength / 2;
    const y2 = cardY + 150 + Math.sin(angle) * gradientLength / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, 'rgb(250, 204, 21)');
    gradient.addColorStop(1, 'rgb(34, 197, 94)');

    // Draw card sections
    ctx.fillStyle = gradient;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 2;

    // Top section
    roundRect(ctx, cardX, cardY, cardWidth, 130, [0, 50, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Middle section
    ctx.fillRect(cardX, cardY + 130, cardWidth, 80);
    ctx.strokeRect(cardX, cardY + 130, cardWidth, 80);

    // Bottom section
    roundRect(ctx, cardX, cardY + 210, cardWidth, 170, [0, 0, 0, 50]);
    ctx.fill();
    ctx.stroke();

    // Header with PESANAN SELESAI
    ctx.fillStyle = 'white';
    roundRect(ctx, cardX + 150, cardY - 30, 350, 70, 50);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = 'bold 34px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PESANAN SELESAI', cardX + 175, cardY + 10);

    // Load and draw success badge
    try {
        const badgeImg = await loadImage('https://files.catbox.moe/vws5b2.jpg');
        const badgeSize = avatarSize - 50;
        const badgeX = cardX + 530;
        const badgeY = cardY + 270;

        ctx.save();
        ctx.translate(badgeX, badgeY);
        ctx.rotate((25 * Math.PI) / 180);
        
        // Clip to circle
        ctx.beginPath();
        ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.drawImage(badgeImg, -badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize);
        ctx.restore();
    } catch (error) {
        console.error('Failed to load badge:', error);
    }

    // USER section
    ctx.fillStyle = 'rgb(220, 38, 38)';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('USER', cardX + 100, cardY + 110);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(user, cardX + 250, cardY + 110);

    // TANGGAL section
    ctx.fillStyle = 'rgb(220, 38, 38)';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('TANGGAL', cardX + 100, cardY + 170);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(datetime, cardX + 250, cardY + 170);

    // PRODUK section
    ctx.fillStyle = 'rgb(220, 38, 38)';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('PRODUK', cardX + 100, cardY + 280);

    // Product text with white outline and green fill
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.strokeText(status, cardX + cardWidth / 2 + 20, cardY + 280);
    ctx.fillStyle = 'rgb(34, 197, 94)';
    ctx.fillText(status, cardX + cardWidth / 2 + 20, cardY + 280);

    // Load and draw avatar
    try {
        const avatarImg = await loadImage(imageurl);
        const avatarX = 110;
        const avatarY = 90;

        // Draw white circle background
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw avatar with circular clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2 - 3, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX - avatarSize / 2 + 3, avatarY - avatarSize / 2 + 3, avatarSize - 6, avatarSize - 6);
        ctx.restore();

        // Draw avatar border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
        ctx.stroke();
    } catch (error) {
        console.error('Failed to load avatar:', error);
        // Draw placeholder circle
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(110, 90, avatarSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawOwnerSection(ctx, owner) {
    const ownerX = 120;
    const ownerY = 480;
    const ownerWidth = 580;
    const ownerHeight = 70;

    // Owner box
    ctx.fillStyle = 'rgb(52, 211, 153)';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    roundRect(ctx, ownerX, ownerY, ownerWidth, ownerHeight, 40);
    ctx.fill();
    ctx.stroke();

    // Owner text
    ctx.fillStyle = 'black';
    ctx.font = 'bold 25px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`OWNER : ${owner}`, ownerX + 40, ownerY + ownerHeight / 2);
}

module.exports = {
    generateSuccessCard
};

