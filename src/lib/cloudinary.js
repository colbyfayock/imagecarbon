import { parseUrl } from '@cloudinary-util/util';
import { constructCloudinaryUrl } from '@cloudinary-util/url-loader';

/**
 * isCloudinaryUrl
 */

export function isCloudinaryUrl(url) {
  return url.startsWith('https://res.cloudinary.com');
}

/**
 * normalizeCloudinaryUrl
 */

export function normalizeCloudinaryUrl(url, overrides = {}) {
  let parts;
  
  try {
    parts = parseUrl(url);
  } catch(e) {
    console.log(`Failed to normalize Cloudinary URL: ${url}`);
    return url;
  }

  const options = {
    assetType: parts?.assetType,
    deliveryType: parts?.deliveryType,
    rawTransformations: parts?.transformations,
    signature: parts?.signature,
    src: parts?.publicId,
    version: parts?.version,
    ...overrides
  }

  if ( parts?.seoSuffix ) {
    options.seoSuffix = 'imagecarbon'; // Avoid any errors with unsual suffixes
  }

  return constructCloudinaryUrl({
    options,
    config: {
      cloud: {
        cloudName: parts?.cloudName
      }
    }
  });
}