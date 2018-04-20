// This script will load the WebWorkers and Codecs from unpkg url


try {
  window.cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: 4,
    startWebWorkersOnDemand: true,
    webWorkerPath: '../webWorkers/cornerstoneWADOImageLoaderWebWorker.min.js',
    webWorkerTaskPaths: [],
    taskConfiguration: {
      decodeTask: {
        loadCodecsOnStartup: true,
        initializeCodecsOnStartup: false,
          codecsPath: '../webWorkers/cornerstoneWADOImageLoaderCodecs.js',
        usePDFJS: false,
        strict: false
      }
    }
  });
} catch (error) {
  throw new Error('cornerstoneWADOImageLoader is not loaded');
}

