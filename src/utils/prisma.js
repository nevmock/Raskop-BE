import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout: 20000,
    },
});

export default db;