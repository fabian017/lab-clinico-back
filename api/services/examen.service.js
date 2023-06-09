const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ExamenService{
  constructor(){}

  async create(data){
    const newExamen = await models.Examen.create(data);
    return newExamen;
    }

  async find(){
    const rta = await models.Examen.findAll();
    return rta;
  }

  async findOne(idExamen){
    const examen =  await models.Examen.findByPk(idExamen,{
      include: ['resultado']
    });
    if(!examen){
      throw boom.notFound('Examen no encontrado');
    }
    if(examen.isBlock){
      throw boom.conflict('Examen con acceso restringido');
    }
    return examen;
  }

  async update(idExamen, changes){
    const examen = await this.findOne(idExamen);
    const rta = await examen.update(changes);
    return rta;
  }

  async delete(idExamen){
    const examen = await models.Examen.findByPk(idExamen);
    await examen.destroy();
    return { idExamen };
  }

}

module.exports = ExamenService;
