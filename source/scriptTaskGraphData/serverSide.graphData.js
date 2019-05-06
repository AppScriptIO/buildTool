"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataItem = exports.node = void 0;

var _script = require("../script.js");

var _path = _interopRequireDefault(require("path"));

const config = require('../../configuration'); // configuration


const prefix = 'serverSide';

const operationModulePath = _path.default.normalize(__dirname, '../utility/operation');

const node = [{
  key: `${prefix}:install:dependencies`,
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
  }],
  tag: {
    traversalImplementationType: 'logNode',
    iterateConnectionImplementation: 'chronological' // parallel

  }
}, {
  key: `${prefix}:copy:sourceToDistribution`,
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
        key: 'node-key-2'
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
        key: 'node-key-3'
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
  key: `${prefix}:transpile:buildJavascriptCode`,
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
        key: 'node-key-4'
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
        key: 'node-key-5'
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
        key: 'node-key-6'
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }],
  tag: {
    traversalImplementationType: 'logNode',
    iterateConnectionImplementation: 'chronological' // parallel

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
        key: `${prefix}:install:dependencies`
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
        key: `${prefix}:copy:sourceToDistribution`
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
        key: `${prefix}:transpile:buildJavascriptCode`
      }]
    },
    tag: {
      direction: 'outgoing' // 'ingoing'/'outgoing'

    }
  }],
  tag: {
    traversalImplementationType: 'logNode',
    iterateConnectionImplementation: 'chronological' // parallel

  }
}, {
  key: 'node-key-1',
  dataItem: {
    key: `${prefix}:install:yarn`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-2',
  dataItem: {
    key: `${prefix}:copy:serverSide`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-3',
  dataItem: {
    key: `${prefix}:copy:databaseData`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-4',
  dataItem: {
    key: `${prefix}:transpile:serverSide`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-5',
  dataItem: {
    key: `${prefix}:transpile:appscript`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}, {
  key: 'node-key-6',
  dataItem: {
    key: `${prefix}:transpile:databaseData`
  },
  tag: {
    dataItemType: 'reference',
    executionType: 'log'
  }
}];
exports.node = node;
const dataItem = [{
  key: `${prefix}:install:yarn`,
  data: {
    path: _path.default.join(operationModulePath, 'installPackage/yarn.js'),
    argument: {
      yarnPath: (0, _script.source)('/packageManager/library.server.yarn/')
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:copy:serverSide`,
  data: {
    path: _path.default.join(operationModulePath, 'rsync.js'),
    argument: {
      source: config.directory.serverSidePath,
      destination: (0, _script.destination)(prefix),
      algorithm: 'sourceToSame',
      copyContentOnly: true
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:copy:databaseData`,
  data: {
    path: _path.default.join(operationModulePath, 'rsync.js'),
    argument: {
      source: (0, _script.source)('databaseData'),
      destination: (0, _script.destination)(),
      algorithm: 'sourceToSame',
      copyContentOnly: false
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:transpile:databaseData`,
  data: {
    path: _path.default.join(operationModulePath, 'assetBuild/javascript.js'),
    module: 'serverJS',
    argument: {
      sources: [(0, _script.source)('databaseData/**/*.js'), '!' + (0, _script.source)('databaseData/node_modules/**/*.js')],
      destination: (0, _script.destination)('databaseData/'),
      babelPath: config.directory.babelPath
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:transpile:serverSide`,
  data: {
    path: _path.default.join(operationModulePath, 'assetBuild/javascript.js'),
    module: 'serverJS',
    argument: {
      sources: [_path.default.join(config.directory.serverSidePath, '**/*.js'), '!' + (0, _script.source)('serverSide/node_modules/**/*.js')],
      destination: (0, _script.destination)('serverSide/'),
      babelPath: config.directory.babelPath
    }
  },
  tag: {
    executionType: 'function'
  }
}, {
  key: `${prefix}:transpile:appscript`,
  data: {
    path: _path.default.join(operationModulePath, 'assetBuild/javascript.js'),
    module: 'serverJS',
    argument: {
      sources: [_path.default.join(config.directory.serverSidePath, 'node_modules/appscript/**/*.js'), '!' + _path.default.join(config.directory.serverSidePath, 'node_modules/appscript/node_modules/**/*.js')],
      destination: (0, _script.destination)('serverSide/node_modules/appscript'),
      babelPath: config.directory.babelPath
    }
  },
  tag: {
    executionType: 'function'
  }
}];
exports.dataItem = dataItem;