import { NSFWJS } from 'nsfwjs';

const Index = () => {
  const weightData = jsModel.weightData;
  const buf = Buffer.from(weightData, 'base64');
  const weightDataArrayBuffer = buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength
  );
  const modelArtefacts = {
    ...jsModel,
    weightData: weightDataArrayBuffer,
  };

  const ioHandler = {
    load: () => {
      return modelArtefacts;
    },
  };

  const options = {};
  const nsfwjs = new NSFWJS(ioHandler, options);
  nsfwjs.load().then(model => {
    model.classify(img).then(predictions => {
      console.log('Predictions', predictions);
    });
  });

  return (
    <div>
      <p>Hello Next.js</p>
    </div>
  );
};

export default Index;
