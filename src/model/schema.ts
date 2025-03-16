import { Schema, model } from "mongoose";


const userSchema = new Schema({

  firstName: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: function (email: any) {
        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)
      },
      message: (props: any) => {
        return `${props.value} is not a valid email address!`
      }
    }
  },

  birthYear: Number,

  // age: Number,


  phoneNumber: {
    type: String,
    validate: {
      validator: (value: any) => {
        return /^[0-9]{10}$/.test(value);
      },
      message: (props: any) => {
        return `${props.value} is not a valid phone number`
      }
    }
  },

  createdTime: {
    type: Date,
    default: new Date()
  }


});

const personSchema = new Schema({

  username: String,
  email: String,


});

const postSchema = new Schema({

  content: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "peoples"
  }

});


const accountHolderSchema = new Schema({

  accountNo: {
    type: Number,
    required: true,
    unique: true,
    maxlength: [11, "max length should be 11"]
  },

  username: String,
  balance: {
    type: Number,
    default: 0
  }

})

// userSchema.pre("save", function (next) {

//   console.log("Before saving the user : ", this);
//   if (this.age) {
//     if (this.age < 18) {
//       next(new Error("age must be at least 18 year old to save"))
//     }
//     else {
//       next();
//     }
//   }

// });


userSchema.post("save", function (doc, next) {

  console.log("user saved succesfully", doc);
  next();

})


userSchema.virtual("age").get(function () {

  const currentYear = new Date().getFullYear();
  if (!this.birthYear) {
    return 'birth year not exists';
  }
  const age = currentYear - this.birthYear;
  return age;

})

userSchema.virtual("fullName").get(function () {

  if (!this.firstName || !this.lastName) {
    return new Error("firstname or lastname not exists");
  }

  return `${this.firstName} ${this.lastName}`;

})



export const accountDoc = model("account" , accountHolderSchema);
export const personDoc = model("peoples", personSchema);
export const postDoc = model("posts", postSchema);
export const userModel = model("users", userSchema);



