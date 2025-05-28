import express from 'express';
import TeacherCreateRequest from '../models/Teachers/TeacherCreateRequest.js';
import TeacherUpdateRequest from '../models/Teachers/TeacherUpdateRequest.js';
import TeacherDeleteRequest from '../models/Teachers/TeacherDeleteRequest.js';
import TeacherController from '../controllers/TeacherController.js';


const TeacherRouter = express.Router();

// Create teacher
TeacherRouter.post("/create", (req, res) => {
    const teacherCreateRequest = new TeacherCreateRequest(req.body);
    const created = new TeacherController().createTeacher(teacherCreateRequest);
    created
        .then(success => res.send(success))
        .catch(error => res.send(error));
});

// Get all teachers with pagination
TeacherRouter.get("/all", (req, res) => {
    const { page = 1, limit = 10, sort, ...filters } = req.query;

    const paginationParams = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        filters
    };

    const teachers = new TeacherController().getTeachers(paginationParams);
    teachers
        .then(success => res.send(success))
        .catch(error => res.send(error));
});

// Update teacher by ID
TeacherRouter.put("/:id", (req, res) => {
    const teacherUpdateRequest = new TeacherUpdateRequest(req.body);
    const updated = new TeacherController().updateTeacher(req.params.id, teacherUpdateRequest);
    updated
        .then(success => res.send(success))
        .catch(error => res.send(error));
});

// Delete teacher by ID
TeacherRouter.delete("/:id", (req, res) => {
    const teacherDeleteRequest = new TeacherDeleteRequest({ id: req.params.id });
    const deleted = new TeacherController().deleteTeacher(teacherDeleteRequest);
    deleted
        .then(success => res.send(success))
        .catch(error => res.send(error));
});

export default TeacherRouter;
