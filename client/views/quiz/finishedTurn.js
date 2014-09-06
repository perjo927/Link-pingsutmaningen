Template.finishedTurn.rendered = function () {
  var finalPoints = Session.get("points");
  var pointQuery = {$inc: {}};
  if(this.data.sourceId === fbId()) {
    pointQuery['$inc'].sourceScore = finalPoints;
  } else {
    pointQuery['$inc'].targetScore = finalPoints;
  }
  Games.update({_id: this.data._id}, pointQuery);
  var realTurn = this.data.turn - (this.data.turn % 2 == 0 ? 1 : 0);
  if(this.data.turn >= NumTurns * 2) {
    Games.update({_id: this.data._id}, {$set: {ongoing: false}});
  } else {
    Games.update({_id: this.data._id}, {$inc: {turn: 1}});
  }
  Games.update({_id: this.data._id}, {$set: {timestamp: Date.now()}});
};

Template.finishedTurn.helpers({
  points: function() {
    return Session.get("points");
  },
  maxPoints: function() {
    return QuestionsPerTurn * PointsPerQuestion;
  }
});