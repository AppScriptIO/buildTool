"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataItem = exports.node = void 0;

var _script = require("../script.js");

var _path = _interopRequireDefault(require("path"));

const config = require('../../configuration'); // configuration


const prefix = config.distribution.clientSide.polyfill.prefix;

const operationModulePath = _path.default.normalize(__dirname, '../utility/operation');

const node = [{
  key: `${prefix}:buildSourceCode`,
  connection: [{
    key: 'connection-key-1',
    // pathPointerKey
    source: {
      position: {
        order: '1' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: 'node-key-1'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }, {
    key: 'connection-key-2',
    // pathPointerKey
    source: {
      position: {
        order: '2' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: 'node-key-2'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }, {
    key: 'connection-key-3',
    // pathPointerKey
    source: {
      position: {
        order: '3' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: 'node-key-3'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }, {
    key: 'connection-key-4',
    // pathPointerKey
    source: {
      position: {
        order: '4' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: 'node-key-4'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }],
  tag: {
    traversalImplementationType: 'logNode',
    iterateConnectionImplementation: 'allPromise' // parallel

  }
}, {
  key: `${prefix}:build`,
  connection: [{
    key: 'connection-key-1',
    // pathPointerKey
    source: {
      position: {
        order: '1' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: 'node-key-5'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }, {
    key: 'connection-key-2',
    // pathPointerKey
    source: {
      position: {
        order: '2' // or
        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }

      }
    },
    destination: {
      node: [{
        key: `${prefix}:buildSourceCode`
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }],
  tag: {
    traversalImplementationType: 'logNode',
    iterateConnectionImplementation: 'chronological'
  }
}, {
  key: 'node-key-1',
  dataItem: {
    key: `${prefix}:json`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-2',
  dataItem: {
    key: `${prefix}:html`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-3',
  dataItem: {
    key: `${prefix}:stylesheet`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-4',
  dataItem: {
    key: `${prefix}:javascript`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-5',
  dataItem: {
    key: `${prefix}:copy:sourceCode`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}];
exports.node = node;
const dataItem = [{
  key: `${prefix}:copy:sourceCode`,
  data: {
    path: _path.default.join(operationModulePath, 'rsync.js'),
    argument: {
      source: config.directory.clientSidePath,
      destination: (0, _script.destination)(prefix),
      algorithm: 'sourceToSame',
      copyContentOnly: true
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:json`,
  data: {
    path: _path.default.join(operationModulePath, 'transformAsset/json.js'),
    argument: {
      sources: [_path.default.join(config.directory.clientSidePath, '/**/*.json'), '!' + _path.default.join(config.directory.clientSidePath, '**/@package/**/*.json')],
      destination: (0, _script.destination)(prefix)
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:html`,
  data: {
    path: _path.default.join(operationModulePath, 'transformAsset/html.js'),
    module: 'html',
    argument: {
      sources: [_path.default.join(config.directory.clientSidePath, '/**/*.html'), '!' + _path.default.join(config.directory.clientSidePath, '**/@package/**/*.html')],
      destination: (0, _script.destination)(prefix),
      babelPath: config.directory.babelPath,
      babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js'
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:stylesheet`,
  data: {
    path: _path.default.join(operationModulePath, 'transformAsset/stylesheet.js'),
    argument: {
      sources: [_path.default.join(config.directory.clientSidePath, '/**/*.css'), '!' + _path.default.join(config.directory.clientSidePath, '**/@package/**/*.css')],
      destination: (0, _script.destination)(prefix)
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:javascript`,
  data: {
    path: _path.default.join(operationModulePath, 'transformAsset/javascript.js'),
    module: 'clientJS',
    argument: {
      sources: [_path.default.join(config.directory.clientSidePath, '/**/*.js'), // including package js to allow named import path transformation.
      '!' + _path.default.join(config.directory.clientSidePath, '/**/@package/**/*.js'), _path.default.join(config.directory.clientSidePath, '/**/webcomponent/@package/@polymer/**/*.js'), '!' + _path.default.join(config.directory.clientSidePath, '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js')],
      destination: (0, _script.destination)(prefix),
      babelPath: config.directory.babelPath,
      babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js',
      includeSourceMap: false
    }
  },
  tag: {
    executionType: 'function'
  }
}];
exports.dataItem = dataItem;