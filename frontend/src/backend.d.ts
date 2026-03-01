import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MemoryEntry {
    id: string;
    contentType: ContentType;
    tags: Array<string>;
    isFavorite: boolean;
    notes: string;
    timestamp: bigint;
    caption: string;
    category: string;
    mediaFiles: Array<MediaFile>;
}
export interface MediaFile {
    id: string;
    fileHash: string;
    fileName: string;
    filePath: string;
    fileType: FileType;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface Category {
    id: string;
    name: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface Permissions {
    canEdit: boolean;
    canView: boolean;
}
export type Time = bigint;
export interface Tag {
    id: string;
    name: string;
}
export interface UserProfile {
    name: string;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
export enum ContentType {
    audio = "audio",
    video = "video",
    text = "text",
    photo = "photo",
    screenshot = "screenshot"
}
export enum FileType {
    jpg = "jpg",
    m4a = "m4a",
    mp3 = "mp3",
    mp4 = "mp4",
    png = "png",
    wav = "wav",
    jpeg = "jpeg"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    accessSharedMemory(linkId: string): Promise<MemoryEntry | null>;
    addCategory(name: string): Promise<string>;
    addTag(name: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMemoryEntry(caption: string, notes: string, tags: Array<string>, category: string, mediaFiles: Array<MediaFile>, contentType: ContentType): Promise<string>;
    createSharedLink(memoryId: string, permissions: Permissions, expires: bigint | null): Promise<string>;
    deleteMemoryEntry(id: string): Promise<boolean>;
    dropFileReference(path: string): Promise<void>;
    editSharedMemory(linkId: string, updatedMemory: MemoryEntry): Promise<void>;
    filterByCategory(category: string): Promise<Array<MemoryEntry>>;
    filterByContentType(contentType: ContentType): Promise<Array<MemoryEntry>>;
    filterByTag(tag: string): Promise<Array<MemoryEntry>>;
    generateInviteCode(): Promise<string>;
    getAllCategories(): Promise<Array<Category>>;
    getAllMemories(): Promise<Array<MemoryEntry>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllTags(): Promise<Array<Tag>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<MemoryEntry>>;
    getFileReference(path: string): Promise<FileReference>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getMemoryEntry(id: string): Promise<MemoryEntry | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
    revokeSharedLink(linkId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMemories(searchTerm: string): Promise<Array<MemoryEntry>>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    toggleFavorite(id: string): Promise<boolean>;
    updateMemoryEntry(id: string, caption: string, notes: string, tags: Array<string>, category: string, mediaFiles: Array<MediaFile>, contentType: ContentType): Promise<boolean>;
}

