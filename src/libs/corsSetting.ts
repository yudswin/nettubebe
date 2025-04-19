import { CorsOptions } from 'cors';

/**
 * Generates CORS configuration options based on the current environment.
 * 
 * @returns {CorsOptions} - The CORS configuration object
 * 
 * @example
 * const corsOptions = getCorsOptions();
 * app.use(cors(corsOptions));
 * 
 * @description
 * This function provides environment-specific CORS configuration with:
 * - Different allowed origins for development, production, and test environments
 * - Secure defaults for headers, methods, and caching
 * - Credential support for authenticated requests
 * - Detailed logging for blocked requests
 * 
 * The configuration follows security best practices while providing necessary
 * access for frontend applications during development and production.
 */
export const getCorsOptions = (): CorsOptions => {
    // Default development settings - common local development URLs
    const developmentOrigins = [
        'http://localhost:3000',    // React default development server
        'http://localhost:8080',    // Vue default development server
        'http://localhost:4200',    // Angular default development server
        'http://127.0.0.1:3000',    // Alternative localhost address
    ];

    // Production settings - your live domain(s)
    const productionOrigins = [
        process.env.PRODUCTION_URL || 'https://yourproductiondomain.com',
        'https://www.yourproductiondomain.com', // Common www variant
    ];

    // Test environment settings (for staging or testing)
    const testOrigins = [
        'http://localhost:3001',    // Test-specific frontend port
        'https://staging.yourdomain.com', // Common staging environment
    ];

    // Determine which origins to use based on the current NODE_ENV
    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? productionOrigins
        : process.env.NODE_ENV === 'test'
            ? testOrigins
            : developmentOrigins;

    return {
        /**
         * Origin validation function
         * @param {string} origin - The requesting origin
         * @param {Function} callback - Callback to signal approval/rejection
         */
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, server-to-server, curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`Blocked by CORS: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },

        // Allowed HTTP methods
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

        // Allowed request headers
        allowedHeaders: [
            'Content-Type',     // For JSON/FormData
            'Authorization',    // For Bearer tokens
            'X-Requested-With',// Common AJAX header
            'Accept',          // Content negotiation
        ],

        credentials: true,      // Allow cookies/auth headers
        optionsSuccessStatus: 200, // Legacy browser support
        maxAge: 86400,          // Cache CORS preflight results for 24 hours
    };
};