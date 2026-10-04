import { registerService, loginService } from "../service/auth.service.js";

export async function registerController(req, res) {
  const { email, password } = req.body || {};
  const user = await registerService(email, password);
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user },
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body || {};
  const data = await loginService(email, password);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data,
  });
}
