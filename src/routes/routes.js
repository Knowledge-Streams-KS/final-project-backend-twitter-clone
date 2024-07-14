import authRouter from "./auth/index.js";
import userRouter from "./user/index.js";
import postRouter from "./post/index.js";
import notificationRouter from "./notification/index.js";

const allRoutes = [authRouter, userRouter, postRouter, notificationRouter];

export default allRoutes;
