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
                              "hidden"
                        ]
                  }
            },
            "required": [
                  "serif",
                  "small_text",
                  "toc"
            ]
      },
      "Note.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "content": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "content"
            ]
      }
} as const