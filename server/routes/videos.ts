import express from 'express';
import { addVideo, addView, deleteVideo, getAllVideos, getVideo, random, search, sub, tags, trend, updateVideo } from '../controllers/video.js';
import verifyToken from '../middlewares/verifyToken.js';

const videoRoutes = express.Router();

videoRoutes.post('/', verifyToken, addVideo); //done
videoRoutes.put('/:videoId', verifyToken, updateVideo); //done
videoRoutes.delete('/:videoId', verifyToken, deleteVideo); //done
videoRoutes.get('/find/:videoId', getVideo); //done
videoRoutes.put('/view/:videoId', addView); //done
videoRoutes.get('/allVideos/:userId', getAllVideos);
videoRoutes.get('/random', random);
videoRoutes.get('/trend', trend);
videoRoutes.get('/sub', verifyToken, sub);
videoRoutes.get('/tags', tags);
videoRoutes.get('/search', search);


export default videoRoutes;