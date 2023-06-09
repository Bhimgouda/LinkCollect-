const User = require("../models/user");
const { verifyEmail } = require("../utils/sendEmail");

class UserRepository {
  async create(data) {
    try {
      console.log("repo", data);
      const user = await User.create(data);
      verifyEmail(user.name, user.email, user.emailToken);
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      throw error;
    }
  }
  async verifyEmailtoken(token) {
    try {
      const user = await User.findOne({ emailToken: token });
      console.log("verifying user");
      if (!user) {
        console.log("User dosent exist");
        throw error;
      }
      var data = {
        emailtoken: null,
        verified: 1,
      };
      //   await User.update(data, {
      //     where: {
      //       emailtoken: token
      //     }
      //   });
      await User.findOneAndUpdate({ emailtoken: token }, data);
      return user;
    } catch (error) {
      console.log("Something went wrong in the verification of mail");
      throw error;
    }
  }
  async destroy(userId) {
    try {
      await User.findByIdAndRemove(userId);
      return true;
    } catch (error) {
      console.log("Something went wrong at repository layer");
      throw error;
    }
  }
  async getwithCollection(userId) {
    try {
      const user = await User.findById(userId)
        .populate({ path: "collections" })
        .lean();
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getByUserId(userId) {
    try {
      console.log("Here", userId);
      const user = await User.findById(userId);
      return user;
    } catch (e) {
      console.log("Something went wrong in fetching the user");
      throw e;
    }
  }
  async getByEmail(userEmail) {
    try {
      const user = await User.findOne({
        email: userEmail,
      });
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user");
      throw error;
    }
  }

  async getById(userId) {
    console.log("here", userId);
    try {
      const user = await User.findAll({ id: userId });
      // delete user.password;
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer");
      throw error;
    }
  }
}

module.exports = UserRepository;
