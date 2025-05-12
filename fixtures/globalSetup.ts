import * as dotenv from 'dotenv'

async function globalSetup() {
  const envPath = process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : '.env';
  dotenv.config({
    path: envPath,
    override: true
  })
}

export default globalSetup
