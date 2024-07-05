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
                  "id": {
                        "type": "string",
                        "maxLength": 42
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "key": {
                        "type": "string",
                        "maxLength": 9
                  },
                  "content": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "key",
                  "content"
            ]
      }
} as const