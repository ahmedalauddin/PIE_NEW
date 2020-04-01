"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const organizationdocument = require("../controllers/organizationdocument");
const path = require("path") 

let multer = require('multer');
    let uuidv4 = require('uuid/v4');


const DIR = "/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // console.log('file',file);
      // console.log('req.file.filename',req.file.filename);
      // console.log('req',req);
        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        // } else {
        //     cb(null, false);
        //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        // }
    }
});

    


module.exports = router => {
  const callerClass = "router";
  // get organization-document-list by project 
  logger.debug(`${callerClass} GET -> path: /api/organization-document/:orgId`);
  router.get("/api/organization-document/:orgId", organizationdocument.listByOrganization);

  // Deactivate Entity by EntityId
  logger.debug(`${callerClass} PUT -> path: /api/organization-document-deactivate/:id`);
  router.put("/api/organization-document-deactivate/:id", organizationdocument.deactivate);

  // get single organization-document by project 
  logger.debug(`${callerClass} GET -> path: /api/organization-document/:projid`);
  router.get("/api/organization-document-single/:id", organizationdocument.findById);

  
  // Get Project Persons By Project ID
//   logger.debug(`${callerClass} PUT -> path: /api/project-persons-for-documents/:projectId`);
//   router.get("/api/project-persons-for-documents/:projectId", organizationdocument.projectPersonsForDocumentByProjectId);

      // Put document-project by id
      logger.debug(`${callerClass} PUT -> path: /api/organization-document/:id`);
      router.put("/api/organization-document/:id", organizationdocument.updateorganizationdocument);


//   // Create Post Document for a project
  logger.debug(`${callerClass} POST -> path: /api/organization-document/:projid=================================`);
  router.post("/api/organization-document/:orgId",upload.single('fileName'), organizationdocument.createDocument);



};
