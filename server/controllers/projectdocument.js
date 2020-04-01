"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const util = require("util");
const mailer = require("./mailer");


const path = require("path") 
const fs = require("fs");
let multer = require('multer');
    let uuidv4 = require('uuid/v4');


const  uuuid = uuidv4();
const DIR = "/";
const DIRwithu = DIR+"/"+uuuid;
if (!fs.existsSync(DIRwithu)){
  fs.mkdirSync(DIRwithu);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('22--------------------------------------------------------req.file.filename',file);
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
      console.log('33--------------------------------------------------------req.file.filename',file);
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,uuuid+'/'+fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // console.log('file',file);
      console.log('11--------------------------------------------------------req.file.filename',file);
      // console.log('req',req);
        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        // } else {
        //     cb(null, false);
        //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        // }
    }
});


module.exports = {
   listByProject(req, res) {
  logger.debug(`${callerType} Project Documents findAll by Project ID`);
  console.log('req',req.params);
  return models.ProjectDocument.findAll({
    
    include: [
      // {
      //   model: models.Project,
      //   as: "project"
      // },
      {
        model: models.Person,
        as: "person",
        required: true,
        attributes: ['firstName','lastName','disabled']
      },

    ],
    // raw:true,
    where: [
      {
        projId: req.params.projid,
        disabled: 0
      }
    ]
  })
    .then(_k => {
     logger.debug(
        `${callerType} Documents findByProjectId -> successful, title: ${_k}`
      );
      res.status(201).send(_k);
    })
    .catch(error => {
      logger.error(`${callerType} findById -> error: ${error.stack}`);
      res.status(400).send(error);
    });
},

  async deactivate(req, res) {
    const id = req.params.id;
    logger.debug(`${callerType} Deactivate -> Deactivate Document for id : ${id}`);
 
      return models.ProjectDocument.update({
        disabled: true
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} Deactivate ProjectDocument`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Project Document deactivated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },
//  // Find a Document by Id
 findById(req, res) {
  logger.error(`${callerType} Document Project, findById `);
  return models.ProjectDocument.findByPk(req.params.id, {
    include: [
      // {
      //   model: models.Project,
      //   as: "project"
      // },
      {
        model: models.Person,
        as: "person"
      }
    ]
  })
    .then(_k => {
      logger.debug(
        `${callerType} findById -> successful, title: ${_k.title}`
      );
      res.status(201).send(_k);
    })
    .catch(error => {
      logger.error(`${callerType} findById -> error: ${error.stack}`);
      res.status(400).send(error);
    });
},

  async createDocument(req, res) {
    // console.log('req--');
    // console.log(req.file)
    // return false;
    const title = req.body.title;
    const description = req.body.description;
    const fileName = req.file.filename;
    const projId = req.params.projid;
    const fileSize = req.file.size;
    const uploadBy = req.body.uploadBy;

    logger.debug(`${callerType} create -> New Project Document for project id : ${projId}`);
 
      return models.ProjectDocument.create({
        title,
        description,
        fileName,
        projId,
        fileSize,
        uploadBy
      })
        .then(ProjectDocument => {
         logger.debug(`${callerType} created Project Document`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Project Document " + title + " created successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} create -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  async updateProjectDocument(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const id = req.params.id;
    
    //console.log('----------------------------------------------------------------------------');
var obj = {};
    console.log(req.file);
    if(req.file == undefined){
obj = {
  title: title,
  description: description
}
    }else{
obj = {
  title: title,
  fileName:req.file.filename,
  fileSize:req.file.size,
  description: description
}
    }

    //console.log('----------------------------------------------------------------------------');

    logger.debug(`${callerType} Update -> Update Project Action for id : ${id}`);
 
      return models.ProjectDocument.update(obj,
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} Updated ProjectDocument`);
         
        })
        .then(() => {
         
          res.status(201).send({
            success: true,
            message: "Project Document " + title + " updated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  projectPersonsForDocumentByProjectId(req, res) {
    let sql = "select per.id, per.disabled, per.fullName from ProjectPersons pp, Persons per " +
      "where per.disabled = 0 and pp.personId = per.id and (pp.inProject = 1 OR pp.owner = 1) and projectId = " + req.params.projectId + " " +
      "order by per.fullName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} projectPersonsForDocumentByProjectId -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} projectPersonsForDocumentByProjectId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

};
