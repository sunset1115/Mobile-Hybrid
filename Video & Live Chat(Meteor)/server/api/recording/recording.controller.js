'use strict';

var _ = require('lodash');
var Recording = require('./recording.model');
var User = require('../user/user.model');
var Q = require('q');

// Get list of recordings
exports.index = function (req, res, next) {
  Recording.find({"creator.email": req.user.email}, function(err, recordings) {
    if(err) { return handleError(res, err); }
    if (!recordings) {return res.json([]);}
    return res.json({data: recordings});
  })
}

// Get a single recording
exports.show = function(req, res) {
  Recording.findById(req.params.id, function (err, recording) {
    if(err) { return handleError(res, err); }
    if(!recording) { return res.send(404); }
    return res.json(recording);
  });
};

// Creates a new recording in the DB.
exports.create = function(req, res) {
  Recording.create(req.body, function(err, recording) {
    if(err) { return handleError(res, err); }
    return res.json(201, recording);
  });
};

// Updates an existing recording in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Recording.findById(req.params.id, function (err, recording) {
    if (err) { return handleError(res, err); }
    if(!recording) { return res.send(404); }
    var updated = _.merge(recording, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, recording);
    });
  });
};

// Deletes a recording from the DB.
exports.destroy = function(req, res) {
  Recording.findById(req.params.id, function (err, recording) {
    if(err) { return handleError(res, err); }
    if(!recording) { return res.send(404); }
    recording.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Get list of recordings belonging to user
// exports.getUserRecordings = function(req, res, next) {
//   // console.log('req.user: ');
//   // console.log(req.user);
//   Recording.find({ creator: req.user.email }, 'url creator partner date',
//  // Recording.find({ $or: [ { creator: req.user._id }, { partner: req.user._id } ] }, 'filename creator partner date',
//     function(err, recordings) {
//       // modify recordings, then res.json & error handling
//       var promises = [];
//       var renaming = function(){
//         recordings.forEach(function(rec){
          
//           console.log('req user id: ');
//           console.log(typeof req.user._id);

//           console.log('rec partner: ');
//           console.log(typeof rec.partner);
          
//           console.log('rec creator: ');
//           console.log(rec.creator);
//           console.log(req.user._id + '' === rec.partner);
//           console.log('\n');
          
//           if (req.user._id + '' === rec.partner) {
//             console.log('req user is partner');
//             promises.push(
//               // 'ObjectId("' + '557225f274e416916f21a8e9' + '")'
//               // > db.users.findOne({_id: ObjectId('557225f274e416916f21a8e9')})
//               User.findById(rec.creator, function(err, doc){
//               // User.findOne({ _id: ObjectId(rec.creator) }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );

//           } else {
//             // console.log('req user is creator');
//             promises.push(
//               User.findOne({ _id: rec.partner }, function(err, doc){
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

//         res.json({recordings: recordings});
//       })
//       .catch(function(err){
//         return next(err);
//       })
//       .done();

//     }
//   );
// };

// this is stubbed out for now
// exports.getOneRecording = function(req, res, next) {
//   // console.log('REQ: ' + Object.keys(req));
//   // console.log('REQ: ' + Object.keys(req.route.stack));
//   // console.log('REQ: ' + JSON.stringify(req.params));
//   // Recording.find({ $or: [ { creator: req.user.email }, { partner: req.user.email } ] }, 'url creator partner date',
//   Recording.findById(req.params.id, 'filename creator partner date',
//   // Recording.findOne({  }, 'filename creator partner date',
//     function(err, rec) {
//       // modify recordings, then res.json & error handling
//       var promises = [];
//       // var renaming = function(){
//       //   recordings.forEach(function(rec){
//           console.log('req user id: ');
//           console.log(typeof req.user._id);

//           console.log('rec partner: ');
//           console.log(typeof rec.partner);
          
//           console.log('rec creator: ');
//           console.log(rec.creator);
//           console.log(req.user._id + '' === rec.partner);
//           console.log('\n');

//           if (req.user._id + '' === rec.partner) {
//             promises.push(
//               User.findById(rec.creator, function(err, doc){
//               // User.findOne({ _id: rec.creator }, function(err, doc){
//                 // console.log(doc.name);
//                 rec.partner = doc.name;
//               }).exec()
//             );

//           } else {
//             promises.push(
//               User.findById(rec.partner, function(err, doc){
//               // User.findOne({ _id: rec.partner }, function(err, doc){
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
//         // res.json({recording: rec});
//         res.json(rec);
//       })
//       .catch(function(err){
//         return next(err);
//       })
//       .done();

//     }
//   );
// };


function handleError(res, err) {
  return res.send(500, err);
}