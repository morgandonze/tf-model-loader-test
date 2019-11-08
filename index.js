const fs = require('fs');

exports.run = () => {
  const concat = buffers => {
    let totalByteLength = 0;
    buffers.forEach(buffer => {
      totalByteLength += buffer.byteLength;
    });

    const temp = new Uint8Array(totalByteLength);
    let offset = 0;
    buffers.forEach(buffer => {
      temp.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    });
    return temp.buffer;
  };

  const loadAll = weightsFilePaths => {
    const shardBuffers = [];
    for (var i = 0; i < weightsFilePaths.length; i++) {
      const f = weightsFilePaths[i];
      const g = fs.readFileSync(f);

      shardBuffers.push(g);
    }
    return shardBuffers;
  };

  const res = loadAll([
    './model/group1-shard1of6',
    './model/group1-shard2of6',
    './model/group1-shard3of6',
    './model/group1-shard4of6',
    './model/group1-shard5of6',
    './model/group1-shard6of6',
  ]);
  const monobuffer = concat(res);
  console.log('buffer before');
  console.log(monobuffer);

  const weightDataString64 = Buffer.from(monobuffer).toString('base64');

  const modelConfigFile = fs.readFileSync('./model/model.json');
  const modelConfig = JSON.parse(modelConfigFile);
  const modelTopology = modelConfig['modelTopology'];
  const weightsManifest = modelConfig['weightsManifest'];
  const weightSpecs = [];
  for (const entry of weightsManifest) {
    weightSpecs.push(...entry.weights);
  }

  const modelArtefacts = {
    modelTopology: modelTopology,
    weightSpecs: weightSpecs,
    weightData: weightDataString64,
  };
  const stringModelArts = JSON.stringify(modelArtefacts);

  const useNodeBuffer =
    typeof Buffer !== 'undefined' &&
    (typeof Blob === 'undefined' ||
      typeof atob === 'undefined' ||
      typeof btoa === 'undefined');
  const base64StringToArrayBuffer = str => {
    if (useNodeBuffer) {
      const buf = Buffer.from(str, 'base64');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    const s = atob(str);
    const buffer = new Uint8Array(s.length);
    for (let i = 0; i < s.length; ++i) {
      buffer.set([s.charCodeAt(i)], i);
    }
    return buffer.buffer;
  };

  const modelArts = JSON.parse(stringModelArts);
  console.log('buffer after');
  console.log(base64StringToArrayBuffer(modelArts.weightData));

  fs.writeFile('jsModel.txt', stringModelArts, err => {});
};

exports.run();
