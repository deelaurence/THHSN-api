import express from 'express';
import { 
    experienceSection,
    headerSection, 
    responsibilitiesSection,
    educationSection,
    liberalPrompting,
    initializeResume,
    skillsAndToolsSection,
    PromtskillsAndTools,
    promptCareerSummary,
    careerSummarySection
 } from '../controllers/dataCollection';
import auth from '../middleware/authentication';

const router = express.Router();
router.use(auth)


router.post('/initialize', initializeResume);
router.post('/header', headerSection);
router.post('/experiences', experienceSection);
router.post('/responsibilities', responsibilitiesSection);
router.post('/education', educationSection);
router.post('/core/:state', skillsAndToolsSection);
router.post('/get/core/:state', PromtskillsAndTools);
router.post('/get/career-summary', promptCareerSummary);
router.post('/career-summary', careerSummarySection);
router.post('/liberal', liberalPrompting);


export default router;
