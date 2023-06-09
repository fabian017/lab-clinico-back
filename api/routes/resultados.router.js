const express = require("express");
const passport = require('passport');

const ResultadosService = require('./../services/resultados.service');
const AuthService = require('./../services/auth.service');

const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('./../middlewares/auth.handler');
const { createResultadoSchema, updateResultadoSchema, getResultadoSchema, queryResultadoSchema } = require('./../schemas/resultado.schema');

const router = express.Router();
const service =  new ResultadosService();
const authService = new AuthService();

router.get("/",
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(queryResultadoSchema, 'query'),
    async (req, res,next) =>{
    try {
      const resultados = await service.find(req.query);
      res.json(resultados);
    } catch (error) {
      next(error);
    }
});

router.get('/:idResultado',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(getResultadoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { idResultado } = req.params;
      const resultado = await service.findOne(idResultado);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
});

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(createResultadoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newResultado = await service.create(body);
      const email = authService.sendNewResultado(body.userId);
      res.status(201).json(newResultado);
    } catch (error) {
      next(error);
    }
});

router.patch('/:idResultado',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(getResultadoSchema, 'params'),
  validatorHandler(updateResultadoSchema, 'body'),
  async (req, res, next) => {
    try {
      const { idResultado } = req.params;
      const body = req.body;
      const resultado = await service.update(idResultado, body);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
});

router.delete('/:idResultado',
  passport.authenticate('jwt', {session: false}),
  checkRoles('ADMIN', 'ANALISTA'),
  validatorHandler(getResultadoSchema, 'params'),
  async (req, res, next) => {
    try {
      console.log('aaaaa')
      const { idResultado } = req.params;
      await service.delete(idResultado);
      res.status(201).json({idResultado});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
