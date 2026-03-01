import OrderedMap "mo:base/OrderedMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Registry "blob-storage/registry";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Migration "migration";
import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";
import Random "mo:base/Random";
import Option "mo:base/Option";

(with migration = Migration.run)
actor MemoryJournal {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var userMemories : OrderedMap.Map<Principal, OrderedMap.Map<Text, MemoryEntry>> = principalMap.empty();
  var userTags : OrderedMap.Map<Principal, OrderedMap.Map<Text, Tag>> = principalMap.empty();
  var userCategories : OrderedMap.Map<Principal, OrderedMap.Map<Text, Category>> = principalMap.empty();
  var sharedLinks : OrderedMap.Map<Text, SharedLink> = textMap.empty();

  let registry = Registry.new();

  let accessControlState = AccessControl.initState();
  let inviteState = InviteLinksModule.initState();

  public type MemoryEntry = {
    id : Text;
    caption : Text;
    notes : Text;
    tags : [Text];
    category : Text;
    mediaFiles : [MediaFile];
    timestamp : Int;
    isFavorite : Bool;
    contentType : ContentType;
  };

  public type MediaFile = {
    id : Text;
    fileName : Text;
    fileType : FileType;
    filePath : Text;
    fileHash : Text;
  };

  public type Tag = {
    id : Text;
    name : Text;
  };

  public type Category = {
    id : Text;
    name : Text;
  };

  public type ContentType = {
    #photo;
    #video;
    #audio;
    #screenshot;
    #text;
  };

  public type FileType = {
    #jpeg;
    #png;
    #mp4;
    #mp3;
    #wav;
    #jpg;
    #m4a;
  };

  public type SharedLink = {
    id : Text;
    memoryId : Text;
    owner : Principal;
    permissions : Permissions;
    created : Int;
    expires : ?Int;
  };

  public type Permissions = {
    canView : Bool;
    canEdit : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  var userProfiles = principalMap.empty<UserProfile>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func createMemoryEntry(
    caption : Text,
    notes : Text,
    tags : [Text],
    category : Text,
    mediaFiles : [MediaFile],
    contentType : ContentType,
  ) : async Text {
    let id = Text.concat("memory-", debug_show (Time.now()));
    let memory : MemoryEntry = {
      id;
      caption;
      notes;
      tags;
      category;
      mediaFiles;
      timestamp = Time.now();
      isFavorite = false;
      contentType;
    };

    let userMemoriesMap = switch (principalMap.get(userMemories, caller)) {
      case (null) { textMap.empty<MemoryEntry>() };
      case (?memories) { memories };
    };

    let updatedMemories = textMap.put(userMemoriesMap, id, memory);
    userMemories := principalMap.put(userMemories, caller, updatedMemories);
    id;
  };

  public shared ({ caller }) func updateMemoryEntry(
    id : Text,
    caption : Text,
    notes : Text,
    tags : [Text],
    category : Text,
    mediaFiles : [MediaFile],
    contentType : ContentType,
  ) : async Bool {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { false };
      case (?memories) {
        switch (textMap.get(memories, id)) {
          case (null) { false };
          case (?existing) {
            let updated : MemoryEntry = {
              id;
              caption;
              notes;
              tags;
              category;
              mediaFiles;
              timestamp = existing.timestamp;
              isFavorite = existing.isFavorite;
              contentType;
            };
            let updatedMemories = textMap.put(memories, id, updated);
            userMemories := principalMap.put(userMemories, caller, updatedMemories);
            true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteMemoryEntry(id : Text) : async Bool {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { false };
      case (?memories) {
        let (updatedMemories, removed) = textMap.remove(memories, id);
        userMemories := principalMap.put(userMemories, caller, updatedMemories);
        switch (removed) {
          case (null) { false };
          case (?_) { true };
        };
      };
    };
  };

  public query ({ caller }) func getMemoryEntry(id : Text) : async ?MemoryEntry {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { null };
      case (?memories) { textMap.get(memories, id) };
    };
  };

  public query ({ caller }) func getAllMemories() : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) { Iter.toArray(textMap.vals(memories)) };
    };
  };

  public query ({ caller }) func searchMemories(searchTerm : Text) : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) {
        let results = Array.filter<MemoryEntry>(
          Iter.toArray(textMap.vals(memories)),
          func(memory) {
            Text.contains(memory.caption, #text searchTerm) or
            Text.contains(memory.notes, #text searchTerm) or
            Array.find<Text>(memory.tags, func(tag) { Text.contains(tag, #text searchTerm) }) != null or
            Text.contains(memory.category, #text searchTerm)
          },
        );
        results;
      };
    };
  };

  public query ({ caller }) func filterByTag(tag : Text) : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) {
        let results = Array.filter<MemoryEntry>(
          Iter.toArray(textMap.vals(memories)),
          func(memory) {
            Array.find<Text>(memory.tags, func(t) { t == tag }) != null;
          },
        );
        results;
      };
    };
  };

  public query ({ caller }) func filterByCategory(category : Text) : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) {
        let results = Array.filter<MemoryEntry>(
          Iter.toArray(textMap.vals(memories)),
          func(memory) {
            memory.category == category;
          },
        );
        results;
      };
    };
  };

  public query ({ caller }) func filterByContentType(contentType : ContentType) : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) {
        let results = Array.filter<MemoryEntry>(
          Iter.toArray(textMap.vals(memories)),
          func(memory) {
            memory.contentType == contentType;
          },
        );
        results;
      };
    };
  };

  public query ({ caller }) func getFavorites() : async [MemoryEntry] {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { [] };
      case (?memories) {
        let results = Array.filter<MemoryEntry>(
          Iter.toArray(textMap.vals(memories)),
          func(memory) {
            memory.isFavorite;
          },
        );
        results;
      };
    };
  };

  public shared ({ caller }) func toggleFavorite(id : Text) : async Bool {
    switch (principalMap.get(userMemories, caller)) {
      case (null) { false };
      case (?memories) {
        switch (textMap.get(memories, id)) {
          case (null) { false };
          case (?memory) {
            let updated : MemoryEntry = {
              id = memory.id;
              caption = memory.caption;
              notes = memory.notes;
              tags = memory.tags;
              category = memory.category;
              mediaFiles = memory.mediaFiles;
              timestamp = memory.timestamp;
              isFavorite = not memory.isFavorite;
              contentType = memory.contentType;
            };
            let updatedMemories = textMap.put(memories, id, updated);
            userMemories := principalMap.put(userMemories, caller, updatedMemories);
            true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func addTag(name : Text) : async Text {
    let id = Text.concat("tag-", debug_show (Time.now()));
    let tag : Tag = {
      id;
      name;
    };

    let userTagsMap = switch (principalMap.get(userTags, caller)) {
      case (null) { textMap.empty<Tag>() };
      case (?tags) { tags };
    };

    let updatedTags = textMap.put(userTagsMap, id, tag);
    userTags := principalMap.put(userTags, caller, updatedTags);
    id;
  };

  public shared ({ caller }) func addCategory(name : Text) : async Text {
    let id = Text.concat("category-", debug_show (Time.now()));
    let category : Category = {
      id;
      name;
    };

    let userCategoriesMap = switch (principalMap.get(userCategories, caller)) {
      case (null) { textMap.empty<Category>() };
      case (?categories) { categories };
    };

    let updatedCategories = textMap.put(userCategoriesMap, id, category);
    userCategories := principalMap.put(userCategories, caller, updatedCategories);
    id;
  };

  public query ({ caller }) func getAllTags() : async [Tag] {
    switch (principalMap.get(userTags, caller)) {
      case (null) { [] };
      case (?tags) { Iter.toArray(textMap.vals(tags)) };
    };
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    switch (principalMap.get(userCategories, caller)) {
      case (null) { [] };
      case (?categories) { Iter.toArray(textMap.vals(categories)) };
    };
  };

  public shared func registerFileReference(path : Text, hash : Text) : async () {
    Registry.add(registry, path, hash);
  };

  public query func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared func dropFileReference(path : Text) : async () {
    Registry.remove(registry, path);
  };

  public shared ({ caller }) func createSharedLink(memoryId : Text, permissions : Permissions, expires : ?Int) : async Text {
    let userMemoriesMap = switch (principalMap.get(userMemories, caller)) {
      case (null) { Debug.trap("No memories found for user") };
      case (?memories) { memories };
    };

    switch (textMap.get(userMemoriesMap, memoryId)) {
      case (null) { Debug.trap("Memory not found") };
      case (?_) {
        let id = Text.concat("shared-link-", debug_show (Time.now()));
        let link : SharedLink = {
          id;
          memoryId;
          owner = caller;
          permissions;
          created = Time.now();
          expires;
        };
        sharedLinks := textMap.put(sharedLinks, id, link);
        id;
      };
    };
  };

  public shared ({ caller }) func revokeSharedLink(linkId : Text) : async () {
    switch (textMap.get(sharedLinks, linkId)) {
      case (null) { Debug.trap("Shared link not found") };
      case (?link) {
        if (link.owner != caller) {
          Debug.trap("Only the owner can revoke this link");
        };
        let (updatedLinks, _) = textMap.remove(sharedLinks, linkId);
        sharedLinks := updatedLinks;
      };
    };
  };

  public query func accessSharedMemory(linkId : Text) : async ?MemoryEntry {
    switch (textMap.get(sharedLinks, linkId)) {
      case (null) { null };
      case (?link) {
        if (link.expires != null and Time.now() > Option.get(link.expires, 0)) {
          let (updatedLinks, _) = textMap.remove(sharedLinks, linkId);
          sharedLinks := updatedLinks;
          null;
        } else {
          switch (principalMap.get(userMemories, link.owner)) {
            case (null) { null };
            case (?memories) { textMap.get(memories, link.memoryId) };
          };
        };
      };
    };
  };

  public shared func editSharedMemory(linkId : Text, updatedMemory : MemoryEntry) : async () {
    switch (textMap.get(sharedLinks, linkId)) {
      case (null) { Debug.trap("Shared link not found") };
      case (?link) {
        if (not link.permissions.canEdit) {
          Debug.trap("Edit permission denied");
        };
        switch (principalMap.get(userMemories, link.owner)) {
          case (null) { Debug.trap("Owner's memories not found") };
          case (?memories) {
            let updatedMemories = textMap.put(memories, updatedMemory.id, updatedMemory);
            userMemories := principalMap.put(userMemories, link.owner, updatedMemories);
          };
        };
      };
    };
  };

  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };
};

