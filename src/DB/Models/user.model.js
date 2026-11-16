import mongoose from "mongoose";
import { genderEnum } from "../../Common/Enums/gender.enum.js";
import { providerEnum, roleEnum } from "../../Common/Enums/role.enum.js";
// fn, ln, email, password, gender, fn+ls => fullName
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "FirstName is required"],
        minLength: [3, "FirstName must be greater than 3 chars"],
        maxLength: [30, "FirstName must be less than 3 chars"]
    },

    lastName: {
        type: String,
        minLength: [1, "LastName must be greater than 3 chars"],
        maxLength: [30, "LastName must be less than 3 chars"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },

    password: {
        type: String,
        minLength: [3, "Password must be greater than 3 chars"],
        required: function () {
            return this.provider === providerEnum.SYSTEM;
        }
    },

    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.Male
    },

    role: {
        type: Number,
        enum: Object.values(roleEnum),
        default: roleEnum.User
    },

    phone: {
        type: String,
        required: false
    },

    provider: {
        type: Number,
        enum: Object.values(providerEnum),
        default: providerEnum.SYSTEM
    }
},
    {
        timestamps: true,
        toObject: { virtuals: true }, //to see in code
        toJSON: { virtuals: true } // response
    })

userSchema.virtual("fullName").set(function (values) {
    const [firstName, lastName] = values.split(" ") || []
    this.set({ firstName, lastName })
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

// userSchema.pre("validate", function () {
//     console.log("BEFORE VALIDATE");
//     console.log(this);

// })

userSchema.post("save", function (doc) {
    console.log("AFTER SAVE");
    console.log(doc);
})

export const UserModel = mongoose.model("Users", userSchema)