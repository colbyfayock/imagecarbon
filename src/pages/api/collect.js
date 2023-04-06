import pLimit from 'p-limit';
import { co2, hosting } from '@tgwf/co2';

import { getCloudinary } from '@/lib/cloudinary-server';
import { cleanUrl, getFileSize } from '@/lib/util';
import { constructCloudinaryUrl } from '@cloudinary-util/url-loader';

const cloudinary = getCloudinary();
const emissions = new co2({ model: 'swd' });

const OPTIMIZED_FORMAT = 'avif';

const limit = pLimit(10);

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const { images } = body;
  const siteUrl = cleanUrl(body.siteUrl);

  console.log(emissions.perVisit(1).toFixed(2));

  try {
    const imagesQueue = images.map(image => {
      return limit(() => {
        async function upload() {
          try {
            const results = await cloudinary.uploader.upload(image, {
              folder: 'imagecarbon',
              tags: ['imagecarbon', `imagecarbon:site:${siteUrl}`],
              context: {
                siteUrl,
                originalUrl: image
              }
            });
            return results;
          } catch(e) {
            console.log(`[${siteUrl}] Failed to upload image ${image}: ${e.message}`);
            return;
          }
        };
        return upload();
      });
    });


    let uploads = await Promise.all(imagesQueue);
    
    // Filter out failed image upload requests

    uploads = uploads.filter(upload => !!upload);

    const hosts = {
      'res.cloudinary.com': await hosting.check('res.cloudinary.com')
    };

    const results = await Promise.all(uploads.map(async (upload) => {
      const { originalUrl } = upload.context.custom;

      const host = cleanUrl(originalUrl).split('/')?.[0];

      if ( typeof hosts[host] === 'undefined' ) {
        hosts[host] = await hosting.check(host);
      }

      const optimizedUrl = constructCloudinaryUrl({
        options: {
          src: upload.public_id,
          format: OPTIMIZED_FORMAT
        },
        config: {
          cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
          }
        }
      });

      const optimizedSize = await getFileSize(optimizedUrl);

      return {
        height: upload.height,
        width: upload.width,
        original: {
          format: upload.format,
          size: upload.bytes,
          url: originalUrl,
          co2: emissions.perVisit(upload.bytes, hosts[host])
        },
        uploaded: {
          url: upload.secure_url,
          publicId: upload.public_id,
        },
        optimized: {
          format: OPTIMIZED_FORMAT,
          url: optimizedUrl,
          size: optimizedSize,
          co2: emissions.perVisit(optimizedSize, hosts['res.cloudinary.com'])
        }
      }
    }));

    res.status(200).json({
      siteUrl,
      images: results
    });
  } catch(e) {
    console.log(`[${siteUrl}] Failed to collect image assets: ${e.message}`);
    res.status(500).json({
      error: e.message
    })
  }
}
