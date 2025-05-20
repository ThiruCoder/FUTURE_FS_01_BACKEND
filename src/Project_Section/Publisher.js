import ProjectModel from '../Database_Section/Models/ProjectModel.js';
import { uploadFile } from './cloudinaryUpload.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary } from './cloudinaryConfig.js';
import { logger } from '../../utils/logger.js';

const createProject = async (req, res) => {
    let { name, description, url, status, tags, priority } = req.body;
    const { role } = req.user;
    logger.info(req.body)

    try {
        if (role !== 'admin') {
            logger.warn('Unauthorized - Only admin can access.');
            return res.status(401).json({
                message: 'Unauthorized - Only admin can access.',
                success: false
            })
        }
        if (!req.file) {
            logger.warn('File is required. Please upload an image.');
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            })
        }

        // ✅ Check if all required fields are present
        if (!name || !description || !url || !status || !tags) {
            logger.warn("Missing required fields: name, description, url, status, tag.")
            return res.status(400).json({
                message: "Missing required fields: name, description, url, status, tag.",
                success: false
            });
        }

        const { result } = await uploadFile(req.file.path);

        const { secure_url, public_id, original_filename } = result;

        try {
            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            }
        } catch (err) {
            return res.status(400).json({ error: 'Invalid tags format' });
        }

        if (!Array.isArray(tags)) {
            logger.info('Tags must be an array')
            return res.status(400).json({ error: "Tags must be an array" });
        }

        // Process tags (optional)
        const cleanTags = [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];

        const projectDetails = await ProjectModel.create({
            name: name,
            description: description,
            status: status || 'In Progress',
            url: url,
            image: {
                fileName: original_filename,
                url: secure_url,
                public_id: public_id
            },
            tags: cleanTags || [],
            priority: priority || 'Medium'
        })
        if (!projectDetails) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const filePath = path.join(__dirname, 'uploads', original_filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    logger.warn('Failed to deleted the file ', err);
                } else {
                    logger.warn('Successfully deleted the file')
                }
            });
            logger.warn('The data is not submitted')
            return res.status(403).json({
                success: false,
                message: 'The data is not submitted'
            })
        }

        logger.info('Successfully submitted the data.')
        return res.status(201).json({
            data: projectDetails,
            message: 'Successfully submitted the data.',
            success: true
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
        logger.error('Error with 500', error);
    }

};

const getProject = async (req, res) => {

    try {
        const projectData = await ProjectModel.find({});
        logger.info('Data is successfully parsed.')
        return res.status(200).json({
            data: projectData,
            message: 'Data is successfully parsed.'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
        logger.error('Error with 500', error);
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    const { role } = req.user
    console.log(id);

    try {
        if (role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Admin only can acess'
            })
        }
        if (!id) {
            logger.warn('Id must be required')
            return res.status(404).json({
                success: false,
                message: 'Id must be required'
            })
        }
        const deletedById = await ProjectModel.findByIdAndDelete(id);
        if (!deletedById) {
            logger.error('Failed to deleted the file.')
            return res.status(404).json({
                success: false,
                message: 'Failed to deleted the file.'
            })
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const { fileName, url, public_id } = deletedById.image;
        const extension = url.split('.').pop();

        const filePath = path.join(__dirname, 'uploads', `${fileName}.${extension}`);
        fs.unlink(filePath, (err) => {
            if (err) {
                logger.warn('Failed to deleted the file.', err)
            } else {
                logger.warn('Successfully deleted the file.')
            }
        });

        cloudinary.uploader.destroy(public_id, (err, result) => {
            if (err) {
                logger.warn('Cloudinary deletion error', err)
            } else {
                logger.warn('Cloudinary deletion success', result)
            }
        })

        logger.info('Successfully deleted the project data.')
        return res.status(200).json({
            data: deletedById,
            success: true,
            message: 'Successfully deleted the project data.'
        })
    } catch (error) {
        logger.error('Error with 500', error);
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
    }
}

const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'ID is required.'
            })
        }
        const project = await ProjectModel.findById(id);
        if (!project) {
            return res.status(403).json({
                success: false,
                message: 'Data is not fetched.'
            })
        }
        return res.status(200).json({
            data: project,
            success: true,
            message: 'Successfully fetched the data.'
        })
    } catch (error) {
        logger.error('Error with 500', error);
        return res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
    }
}

export { getProject, createProject, deleteProject, getProjectById }