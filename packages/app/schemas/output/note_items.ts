export default {
      "Note.Setting": {
            "type": "object",
            "properties": {
                  "serif": {
                        "type": "boolean"
                  },
                  "small_text": {
                        "type": "boolean"
                  },
                  "toc": {
                        "type": "string",
                        "enum": [
                              "default",
                              "visible",
                              "minimize",
                              "hidden"
                        ]
                  },
                  "count": {
                        "type": "boolean"
                  }
            },
            "required": [
                  "serif",
                  "small_text",
                  "toc",
                  "count"
            ]
      },
      "Note.Item": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "prev": {
                        "type": "string"
                  },
                  "next": {
                        "type": "string"
                  },
                  "content": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "update_at": {
                        "type": "number"
                  },
                  "extends": {
                        "type": "string"
                  }
            },
            "required": [
                  "file_id",
                  "id",
                  "content",
                  "create_at"
            ]
      }
} as const