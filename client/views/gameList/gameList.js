var sortLatestTimestamp = {sort: {timestamp: -1}};

Template.gameList.helpers({
  incomingGame: function() {
    var query = {targetId: fbId(), accepted: false, ongoing: true};
    return Games.find(query, sortLatestTimestamp);
  },ongoingGame: function() {
    var query = {$and: [{$or: [{sourceId: fbId()}, {targetId: fbId()}]}, {ongoing: true}, {accepted: true}]};
    return Games.find(query, sortLatestTimestamp);
  },
  finishedGame: function() {
    var query = {$and: [{$or: [{sourceId: fbId()}, {targetId: fbId()}]}, {ongoing: false}]};
    return Games.find(query, sortLatestTimestamp);
  }
});

Template.gameList.events = {
  "click .play-turn": function() {
    Router.go("quiz/:quizId", {quizId: this._id});
  },
  "click .accept-invite": function() {
    Games.update({_id: this._id}, {$set: {accepted: true, timestamp: Date.now()}});
  },
  "click .deny-invite": function() {
    Games.update({_id: this._id}, {$set: {ongoing: false, timestamp: Date.now()}});
  }
};