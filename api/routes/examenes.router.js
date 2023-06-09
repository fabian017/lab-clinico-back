const express = require('express');
const passport = require('passport');

const ExamenService = require('./../services/examen.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { checkRoles } = require('./../middlewares/auth.handler');
const { updateExamenSchema, createExamenSchema, getExamenSchema } = require('./../schemas/examen.schema');

const router = express.Router();
const service = new ExamenService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  async (req, res, next) => {
    try {
      const resultados = await service.find();
      res.json(resultados);
    } catch (error) {
      next(error);
    }
});

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(getExamenSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const examen = await service.findOne(id);
      res.json(examen);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN'),
  validatorHandler(createExamenSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newExamen = await service.create(body);
      res.status(201).json(newExamen);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN'),
  validatorHandler(getExamenSchema, 'params'),
  validatorHandler(updateExamenSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const examen = await service.update(id, body);
      res.json(examen);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN'),
  validatorHandler(getExamenSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
