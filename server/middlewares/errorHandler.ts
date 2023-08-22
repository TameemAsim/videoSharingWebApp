import { Request, Response, NextFunction } from "express";


const errorHandler = (err: { status: number; message: string; }, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
};

export default errorHandler;