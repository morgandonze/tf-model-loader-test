# TF MODEL LOADER TEST

We want to be able to bundle a TF model with a web app so we don't have to make and external request for it.
We attempt this by creating an [IOHandler](https://github.com/tensorflow/tfjs-core/blob/c157cc52c784edcb7499929516f3e9662ab0e3d1/src/io/types.ts#L207-L210), which is just an object with a `load` method ([source](https://github.com/tensorflow/tfjs-core/blob/c157cc52c784edcb7499929516f3e9662ab0e3d1/src/io/types.ts#L207-L210)),
which returns a `Promise<ModelArtefacts>`. ModelArtefacts is defined [here](https://github.com/tensorflow/tfjs-core/blob/c157cc52c784edcb7499929516f3e9662ab0e3d1/src/io/types.ts#L165-L187).

```
export declare interface ModelArtifacts {
  /**
   * Model topology.
   *
   * For Keras-style `tf.Model`s, this is a JSON object.
   * For TensorFlow-style models (e.g., `FrozenModel`), this is a binary buffer
   * carrying the `GraphDef` protocol buffer.
   */
  modelTopology?: {}|ArrayBuffer;

  /**
   * Weight specifications.
   *
   * This corresponds to the weightsData below.
   */
  weightSpecs?: WeightsManifestEntry[];

  /**
   * Binary buffer for all weight values concatenated in the order specified
   * by `weightSpecs`.
   */
  weightData?: ArrayBuffer;
}
```

The most complicated part of ModelArtifacts is `weightData`. This sometimes comes as multiple binary shards. These must be read and concatenated. We convert `weightData` to a base64 string, then we construct `ModelArtefacts`, then `JSON.stringify` it and insert the value directly into the project's code as `modelArtefacts`. Our `IOHandler` returns a `Promise` of those `ModelArtefacts`. During runtime, the string is `JSON.parse`d and the `weightData` converted back to an array buffer.


### Setup

```
  git clone https://github.com/mlaco/tf-model-loader-test.git
  cd tf-model-loader-test
  ./bundle-model
  yarn && yarn run dev
```
