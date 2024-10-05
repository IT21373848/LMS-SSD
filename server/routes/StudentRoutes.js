import express from 'express';
import { CreateStudentAccount, getStudentDetails, getAllStudents, getStudentsByClassId, updateStudentById, deleteStudentById, getAllSubjectsInClassUsingStId, getClassMatesUsingStId, getStudentOverview } from '../controllers/StudentController.js';
import { LoginValidator } from '../middlewares/LoggedIn.js';
import { getSubjectTeacher } from '../controllers/SubjectController.js';
import { getMarksByStudentId } from '../controllers/MarksController.js';
import { createMessage } from '../controllers/MessageController.js';
import { getNewUsers } from '../controllers/UserController.js';

const studentRouter = express.Router();

// Student-related routes
studentRouter.get('/', LoginValidator, getStudentDetails);
studentRouter.get('/get-student-overview', LoginValidator, getStudentOverview);
studentRouter.get('/get-subjects', LoginValidator, getAllSubjectsInClassUsingStId);
studentRouter.get('/get-classmates', LoginValidator, getClassMatesUsingStId);
studentRouter.get('/get-subject/:id', getSubjectTeacher);
studentRouter.get('/new-users', getNewUsers);
studentRouter.get('/students', getAllStudents)
studentRouter.post('/create-student', CreateStudentAccount);
studentRouter.get('/:classId', getStudentsByClassId);
;
studentRouter.put('/update-student/:id', updateStudentById);
studentRouter.delete('/delete-student/:id', deleteStudentById);
studentRouter.get('/get-marks-by-student/:id', getMarksByStudentId);
studentRouter.post('/send-message', LoginValidator, createMessage);

export default studentRouter;
