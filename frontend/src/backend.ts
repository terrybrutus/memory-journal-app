import { type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { backend as _backend, createActor as _createActor, canisterId as _canisterId, CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        __kind__: "Some",
        value: value
    };
}
function none(): None {
    return {
        __kind__: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
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
export function createActor(canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never): backendInterface {
    const actor = _createActor(canisterId, options);
    return new Backend(actor, processError);
}
export const canisterId = _canisterId;
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
import type { ContentType as _ContentType, FileType as _FileType, MediaFile as _MediaFile, MemoryEntry as _MemoryEntry, UserProfile as _UserProfile, UserRole as _UserRole } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    private actor: ActorSubclass<_SERVICE>;
    constructor(actor?: ActorSubclass<_SERVICE>, private processError?: (error: unknown) => never){
        this.actor = actor ?? _backend;
    }
    async accessSharedMemory(arg0: string): Promise<MemoryEntry | null> {
        if (this.processError) {
            try {
                const result = await this.actor.accessSharedMemory(arg0);
                return from_candid_opt_n1(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.accessSharedMemory(arg0);
            return from_candid_opt_n1(result);
        }
    }
    async addCategory(arg0: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.addCategory(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addCategory(arg0);
            return result;
        }
    }
    async addTag(arg0: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.addTag(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addTag(arg0);
            return result;
        }
    }
    async assignCallerUserRole(arg0: Principal, arg1: UserRole): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n11(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n11(arg1));
            return result;
        }
    }
    async createMemoryEntry(arg0: string, arg1: string, arg2: Array<string>, arg3: string, arg4: Array<MediaFile>, arg5: ContentType): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createMemoryEntry(arg0, arg1, arg2, arg3, to_candid_vec_n13(arg4), to_candid_ContentType_n18(arg5));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createMemoryEntry(arg0, arg1, arg2, arg3, to_candid_vec_n13(arg4), to_candid_ContentType_n18(arg5));
            return result;
        }
    }
    async createSharedLink(arg0: string, arg1: Permissions, arg2: bigint | null): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createSharedLink(arg0, arg1, to_candid_opt_n20(arg2));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createSharedLink(arg0, arg1, to_candid_opt_n20(arg2));
            return result;
        }
    }
    async deleteMemoryEntry(arg0: string): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteMemoryEntry(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteMemoryEntry(arg0);
            return result;
        }
    }
    async dropFileReference(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.dropFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.dropFileReference(arg0);
            return result;
        }
    }
    async editSharedMemory(arg0: string, arg1: MemoryEntry): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.editSharedMemory(arg0, to_candid_MemoryEntry_n21(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.editSharedMemory(arg0, to_candid_MemoryEntry_n21(arg1));
            return result;
        }
    }
    async filterByCategory(arg0: string): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.filterByCategory(arg0);
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.filterByCategory(arg0);
            return from_candid_vec_n23(result);
        }
    }
    async filterByContentType(arg0: ContentType): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.filterByContentType(to_candid_ContentType_n18(arg0));
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.filterByContentType(to_candid_ContentType_n18(arg0));
            return from_candid_vec_n23(result);
        }
    }
    async filterByTag(arg0: string): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.filterByTag(arg0);
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.filterByTag(arg0);
            return from_candid_vec_n23(result);
        }
    }
    async generateInviteCode(): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.generateInviteCode();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.generateInviteCode();
            return result;
        }
    }
    async getAllCategories(): Promise<Array<Category>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllCategories();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllCategories();
            return result;
        }
    }
    async getAllMemories(): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllMemories();
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllMemories();
            return from_candid_vec_n23(result);
        }
    }
    async getAllRSVPs(): Promise<Array<RSVP>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllRSVPs();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllRSVPs();
            return result;
        }
    }
    async getAllTags(): Promise<Array<Tag>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllTags();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllTags();
            return result;
        }
    }
    async getCallerUserProfile(): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserProfile();
                return from_candid_opt_n24(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserProfile();
            return from_candid_opt_n24(result);
        }
    }
    async getCallerUserRole(): Promise<UserRole> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserRole();
                return from_candid_UserRole_n25(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserRole();
            return from_candid_UserRole_n25(result);
        }
    }
    async getFavorites(): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.getFavorites();
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFavorites();
            return from_candid_vec_n23(result);
        }
    }
    async getFileReference(arg0: string): Promise<FileReference> {
        if (this.processError) {
            try {
                const result = await this.actor.getFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFileReference(arg0);
            return result;
        }
    }
    async getInviteCodes(): Promise<Array<InviteCode>> {
        if (this.processError) {
            try {
                const result = await this.actor.getInviteCodes();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getInviteCodes();
            return result;
        }
    }
    async getMemoryEntry(arg0: string): Promise<MemoryEntry | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getMemoryEntry(arg0);
                return from_candid_opt_n1(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getMemoryEntry(arg0);
            return from_candid_opt_n1(result);
        }
    }
    async getUserProfile(arg0: Principal): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getUserProfile(arg0);
                return from_candid_opt_n24(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getUserProfile(arg0);
            return from_candid_opt_n24(result);
        }
    }
    async initializeAccessControl(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.initializeAccessControl();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.initializeAccessControl();
            return result;
        }
    }
    async isCallerAdmin(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isCallerAdmin();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isCallerAdmin();
            return result;
        }
    }
    async listFileReferences(): Promise<Array<FileReference>> {
        if (this.processError) {
            try {
                const result = await this.actor.listFileReferences();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.listFileReferences();
            return result;
        }
    }
    async registerFileReference(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerFileReference(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerFileReference(arg0, arg1);
            return result;
        }
    }
    async revokeSharedLink(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.revokeSharedLink(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.revokeSharedLink(arg0);
            return result;
        }
    }
    async saveCallerUserProfile(arg0: UserProfile): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.saveCallerUserProfile(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.saveCallerUserProfile(arg0);
            return result;
        }
    }
    async searchMemories(arg0: string): Promise<Array<MemoryEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.searchMemories(arg0);
                return from_candid_vec_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.searchMemories(arg0);
            return from_candid_vec_n23(result);
        }
    }
    async submitRSVP(arg0: string, arg1: boolean, arg2: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.submitRSVP(arg0, arg1, arg2);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.submitRSVP(arg0, arg1, arg2);
            return result;
        }
    }
    async toggleFavorite(arg0: string): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.toggleFavorite(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.toggleFavorite(arg0);
            return result;
        }
    }
    async updateMemoryEntry(arg0: string, arg1: string, arg2: string, arg3: Array<string>, arg4: string, arg5: Array<MediaFile>, arg6: ContentType): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.updateMemoryEntry(arg0, arg1, arg2, arg3, arg4, to_candid_vec_n13(arg5), to_candid_ContentType_n18(arg6));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateMemoryEntry(arg0, arg1, arg2, arg3, arg4, to_candid_vec_n13(arg5), to_candid_ContentType_n18(arg6));
            return result;
        }
    }
}
export const backend: backendInterface = new Backend();
function from_candid_ContentType_n4(value: _ContentType): ContentType {
    return from_candid_variant_n5(value);
}
function from_candid_FileType_n9(value: _FileType): FileType {
    return from_candid_variant_n10(value);
}
function from_candid_MediaFile_n7(value: _MediaFile): MediaFile {
    return from_candid_record_n8(value);
}
function from_candid_MemoryEntry_n2(value: _MemoryEntry): MemoryEntry {
    return from_candid_record_n3(value);
}
function from_candid_UserRole_n25(value: _UserRole): UserRole {
    return from_candid_variant_n26(value);
}
function from_candid_opt_n1(value: [] | [_MemoryEntry]): MemoryEntry | null {
    return value.length === 0 ? null : from_candid_MemoryEntry_n2(value[0]);
}
function from_candid_opt_n24(value: [] | [_UserProfile]): UserProfile | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_record_n3(value: {
    id: string;
    contentType: _ContentType;
    tags: Array<string>;
    isFavorite: boolean;
    notes: string;
    timestamp: bigint;
    caption: string;
    category: string;
    mediaFiles: Array<_MediaFile>;
}): {
    id: string;
    contentType: ContentType;
    tags: Array<string>;
    isFavorite: boolean;
    notes: string;
    timestamp: bigint;
    caption: string;
    category: string;
    mediaFiles: Array<MediaFile>;
} {
    return {
        id: value.id,
        contentType: from_candid_ContentType_n4(value.contentType),
        tags: value.tags,
        isFavorite: value.isFavorite,
        notes: value.notes,
        timestamp: value.timestamp,
        caption: value.caption,
        category: value.category,
        mediaFiles: from_candid_vec_n6(value.mediaFiles)
    };
}
function from_candid_record_n8(value: {
    id: string;
    fileHash: string;
    fileName: string;
    filePath: string;
    fileType: _FileType;
}): {
    id: string;
    fileHash: string;
    fileName: string;
    filePath: string;
    fileType: FileType;
} {
    return {
        id: value.id,
        fileHash: value.fileHash,
        fileName: value.fileName,
        filePath: value.filePath,
        fileType: from_candid_FileType_n9(value.fileType)
    };
}
function from_candid_variant_n10(value: {
    jpg: null;
} | {
    m4a: null;
} | {
    mp3: null;
} | {
    mp4: null;
} | {
    png: null;
} | {
    wav: null;
} | {
    jpeg: null;
}): FileType {
    return "jpg" in value ? FileType.jpg : "m4a" in value ? FileType.m4a : "mp3" in value ? FileType.mp3 : "mp4" in value ? FileType.mp4 : "png" in value ? FileType.png : "wav" in value ? FileType.wav : "jpeg" in value ? FileType.jpeg : value;
}
function from_candid_variant_n26(value: {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
}): UserRole {
    return "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : "guest" in value ? UserRole.guest : value;
}
function from_candid_variant_n5(value: {
    audio: null;
} | {
    video: null;
} | {
    text: null;
} | {
    photo: null;
} | {
    screenshot: null;
}): ContentType {
    return "audio" in value ? ContentType.audio : "video" in value ? ContentType.video : "text" in value ? ContentType.text : "photo" in value ? ContentType.photo : "screenshot" in value ? ContentType.screenshot : value;
}
function from_candid_vec_n23(value: Array<_MemoryEntry>): Array<MemoryEntry> {
    return value.map((x)=>from_candid_MemoryEntry_n2(x));
}
function from_candid_vec_n6(value: Array<_MediaFile>): Array<MediaFile> {
    return value.map((x)=>from_candid_MediaFile_n7(x));
}
function to_candid_ContentType_n18(value: ContentType): _ContentType {
    return to_candid_variant_n19(value);
}
function to_candid_FileType_n16(value: FileType): _FileType {
    return to_candid_variant_n17(value);
}
function to_candid_MediaFile_n14(value: MediaFile): _MediaFile {
    return to_candid_record_n15(value);
}
function to_candid_MemoryEntry_n21(value: MemoryEntry): _MemoryEntry {
    return to_candid_record_n22(value);
}
function to_candid_UserRole_n11(value: UserRole): _UserRole {
    return to_candid_variant_n12(value);
}
function to_candid_opt_n20(value: bigint | null): [] | [bigint] {
    return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n15(value: {
    id: string;
    fileHash: string;
    fileName: string;
    filePath: string;
    fileType: FileType;
}): {
    id: string;
    fileHash: string;
    fileName: string;
    filePath: string;
    fileType: _FileType;
} {
    return {
        id: value.id,
        fileHash: value.fileHash,
        fileName: value.fileName,
        filePath: value.filePath,
        fileType: to_candid_FileType_n16(value.fileType)
    };
}
function to_candid_record_n22(value: {
    id: string;
    contentType: ContentType;
    tags: Array<string>;
    isFavorite: boolean;
    notes: string;
    timestamp: bigint;
    caption: string;
    category: string;
    mediaFiles: Array<MediaFile>;
}): {
    id: string;
    contentType: _ContentType;
    tags: Array<string>;
    isFavorite: boolean;
    notes: string;
    timestamp: bigint;
    caption: string;
    category: string;
    mediaFiles: Array<_MediaFile>;
} {
    return {
        id: value.id,
        contentType: to_candid_ContentType_n18(value.contentType),
        tags: value.tags,
        isFavorite: value.isFavorite,
        notes: value.notes,
        timestamp: value.timestamp,
        caption: value.caption,
        category: value.category,
        mediaFiles: to_candid_vec_n13(value.mediaFiles)
    };
}
function to_candid_variant_n12(value: UserRole): {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
} {
    return value == UserRole.admin ? {
        admin: null
    } : value == UserRole.user ? {
        user: null
    } : value == UserRole.guest ? {
        guest: null
    } : value;
}
function to_candid_variant_n17(value: FileType): {
    jpg: null;
} | {
    m4a: null;
} | {
    mp3: null;
} | {
    mp4: null;
} | {
    png: null;
} | {
    wav: null;
} | {
    jpeg: null;
} {
    return value == FileType.jpg ? {
        jpg: null
    } : value == FileType.m4a ? {
        m4a: null
    } : value == FileType.mp3 ? {
        mp3: null
    } : value == FileType.mp4 ? {
        mp4: null
    } : value == FileType.png ? {
        png: null
    } : value == FileType.wav ? {
        wav: null
    } : value == FileType.jpeg ? {
        jpeg: null
    } : value;
}
function to_candid_variant_n19(value: ContentType): {
    audio: null;
} | {
    video: null;
} | {
    text: null;
} | {
    photo: null;
} | {
    screenshot: null;
} {
    return value == ContentType.audio ? {
        audio: null
    } : value == ContentType.video ? {
        video: null
    } : value == ContentType.text ? {
        text: null
    } : value == ContentType.photo ? {
        photo: null
    } : value == ContentType.screenshot ? {
        screenshot: null
    } : value;
}
function to_candid_vec_n13(value: Array<MediaFile>): Array<_MediaFile> {
    return value.map((x)=>to_candid_MediaFile_n14(x));
}

