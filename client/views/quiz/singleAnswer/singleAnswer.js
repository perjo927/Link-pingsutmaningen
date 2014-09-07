Template.singleAnswer.events = {
  "click .singleAnswer-answer": function (event) {
    if(Session.get("answersLocked")) return;
    Session.set("answersLocked", true);
    if(this.correct) {
      $(event.target).addClass("btn-success");
      Session.set("points", Session.get("points") + PointsPerQuestion);
    } else {
      // TODO: Markera rätt svar
      $(".correct-answer").addClass("btn-success");
      $(event.target).addClass("btn-danger");
    }
    Meteor.setTimeout(function () {
      $(".correct-answer").removeClass("btn-success");
      $(event.target).removeClass("btn-success btn-danger").addClass("btn-primary");
      Session.set("whiteScreen", true);
    }, 2500);
  }
};