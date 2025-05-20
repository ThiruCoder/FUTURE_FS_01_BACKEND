
import { logger } from "../../utils/logger.js";
import { sendUserRequest } from "../../utils/Mailer.js";
import { ResumeModel } from "../Database_Section/Models/Resume.js";

const getResume = async (req, res) => {

    try {
        const resumeData = await ResumeModel.find({});
        logger.info('Data is successfully parsed.')
        return res.status(200).json({
            data: resumeData,
            message: 'Data is successfully parsed.'
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong! Please try again later.' });
        logger.error('Error with 500', error);
    }
};

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const resumeData = await ResumeModel.findById(id);
        if (!resumeData) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }
        return res.status(200).json({
            data: resumeData,
            message: 'Resume data retrieved successfully',
            success: true
        });
    } catch (error) {
        console.error('Error fetching resume by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch resume by ID'
        });
    }
}

const createResume = async (req, res) => {
    try {
        const { personalData, summary, experience, education, skills, recentDataId } = req.body;
        console.log('Received data:', req.body, recentDataId);
        // Validate required fields
        if (!personalData || !personalData.fname?.trim() || !personalData.lname?.trim() ||
            !personalData.role?.trim() || !personalData.email?.trim() || !personalData.number) {
            return res.status(400).json({
                success: false,
                message: 'First name, Last name, Role, Email, and Number are required.'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(personalData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate address
        if (!personalData.address || !personalData.address.city?.trim() ||
            !personalData.address.state?.trim() || !personalData.address.country?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'City, State, and Country are required.'
            });
        }

        // Validate summary
        if (!summary?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Summary is required.'
            });
        }

        // Validate experience (making it optional but properly structured)
        const experienceData = experience ? {
            company: experience.company?.trim() || '',
            jobType: experience.jobType?.trim() || '',
            joinDate: experience.joinDate ? new Date(experience.joinDate).setHours(0, 0, 0, 0) : null,
            lastDate: experience.lastDate ? new Date(experience.lastDate).setHours(0, 0, 0, 0) : null,
            performance: Array.isArray(experience.performance) ? experience.performance : []
        } : {
            company: '',
            jobType: '',
            joinDate: null,
            lastDate: null,
            performance: []
        };

        // Validate education
        if (!education?.ug || !education.ug.college?.trim() || !education.ug.university?.trim() ||
            !education.ug.start || !education.ug.end) {
            return res.status(400).json({
                success: false,
                message: 'College, University, Start Date, and End Date are required.'
            });
        }

        // Validate skills
        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: 'Skills must be an array'
            });
        }

        // Validate each skill
        const validatedSkills = skills.map(skill => {
            // Ensure proficiency is between 1-10
            const proficiency = Math.max(1, Math.min(10, Number(skill.proficiency) || 1));

            return {
                name: skill.name?.trim() || '',
                category: skill.category?.trim() || 'Other',
                proficiency,
                experience: Math.max(0, Number(skill.experience) || 0),
                certified: Boolean(skill.certified)
            };
        });

        const deleteRecentData = await ResumeModel.deleteMany({});

        if (!deleteRecentData) {
            return res.status(400).json({
                success: false,
                message: 'The data is not deleted',
            });
        }
        // Create the resume
        const resumeDetails = await ResumeModel.create({
            personalData: {
                fname: personalData.fname.trim(),
                lname: personalData.lname.trim(),
                role: personalData.role.trim(),
                email: personalData.email.trim(),
                number: personalData.number,
                address: {
                    city: personalData.address.city.trim(),
                    state: personalData.address.state.trim(),
                    country: personalData.address.country.trim()
                }
            },
            summary: summary.trim(),
            experience: experienceData,
            education: {
                ug: {
                    course: education.ug.course.trim(),
                    college: education.ug.college.trim(),
                    university: education.ug.university.trim(),
                    start: new Date(education.ug.start).setHours(0, 0, 0, 0),
                    end: new Date(education.ug.end).setHours(0, 0, 0, 0)
                }
            },
            skills: validatedSkills
        });

        return res.status(201).json({
            data: resumeDetails,
            message: 'Resume created successfully',
            success: true
        });

    } catch (error) {
        console.error('Error creating resume:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create resume'
        });
    }
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const { personalData, summary, experience, education, skills } = req.body;


    try {
        const resumeData = await ResumeModel.findByIdAndUpdate(id, {
            personalData: {
                fname: personalData.fname.trim(),
                lname: personalData.lname.trim(),
                role: personalData.role.trim(),
                email: personalData.email.trim(),
                number: personalData.number,
                address: {
                    city: personalData.address.city.trim(),
                    state: personalData.address.state.trim(),
                    country: personalData.address.country.trim()
                }
            },
            summary: summary.trim(),
            experience: {
                company: experience.company?.trim() || '',
                jobType: experience.jobType?.trim() || '',
                joinDate: experience.joinDate ? new Date(experience.joinDate).setHours(0, 0, 0, 0) : null,
                lastDate: experience.lastDate ? new Date(experience.lastDate).setHours(0, 0, 0, 0) : null,
                performance: Array.isArray(experience.performance) ? experience.performance : []
            },
            education: {
                ug: {
                    course: education.ug.course.trim(),
                    college: education.ug.college.trim(),
                    university: education.ug.university.trim(),
                    start: new Date(education.ug.start).setHours(0, 0, 0, 0),
                    end: new Date(education.ug.end).setHours(0, 0, 0, 0)
                }
            },
            skills: skills.map(skill => ({
                name: skill.name?.trim() || '',
                category: skill.category?.trim() || 'Other',
                proficiency: Math.max(1, Math.min(10, Number(skill.proficiency) || 1)),
                experience: Math.max(0, Number(skill.experience) || 0),
                certified: Boolean(skill.certified)
            }))
        }, { new: true });

        if (!resumeData) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        return res.status(200).json({
            data: resumeData,
            message: 'Resume updated successfully',
            success: true
        });
    } catch (error) {
        console.error('Error updating resume:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update resume'
        });
    }
}

const sendMail = async (req, res) => {
    const { email } = req.body;
    const mail = 'charipallithirumalesh@gmail.com'
    console.log(email)
    try {
        if (!email) {
            return res.status(403).json({
                message: "Message is required.",
                success: 'false'
            })
        }
        const sendMail = await sendUserRequest(
            mail,
            `The User send you a message.`,
            '<h1>Make Response from Task Manager</h1>',
            email
        );
        console.log('sendMail', sendMail)
        return res.status(200).json({
            data: sendMail,
            message: 'Message is successfully send.',
            success: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: err,
            message: 'Failed to send message.',
            success: false
        });
    }

}


export { createResume, getResume, getResumeById, updateById, sendMail };