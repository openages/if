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
                        "type": "string",
                        "maxLength": 30
                  },
                  "name": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "pid": {
                        "type": "string"
                  },
                  "prev_id": {
                        "type": "string"
                  },
                  "next_id": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": [
                              "number",
                              "string"
                        ]
                  },
                  "update_at": {
                        "type": [
                              "number",
                              "string"
                        ]
                  },
                  "backup_at": {
                        "type": [
                              "number",
                              "string"
                        ]
                  }
            },
            "required": [
                  "module",
                  "type",
                  "id",
                  "name",
                  "create_at"
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
                        "type": "string",
                        "maxLength": 30
                  },
                  "name": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "pid": {
                        "type": "string"
                  },
                  "prev_id": {
                        "type": "string"
                  },
                  "next_id": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "icon_hue": {
                        "type": [
                              "number",
                              "string"
                        ]
                  },
                  "update_at": {
                        "type": [
                              "number",
                              "string"
                        ]
                  },
                  "backup_at": {
                        "type": [
                              "number",
                              "string"
                        ]
                  }
            },
            "required": [
                  "module",
                  "type",
                  "id",
                  "name",
                  "create_at"
            ]
      }
} as const