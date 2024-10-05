import express from 'express';
import { CreateSupportAccount, deleteSupportMember, getAllSupportMembers, getSupportMember, updateSupportMember } from '../controllers/SupportController.js';
import { CreateTeacherAccount, deleteTeacher, getAllTeachers, getTeacher, updateTeacher } from '../controllers/TeacherContraller.js';
import { getOverview } from '../controllers/AdminControlller.js';
import { gradeUp } from '../controllers/ClassController.js';
import { isAdmin, LoginValidator } from '../middlewares/LoggedIn.js';


const adminRouter = express.Router();

//added login validator
adminRouter.get('/get-overview', LoginValidator, isAdmin, getOverview);
adminRouter.get('/get-all-support', getAllSupportMembers);
adminRouter.get('/get-support/:email', getSupportMember);
adminRouter.put('/update-support/:email', updateSupportMember);
adminRouter.delete('/delete-support/:email', deleteSupportMember);
adminRouter.post('/create-support', CreateSupportAccount);

adminRouter.get('/get-all-teachers', getAllTeachers);
adminRouter.get('/get-teacher/:email', getTeacher);
adminRouter.put('/update-teacher/:email', updateTeacher);
adminRouter.delete('/delete-teacher/:email', deleteTeacher);
adminRouter.post('/create-teacher', CreateTeacherAccount);
adminRouter.get('/grade-up', gradeUp);


export default adminRouter;