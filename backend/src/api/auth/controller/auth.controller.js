import { registerService } from "../service/auth.service.js";

export async function registerController(req, res) {
  const { email, password } = req.body || {};
  const user = await registerService(email, password);
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user },
  });
}
