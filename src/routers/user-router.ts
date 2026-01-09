import express from "express";

const userRouter = express.Router();
import {
  getAllUsers,
  register,
  login,
  me,
  getUserById,
  updateUserById,
  deleteUserById,
  changePassword,
} from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-user";
import {
  listUserAddresses,
  createAddress,
  addressById,
  deleteAddress,
  updateAddress,
} from "../controllers/address-controller";
import { HttpError } from "../error/HttpError";

// USER
userRouter.get("/users", getAllUsers);
userRouter.post("/users/register", register);
userRouter.post("/users/login", login);
userRouter.get("/users/me", authMiddleware, me);
userRouter.get("/users/:id", authMiddleware, getUserById);
userRouter.put("/users/:id", authMiddleware, updateUserById);
userRouter.delete("/users/:id", authMiddleware, deleteUserById);
userRouter.put("/users/:id/change-password", authMiddleware, changePassword);

// ADDRESS
userRouter.get("/users/:id/addresses", authMiddleware, listUserAddresses);
userRouter.post("/users/:id/address", authMiddleware, createAddress);
userRouter.get("/users/:id/address/:addressId", authMiddleware, addressById);
userRouter.delete(
  "/users/:id/address/:addressId",
  authMiddleware,
  deleteAddress
);
userRouter.put("/users/:id/address/:addressId", authMiddleware, updateAddress);

// Location

userRouter.post("/reverse-geocoding", async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!GOOGLE_API_KEY) {
      throw new HttpError(400, 'Google maps api is undefined')
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    if (data.status === "OK") {
      console.log(data);
      const formattedAddress = data.results[0].formatted_address;

      res.json({
        display_name: formattedAddress,
        details: data.results[0].address_components,
      });
    } else {
      throw new HttpError(404, "Google não encontrou o endereço.");
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
