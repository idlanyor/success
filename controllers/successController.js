const generateSuccessCardHTML = require('../views/successCard');
const { generateSuccessCard } = require('../services/canvasService');
const config = require('../config/config');

exports.generateCard = async (req, res) => {
    try {
        // Get format from query params (png or jpeg)
        const format = req.query.format || 'png';
        const quality = parseInt(req.query.quality) || 90;
        
        // Validate format
        if (!['png', 'jpeg', 'jpg'].includes(format.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid format',
                message: 'Format must be png, jpeg, or jpg'
            });
        }

        // Generate image using canvas
        const imageFormat = format === 'jpg' ? 'jpeg' : format;
        const imageBuffer = await generateSuccessCard(req.query, {
            width: config.canvas.width,
            height: config.canvas.height,
            format: imageFormat,
            quality: quality / 100 // Canvas expects 0-1
        });
        
        // Set headers
        const contentType = imageFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="success-card.${imageFormat}"`);
        res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        
        // Send image
        res.send(imageBuffer);
    } catch (error) {
        console.error('Generate card error:', error);
        res.status(500).json({ 
            error: 'Failed to generate success card',
            message: error.message 
        });
    }
};

// New endpoint for HTML preview
exports.generateCardHTML = (req, res) => {
    try {
        const html = generateSuccessCardHTML(req.query);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to generate success card HTML',
            message: error.message 
        });
    }
};

exports.getApiInfo = (req, res) => {
    res.json({
        name: 'Success Card API',
        version: '1.0.0',
        description: 'API untuk generate kartu sukses dengan desain modern dan gradien',
        documentation: {
            endpoint: '/success',
            method: 'GET',
            parameters: [
                {
                    name: 'user',
                    type: 'string',
                    required: false,
                    default: config.defaultValues.user,
                    description: 'Username atau ID user'
                },
                {
                    name: 'imageurl',
                    type: 'string',
                    required: false,
                    default: config.defaultValues.imageurl,
                    description: 'URL gambar avatar user'
                },
                {
                    name: 'datetime',
                    type: 'string',
                    required: false,
                    default: config.defaultValues.datetime,
                    description: 'Tanggal dan waktu pesanan'
                },
                {
                    name: 'status',
                    type: 'string',
                    required: false,
                    default: config.defaultValues.status,
                    description: 'Status pesanan (akan ditampilkan besar)'
                },
                {
                    name: 'owner',
                    type: 'string',
                    required: false,
                    default: config.defaultValues.owner,
                    description: 'Link WhatsApp owner'
                }
            ],
            examples: [
                {
                    description: 'Basic usage dengan default values',
                    url: '/success'
                },
                {
                    description: 'Custom user dan status',
                    url: '/success?user=@123456789&status=Success'
                },
                {
                    description: 'Full custom parameters',
                    url: '/success?user=@987654&imageurl=https://example.com/avatar.png&datetime=Senin,%2023%20Oktober%202025&status=Completed&owner=https://wa.me/6281234567890'
                }
            ]
        },
        features: [
            'Gradien background biru ke hijau',
            'Kartu dengan gradien kuning-hijau diagonal 55°',
            'Avatar circular dengan border hitam',
            'Success badge dengan rotasi 25°',
            'Font custom (Bitcount Grid Single, Caveat Brush, Quicksand)',
            'Bintang dekoratif merah',
            'Border radius asimetris',
            'Status text dengan warna hijau dan outline putih'
        ]
    });
};

exports.getHome = (req, res) => {
    res.json({
        name: 'Success Card API',
        version: '1.0.0',
        endpoints: {
            '/success': {
                method: 'GET',
                description: 'Generate success card with custom parameters',
                parameters: {
                    user: {
                        type: 'string',
                        required: false,
                        default: config.defaultValues.user,
                        description: 'Username or user ID'
                    },
                    imageurl: {
                        type: 'string',
                        required: false,
                        default: config.defaultValues.imageurl,
                        description: 'Avatar image URL'
                    },
                    datetime: {
                        type: 'string',
                        required: false,
                        default: config.defaultValues.datetime,
                        description: 'Date and time string'
                    },
                    status: {
                        type: 'string',
                        required: false,
                        default: config.defaultValues.status,
                        description: 'Order status'
                    },
                    owner: {
                        type: 'string',
                        required: false,
                        default: config.defaultValues.owner,
                        description: 'WhatsApp owner link'
                    }
                },
                examples: [
                    '/success',
                    '/success?user=@123456789&status=Success',
                    '/success?user=@987654&imageurl=https://example.com/avatar.png&datetime=Senin,%2023%20Oktober%202025&status=Completed&owner=https://wa.me/6281234567890'
                ]
            },
            '/api/info': {
                method: 'GET',
                description: 'Get detailed API information and documentation'
            },
            '/health': {
                method: 'GET',
                description: 'Health check endpoint'
            }
        }
    });
};

exports.healthCheck = (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};

