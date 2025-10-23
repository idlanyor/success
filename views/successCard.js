const config = require('../config/config');

function generateSuccessCardHTML(params) {
    const {
        user = config.defaultValues.user,
        imageurl = config.defaultValues.imageurl,
        datetime = config.defaultValues.datetime,
        status = config.defaultValues.status,
        owner = config.defaultValues.owner
    } = params;

    // Escape single quotes untuk keamanan
    const escapeQuotes = (str) => str.replace(/'/g, "\\'");

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kartu Sukses - Modern Design</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Quicksand:wght@500;700&family=Caveat+Brush&family=Bitcount+Grid+Single:wght@100..900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; }
    </style>
</head>
<body>
    <script>
        let avatarImg;
        let successBadgeImg;
        let cardConfig = {
            width: ${config.canvas.width},
            height: ${config.canvas.height},
            backgroundColor: ${JSON.stringify(config.colors.backgroundColor)},
            cardColor: ${JSON.stringify(config.colors.cardColor)},
            labelColor: ${JSON.stringify(config.colors.labelColor)},
            textColor: ${JSON.stringify(config.colors.textColor)},
            user: '${escapeQuotes(user)}',
            date: '${escapeQuotes(datetime)}',
            product: '${escapeQuotes(status)}',
            owner: '${escapeQuotes(owner)}',
            fonts: {
                title: '${config.fonts.title}',
                labels: '${config.fonts.labels}',
                content: '${config.fonts.content}'
            }
        };

        function preload() {
            avatarImg = loadImage('${escapeQuotes(imageurl)}');
            successBadgeImg = loadImage('${config.badge.url}');
        }

        function setup() {
            createCanvas(cardConfig.width, cardConfig.height);
            noLoop();
        }

        function draw() {
            drawBackground();
            drawStars();
            drawMainCard();
            drawOwnerSection();
        }

        function drawBackground() {
            for (let y = 0; y < height; y++) {
                let inter = map(y, 0, height, 0, 1);
                let c = lerpColor(color(59, 130, 246), color(16, 185, 129), inter);
                stroke(c);
                line(0, y, width, y);
            }
        }

        function drawMainCard() {
            const margin = 40;
            const cardX = 80;
            const cardY = 90;
            const cardWidth = 650;
            const cardHeight = 300;
            const avatarSize = 140;

            const angle = 55 * (Math.PI / 180);
            const gradientLength = Math.sqrt(cardWidth * cardWidth + cardHeight * cardHeight);
            const x1 = cardX + cardWidth / 2 - Math.cos(angle) * gradientLength / 2;
            const y1 = cardY + cardHeight / 2 - Math.sin(angle) * gradientLength / 2;
            const x2 = cardX + cardWidth / 2 + Math.cos(angle) * gradientLength / 2;
            const y2 = cardY + cardHeight / 2 + Math.sin(angle) * gradientLength / 2;
            
            const gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, 'rgb(250, 204, 21)');
            gradient.addColorStop(1, 'rgb(34, 197, 94)');
            
            drawingContext.fillStyle = gradient;
            drawingContext.strokeStyle = 'rgb(0, 0, 0)';
            drawingContext.lineWidth = 2;
            
            drawingContext.beginPath();
            drawingContext.roundRect(cardX, cardY, cardWidth, 130, [0, 50, 0, 0]);
            drawingContext.fill();
            drawingContext.stroke();
            
            drawingContext.beginPath();
            drawingContext.rect(cardX, cardY + 130, cardWidth, 80);
            drawingContext.fill();
            drawingContext.stroke();
            
            drawingContext.beginPath();
            drawingContext.roundRect(cardX, cardY + 210, cardWidth, 170, [0, 0, 0, 50]);
            drawingContext.fill();
            drawingContext.stroke();

            noStroke();
            fill(255);
            rect(cardX + 150, cardY-30, 350, 70, 50);
            
            fill(0);
            textFont(cardConfig.fonts.title);
            textSize(34);
            textStyle(BOLD);
            textAlign(LEFT, CENTER);
            text('PESANAN SELESAI', cardX + 175, cardY+10);
            
            push();
            const badgeSize = avatarSize-50;
            const badgeX = cardX + 530;
            const badgeY = cardY+270;
            
            translate(badgeX, badgeY);
            rotate(radians(25));
            
            drawingContext.save();
            drawingContext.beginPath();
            drawingContext.arc(0, 0, badgeSize/2, 0, TWO_PI);
            drawingContext.clip();
            
            imageMode(CENTER);
            image(successBadgeImg, 0, 0, badgeSize, badgeSize);
            drawingContext.restore();
            pop();

            textFont(cardConfig.fonts.labels);
            fill(...cardConfig.labelColor);
            textSize(22);
            textStyle(BOLD);
            textAlign(LEFT, CENTER);
            text('USER', cardX + 100, cardY + 110);
            
            textFont(cardConfig.fonts.content);
            fill(...cardConfig.textColor);
            textSize(20);
            textStyle(NORMAL);
            text(cardConfig.user, cardX + 250, cardY + 110);

            textFont(cardConfig.fonts.labels);
            fill(...cardConfig.labelColor);
            textSize(22);
            textStyle(BOLD);
            text('TANGGAL', cardX + 100, cardY + 170);
            
            textFont(cardConfig.fonts.content);
            fill(...cardConfig.textColor);
            textSize(20);
            textStyle(NORMAL);
            text(cardConfig.date, cardX + 250, cardY + 170);

            textFont(cardConfig.fonts.labels);
            fill(...cardConfig.labelColor);
            textSize(22);
            textStyle(BOLD);
            textAlign(LEFT, CENTER);
            text('PRODUK', cardX + 100, cardY + 280);
            
            textFont(cardConfig.fonts.title);
            textSize(56);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            
            stroke(255);
            strokeWeight(8);
            fill(34, 197, 94);
            text(cardConfig.product, cardX + cardWidth/2 + 20, cardY + 280);
            
            noStroke();
            
            push();
            const avatarX = 110;
            const avatarY = 90;
            
            stroke(0);
            strokeWeight(2);
            fill(255);
            circle(avatarX, avatarY, avatarSize);
            
            drawingContext.save();
            drawingContext.beginPath();
            drawingContext.arc(avatarX, avatarY, avatarSize/2 - 3, 0, TWO_PI);
            drawingContext.clip();
            image(avatarImg, avatarX - avatarSize/2 + 3, avatarY - avatarSize/2 + 3, avatarSize - 6, avatarSize - 6);
            drawingContext.restore();
            pop();
        }

        function drawStars() {
            noStroke();
            fill(220, 38, 38, 200);
            drawStar(45, 180, 12, 25, 4);
            drawStar(35, 350, 8, 18, 4);
            
            fill(220, 38, 38, 180);
            drawStar(735, 80, 10, 22, 4);
            drawStar(750, 240, 14, 28, 4);
            drawStar(740, 450, 9, 20, 4);
            
            fill(220, 38, 38, 120);
            drawStar(760, 350, 6, 14, 4);
        }

        function drawStar(x, y, radius1, radius2, npoints) {
            let angle = TWO_PI / npoints;
            let halfAngle = angle/2.0;
            beginShape();
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = x + cos(a) * radius2;
                let sy = y + sin(a) * radius2;
                vertex(sx, sy);
                sx = x + cos(a+halfAngle) * radius1;
                sy = y + sin(a+halfAngle) * radius1;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        }

        function drawOwnerSection() {
            const ownerX = 120;
            const ownerY = 480;
            const ownerWidth = 580;
            const ownerHeight = 70;
            
            stroke(0);
            strokeWeight(1);
            fill(52, 211, 153);
            rect(ownerX, ownerY, ownerWidth, ownerHeight, 40);
            
            noStroke();
            fill(0);
            textFont('Quicksand');
            textSize(25);
            textStyle(BOLD);
            textAlign(LEFT, CENTER);
            text('OWNER : ' + cardConfig.owner, ownerX + 40, ownerY + ownerHeight/2);
        }
    </script>
</body>
</html>`;
}

module.exports = generateSuccessCardHTML;

