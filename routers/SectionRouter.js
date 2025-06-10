import express from "express";
import SectionController from "../controllers/SectionController.js";
import SectionCreateRequest from "../models/Sections/SectionCreateRequest.js";
import SectionUpdateRequest from "../models/Sections/SectionUpdateRequest.js";
import SectionDeleteRequest from "../models/Sections/SectionDeleteRequest.js";

const SectionRouter = express.Router();

// Create section
SectionRouter.post("/create", (req, res) => {
  const sectionCreateRequest = new SectionCreateRequest(req.body);
  const sectionCreated = new SectionController().createSection(sectionCreateRequest);
  sectionCreated
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

// Get sections
SectionRouter.get("/:classId", (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const paginationParams = {
    classId: req.params.classId,
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const sections = new SectionController().getSections(paginationParams);
  sections
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

// Update section
SectionRouter.put("/:id", (req, res) => {
  const sectionUpdateRequest = new SectionUpdateRequest(req.body);
  const sectionUpdate = new SectionController().updateSection(req.params.id, sectionUpdateRequest);
  sectionUpdate
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

// Delete section
SectionRouter.delete("/:id", (req, res) => {
  const sectionDeleteRequest = new SectionDeleteRequest({ sectionId: req.params.id });
  const sectionDelete = new SectionController().deleteSection(sectionDeleteRequest);
  sectionDelete
    .then((success) => res.send(success))
    .catch((error) => res.send(error));
});

export default SectionRouter;
