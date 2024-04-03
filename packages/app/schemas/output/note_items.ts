export default {
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
                        "type": "string",
                        "maxLength": 150
                  },
                  "sort": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "content",
                  "sort"
            ]
      }
} as const