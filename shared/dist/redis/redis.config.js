export const redisOptionsModuleFactory = (config) => ({
    config: {
        host: config.get('REDIS_HOST'),
        port: Number(config.get('REDIS_PORT')),
        password: config.get('REDIS_PASSWORD'),
    },
});
//# sourceMappingURL=redis.config.js.map