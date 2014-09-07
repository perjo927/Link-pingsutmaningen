var iconv, charConverter;
Meteor.startup(function () {
  proj4.defs["EPSG:3009"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  iconv = Iconv.Iconv;
  charConverter = new iconv('ISO-8859-1', 'UTF-8');
});

quiz_api = {};

quiz_api.poi = {};
quiz_api.poi.url = 'http://kartan.linkoping.se/isms/poi';
quiz_api.poi.args = {
    service: 'wfs',
    request: 'getfeature',
    version: '1.1.0'
};
quiz_api.poi.types = ['simhall_bassang','bad_ute','bibliotek','domstol','flygplatser','golf','konsthall','kyrka','museum','parkomraden','resecentrum','sjukhus','slott','teatrar','universitet'];


// Fetches XML data from url+args as JSON
quiz_api.get_data = function(url, args, callback) 
{
    HTTP.call('GET', url, {params:args},
	function(err, res) {
	    if (err) {
		callback(err);
	    } else {
		// Parse XML data to JSON
		    xml2js.parseString(utf8_decode(res.content), callback);
	    }
	}
    );
};

// Fetches POI data for all typenames in types
quiz_api.get_poi_data = function(types,callback) 
{
    // GET request arguments
    var args = {};
    for (var a in this.poi.args)
    {
	args[a] = this.poi.args[a];
    }
    args.typename = types.join(',');

    this.get_data(this.poi.url, args,
		  function a(err, result) 
		  {
		      if (!err) {
			  // Extract collection of POIs
			  callback(result['wfs:FeatureCollection']['gml:featureMember']);
		      }
		  });
    
};

quiz_api.map_location = function() {
    var callback = function(result) {
	var question = {template: "singleMapTarget"};
	question.answers = [];

var random = getRandomInt(0, 3);
	// Pick 4 random locations as answers
	for (var i = 0; i < 4; ++i)
	{
	    // Pick and remove random location
	    var temp = result.splice(Math.floor(Math.random()*result.length), 1)[0];
	    temp = temp[Object.keys(temp)[0]][0];
	    
	    // Extract info from location
	    var poi = {};
	    poi.answer = temp['ms:NAMN'][0];
	    poi.category = temp['ms:KATEGORI'][0];
	    //poi.address = temp['ms:ADRESS'][0];

	    // Add location to answers
	    question.answers.push(poi);	    

	    // Pick the first location as the correct answer
	    if (i == random) {
        poi.correct = true;
		    var bounds = temp['gml:boundedBy'][0]['gml:Envelope'][0];
    		var lower = bounds['gml:lowerCorner'][0].split(' ').reverse();
		    var upper = bounds['gml:upperCorner'][0].split(' ').reverse();
	
		// Extract geolocation for the correct answer
        question.loc = {};
        question.loc.lower_corner = proj4(proj4.defs["EPSG:3009"],proj4.defs["EPSG:4326"],lower).reverse();
        question.loc.upper_corner = proj4(proj4.defs["EPSG:3009"],proj4.defs["EPSG:4326"],upper).reverse();
		question.coords = question.loc.upper_corner;

	    }
	}
	Questions.insert(question);
    };
    this.get_poi_data(this.poi.types, callback);
};

/*********/
// STATS //

quiz_api.stats = {};
quiz_api.stats.url = 'http://opendata.linkoping.se/ws_opendata/main.asmx/GetFile';
quiz_api.stats.args = {
  CustomKey: '5f9931b807ac47c2bb2375d4cb35e239',
  filename: 'statistik_linkoping_befolkning_be01.px' // dependency
}
quiz_api.stats.types = ['population'];
quiz_api.stats.filenames = {population: 'statistik_linkoping_befolkning_be01.px'};

quiz_api.stats.getData = function(url,args, callback) {
  //
  //args.filename = this.filenames[statType];
  //
  HTTP.call("GET", url, {
        params: args
      },
      // callback
      function(err, res) {
        if (err) {
          callback(err);
        }
        else {
          var xml = res.content;
          xml2js.parseString(xml, callback);
        }
      });
};

quiz_api.getStatData = function(statType, callback){
  this.stats.getData(this.stats.url, this.stats.args, callback);
};

quiz_api.createStatQuestion = function(statType) {
  var callback = function(error, result) {
    var question = {};

    if(error) {
      console.log(error);
    } else {

      var px = Stats.parsePxData(result);
      switch(statType) {
        case "population":
          var answerFacts = Stats.populationStats(px);
            question.template = "singleAnswer";
          question.question = answerFacts.title;
          question.answers = [];

          correctAnswer = Math.floor(Math.random()*4)+1;

          for(var i = 0; i < 4; ++i) {
            var stat = {};
            if (i === correctAnswer) {
              stat.answer = answerFacts.answer;
              stat.correct = true;
            } else {
              stat.answer = Stats.fakeAnAnswer(answerFacts.answer);
            }
            question.answers.push(stat);
          }
          break;
        default:
          break;
      }

    }
    //console.log(question);
    Questions.insert(question);
    //coll.insert(question);
  };
  this.getStatData(statType, callback);
};