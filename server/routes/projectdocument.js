"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const projectdocument = require("../controllers/projectdocument");
const path = require("path") 
const fs = require("fs");
let multer = require('multer');
    let uuidv4 = require('uuid/v4');


const  uuuid = uuidv4();
const DIR = "/data";
const DIRwithu = DIR+"/"+uuuid;
if (!fs.existsSync(DIRwithu)){
  fs.mkdirSync(DIRwithu);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log('22--------------------------------------------------------req.file.filename',file);
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
      // console.log('33--------------------------------------------------------req.file.filename',file);
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,uuuid+'/'+fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // console.log('file',file);
      // console.log('11--------------------------------------------------------req.file.filename',file);
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
  // get project-document-list by project 
  logger.debug(`${callerClass} GET -> path: /api/project-document/:projid`);
  router.get("/api/project-document/:projid", projectdocument.listByProject);

  // Deactivate Entity by EntityId
  logger.debug(`${callerClass} PUT -> path: /api/project-document-deactivate/:id`);
  router.put("/api/project-document-deactivate/:id", projectdocument.deactivate);

  // get single project-document by project 
  logger.debug(`${callerClass} GET -> path: /api/project-document/:projid`);
  router.get("/api/project-document-single/:id", projectdocument.findById);

  
  // Get Project Persons By Project ID
  logger.debug(`${callerClass} PUT -> path: /api/project-persons-for-documents/:projectId`);
  router.get("/api/project-persons-for-documents/:projectId", projectdocument.projectPersonsForDocumentByProjectId);

      // Put document-project by id
      logger.debug(`${callerClass} PUT -> path: /api/project-document/:id`);
      router.put("/api/project-document/:id", upload.single('fileName'),projectdocument.updateProjectDocument);


  // Create Post Document for a project
  logger.debug(`${callerClass} POST -> path: /api/project-document/:projid=================================`);
  router.post("/api/project-document/:projid",upload.single('fileName'), projectdocument.createDocument);



  // router.post('/api/project-document/:projid', upload.single('fileName'), (req, res, next) => {
  //   console.log('req.file',req.file);
  //   console.log('req.file.filename',req.file.filename);
  //   console.log('req',req);
    // const url = req.protocol + '://' + req.get('host')
    // const user = new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     name: req.body.name,
    //     profileImg: url + '/public/' + req.file.filename
    // });
    // user.save().then(result => {
    //     res.status(201).json({
    //         message: "User registered successfully!",
    //         userCreated: {
    //             _id: result._id,
    //             profileImg: result.profileImg
    //         }
    //     })
    // }).catch(err => {
    //     console.log(err),
    //         res.status(500).json({
    //             error: err
    //         });
    // })
// })

  // router.get("/api/action/findAll", projectaction.findAll);

  // // Post action-project by project
  // logger.debug(`${callerClass} POST -> path: /api/action-project/:projid`);
  // router.post("/api/action-project/:projid", projectaction.createProjectAction);

  // // Put action-project by project
  // logger.debug(`${callerClass} PUT -> path: /api/action-project/:projid`);
  // router.put("/api/action-project/:actionId", projectaction.updateProjectAction);

  //   // Deactivate action-project by ActionId
  //   logger.debug(`${callerClass} PUT -> path: /api/action-project-deactivate/:actionId`);
  //   router.put("/api/action-project-deactivate/:actionId", projectaction.deactivateProjectAction);

  // // Find action-project by ID
  // logger.debug(`${callerClass} Find -> path: /api/action-project-id/:id`);
  // router.get("/api/action-project-id/:id", projectaction.findById);

  // router.get("/api/project-action-persons/:projectId", projectaction.projectActionPersonsByProjectId);
};
