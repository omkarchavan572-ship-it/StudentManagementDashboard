const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, 'Please add a Roll / Student ID'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please add a student name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add a student email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
      trim: true
    },
    institute: {
      type: String,
      required: [true, 'Please add an institute name'],
      trim: true
    },
    course: {
      type: String,
      required: [true, 'Please specify the enrolled course'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
      default: 'Active'
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: 'Tech University Campus, Block B'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for getting student initials
studentSchema.virtual('initials').get(function () {
  if (!this.name) return 'ST';
  const parts = this.name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return this.name.substring(0, 2).toUpperCase();
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
