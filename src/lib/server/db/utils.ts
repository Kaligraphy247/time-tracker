import Surreal from 'surrealdb';
import { env } from '$env/dynamic/private';

type DBConfig = {
	url: string;
	namespace: string;
	database: string;
	username: string;
	password: string;
};

const DEFAULT_CONFIG: DBConfig = {
	url: env.DB_URL,
	namespace: env.DB_NS,
	database: env.DB_NAME,
	username: env.DB_USERNAME,
	password: env.DB_PASSWORD
};

if (Object.entries(DEFAULT_CONFIG).some(([_key, value]) => value === undefined)) {
	throw new Error(`Missing required environment variables. Please check your .env file.`);
}

export async function getDb(config: DBConfig = DEFAULT_CONFIG): Promise<Surreal> {
	const db = new Surreal();

	try {
		await db.connect(config.url);
		await db.use({
			namespace: config.namespace,
			database: config.database
		});
		await db.signin({
			username: config.username,
			password: config.password
		});
		return db;
	} catch (error) {
		console.error(
			'Failed to connect to SurrealDB:',
			error instanceof Error ? error.message : String(error)
		);
		await db.close();
		throw error;
	}
}
