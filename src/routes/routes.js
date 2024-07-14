import authRouter from "./auth/index.js";
import userRouter from "./user/index.js";
import postRouter from "./post/index.js";

const allRoutes = [authRouter, userRouter, postRouter];

export default allRoutes;
