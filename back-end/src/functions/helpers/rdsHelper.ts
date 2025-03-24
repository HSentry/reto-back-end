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
            // Configuracion de base de datos a partir de variables de ambiente
            const dbConfig = {
                host: process.env.DB_HOST!,
                user: process.env.DB_USER!,
                database: process.env.DB_NAME!,
                port: parseInt(process.env.DB_PORT || '3306'),
                region: process.env.AWS_REGION!
            };

            // Crear RDS Signer
            const signer = new Signer({
                hostname: dbConfig.host,
                port: dbConfig.port,
                region: dbConfig.region,
                username: dbConfig.user
            });

            // Token de autenticacion
            const token = await signer.getAuthToken();

            // Crear conexion
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

    //Funcion para insertar un appointment en la tabla mysql_cl o mysql_pe
    async insertAppointment(appointment: Appointment, table : string): Promise<void> {
        try {
            const connection = await this.createConnection();

            const query = `
                INSERT INTO ${table} (insuredId, scheduleId, countryISO)
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

