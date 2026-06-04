export default interface HostingServer {
    getServerUrl(): string;
    getIp(): string;
    getPort(): any;
    getDb(): any;
}
