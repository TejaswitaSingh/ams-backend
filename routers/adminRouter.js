import express from 'express';
import AdminRegisterRequest from '../models/AdminRegisterRequest.js';
import AdminLoginRequest from '../models/AdminLoginRequest.js';
import adminAuth from '../middleware/adminAuth.js';
import AdminCreateRequest from '../models/AdminCreateRequest.js';
import AdminUpdateRequest from '../models/AdminUpdateRequest.js';
import AdminDeleteRequest from '../models/AdminDeleteRequest.js';
import AdminController from '../controllers/adminController.js';

const AdminRouter = express.Router();

// Register
AdminRouter.post("/register", (req, res) => {
    const adminRegisterRequest = new AdminRegisterRequest(req.body);
    const adminRegistered = new AdminController().register(adminRegisterRequest);
    adminRegistered.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Login
AdminRouter.post("/login", (req, res) => {
    const adminLoginRequest = new AdminLoginRequest(req.body);
    const adminLoggedIn = new AdminController().login(adminLoginRequest);
    adminLoggedIn.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Create admin
AdminRouter.post("/create", (req, res) => {
    const adminCreateRequest = new AdminCreateRequest(req.body);
    const adminCreated = new AdminController().createAdmin(adminCreateRequest);
    adminCreated.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Get all admins with pagination
AdminRouter.get("/all", (req, res) => {
    const { page = 1, limit = 10, sort, ...filters } = req.query;
    
    const paginationParams = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        filters
    };

    const adminRead = new AdminController().getAdmins(paginationParams);
    adminRead.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Update admin
AdminRouter.put("/:id", (req, res) => {
    const adminUpdateRequest = new AdminUpdateRequest(req.body);
    const adminUpdate = new AdminController().updateAdmin(req.params.id, adminUpdateRequest);
    adminUpdate.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

// Delete admin
AdminRouter.delete("/:id", (req, res) => {
    const adminDeleteRequest = new AdminDeleteRequest({ id: req.params.id });
    const adminDelete = new AdminController().deleteAdmin(adminDeleteRequest);
    adminDelete.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});

export default AdminRouter;