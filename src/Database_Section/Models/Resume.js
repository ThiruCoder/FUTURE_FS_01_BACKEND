import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    personalData: {
        fname: {
            type: String,
            required: [true, 'First name is required'],
            minLength: [2, 'Must be minimum length is 2'],
            maxLength: [30, 'Maximum length is 30'],
            trim: true,
        },
        lname: {
            type: String,
            required: [true, 'Last name is required'],
            minLength: [2, 'Must be minimum length is 2'],
            maxLength: [30, 'Maximum length is 30'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            minLength: [2, 'Must be minimum length is 2'],
            maxLength: [60, 'Maximum length is 60'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            lowercase: true
        },
        number: {
            type: Number,
            required: [true, 'Number is required'],
            trim: true,
        },
        address: {
            city: {
                type: String,
                required: [true, 'City name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [30, 'Maximum length is 30'],
                trim: true,
            },
            state: {
                type: String,
                required: [true, 'State name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [30, 'Maximum length is 30'],
                trim: true,
            },
            country: {
                type: String,
                required: [true, 'Country name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [30, 'Maximum length is 30'],
                trim: true,
            },
        }
    },
    summary: {
        type: String,
        minLength: [5, 'Must be minimum length is 5'],
        maxLength: [1000, 'Maximum length is 1000'],
        trim: true,
    },
    experience: {
        company: {
            type: String,
            minLength: [3, 'Must be minimum length is 3'],
            maxLength: [60, 'Maximum length is 60'],
            trim: true,
        },
        jobType: {
            type: String,
            minLength: [2, 'Must be minimum length is 2'],
            maxLength: [60, 'Maximum length is 60'],
            trim: true,
        },
        joinDate: {
            type: Date,
            set: function (date) {
                return new Date(date).setHours(0, 0, 0, 0)
            }
        },
        lastDate: {
            type: Date,
            set: function (date) {
                return new Date(date).setHours(0, 0, 0, 0)
            }
        },
        performance: { type: [String], default: [] },
    },
    education: {
        ug: {
            course: {
                type: String,
                required: [true, 'Course name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [60, 'Maximum length is 60'],
                trim: true,
            },
            college: {
                type: String,
                required: [true, 'College name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [60, 'Maximum length is 60'],
                trim: true,
            },
            university: {
                type: String,
                required: [true, 'University name is required'],
                minLength: [2, 'Must be minimum length is 2'],
                maxLength: [60, 'Maximum length is 60'],
                trim: true,
            },
            start: {
                type: Date,
                required: [true, 'Start date is required'],
                set: function (date) {
                    return new Date(date).setHours(0, 0, 0, 0)
                }
            },
            end: {
                type: Date,
                required: [true, 'End date is required'],
                set: function (date) {
                    return new Date(date).setHours(0, 0, 0, 0)
                }
            },
        }
    },
    skills: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            category: {
                type: String,
                enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Other'],
                required: true,
            },
            proficiency: {
                type: Number,
                min: 1,
                max: 10,
                required: true,
            },
            experience: {
                type: Number,
                min: 0,
                required: true,
            },
            certified: {
                type: Boolean,
                default: false,
            }
        }
    ]

}, { timestamps: true });

const ResumeModel = mongoose.model('Resume', ResumeSchema);

export { ResumeModel }