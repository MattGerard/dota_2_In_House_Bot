var mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect('mongodb://localhost/dota_house');
  // Create your schemas and models here.

  var mmrSchema = new mongoose.Schema({
      steamID: String
    , initialSoloMMR: Number
    , initialPartyMMR: Number
    , created: {
      type: Date,
      default: Date.now
    },
  });

  // Compile a 'Mmr' model using the mmrSchema as the structure.
  // Mongoose also creates a MongoDB collection called 'Mmr' for these documents.
  var Mmr = mongoose.model('Mmr', mmrSchema);
  module.exports = Mmr; // this is what you want