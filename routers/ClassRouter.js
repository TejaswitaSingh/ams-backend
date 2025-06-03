import express from "express";
import ClassCreateRequest from "../models/Class/ClassCreateRequest.js";
import ClassUpdateRequest from "../models/Class/ClassUpdateRequest.js";
import ClassDeleteRequest from "../models/Class/ClassDeleteRequest.js";
import ClassController from "../controllers/classController.js";

const ClassRouter = express.Router();

// Create class
ClassRouter.post("/create", (req, res) => {
  const classCreateRequest = new ClassCreateRequest(req.body);
  const classCreated = new ClassController().createClass(classCreateRequest);
  classCreated.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});


// Get class
ClassRouter.get("/", (req, res) => {
  const { page = 1, limit = 10, sort, ...filters } = req.query;

  const paginationParams = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    filters,
  };

  const classRead = new ClassController().getClasses(paginationParams);
  classRead
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

// Get single class by ID
ClassRouter.get("/:id", (req, res) => {
  const classDetails = new ClassController().getClassById(req.params.id);
  classDetails
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});



// Update class
ClassRouter.put("/:id", (req, res) => {
  const classUpdateRequest = new ClassUpdateRequest(req.body);
  const classUpdate = new ClassController().updateClass(req.params.id, classUpdateRequest);
  classUpdate
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});



// Delete class
ClassRouter.delete("/:id", (req, res) => {
  console.log(req.params.id, "router id")
  const classDeleteRequest = new ClassDeleteRequest({ classId: req.params.id });
  const classDelete = new ClassController().deleteClass(classDeleteRequest);
  classDelete
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

export default ClassRouter;
