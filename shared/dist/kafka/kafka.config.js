import { Transport } from '@nestjs/microservices';
export const kafkaOptionsFactory = (config) => {
    const clientId = config.get('KAFKA_CLIENT_ID');
    const brokersRaw = config.get('KAFKA_CLIENT_BROKERS');
    const groupId = config.get('KAFKA_CONSUMER_GROUP_ID');
    if (!clientId || !brokersRaw || !groupId) {
        throw new Error('KAFKA_CLIENT_ID, KAFKA_CLIENT_BROKERS, KAFKA_CONSUMER_GROUP_ID must be defined');
    }
    return {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId,
                brokers: brokersRaw.split(',').map((b) => b.trim()),
            },
            consumer: {
                groupId,
            },
            subscribe: {
                fromBeginning: true,
            },
        },
    };
};
//# sourceMappingURL=kafka.config.js.map