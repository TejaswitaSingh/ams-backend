import express from 'express';
import StudentCreateRequest from '../models/Students/StudentCreateRequest.js';
import StudentUpdateRequest from '../models/Students/StudentUpdateRequest.js';
import StudentDeleteRequest from '../models/Students/StudentDeleteRequest.js';
import StudentController from '../controllers/studentController.js';

const StudentRouter = express.Router();

// Create student
StudentRouter.post("/", (req, res) => {
    const studentCreateRequest = new StudentCreateRequest(req.body);
    const studentCreated = new StudentController().createStudent(studentCreateRequest);
    studentCreated.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Get all students with pagination
StudentRouter.get("/", (req, res) => {
    const { page = 1, limit = 10, sort, ...filters } = req.query;
    
    const paginationParams = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        filters
    };

    const studentsRead = new StudentController().getStudents(paginationParams);
    studentsRead.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Get single student by ID
StudentRouter.get("/:id", (req, res) => {
    const studentDetails = new StudentController().getStudentById(req.params.id);
    studentDetails.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Update student
StudentRouter.put("/:id", (req, res) => {
    const studentUpdateRequest = new StudentUpdateRequest(req.body);
    const studentUpdate = new StudentController().updateStudent(req.params.id, studentUpdateRequest);
    studentUpdate.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Delete student
StudentRouter.delete("/:id", (req, res) => {
    const studentDeleteRequest = new StudentDeleteRequest({ id: req.params.id });
    const studentDelete = new StudentController().deleteStudent(studentDeleteRequest);
    studentDelete.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

export default StudentRouter;