'use strict';

var User = require('./user.model');
var Recording = require('../recording/recording.model');
var Partnership = require('../partnership/partnership.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongoose = require('mongoose');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Gets a user's profile information by id
*/
exports.getProfile = function(req, res, next) {
  User.findOne({
    _id: req.params.id
  }, '-salt -hashedPassword', function(err, user) {
    if(err) return next(err);
    if(!user) return res.json(401);
    res.json(user);
  }
  )
};


/**
 * Changes user language preferences
 */
exports.changeUserPreferences = function(req, res, next) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(500);
    user.nativeLanguage = req.native;
    user.languageLearning = req.learning;
    user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
    });
  });
};

/**
 * Gets suggestions for language partners
 */
 exports.getSuggestedPartners = function(req, res, next) {
  var userId = req.user._id;
  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(500);
    // map language names into an array that can be used with '$in'
    var languageNames = [];
    for(var i = 0; i < user.languagesLearning.length; i++) {
      languageNames.push(user.languagesLearning[i].language);
    }
    // retrieves all users that speak the same language the user is learning 
    // and aren't already partners with the user
    User.find({'$and': [{ 'languagesSpeaking.language' : {'$in': languageNames } }
       , { '_id' : {'$nin': user.partners}}]}, 
      'name languagesLearning nativeLanguages languagesSpeaking pic',
      function(err, partners) {
        if(err) return next(err);
        res.json({partners: partners});
    });
  });
 };


/*** retrieves an array of all the user's partners. 
 each object in the array includes select data about 
 the partner and the id of the associated partnership 
 */
exports.getPartners = function(req, res, next) {
  var userId = mongoose.Types.ObjectId(req.user._id); // explicity convert string to ObjectId type
  User.findById(userId, function(err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(500); }
    var partners = [];
    // use partnerships array of found user to retrieve all user's partnerships
    Partnership.find({ '_id' : {'$in': user.partnerships }}).
      populate('recipient requester', // populate with select info 
        'name languagesLearning nativeLanguages languagesSpeaking pic country')
      .exec(function(err, partnerships) {
        if (err) { return handleError(res, err) };
        partnerships.forEach(function(partnership) {
          if(partnership.requester._id.equals(userId)) { // comparison using native ObjectId type
            partners.push({
              partnershipId: partnership._id,
              user: partnership.recipient
            });
          } else {
            partners.push({
              partnershipId: partnership._id,
              user: partnership.requester
            });
          }
        });
        res.json(partners);
      });
  });
};

/*** responds with an object that has two arrays
that describe the user's requests that the user 
is either waiting for or hasn't responded to 
 */
exports.getRequests = function(req, res, next) {
  var userId = mongoose.Types.ObjectId(req.user._id);
  User.findById(userId, function(err, user) {
    if (err) { return handleError(res, err) };
    if (!user) { return res.json(500); }
    var requests = {};
    requests.waitingOn = user.waitingOn;
    requests.notRespondedTo = user.notRespondedTo;
    res.json(requests);
  })
}

/**
 * Gets user recordings
 */

// exports.getUserRecordings = function(req, res, next) {
//   Recording.find({ $or: [ { creator: req.user.email }, { partner: req.user.email } ] }, 'url creator partner date',
//     function(err, recordings) {
//       // modify recordings, then res.json & error handling
//       var promises = [];
//       var renaming = function(){
//         recordings.forEach(function(rec){
//           if (req.user.email === rec.partner) {
//             promises.push(
//               User.findOne({ email: rec.creator }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );

//           } else {
//             promises.push(
//               User.findOne({ email: rec.partner }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );


//           }
//         });
//       };
//       renaming();  
//       Q.all(promises)
//       .then(function(value){
//         // console.log('RECORDINGS: ' + recordings);
//         // console.log('EMAIL: ' + req.user.email);
//         res.json({recordings: recordings});
//       })
//       .catch(function(err){
//         return next(err);
//       })
//       .done();

//     }
//   );
// };


// get single recording
// TODO: unbreak this

// exports.getOneRecording = function(req, res, next) {
//   // console.log('REQ: ' + Object.keys(req));
//   // console.log('REQ: ' + Object.keys(req.route.stack));
//   // console.log('REQ: ' + JSON.stringify(req.params));
//   // Recording.find({ $or: [ { creator: req.user.email }, { partner: req.user.email } ] }, 'url creator partner date',
//   Recording.findOne({  }, 'url creator partner date',
//     function(err, rec) {
//       // modify recordings, then res.json & error handling
//       var promises = [];
//       // var renaming = function(){
//       //   recordings.forEach(function(rec){
//           if (req.user.email === rec.partner) {
//             promises.push(
//               User.findOne({ email: rec.creator }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );

//           } else {
//             promises.push(
//               User.findOne({ email: rec.partner }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );

//           }
//         // });
//       // };
//       // renaming();  
//       Q.all(promises)
//       .then(function(value){
//         // console.log('RECORDINGS: ' + rec);
//         // console.log('EMAIL: ' + req.user.email);
//         res.json({recording: rec});
//       })
//       .catch(function(err){
//         return next(err);
//       })
//       .done();

//     }
//   );
// };


/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}