const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Success Card API',
            version: '1.0.0',
            description: 'API untuk generate kartu sukses dengan desain modern dan gradien. Kartu ini menggunakan p5.js untuk rendering canvas dengan berbagai fitur visual menarik.',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: 'https://canvas.kanata.web.id',
                description: 'Development server'
            },
            {
                url: 'https://your-production-domain.com',
                description: 'Production server'
            }
        ],
        tags: [
            {
                name: 'Success Card',
                description: 'Endpoints untuk generate success card'
            },
            {
                name: 'Info',
                description: 'Informasi dan dokumentasi API'
            },
            {
                name: 'Health',
                description: 'Health check endpoints'
            }
        ],
        components: {
            schemas: {
                SuccessCardParams: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'string',
                            description: 'Username atau ID user',
                            example: '@80775651303442',
                            default: config.defaultValues.user
                        },
                        imageurl: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL gambar avatar user (harus CORS-enabled)',
                            example: 'https://files.catbox.moe/5lzdmq.png',
                            default: config.defaultValues.imageurl
                        },
                        datetime: {
                            type: 'string',
                            description: 'Tanggal dan waktu pesanan',
                            example: 'Minggu, 12 Oktober 2025    18:19:14 WIB',
                            default: config.defaultValues.datetime
                        },
                        status: {
                            type: 'string',
                            description: 'Status pesanan (akan ditampilkan besar dengan warna hijau)',
                            example: 'Done',
                            default: config.defaultValues.status
                        },
                        owner: {
                            type: 'string',
                            format: 'uri',
                            description: 'Link WhatsApp owner',
                            example: 'https://wa.me/6285143569870',
                            default: config.defaultValues.owner
                        }
                    }
                },
                APIInfo: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Success Card API'
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0'
                        },
                        description: {
                            type: 'string'
                        },
                        documentation: {
                            type: 'object'
                        },
                        features: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                HealthCheck: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'OK'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-10-23T10:30:00.000Z'
                        },
                        uptime: {
                            type: 'number',
                            description: 'Server uptime in seconds',
                            example: 123.45
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Error type'
                        },
                        message: {
                            type: 'string',
                            example: 'Detailed error message'
                        }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        example: 'Endpoint not found'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Please check the API documentation'
                                    },
                                    availableEndpoints: {
                                        type: 'array',
                                        items: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                InternalError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

