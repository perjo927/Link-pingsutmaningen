Template.singleAnswer.events = {
  "click button": function (event) {
    if(Session.get("answersLocked")) return;
    Session.set("answersLocked", true);
    if(this.correct) {
      $(event.target).addClass("btn-success");
      Session.set("points", Session.get("points") + PointsPerQuestion);
    } else {
      // TODO: Markera rätt svar
      $(event.target).addClass("btn-danger");
    }
    var nextQuestion = Session.get("questionNumber") + 1;
    Meteor.setTimeout(function () {
      $(event.target).removeClass("btn-success btn-danger").addClass("btn-primary");
      Session.set("questionNumber", nextQuestion);
    }, 500);
  }
};