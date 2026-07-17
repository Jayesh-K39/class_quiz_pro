import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import {readFileSync} from 'fs'

dotenv.config()

const pool = mysql.createPool({
	host:process.env.DB_HOST,
	port:process.env.DB_PORT,
	user:process.env.DB_USER,
	database:process.env.DB_NAME,
	password:process.env.DB_PASSWORD,
	...(process.env.NODE_ENV === 'production' && {
		ssl:{ca:readFileSync('/etc/secrets/aiven-ca.pem')}
	})
}
)
export default pool
