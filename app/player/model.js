const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASS_ROUND = 10;

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi"],
    },
    name: {
      type: String,
      require: [true, "Nama harus diisi"],
      maxlenght: [225, "panjang nama harus antara 3 - 225 karakter"],
      minlenght: [3, "panjang nama harus antara 3 - 225 karakter"],
    },
    username: {
      type: String,
      require: [true, "Username harus diisi"],
      maxlenght: [225, "panjang username harus antara 3 - 225 karakter"],
      minlenght: [3, "panjang username harus antara 3 - 225 karakter"],
    },
    password: {
      type: String,
      require: [true, "Kata sandi harus diisi"],
      maxlenght: [225, "panjang password maksimal 225 karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor telpon harus diisi"],
      maxlenght: [13, "panjang nomor telepon harus antara 9 - 13 karakter"],
      minlenght: [9, "panjang nomor telepon harus antara 9 - 13 karakter"],
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASS_ROUND);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
