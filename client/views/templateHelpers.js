fbId = function fbId() {
  var user = Meteor.user();
  if(user && user.services && user.services.facebook) {
    return Meteor.user().services.facebook.id;
  } else {
    return undefined;
  }
};

UI.registerHelper("fbId", fbId);

getNameUsingFbId = function getNameUsingFbId(context, options) {
  var user = Meteor.users.findOne({"services.facebook.id": context});
  if(user) {
    return user.profile.name;
  } else {
    return null;
  }
};

UI.registerHelper("getNameUsingFbId", getNameUsingFbId);

getName = function getName(context, options) {
  var user = Meteor.user();
  if(user) {
    return user.profile.name;
  } else {
    return null;
  }
};

UI.registerHelper("getName", getName);

isChallenged = function isChallenged(context, options) {
  var ids = [fbId(), context];
  var query = {sourceId: {$in: ids}, targetId: {$in: ids}, ongoing: true};
  return Games.find(query).count() > 0;
};

UI.registerHelper("isChallenged", isChallenged);

profilePicUrl = function profilePicUrl(context, options) {
  if(context)
    return "http://graph.facebook.com/"+context+"/picture/?type=square";
  return "";
};

UI.registerHelper("profilePicUrl", profilePicUrl);

getOpponentName = function getOpponentName(sourceId, targetId) {
  return getNameUsingFbId(sourceId === fbId() ? targetId : sourceId);
};

UI.registerHelper("getOpponentName", getOpponentName);

myTurn = function myTurn(turn, sourceId) {
  if(turn % 2 === 0) {
    return sourceId === fbId();
  } else {
    return sourceId !== fbId();
  }
};

UI.registerHelper("myTurn", myTurn);

UI.registerHelper('eq', function(v1, v2, options) {
  return (v1 === v2);
});

UI.registerHelper('gt', function(v1, v2, options) {
  return (v1 > v2);
});

UI.registerHelper('lt', function(v1, v2, options) {
  return (v1 < v2);
});
