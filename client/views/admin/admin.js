Template.admin.events = {
  "click .generate-map-question": function (event) {
    Meteor.call("mapLocation");
  },
  "click .generate-population-question": function (event) {
    Meteor.call("populationQuestion");
  }
};