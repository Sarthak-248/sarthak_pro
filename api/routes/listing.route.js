import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Apply the `upload.single()` middleware for image upload
router.post('/create', verifyToken, upload.single('image'), createListing);
router.post('/update/:id', verifyToken, upload.single('image'), updateListing);

router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/edit-listing', updateListing);

export default router;
