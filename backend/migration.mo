import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
  type OldActor = {
    memories : OrderedMap.Map<Text, {
      id : Text;
      caption : Text;
      notes : Text;
      tags : [Text];
      category : Text;
      mediaFiles : [{
        id : Text;
        fileName : Text;
        fileType : {
          #jpeg;
          #png;
          #mp4;
          #mp3;
          #wav;
          #jpg;
          #m4a;
        };
        filePath : Text;
        fileHash : Text;
      }];
      timestamp : Int;
      isFavorite : Bool;
      contentType : {
        #photo;
        #video;
        #audio;
        #screenshot;
        #text;
      };
    }>;
    tags : OrderedMap.Map<Text, { id : Text; name : Text }>;
    categories : OrderedMap.Map<Text, { id : Text; name : Text }>;
  };

  type NewActor = {
    userMemories : OrderedMap.Map<Principal, OrderedMap.Map<Text, {
      id : Text;
      caption : Text;
      notes : Text;
      tags : [Text];
      category : Text;
      mediaFiles : [{
        id : Text;
        fileName : Text;
        fileType : {
          #jpeg;
          #png;
          #mp4;
          #mp3;
          #wav;
          #jpg;
          #m4a;
        };
        filePath : Text;
        fileHash : Text;
      }];
      timestamp : Int;
      isFavorite : Bool;
      contentType : {
        #photo;
        #video;
        #audio;
        #screenshot;
        #text;
      };
    }>>;
    userTags : OrderedMap.Map<Principal, OrderedMap.Map<Text, { id : Text; name : Text }>>;
    userCategories : OrderedMap.Map<Principal, OrderedMap.Map<Text, { id : Text; name : Text }>>;
    sharedLinks : OrderedMap.Map<Text, {
      id : Text;
      memoryId : Text;
      owner : Principal;
      permissions : { canView : Bool; canEdit : Bool };
      created : Int;
      expires : ?Int;
    }>;
  };

  public func run(_old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    let principalMap = OrderedMap.Make<Principal>(Principal.compare);

    let userMemories = principalMap.empty<OrderedMap.Map<Text, {
      id : Text;
      caption : Text;
      notes : Text;
      tags : [Text];
      category : Text;
      mediaFiles : [{
        id : Text;
        fileName : Text;
        fileType : {
          #jpeg;
          #png;
          #mp4;
          #mp3;
          #wav;
          #jpg;
          #m4a;
        };
        filePath : Text;
        fileHash : Text;
      }];
      timestamp : Int;
      isFavorite : Bool;
      contentType : {
        #photo;
        #video;
        #audio;
        #screenshot;
        #text;
      };
    }>>();

    let userTags = principalMap.empty<OrderedMap.Map<Text, { id : Text; name : Text }>>();
    let userCategories = principalMap.empty<OrderedMap.Map<Text, { id : Text; name : Text }>>();
    let sharedLinks = textMap.empty<{
      id : Text;
      memoryId : Text;
      owner : Principal;
      permissions : { canView : Bool; canEdit : Bool };
      created : Int;
      expires : ?Int;
    }>();

    {
      userMemories;
      userTags;
      userCategories;
      sharedLinks;
    };
  };
};

