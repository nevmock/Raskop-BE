import { Request, Response } from 'express';
import IController from '../../interfaces/controller-interface';
import UserService from './user-services';
import statusCodes from '../../errors/status-codes';

class UserController {
   async index(req, res) {
      const users = await UserService.getAll();

      // return res.send('Staging Test');
      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            users,
         },
      });
   }

   async create(req, res: Response): Promise<Response> {
      // await UserService.create(req.body);

      return res.status(200).json({
         code: 'SUCCESS_CREATE_USER',
         status: 'OK',
         data: {
            message: 'User created!',
         },
      });
   }

   async show(req: Request, res: Response): Promise<Response> {
      const user = await UserService.findById(
         parseInt(req.params.user_id || ''),
      );

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            user,
         },
      });
   }

   async updatePassword(req: Request, res: Response): Promise<Response> {
      await UserService.updatePassword(
         parseInt(req.params.user_id!),
         req.body.oldPassword,
         req.body.newPassword,
      );

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'User password was update!',
         },
      });
   }

   async update(req: Request, res: Response): Promise<Response> {
      const obj = JSON.parse(JSON.stringify({ ...req.files }));

      let data = {
         ...req.body,
      };

      if (obj.profile_picture) {
         data = {
            ...req.body,
            profile_picture: obj.profile_picture[0].filename.toString(),
         };
      }

      await UserService.update(parseInt(req.params.user_id!), data);

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'User profile was update!',
         },
      });
   }

   async delete(req: Request, res: Response): Promise<Response> {
      await UserService.delete(parseInt(req.params.user_id || ''));
      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'User was deleted!',
         },
      });
   }
}

export default new UserController();