export const envConfig = {
  protocol: 'http',
  host: import.meta.env.VITE_HOST,
  port: import.meta.env.VITE_PORT,
  token:import.meta.env.VITE_PUBLIC_TOKEN,
  get baseURL(): string {
    return `${this.protocol}://${this.host}:${this.port}`;
  }
};