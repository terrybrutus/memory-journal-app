import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : string, 'name' : string }
export type ContentType = { 'audio' : null } |
  { 'video' : null } |
  { 'text' : null } |
  { 'photo' : null } |
  { 'screenshot' : null };
export interface FileReference { 'hash' : string, 'path' : string }
export type FileType = { 'jpg' : null } |
  { 'm4a' : null } |
  { 'mp3' : null } |
  { 'mp4' : null } |
  { 'png' : null } |
  { 'wav' : null } |
  { 'jpeg' : null };
export interface InviteCode {
  'created' : Time,
  'code' : string,
  'used' : boolean,
}
export interface MediaFile {
  'id' : string,
  'fileHash' : string,
  'fileName' : string,
  'filePath' : string,
  'fileType' : FileType,
}
export interface MemoryEntry {
  'id' : string,
  'contentType' : ContentType,
  'tags' : Array<string>,
  'isFavorite' : boolean,
  'notes' : string,
  'timestamp' : bigint,
  'caption' : string,
  'category' : string,
  'mediaFiles' : Array<MediaFile>,
}
export interface Permissions { 'canEdit' : boolean, 'canView' : boolean }
export interface RSVP {
  'name' : string,
  'inviteCode' : string,
  'timestamp' : Time,
  'attending' : boolean,
}
export interface Tag { 'id' : string, 'name' : string }
export type Time = bigint;
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  'accessSharedMemory' : ActorMethod<[string], [] | [MemoryEntry]>,
  'addCategory' : ActorMethod<[string], string>,
  'addTag' : ActorMethod<[string], string>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'createMemoryEntry' : ActorMethod<
    [string, string, Array<string>, string, Array<MediaFile>, ContentType],
    string
  >,
  'createSharedLink' : ActorMethod<
    [string, Permissions, [] | [bigint]],
    string
  >,
  'deleteMemoryEntry' : ActorMethod<[string], boolean>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'editSharedMemory' : ActorMethod<[string, MemoryEntry], undefined>,
  'filterByCategory' : ActorMethod<[string], Array<MemoryEntry>>,
  'filterByContentType' : ActorMethod<[ContentType], Array<MemoryEntry>>,
  'filterByTag' : ActorMethod<[string], Array<MemoryEntry>>,
  'generateInviteCode' : ActorMethod<[], string>,
  'getAllCategories' : ActorMethod<[], Array<Category>>,
  'getAllMemories' : ActorMethod<[], Array<MemoryEntry>>,
  'getAllRSVPs' : ActorMethod<[], Array<RSVP>>,
  'getAllTags' : ActorMethod<[], Array<Tag>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getFavorites' : ActorMethod<[], Array<MemoryEntry>>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getInviteCodes' : ActorMethod<[], Array<InviteCode>>,
  'getMemoryEntry' : ActorMethod<[string], [] | [MemoryEntry]>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'revokeSharedLink' : ActorMethod<[string], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'searchMemories' : ActorMethod<[string], Array<MemoryEntry>>,
  'submitRSVP' : ActorMethod<[string, boolean, string], undefined>,
  'toggleFavorite' : ActorMethod<[string], boolean>,
  'updateMemoryEntry' : ActorMethod<
    [
      string,
      string,
      string,
      Array<string>,
      string,
      Array<MediaFile>,
      ContentType,
    ],
    boolean
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
