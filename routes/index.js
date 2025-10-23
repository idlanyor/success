const express = require('express');
const router = express.Router();
const successController = require('../controllers/successController');

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Overview
 *     description: Menampilkan informasi dasar API dan daftar semua endpoints yang tersedia
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Success Card API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 */
router.get('/', successController.getHome);

/**
 * @swagger
 * /success:
 *   get:
 *     summary: Generate Success Card Image
 *     description: Generate kartu sukses sebagai gambar (PNG/JPEG) dengan parameter custom. Semua parameter bersifat optional dan akan menggunakan default values jika tidak diberikan. Response berupa image yang dapat langsung ditampilkan atau didownload.
 *     tags: [Success Card]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *           default: "@80775651303442"
 *         required: false
 *         description: Username atau ID user
 *         example: "@123456789"
 *       - in: query
 *         name: imageurl
 *         schema:
 *           type: string
 *           format: uri
 *           default: "https://files.catbox.moe/5lzdmq.png"
 *         required: false
 *         description: URL gambar avatar user (harus CORS-enabled)
 *         example: "https://example.com/avatar.png"
 *       - in: query
 *         name: datetime
 *         schema:
 *           type: string
 *           default: "Minggu, 12 Oktober 2025    18:19:14 WIB"
 *         required: false
 *         description: Tanggal dan waktu pesanan
 *         example: "Senin, 23 Oktober 2025 10:30:00 WIB"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: "Done"
 *         required: false
 *         description: Status pesanan (akan ditampilkan besar dengan warna hijau dan outline putih)
 *         example: "Success"
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *           format: uri
 *           default: "https://wa.me/6285143569870"
 *         required: false
 *         description: Link WhatsApp owner
 *         example: "https://wa.me/6281234567890"
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [png, jpeg, jpg]
 *           default: "png"
 *         required: false
 *         description: Format gambar output
 *         example: "png"
 *       - in: query
 *         name: quality
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 90
 *         required: false
 *         description: Kualitas gambar untuk JPEG (1-100)
 *         example: 90
 *     responses:
 *       200:
 *         description: Success card image generated successfully
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid format parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to generate success card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/success', successController.generateCard);

/**
 * @swagger
 * /success/html:
 *   get:
 *     summary: Generate Success Card HTML Preview
 *     description: Generate kartu sukses sebagai HTML page dengan canvas p5.js untuk preview atau testing. Berguna untuk melihat tampilan sebelum generate image.
 *     tags: [Success Card]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *           default: "@80775651303442"
 *         required: false
 *         description: Username atau ID user
 *       - in: query
 *         name: imageurl
 *         schema:
 *           type: string
 *           format: uri
 *           default: "https://files.catbox.moe/5lzdmq.png"
 *         required: false
 *         description: URL gambar avatar user
 *       - in: query
 *         name: datetime
 *         schema:
 *           type: string
 *           default: "Minggu, 12 Oktober 2025    18:19:14 WIB"
 *         required: false
 *         description: Tanggal dan waktu pesanan
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: "Done"
 *         required: false
 *         description: Status pesanan
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *           format: uri
 *           default: "https://wa.me/6285143569870"
 *         required: false
 *         description: Link WhatsApp owner
 *     responses:
 *       200:
 *         description: Success card HTML preview generated successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Failed to generate HTML preview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/success/html', successController.generateCardHTML);

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Detailed API Documentation
 *     description: Mendapatkan dokumentasi API lengkap dalam format JSON termasuk semua parameters, examples, dan features
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API documentation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIInfo'
 */
router.get('/api/info', successController.getApiInfo);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Endpoint untuk mengecek status server dan uptime
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
router.get('/health', successController.healthCheck);

module.exports = router;

