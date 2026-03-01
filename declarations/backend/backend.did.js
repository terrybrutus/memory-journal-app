export const idlFactory = ({ IDL }) => {
  const ContentType = IDL.Variant({
    'audio' : IDL.Null,
    'video' : IDL.Null,
    'text' : IDL.Null,
    'photo' : IDL.Null,
    'screenshot' : IDL.Null,
  });
  const FileType = IDL.Variant({
    'jpg' : IDL.Null,
    'm4a' : IDL.Null,
    'mp3' : IDL.Null,
    'mp4' : IDL.Null,
    'png' : IDL.Null,
    'wav' : IDL.Null,
    'jpeg' : IDL.Null,
  });
  const MediaFile = IDL.Record({
    'id' : IDL.Text,
    'fileHash' : IDL.Text,
    'fileName' : IDL.Text,
    'filePath' : IDL.Text,
    'fileType' : FileType,
  });
  const MemoryEntry = IDL.Record({
    'id' : IDL.Text,
    'contentType' : ContentType,
    'tags' : IDL.Vec(IDL.Text),
    'isFavorite' : IDL.Bool,
    'notes' : IDL.Text,
    'timestamp' : IDL.Int,
    'caption' : IDL.Text,
    'category' : IDL.Text,
    'mediaFiles' : IDL.Vec(MediaFile),
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const Permissions = IDL.Record({
    'canEdit' : IDL.Bool,
    'canView' : IDL.Bool,
  });
  const Category = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const Time = IDL.Int;
  const RSVP = IDL.Record({
    'name' : IDL.Text,
    'inviteCode' : IDL.Text,
    'timestamp' : Time,
    'attending' : IDL.Bool,
  });
  const Tag = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const InviteCode = IDL.Record({
    'created' : Time,
    'code' : IDL.Text,
    'used' : IDL.Bool,
  });
  return IDL.Service({
    'accessSharedMemory' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(MemoryEntry)],
        ['query'],
      ),
    'addCategory' : IDL.Func([IDL.Text], [IDL.Text], []),
    'addTag' : IDL.Func([IDL.Text], [IDL.Text], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'createMemoryEntry' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Text,
          IDL.Vec(MediaFile),
          ContentType,
        ],
        [IDL.Text],
        [],
      ),
    'createSharedLink' : IDL.Func(
        [IDL.Text, Permissions, IDL.Opt(IDL.Int)],
        [IDL.Text],
        [],
      ),
    'deleteMemoryEntry' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'editSharedMemory' : IDL.Func([IDL.Text, MemoryEntry], [], []),
    'filterByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MemoryEntry)],
        ['query'],
      ),
    'filterByContentType' : IDL.Func(
        [ContentType],
        [IDL.Vec(MemoryEntry)],
        ['query'],
      ),
    'filterByTag' : IDL.Func([IDL.Text], [IDL.Vec(MemoryEntry)], ['query']),
    'generateInviteCode' : IDL.Func([], [IDL.Text], []),
    'getAllCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getAllMemories' : IDL.Func([], [IDL.Vec(MemoryEntry)], ['query']),
    'getAllRSVPs' : IDL.Func([], [IDL.Vec(RSVP)], ['query']),
    'getAllTags' : IDL.Func([], [IDL.Vec(Tag)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getFavorites' : IDL.Func([], [IDL.Vec(MemoryEntry)], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getInviteCodes' : IDL.Func([], [IDL.Vec(InviteCode)], ['query']),
    'getMemoryEntry' : IDL.Func([IDL.Text], [IDL.Opt(MemoryEntry)], ['query']),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], []),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'revokeSharedLink' : IDL.Func([IDL.Text], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'searchMemories' : IDL.Func([IDL.Text], [IDL.Vec(MemoryEntry)], ['query']),
    'submitRSVP' : IDL.Func([IDL.Text, IDL.Bool, IDL.Text], [], []),
    'toggleFavorite' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'updateMemoryEntry' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Text,
          IDL.Vec(MediaFile),
          ContentType,
        ],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
