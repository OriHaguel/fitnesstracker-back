import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService {
	private dbConn: Db = null;

	constructor(private configService: ConfigService) { }

	async getCollection(collectionName: string) {
		try {
			const db = await this._connect();
			const collection = await db.collection(collectionName);
			return collection;
		} catch (err) {
			throw err;
		}
	}

	private async _connect(): Promise<Db> {
		if (this.dbConn) return this.dbConn;

		try {
			const client = await MongoClient.connect(this.configService.get<string>('MONGO_URL'));
			this.dbConn = client.db(this.configService.get<string>('DB_NAME'));
			return this.dbConn;
		} catch (err) {
			console.log("🚀 ~ _connect ~ err:", err);
			throw err;
		}
	}

}
