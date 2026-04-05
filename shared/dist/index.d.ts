export declare enum DeviceType {
    MEGAPACK_XL = "MegapackXL",
    MEGAPACK_2 = "Megapack2",
    MEGAPACK = "Megapack",
    POWERPACK = "PowerPack",
    TRANSFORMER = "Transformer"
}
export interface SiteDevice {
    id: string;
    type: DeviceType;
    x: number;
    y: number;
}
export interface SiteLayout {
    id: string;
    name: string;
    devices: SiteDevice[];
    updatedAt: string;
}
export interface User {
    name: string;
    username: string;
    password?: string;
    language?: string;
    theme?: string;
    sites?: SiteLayout[];
}
export interface AuthResponse {
    message?: string;
    user: User;
    token: string;
}
export interface UsersResponse {
    count: number;
    users: User[];
}
