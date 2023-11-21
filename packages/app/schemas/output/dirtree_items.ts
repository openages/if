export default {
      "DirTreeItems.Item": {
            "type": "object",
            "properties": {
                  "module": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "type": {
                        "type": "string",
                        "enum": [
                              "dir",
                              "file"
                        ]
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "pid": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "module",
                  "type",
                  "id",
                  "name"
            ]
      },
      "DirTree.Item": {
            "type": "object",
            "properties": {
                  "module": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "type": {
                        "type": "string",
                        "enum": [
                              "dir",
                              "file"
                        ]
                  },
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "pid": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": "number"
                  }
            },
            "required": [
                  "module",
                  "type",
                  "id",
                  "name"
            ]
      }
} as const