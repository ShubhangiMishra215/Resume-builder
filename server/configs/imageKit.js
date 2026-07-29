import ImageKit from '@imagekit/nodejs';

const key = process.env.IMAGEKIT_PRIVATE_KEY;

const imagekit = new ImageKit({
  privateKey: key
});

export default imagekit