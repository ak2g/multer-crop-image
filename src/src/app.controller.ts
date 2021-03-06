import {Controller, Inject, Post, Query, Req, Res} from '@nestjs/common';
import {IUploadImage} from "./storages/interfaces/upload.image.interface";
import {CropQueryDto} from "./storages/dto/crop.query.dto";
import * as  uuid4 from 'uuid/v4';

@Controller()
export class AppController {
    constructor(
        @Inject('IUploadImage')
        private readonly uploadImage: IUploadImage,
    ) {
    }


    @Post('/')
    async create(
        @Query() cropQueryDto: CropQueryDto,
        @Req() req,
        @Res() res,
    ) {
        await new Promise((resolve, reject) => {
            this.uploadImage
                .setFilename(uuid4())
                .setCroppedPrefix('__cropped__')
                .setCroppedPayload(cropQueryDto)
                .getMulter()(req, res, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(req.file);
                });
        });

        res.code(200).send(true);
        return ;
    }
}
