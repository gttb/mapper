(function () {
  'use strict';
  var Foxx = require('org/arangodb/foxx'),
    ArangoError = require('org/arangodb').ArangoError,
    email_map_repo = require('repositories/email_map').Repository,
    Email_map = require('models/Email_map').Model,
    joi = require('joi'),
    _ = require('underscore'),
    controller,
    Email_mapDescription = {
      type: joi.string().required().description(
        'The id of the Email_map-Item'
      ),
      allowMultiple: false
    },
    Email_map_repo;

  controller = new Foxx.Controller(applicationContext);

  Email_map_repo = new email_map_repo(applicationContext.collection('email_map'), {
    model: Email_map
  });


  /** Lists of all Email_map
   *
   * This function simply returns the list of all Email_map.
   */
  controller.get('/email_map', function (req, res) {
    res.json(_.map(Email_map_repo.all(), function (model) {
      return model.forClient();
    }));
  });

  /** Creates a new Email_map
   *
   * Creates a new Email_map-Item. The information has to be in the
   * requestBody.
   */
  controller.post('/email_map', function (req, res) {
    var email_map = req.params('email_map');
    res.json(Email_map_repo.save(email_map).forClient());
  }).bodyParam('email_map', {
    description: 'The Email_map you want to create',
    type: Email_map
  });

  /** Reads a Email_map
   *
   * Reads a Email_map-Item.
   */
  controller.get('/email_map/:id', function (req, res) {
    var id = req.params('id');
    res.json(Email_map_repo.byId(id).forClient());
  }).pathParam('id', Email_mapDescription);

  /** Updates a Email_map
   *
   * Changes a Email_map-Item. The information has to be in the
   * requestBody.
   */
  controller.put('/email_map/:id', function (req, res) {
    var id = req.params('id'),
    email_map = req.params('email_map');
    res.json(Email_map_repo.replaceById(id, email_map));
  }).pathParam('id', Email_mapDescription
  ).bodyParam('email_map', 'The Email_map you want your old one to be replaced with', Email_map);

  /** Removes a Email_map
   *
   * Removes a Email_map-Item.
   */
  controller.del('/email_map/:id', function (req, res) {
    var id = req.params('id');
    Email_map_repo.removeById(id);
    res.json({ success: true });
  }).pathParam('id', Email_mapDescription
  ).errorResponse(ArangoError, 404, 'The document could not be found');

    /** Search a email_map by id/email
     *
     * Searches for a manager email
     * with a specific id attribute.
     */
    controller.get('/email_map/managerof/:id', function (req, res) {
            var id = req.params('id');
            var query = Foxx.createQuery({
                query: 'FOR user IN @@collection FILTER user.id==@id RETURN user.manager',
                params: ['@collection', 'id']
            });
            var managers = query(Email_map_repo.collection.name(), id);
            res.json(managers);
        }
    ).pathParam('id', {description: 'User id/email', type: joi.string().email().required()});



}());

