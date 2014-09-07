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
  },
  whoWon: function() {
    var ret = {};
    if(this.targetId === fbId()) {
      ret.opponentId = this.sourceId;
      ret.opponentScore = this.sourceScore;
      ret.ourScore = this.targetScore;
      if(this.targetScore > this.sourceScore) {
        ret.type = "youWon";
      } else if(this.targetScore < this.sourceScore) {
        ret.type = "youLost";
      }
    } else {
      ret.opponentId = this.targetId;
      ret.opponentScore = this.targetScore;
      ret.ourScore = this.sourceScore;
      if(this.targetScore > this.sourceScore) {
        ret.type = "youLost";
      } else if(this.targetScore < this.sourceScore) {
        ret.type = "youWon";
      }
    }
    if(this.sourceScore === this.targetScore) {
      ret.type = "youTied";
    }
    if(ret.type === "youWon") {
      ret.className = "bg-success";
    } else if(ret.type === "youLost") {
      ret.className = "bg-danger";
    } else {
      ret.className = "bg-warning";
    }
    return ret;
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