Meteor.publish("games", function () {
  return Games.find({});
});

Meteor.publish("questions", function () {
  return Questions.find({});
});

Meteor.publish("users", function () {
  return Meteor.users.find({});
});
