import mysql, { RowDataPacket, Connection } from 'mysql2-promise';
import { Signer } from "@aws-sdk/rds-signer";

export interface Appointment {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
}

export class DatabaseService {
    private connection: Connection | null = null;

    private async createConnection(): Promise<Connection> {
        try {
            // Get database configuration from environment variables
            const dbConfig = {
                host: process.env.DB_HOST!,
                user: process.env.DB_USER!,
                database: process.env.DB_NAME!,
                port: parseInt(process.env.DB_PORT || '3306'),
                region: process.env.AWS_REGION!
            };

            // Create RDS Signer for IAM authentication
            const signer = new Signer({
                hostname: dbConfig.host,
                port: dbConfig.port,
                region: dbConfig.region,
                username: dbConfig.user
            });

            // Get authentication token
            const token = await signer.getAuthToken();

            // Create connection
            const connection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: token,
                database: dbConfig.database,
                ssl: 'Amazon RDS',
                authPlugins: {
                    mysql_clear_password: () => () => Buffer.from(token + '\0')
                }
            });

            return connection;
        } catch (error) {
            console.error('Error creating database connection:', error);
            throw error;
        }
    }

    async insertAppointmentPE(appointment: Appointment): Promise<void> {
        try {
            const connection = await this.createConnection();

            const query = `
                INSERT INTO mysql_pe (insuredId, scheduleId, countryISO)
                VALUES (?, ?, ?)
            `;

            const values = [appointment.insuredId, appointment.scheduleId, appointment.countryISO];

            await connection.execute(query, values);
            console.log('Employee PE inserted successfully');

            await connection.end();
        } catch (error) {
            console.error('Error inserting appointment:', error);
            throw error;
        }
    }

    async insertAppointmentCL(appointment: Appointment): Promise<void> {
        try {
            const connection = await this.createConnection();

            const query = `
                INSERT INTO mysql_cl (insuredId, scheduleId, countryISO)
                VALUES (?, ?, ?)
            `;

            const values = [appointment.insuredId, appointment.scheduleId, appointment.countryISO];

            await connection.execute(query, values);
            console.log('Employee CL inserted successfully');

            await connection.end();
        } catch (error) {
            console.error('Error inserting appointment:', error);
            throw error;
        }
    }
}

